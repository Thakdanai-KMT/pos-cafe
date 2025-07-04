const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET /api/categories - ดึงหมวดหมู่ทั้งหมด
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;
