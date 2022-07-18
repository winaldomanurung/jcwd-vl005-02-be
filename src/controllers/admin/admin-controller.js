const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const db = require("../../config").promise();
const {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} = require("../../helpers/validation-schema");
const { createToken } = require("../../helpers/createToken");
const transporter = require("../../helpers/nodemailer");

module.exports.loginadmin = async (req, res) => {
  // username menampung nilai email dan username
  const { username, password } = req.body;

  try {
    // 1.validation login schema
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // 2. check if user exist or not
    const CHECK_ADMIN = `SELECT * FROM admins WHERE username = ${db.escape(
      username
    )} OR email = ${db.escape(username)};`;
    const [ADMIN] = await db.execute(CHECK_ADMIN);
    if (!ADMIN.length) {
      return res.status(400).send("admin is not registered");
    }

    //   3.compare password
    const valid = await bcrypt.compare(password, ADMIN[0].password);
    console.log("is valid : ", valid);
    if (!valid) {
      return res.status(400).send("invalid password.");
    }
    //   // check user status
    //   if(USER[0].is_active == "banned"){
    //     return res.status(400).send("Your account has been banned");
    //   }
    // 4. create JWT token
    const { email, status, id } = ADMIN[0];
    console.log("emailku:", email);
    let token = createToken({ username, email, id });
    console.log("Token:", token);

    // create respond
    delete ADMIN[0].password;
    const respond = ADMIN[0];
    return res
      .header("Auth-Token-Admin", `Bearer ${token}`)
      .send({ dataLogin: respond, token, message: "Login Success" });
    console.log(USER[0]);
    // res.status(200).send(USER)
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

module.exports.currentadmin = async (req, res) => {
    const tokenAdmin = req.header("Auth-Token-Admin");
    const idAdmin = req.admin.id;
    try {
        console.log('IDADMIN:',idAdmin)
        console.log(tokenAdmin)
      const GET_ADMIN= `SELECT * FROM admins WHERE id = ?;`;
      const [ADMIN] = await db.execute(GET_ADMIN, [idAdmin]);
  
      // 4. create respond
      delete ADMIN[0].password;
      const respond = ADMIN[0];
      // console.log('mystatus:',USER[0].status)
      res.header("Auth-Token-Admin", `Bearer ${tokenAdmin}`).send(ADMIN[0]);
    } catch (error) {
      console.log("error:", error);
      return res.status(500).send(error);
    }
  };
