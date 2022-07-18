const JWT = require("jsonwebtoken");
// const http_status = require('./http-status-code')
// const createError = require('./create-error')

module.exports = (req, res, next) => {
  const token = req.header("Auth-Token");
  try {
    // check token
    if (!token) {
      return res.status(401).send("un-authorized.");
      // throw new createError(http_status.UNAUTHORIZHED, 'un-authorized.')
    }

    // verify token
    const { id } = JWT.verify(token, "private123");
    console.log(id)

    let userData = { user: { id: id } };
    // modifed object req
    Object.assign(req, userData);
    next();
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
