const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// Trae todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT id, username, role FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error.message);
  }
};

//Log in
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    //chequeo si no existe el usuario (si no existe tiramos error)
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    //no existe el usuario
    if (user.rows.length === 0) {
      return res.status(401).json("El usuario no existe.");
    }

    //chequeo si la contraseña es la misma que en la base de datos
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    //la contraseña es incorrecta
    if (!validPassword) {
      return res.status(401).json("La contraseña es incorrecta.");
    }

    //devolvemos un jwt
    const token = jwtGenerator(user.rows[0].id, user.rows[0].role);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
};

// Registro de usuario
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = "Normal";

    // Chequeo si existe el usuario
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    //Si ya existe devolvemos status 409.
    if (user.rows.length !== 0) {
      return res.status(409).send("Nombre de usuario ya existe");
    }

    //Encriptacion de la password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    //Insertamos el usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, bcryptPassword, role]
    );

    //Generamos un token JWT
    const token = jwtGenerator(newUser.rows[0].id);
    res.json({ token });
  } catch (error) {
    res.json({ error: error.message });
    //manejar en dev con error.message, pero en prod usar el codigo del error, y mostrar bien en la interfaz
  }
};

// verifica el usuario, se verifica en authorization.js
const verify = async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

//Cambio de rol o nombre de usuario
const updateUser = async (req, res) => {
  try {
    const { username, role, id } = req.body;

    // Chequeo si existe el usuario
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    //Si ya existe y no es el mismo id que estamos consultando devolvemos status 409.
    if (user.rows.length !== 0 && user.rows[0].id !== id) {
      return res.status(409).send("Nombre de usuario ya existe");
    }

    //continuamos actualizando el usuario y el rol a los proveidos
    const result = await pool.query(
      "UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING *",
      [username, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  login,
  verify,
  createUser,
  updateUser,
};
