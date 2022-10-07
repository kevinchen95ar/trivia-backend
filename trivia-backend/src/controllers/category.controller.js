const pool = require("../db");
const axios = require("axios").default;

//Trae todas las categorias disponibles en opentdb y las coloca en nuestra db -- TERMINADA, PROBARLO
const updateAllCategories = async (req, res) => {
  const url = "https://opentdb.com/api_category.php";
  const opentdbID = 1;
  const dbCategories = await pool.query("SELECT * FROM category");
  const allLength = dbCategories.rows.length;
  var allCategories = [];
  // Colocamos todas las categorias en un array simple sin los id para poder comparar con include
  for (var i = 0; i < allLength; i++) {
    allCategories.push(dbCategories.rows[i].category);
  }

  //Creamos un array que tendra solo las categorias no repetidas
  var newCategories = [];
  await axios
    .get(url)
    .then((res) => {
      const length = res.data.trivia_categories.length;
      for (var i = 0; i < length; i++) {
        //Chequeamos que si ya existe esa categoria, si no existe la insertamos en el array
        if (!allCategories.includes(res.data.trivia_categories[i].name)) {
          newCategories.push(res.data.trivia_categories[i].name);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // Guardamos en la base de datos las nuevas categorias
  const newLength = newCategories.length;
  for (var i = 0; i < newLength; i++) {
    await pool.query(
      "INSERT INTO category (category, idSource) VALUES ($1, $2) RETURNING *",
      [newCategories[i], opentdbID]
    );
  }
  res.json("Actualizacion completada");
};

//Get de todas las categorias en la base de datos
const getAllCategories = async (req, res) => {
  try {
    //Consulta y guardamos todas las categorias en una constante
    //Devolvemos todas las categorias en un json
  } catch (error) {
    // devolver un json de error
  }
};

module.exports = {
  updateAllCategories,
  getAllCategories,
};
