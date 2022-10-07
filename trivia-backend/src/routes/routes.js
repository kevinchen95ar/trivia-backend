const { Router } = require("express");

const {
  getAllCategories,
  updateAllCategories,
} = require("../controllers/category.controller");

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

//Category routes
router.get("/category", getAllCategories);
router.get("/category/update", updateAllCategories);

module.exports = router;
