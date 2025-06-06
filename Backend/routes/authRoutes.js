const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');
const { comparePassword } = require('../utils/hashUtils');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ message: 'กรุณาระบุ loginId และ password' });
  }

  let query = supabase.from('staff_profiles').select('*').or(`username.eq.${loginId},phone.eq.${loginId}`).limit(1);
  const { data: staffArray, error } = await query;

  if (error || !staffArray || staffArray.length === 0) {
    return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' });
  }

  const staff = staffArray[0];
  const validPassword = await comparePassword(password, staff.password_hash);

  if (!validPassword) {
    return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
  }

  const token = jwt.sign(
    { id: staff.id, role: staff.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    staff: { id: staff.id, name: staff.name, role: staff.role }
  });
});

module.exports = router;
