const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

let result = "";
let pokemon = {};
//app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function (req, res) {
  let id = req.body.Pokemon;
  const url = "https://pokeapi.co/api/v2/pokemon/" + id;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (chunk) {
      //append chunks of data to result
      result += chunk;
    });

    response.on("end", function (err) {
      let data = JSON.parse(result);

      pokemon = {
        name: data.name,
        sprite: data.sprites.front_default,
      };

      //pokemon = JSON.stringify(pokemon);

      console.log(pokemon);
      res.render("index", { pokemon: pokemon });
      // res.send("<img src=" + pokemon.sprite + ">");
    });
  });
});

app.listen(port, function (req, res) {
  console.log("Server started on port " + port);
});
