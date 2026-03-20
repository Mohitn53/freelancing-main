/**
 * routes/wishlistRoutes.js
 * GET    /wishlist           – get current user's wishlist
 * POST   /wishlist           – add product to wishlist
 * DELETE /wishlist/:productId – remove from wishlist
 */
import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, products(id, name, price, image_url, category)')
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body;
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .maybeSingle();
    if (existing) return res.json({ success: true, data: existing, alreadyExists: true });

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{ user_id: req.user.id, product_id }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:productId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', req.user.id)
      .eq('product_id', req.params.productId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
