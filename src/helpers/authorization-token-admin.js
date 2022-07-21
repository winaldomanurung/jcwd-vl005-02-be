const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const tokenAdmin = req.header("Auth-Token-Admin");
  try {
    // check token
    if (!tokenAdmin) {
      return res.status(401).send("un-authorized.");
      // throw new createError(http_status.UNAUTHORIZHED, 'un-authorized.')
    }

    // verify token
    const { id } = JWT.verify(tokenAdmin, "private123");
    // console.log(idAdmin);s

    let adminData = { admin: { id: id } };
    // modifed object req
    Object.assign(req, adminData);
    next();
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
