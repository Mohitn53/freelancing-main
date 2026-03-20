import { Router } from 'express';
import supabase from '../config/supabaseClient.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// GET all categories (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Only Routes
router.use(verifyToken, requireRole('admin'));

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { data, error } = await supabase.from('categories').update({ name }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Check if category has products
    const { data: category } = await supabase.from('categories').select('name').eq('id', req.params.id).single();
    if (category) {
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', category.name);
        if (count > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete category containing products.' });
        }
    }

    const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
