const { Router } = require("express");

const {
  getAllUsers,
  getUser,
  login,
  verify,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const authorization = require("../middleware/authorization");

const router = Router();

//User routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.post("/login", login);
router.post("/register", createUser);
router.get("/is-verify", authorization, verify);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

module.exports = router;
