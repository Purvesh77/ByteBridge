const express = require("express");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/:name").get(userController.getUser);
router.route("/").get(authController.protect, userController.allUsers);
router
  .route("/add-bookmark")
  .post(authController.protect, userController.addBookmark);
router.route("/register").post(authController.protect, userController.register);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/make-friend", authController.protect, userController.makeFriend);
router.post(
  "/accept-request",
  authController.protect,
  userController.responseToFriendRequest
);

module.exports = router;
