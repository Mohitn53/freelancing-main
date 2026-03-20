/**
 * routes/cartRoutes.js
 * GET    /cart              – get current user's cart
 * POST   /cart              – add item to cart
 * PUT    /cart/:itemId      – update quantity
 * DELETE /cart/:itemId      – remove item
 * DELETE /cart              – clear cart
 */
import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(id, name, price, image_url)')
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1, size } = req.body;
    // Upsert logic: if item exists for same product+size, increment qty
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .eq('size', size || 'M')
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select().single();
      if (error) throw error;
      return res.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ user_id: req.user.id, product_id, quantity, size: size || 'M' }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.itemId)
      .eq('user_id', req.user.id)
      .select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:itemId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.itemId)
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
