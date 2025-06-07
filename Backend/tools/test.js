const bcrypt = require('bcrypt');

async function test() {
  const password = 'TESTabc123'; // ← ใช้รหัสผ่านตัวอย่าง
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash:', hash);

  const isMatch = await bcrypt.compare(password, hash);
  console.log('Match:', isMatch); // ✅ ควรได้ true
}

test();
