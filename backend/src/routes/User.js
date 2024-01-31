const express = require("express");
const router = express.Router();

const userController = require('../controller/userController');

router.post("/register-user", userController.registerUser);

router.post("/login-user", userController.loginUser);

router.get("/get-user/:email", userController.getUserByEmail);

router.get("/get-users", userController.getUsers);

router.get("/get-all-users", userController.getAllUsers);

router.get("/is-root/:name", userController.isRoot)

router.get("/get-user-image/:email", userController.getUserImage);

router.patch("/update-user-status/:id", userController.updateUserStatus);

module.exports = router;