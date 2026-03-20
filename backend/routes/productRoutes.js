/**
 * routes/productRoutes.js  – public + protected product endpoints
 * GET  /products           – list all (12 per page, filterable)
 * GET  /products/search    – search by name
 * GET  /products/:id       – single product
 * POST /products           – create (admin)
 * PUT  /products/:id       – update (admin)
 * DELETE /products/:id     – delete (admin)
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import supabase from '../config/supabaseClient.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Stricter limiter for product listing (public endpoint)
const publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Slow down.' },
});

// ─── GET /products ────────────────────────────────────────────────────────────
router.get('/', publicLimiter, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 12;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const sort = req.query.sort || 'created_at';
    const order = req.query.order === 'asc' ? true : false;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sort, { ascending: order });

    if (category) query = query.eq('category', category);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /products/search ─────────────────────────────────────────────────────
router.get('/search', publicLimiter, async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, image_url, category')
      .ilike('name', `%${q}%`)
      .limit(8);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /products/:id ────────────────────────────────────────────────────────
router.get('/:id', publicLimiter, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /products (admin) ───────────────────────────────────────────────────
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;
    const { data, error } = await supabase.from('products').insert([{ name, description, price, category, stock, image_url }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /products/:id (admin) ────────────────────────────────────────────────
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /products/:id (admin) ─────────────────────────────────────────────
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
