const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Init Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 ชื่อ bucket ที่ใช้ใน Supabase Storage
const BUCKET = 'product-images';

// GET /api/products
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'ไม่พบสินค้า' });
  res.json(data);
});

// POST /api/products
router.post('/', upload.single('image'), async (req, res) => {
  const { name, sale_price, category_id, user_id } = req.body;

  if (!name || !sale_price || !category_id || !user_id) {
    return res.status(400).json({ error: 'ต้องระบุชื่อ ราคา ประเภทสินค้า และผู้ใช้งาน (user_id)' });
  }

  let imageUrl = null;

  if (req.file) {
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${Date.now()}${fileExt}`;
    const fileBuffer = req.file.buffer;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { publicURL } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    imageUrl = publicURL;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{
      name,
      sale_price,
      category_id,
      image: imageUrl,
      created_by: user_id,
      updated_by: user_id
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

// PUT /api/products/:id
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, sale_price, category_id, user_id } = req.body;

  if (!name || !sale_price || !category_id || !user_id) {
    return res.status(400).json({ error: 'ต้องระบุชื่อ ราคา ประเภทสินค้า และผู้ใช้งาน (user_id)' });
  }

  // Get current product data
  const { data: existing, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ error: 'ไม่พบสินค้าที่จะแก้ไข' });
  }

  let imageUrl = existing.image;

  if (req.file) {
    // 🔥 ลบไฟล์เก่าถ้ามี
    if (imageUrl) {
      const oldFileName = imageUrl.split('/').pop();
      await supabase.storage.from(BUCKET).remove([oldFileName]);
    }

    // อัปโหลดใหม่
    const fileExt = path.extname(req.file.originalname);
    const newFileName = `${Date.now()}${fileExt}`;
    const fileBuffer = req.file.buffer;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newFileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { publicURL } = supabase.storage.from(BUCKET).getPublicUrl(newFileName);
    imageUrl = publicURL;
  }

  const { data, error: updateError } = await supabase
    .from('products')
    .update({
      name,
      sale_price,
      category_id,
      image: imageUrl,
      updated_by: user_id
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.json(data);
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // 🔥 ลบรูปใน storage ก่อน
  const { data: existing, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!fetchError && existing?.image) {
    const fileName = existing.image.split('/').pop();
    await supabase.storage.from(BUCKET).remove([fileName]);
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(204).send();
});

module.exports = router;
