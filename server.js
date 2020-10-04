const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let pokemon = {
  name: "???",

  abilities: [{ ability: { name: "???" } }],

  types: [{ type: { name: "???" } }],
};

app.get("/", function (req, res) {
  res.render("index", { pokemon: pokemon });
});

app.post("/", function (req, res) {
  //clear the JSON after each POST request
  console.log(req.body);
  let id;

  if (req.body.Pokemon === "random") {
    console.log("working");

    id = Math.ceil(Math.random() * 893);
  } else {
    let str = req.body.Pokemon;
    id = str.toLowerCase(); //handel inputs with capital letters
  }

  let result = "";

  let url = "https://pokeapi.co/api/v2/pokemon/" + id;

  https.get(url, function (response) {
    console.log(response.statusCode);

    if (response.statusCode === 404) {
      console.log("404 erroer");

      pokemon = {
        name: "404 err",
        abilities: {
          name: "none",
        },
        types: {
          name: "none",
        },
      };
      res.redirect("/");
    } else {
      response.on("data", function (chunk) {
        //append chunks of data to result
        result += chunk;
      });

      //parse after full JSON is recieved
      response.on("end", function (err) {
        let data = JSON.parse(result);

        pokemon = {
          name: data.name,
          artwork: data.sprites.other["official-artwork"].front_default,
          abilities: data.abilities,
          types: data.types,
        };

        res.redirect("/");
      });
    }
  });
});

app.listen(port, function (req, res) {
  console.log("Server started on port " + port);
});
