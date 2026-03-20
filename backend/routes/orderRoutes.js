import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);

// ─── USER ROUTES ─────────────────────────────────────────────────────────────

// Create order (Checkout)
router.post('/', async (req, res) => {
  try {
    const { items = [], total_amount, total, amount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must include at least one item.',
      });
    }

    const normalizedTotal = Number(total_amount ?? total ?? amount);
    if (Number.isNaN(normalizedTotal) || normalizedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount.',
      });
    }

    const normalizedItems = items
      .map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }))
      .filter((item) => item.product_id && !Number.isNaN(item.quantity) && item.quantity > 0);

    if (!normalizedItems.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order items payload.',
      });
    }

    const isMissingColumnError = (errMessage, tableName) => {
      const msg = String(errMessage || '').toLowerCase();
      return msg.includes('could not find') && msg.includes(`column of '${tableName}'`);
    };
    
    // 1. Create Order
    const orderPayloads = [
      { user_id: req.user.id, total_amount: normalizedTotal, status: 'pending' },
      { user_id: req.user.id, total: normalizedTotal, status: 'pending' },
      { user_id: req.user.id, amount: normalizedTotal, status: 'pending' },
    ];

    let order = null;
    let orderError = null;

    for (const payload of orderPayloads) {
      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        .select()
        .single();

      if (!error) {
        order = data;
        orderError = null;
        break;
      }

      orderError = error;
      if (!isMissingColumnError(error.message, 'orders')) {
        break;
      }
    }

    if (orderError || !order) throw orderError || new Error('Failed to create order.');

    // 2. Create Order Items
    const orderItemsBase = normalizedItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const orderItemsPayloads = [
      orderItemsBase,
      orderItemsBase.map(({ price, ...rest }) => ({ ...rest, unit_price: price })),
      orderItemsBase.map(({ price, ...rest }) => ({ ...rest, amount: price })),
      orderItemsBase.map(({ price, ...rest }) => ({ ...rest })),
    ];

    let itemsError = null;
    for (const payload of orderItemsPayloads) {
      const { error } = await supabase.from('order_items').insert(payload);
      if (!error) {
        itemsError = null;
        break;
      }
      itemsError = error;
      if (!isMissingColumnError(error.message, 'order_items')) {
        break;
      }
    }

    if (itemsError) throw itemsError;

    // 3. Clear Cart
    await supabase.from('cart_items').delete().eq('user_id', req.user.id);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// List all orders (Admin Only)
router.get('/admin', requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single order with items
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url)), profiles(name, email)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    // Authorization check: User can only see their own order, Admin can see all
    if (data.user_id !== req.user.id) {
        // Check if admin
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        if (profile?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel order (User Only)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, user_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied.' });
    if (order.status === 'delivered') return res.status(400).json({ success: false, message: 'Cannot cancel a delivered order.' });
    if (order.status === 'cancelled') return res.status(400).json({ success: false, message: 'Order is already cancelled.' });

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update order status (Admin Only)
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select().single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
