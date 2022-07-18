const router = require("express").Router();
const { auth } = require("../../helpers/authToken");

const authorization = require("../../helpers/authorization-token-admin");

// import user controller
const { adminController } = require("../../controllers");

// define route
router.post("/login",adminController.loginadmin);
router.get("/currentadmin", authorization, adminController.currentadmin);
// router.post("/forgotpassword", user.forgetpassword);
// router.post("/resetpassword",auth, user.resetpassword);
// router.post("/register", user.register);
// router.patch("/verified", auth, user.verifyUser);

// export * modules
module.exports = router;

