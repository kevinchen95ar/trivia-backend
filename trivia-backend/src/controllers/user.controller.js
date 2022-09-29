const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

// Trae todos los usuarios -- HAY QUE IMPLEMENTAR EN EL FRONT
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.log(error.message);
  }
};

//Trae un solo usuario con el id que le pasemos en el link -- SIN USO
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(result.rows[0]);
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
    const token = jwtGenerator(user.rows[0].id);
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

// verifica el usuario
const verify = async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

//Elimina el usuario con el id del link -- SIN USO
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.sendStatus(204).json({ message: "User deleted" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

//se puede solo cambiar la contraseña -- HAY QUE IMPLEMENTAR EN EL FRONT
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [password, id]
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
  getUser,
  login,
  verify,
  createUser,
  deleteUser,
  updateUser,
};
