const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash:', hash);
}

hashPassword('123456'); // ← เปลี่ยนรหัสผ่านตามต้องการ
