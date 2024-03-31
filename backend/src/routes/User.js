const express = require("express");
const router = express.Router();

const userController = require('../controller/userController');

router.post("/register-user", userController.registerUser);

router.post("/login-user", userController.loginUser);

router.get("/get-users", userController.getUsers);

router.get("/get-all-users", userController.getAllUsers);

router.get("/get-user-image/:email", userController.getUserImage);

router.patch("/update-user-status/:id", userController.updateUserStatus);

router.put("/update-user/:id", userController.updateUser);

module.exports = router;