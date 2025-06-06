const bcrypt = require('bcrypt');

async function comparePassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}

module.exports = {
  comparePassword,
};
