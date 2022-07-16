const db = require("../../config").promise();
// GET ALL USERS
module.exports.manageusers = async (req, res) => {
  try {
    const GET_ALL_USERS = `
SELECT 
    id,
    CONCAT(first_name, ' ', last_name) AS name,
    username,
    email,
    is_verified,
    is_active,
    created_at
FROM
    users
    `;

    const USERS = await db.execute(GET_ALL_USERS)
    res.status(200).send(USERS[0])

  } catch (error) {}
};

// CHANGE USER IS ACTIVE
