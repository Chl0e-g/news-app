const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query(`
    SELECT * FROM users;`);
  return users;
};
