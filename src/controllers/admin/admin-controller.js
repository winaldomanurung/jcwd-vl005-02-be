const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const db = require("../../config").promise();
const {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  addNewAdminSchema,
} = require("../../helpers/validation-schema");
const { createToken } = require("../../helpers/createToken");
const transporter = require("../../helpers/nodemailer");
// ADMIN LOGIN
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
    // 4. create JWT token
    const { email, id } = ADMIN[0];
    // console.log("emailku:", email);
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

// KEEP LOGIN
module.exports.currentadmin = async (req, res) => {
  const tokenAdmin = req.header("Auth-Token-Admin");
  const idAdmin = req.admin.id;
  try {
    console.log("IDADMIN:", idAdmin);
    console.log(tokenAdmin);
    const GET_ADMIN = `SELECT * FROM admins WHERE id = ?;`;
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

// FORGET PASSWORD

module.exports.forgetpassword = async (req, res) => {
  const { Email } = req.body;
  try {
    console.log("Admin:", Email);
    // . verify req.body by our schema
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // check users
    const CHECK_ADMIN = `SELECT * FROM admins WHERE email = ?`;
    const [ADMIN] = await db.execute(CHECK_ADMIN, [Email]);
    if (!ADMIN.length) {
      return res.status(400).send("email not registered");
    }

    // user exist
    // bahan membuat token
    const { email, id, username } = ADMIN[0];
    console.log("emailku:", email);
    let token = createToken({ username, email, id });
    console.log("Token:", token);
    let mail = {
      from: `Admin <zilongbootcamp@gmail.com>`,
      to: `${email}`,
      subject: `Reset Password`,
      html: `<a href='http://localhost:3000/admin/resetpassword/${token}'> Click here to reset your password</a>`,
    };

    transporter.sendMail(mail, (errMail, resmail) => {
      if (errMail) {
        console.log(errMail);
        return res.status(500).send({
          message: "failed",
          success: false,
          err: errMail,
        });
      }
      return res.status(200).send({
        message: "Check your email",
        success: true,
      });
    });

    return res.status(200).send("succes");
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

module.exports.resetpassword = async (req, res) => {
  const { password, repassword } = req.body;
  const id = req.user.id;

  try {
    console.log(id);
    // 1. verify password & repassword
    if (password !== repassword) {
      return res.status(400).send(`password and re-password doesn't match.`);
    }
    // 2. verify req.body by our schema
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // 3. encypt-ing or hash-ing password
    const salt = await bcrypt.genSalt(10);
    console.log("salt : ", salt);

    const hashpassword = await bcrypt.hash(password, salt);
    console.log("plain : ", password);
    console.log("hash: ", hashpassword);
    console.log("id:", id);

    // 4. UPDATE PASSWORD
    const EDIT_ADMIN = `
        UPDATE admins SET password= ${db.escape(hashpassword)} WHERE id= ${id}`;
    const [RESULT] = await db.execute(EDIT_ADMIN);

    return res.status(200).send("Reset Password Berhasil");
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};

module.exports.addnewadmin = async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;
  try {
    // 2. verify req.body by our schema
    const { error } = addNewAdminSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // 3.1 verify if username and email is unique
    const CHECK_USERNAME = `SELECT id FROM admins WHERE username = ?;`;
    const [USERNAME] = await db.execute(CHECK_USERNAME, [username]);
    if (USERNAME.length) {
      return res
        .status(400)
        .send("Username already used, please use another username ");
    }
    // 3.2 verify if  email is unique
    const CHECK_USEREMAIL = `SELECT id FROM admins WHERE email = ?;`;
    const [USEREMAIL] = await db.execute(CHECK_USEREMAIL, [email]);
    if (USEREMAIL.length) {
      return res
        .status(400)
        .send("Email already used, please use another email ");
    }
    // 5. encypt-ing or hash-ing password
    const salt = await bcrypt.genSalt(10);
    console.log("salt : ", salt);

    const hashpassword = await bcrypt.hash(password, salt);
    console.log("plain : ", password);
    console.log("hash: ", hashpassword);
    // 6. do query INSERT
    const INSERT_ADMIN = `
         INSERT INTO admins(first_name,last_name,email,username,password)
         VALUES(${db.escape(firstName)},${db.escape(lastName)}, ${db.escape(
      email
    )}, ${db.escape(username)}, ${db.escape(hashpassword)});
     `;
    const [ADMIN] = await db.execute(INSERT_ADMIN);
    console.log(ADMIN.insertId);

    if (ADMIN.insertId) {
      const GET_ADMIN = `SELECT * FROM admins WHERE id = ?`;
      const [RESULT] = await db.execute(GET_ADMIN, [ADMIN.insertId]);
      console.log(RESULT[0].id);

      // bahan membuat token
      const { username, email, id } = RESULT[0];
      let token = createToken({ username, email, id });
      console.log("Token:", token);

      let mail = {
        from: `Admin <zilongbootcamp@gmail.com>`,
        to: `${email}`,
        subject: `Add New Admin`,
        html: `
        <h3>Account Details</h1>
        <h4>Hi ${firstName} ${lastName}</h4>
        <p>You can login to the admin page using the account below</>
        <p> Email    :${email} </>
        <p> Username :${username} </>
        <p> Password :${password} </>
        
        `,
      };
      transporter.sendMail(mail, (errMail, resmail) => {
        if (errMail) {
          console.log(errMail);
          return res.status(500).send({
            message: "Registration failed",
            success: false,
            err: errMail,
          });
        }
        return res.status(200).send({
          message: "Registration success,check your email",
          success: true,
        });
      });
    }
    res.status(200).send("Admin has been added");
  } catch (error) {
    console.log("error:", error);
    return res.status(500).send(error);
  }
};
