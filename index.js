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
  "mongodb+srv://luizzitol:XiyAuA7hkKaeDykY@nieto-3f60x.mongodb.net/todoDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
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
  console.log("redirecting");
  res.redirect("/Today");
});

///////Redirecting to Capitalise DB and launching react app
app.use(express.static(path.join(__dirname + "/build")));

app.get("/:databaseName", (req, res) => {
  const route = req.params.databaseName;
  if (route === "") {
    return res.redirect("/Today");
  }
  if (route[0] != route[0].toUpperCase()) {
    console.log(route, route[0]);
    res.redirect("/" + _.capitalize(route));
  } else {
    res.sendFile(path.join(__dirname + "/build/index.html"));
  }
});

/////// Modifying DB

app
  .route("/:databaseName/API")
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

const port = process.env.PORT ? process.env.PORT : 3000;

app.listen(port, () => {
  console.log("server up");
});
