const bcrypt = require('bcrypt');

async function hashPassword() {
  const hash = await bcrypt.hash('Abc123', 10);
  console.log('Hash:', hash);
}

hashPassword();
