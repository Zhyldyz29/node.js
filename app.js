const express = require("express"); // framework web
const mysql2 = require("mysql2");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const port = 8080;

app.use(cookieParser());
app.use(
  session({
    secret: "Shh, its a secret!",
    resave: false,
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
  })
);

const bdd = require("./model/pool.js");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// permet la récuperation des champs POST
app.use(express.json());
// permet léchange de données au format JSON
app.set("views", __dirname + "/mesvues");
app.set("view engine", "ejs");

app.get("/", (req, res) => res.send("Bienvenue"));

app.get("/acteur/:id", (req, res) => {
  bdd.getActeur(req.params.id, function (row) {
    res.render("acteur", { acteur: row });
  });
});

app.get("/acteurs", (req, res) => {
  bdd.getActeurs(function (row) {
    res.render("acteurs", { acteurs: row });
  });
});

app.get("/realisateurs", (req, res) => {
  bdd.getRealisateurs(function (row) {
    res.render("realisateurs", { realisateurs: row });
  });
});

app.get("/films", (req, res) => {
  bdd.getFilms(function (row) {
    res.render("films", { films: row, user: req.session.user });
  });
});

app.get("/film/:id", (req, res) => {
  idf = req.params.id;
  bdd.getFilm(idf, function (film) {
    bdd.getGenreFilm(idf, function (genre) {
      bdd.getRealisateurFilm(idf, function (real) {
        bdd.getActeursFilm(idf, function (actors) {
          res.render("film", {
            film: film,
            genre: genre,
            real: real,
            actors: actors,
          });
        });
      });
    });
  });
});

app.get("/realisateur/:id", (req, res) => {
  bdd.getRealisateur(req.params.id, function (row) {
    console.log(row);
  });
});

app.get("/genres", (req, res) => {
  bdd.getGenres(function (row) {
    res.render("genres", { genres: row });
  });
});

app.get("/addacteur", (req, res) => {
  res.render("addacteur");
});

app.post("/addacteur", (req, res) => {
  bdd.addacteur(req.body, function (row) {
    if (row) {
      res.redirect("/acteurs");
    } else {
      res.send("erreur");
    }
  });
});

app.get("/addrealisateur", (req, res) => {
  res.render("addrealisateur");
});
app.post("/addrealisateur", (req, res) => {
  bdd.addrealisateur(req.body, function (row) {
    if (row) {
      res.redirect("/realisateurs");
    } else {
      res.send("erreur");
    }
  });
});

app.get("/addgenre", (req, res) => {
  res.render("addgenre");
});

app.post("/addgenre", (req, res) => {
  bdd.addgenre(req.body, function (row) {
    if (row) {
      res.redirect("/genres");
    } else {
      res.send("erreur");
    }
  });
});
app.get("/addfilm", (req, res) => {
  bdd.getGenres(function (genres) {
    bdd.getRealisateurs(function (realisateurs) {
      res.render("addfilm", {
        genres: genres,
        realisateurs: realisateurs,
      });
    });
  });
});

app.post("/addfilm", (req, res) => {
  bdd.addfilm(req.body, function (row) {
    if (row) {
      res.redirect("/films");
    } else {
      res.send("erreur");
    }
  });
});

app.get("/updatefilm/:id", (req, res) => {
  bdd.getFilm(req.params.id, function (film) {
    bdd.getGenres(function (genres) {
      bdd.getRealisateurs(function (realisateurs) {
        res.render("updatefilm", {
          film: film,
          genres: genres,
          realisateurs: realisateurs,
        });
      });
    });
  });
});

app.post("/updatefilm", (req, res) => {
  bdd.updatefilm(req.body, function (rep) {
    if (rep) {
      res.redirect("/films");
    } else {
      res.send("erreur");
    }
  });
});

app.get("/deletefilm/:id", (req, res) => {
  bdd.deletefilm(req.params.id, function () {
    res.redirect("/films");
  });
});

app.post("/deletefilm", (req, res) => {
  if (row) {
    res.redirect("/films");
  } else {
    res.send("erreur");
  }
});

app.get("/adduser", (req, res) => {
  res.render("adduser");
});

app.post("/adduser", (req, res) => {
  bdd.adduser(req.body, function (row) {
    if (row) {
      res.redirect("/users");
    } else {
      res.send("erreur");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  bdd.login(req.body, function (user) {
    if (user) {
      req.session.user = user;
      res.redirect("/films");
    } else {
      res.redirect("/login");
    }
  });
});

app.listen(port, () => {
  "listen to post" + port;
});
