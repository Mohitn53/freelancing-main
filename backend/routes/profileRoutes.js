/**
 * routes/profileRoutes.js
 * GET    /profile           – get my profile
 * PUT    /profile           – update profile info
 * GET    /profile/orders    – order history
 * GET    /profile/addresses – address book
 * POST   /profile/addresses – add address
 * PUT    /profile/addresses/:id – update address
 * DELETE /profile/addresses/:id – delete address
 * GET    /profile/payment-methods – payment methods
 */
import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, phone, updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Orders ──────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Addresses ───────────────────────────────────────────────────────────────
router.get('/addresses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('addresses').select('*').eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/addresses', async (req, res) => {
  try {
    const { full_name, line1, line2, city, state, pincode, phone, is_default } = req.body;
    if (is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', req.user.id);
    }
    const { data, error } = await supabase
      .from('addresses')
      .insert([{ user_id: req.user.id, full_name, line1, line2, city, state, pincode, phone, is_default: !!is_default }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/addresses/:id', async (req, res) => {
  try {
    if (req.body.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', req.user.id);
    }
    const { data, error } = await supabase.from('addresses').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/addresses/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('addresses').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ─── Payment Methods (stored tokens only, never raw card data) ────────────────
router.get('/payment-methods', async (req, res) => {
  try {
    const { data, error } = await supabase.from('payment_methods').select('id, brand, last4, exp_month, exp_year, is_default').eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/payment-methods', async (req, res) => {
  try {
    const { brand, last4, exp_month, exp_year, is_default } = req.body;
    if (is_default) {
      await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', req.user.id);
    }
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{ user_id: req.user.id, brand, last4, exp_month, exp_year, is_default: !!is_default }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/payment-methods/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('payment_methods').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
