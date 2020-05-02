const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const _ = require("lodash");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

////////////// Conecting to database and creating Schema
mongoose.connect(
  process.env.MONGODB_URI || `mongodb://localhost:27017/node-react-starter`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we are into the database!!");
});

const todoSchema = new mongoose.Schema({
  text: String,
});

//////////////Redirecting to Today database by default

app.get("/", function (req, res) {
  console.log("redirecting to TOoday");
  res.redirect("/Today");
});

/////// Modifying DB

app
  .route("/api/:databaseName")
  .get(function (req, res) {
    console.log("fetching");
    const Db = mongoose.model(req.params.databaseName, todoSchema);
    Db.find(function (err, todos) {
      if (err) console.error(err);
      res.send(todos);
    });
  })
  .post(function (req, res) {
    console.log(req.body);
    const Db = mongoose.model(req.params.databaseName, todoSchema);
    const todo = new Db({ text: req.body.text });
    todo.save(function (err, todo) {
      if (err) console.error(err);
      res.send(todo);
    });
  })
  .delete(function (req, res) {
    console.log(req.body);
    const Db = mongoose.model(req.params.databaseName, todoSchema);
    Db.deleteOne({ _id: req.body.id }, function (err, deleted) {
      if (err) console.error(err);
      res.send(deleted);
    });
  });

///////Redirecting to Capitalise DB and launching react app
app.use(express.static(path.join(__dirname, "react-app", "build")));

app.get("/:databaseName", (req, res) => {
  const route = req.params.databaseName;
  if (route[0] != route[0].toUpperCase()) {
    console.log(route, route[0], "redirecting to uppercase");
    res.redirect("/" + _.capitalize(route));
  } else {
    console.log("serving react");
    res.sendFile(path.join(__dirname, "react-app", "build", "index.html"));
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("server up");
});
