const router = require("express").Router();
const { auth } = require("../../helpers/authToken");

const authorization = require("../../helpers/authorization-token-admin");

// import user controller
const { adminController } = require("../../controllers");

// define route
router.post("/login",adminController.loginadmin);
router.get("/currentadmin", authorization, adminController.currentadmin);
router.post("/forgetpassword",adminController.forgetpassword);
router.post("/resetpassword",auth, adminController.resetpassword);
router.post("/addnewadmin", adminController.addnewadmin);
// router.patch("/verified", auth, user.verifyUser);

// export * modules
module.exports = router;

