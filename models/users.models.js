const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query(`
    SELECT username FROM users`);
  return users;
};

exports.fetchUserByUsername = async (username) => {
  const {
    rows: [user],
  } = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);

  //error handling: no user found
  if (!user) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }

  return user;
};
