//Imports
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/routes");

//Definition
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(morgan("dev"));
app.use(express.json());
app.use(routes);
app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  return res.json({
    message: err.message,
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
