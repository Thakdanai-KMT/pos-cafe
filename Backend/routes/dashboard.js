const express = require('express');
const multer = require('multer'); // middleware สำหรับรับ multipart/form-data
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ตั้งค่า multer เก็บไฟล์ชั่วคราวใน memory
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/products/upload - อัปโหลดรูปภาพพร้อมข้อมูลสินค้า
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file; // ไฟล์ภาพที่รับมา
    const { name, price } = req.body; // ข้อมูลสินค้าอื่น ๆ

    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // ตั้งชื่อไฟล์เพื่ออัปโหลดใน Storage
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // อัปโหลดไฟล์ไป Supabase Storage bucket 'images'
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // ดึง public URL ของไฟล์
    const { publicURL, error: urlError } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    if (urlError) {
      return res.status(500).json({ error: urlError.message });
    }

    // บันทึกข้อมูลสินค้าและ URL ลงในตาราง products
    const { data, error: insertError } = await supabase
      .from('products')
      .insert([{ name, price, image_url: publicURL }]);

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json({ message: 'Product created', product: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
