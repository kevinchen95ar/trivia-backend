const { Router } = require("express");

const {
  getAllUsers,
  login,
  verify,
  createUser,
  updateUser,
} = require("../controllers/user.controller");
const authorization = require("../middleware/authorization");

const router = Router();

//User routes
router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/register", createUser);
router.get("/is-verify", authorization, verify);
router.put("/users", updateUser);

module.exports = router;
