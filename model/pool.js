const connect = require("./mysqlconfig.js");
const bcrypt = require("bcrypt");

exports.getActeur = function (idacteur, cb) {
  connect.query(
    "SELECT * FROM acteur WHERE id_acteur =" + idacteur,
    function (err, result) {
      cb(...result); // cb est une fonction de callback envoyé en paramètres à partir de app.js
    }
  );
};

exports.getActeurs = function (cb) {
  connect.query("SELECT * FROM acteur ", function (err, result) {
    cb(result);
  });
};

exports.getRealisateurs = function (cb) {
  connect.query("SELECT * FROM realisateur ", function (err, result) {
    cb(result);
  });
};

exports.getRealisateur = function (idrealisateur) {
  connect.query(
    "SELECT * FROM realisateur WHERE id_realisateur =" + idrealisateur,
    function (err, result) {
      console.log(result);
    }
  );
};
exports.getFilms = function (cb) {
  connect.query("SELECT * FROM film ", function (err, result) {
    cb(result);
  });
};
exports.getFilm = function (idfilm, cb) {
  connect.query(
    "SELECT * FROM film WHERE id_film =" + idfilm,
    function (err, result) {
      cb(...result);
    }
  );
};
exports.getGenres = function (cb) {
  connect.query("SELECT * FROM genre ", function (err, result) {
    cb(result);
  });
};

exports.getGenreFilm = function (id, cb) {
  connect.query(
    "SELECT genre.* FROM genre,film WHERE genre.id_genre = film.id_genre AND film.id_film= ?",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
      }
      cb(result[0]);
    }
  );
};

exports.getRealisateurFilm = function (id, cb) {
  connect.query(
    "SELECT * FROM realisateur,film WHERE film.id_realisateur = realisateur.id_realisateur AND film.id_film= ?",
    [id],
    function (err, result) {
      cb(result[0]);
    }
  );
};

exports.getActeursFilm = function (id, cb) {
  connect.query(
    "SELECT acteur.* FROM acteur,`composé` WHERE acteur.id_acteur = `composé`.id_acteur AND  `composé`.id_film = ?  ",
    [id],
    function (err, result) {
      cb(result);
    }
  );
};

exports.addacteur = function (acteur, cb) {
  connect.query(
    "INSERT INTO `acteur` (`nom`,`prenom`,`photo`) VALUES(?,?,?)",
    [acteur.nom, acteur.prenom, acteur.photo],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};
exports.addrealisateur = function (realisateur, cb) {
  connect.query(
    "INSERT INTO `realisateur` (`nom`,`prenom`,`photo`) VALUES(?,?,?)",
    [realisateur.nom, realisateur.prenom, realisateur.photo],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};
exports.addgenre = function (genre, cb) {
  connect.query(
    "INSERT INTO `genre`(`genre`) VALUES (?)",
    [genre.genre],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};
exports.addfilm = function (film, cb) {
  connect.query(
    "INSERT INTO `film` (`titre`,`date_de_sortie`,`une_affiche`,`id_genre`,`id_realisateur`) VALUES(?,?,?,?,?)",
    [film.titre, film.date, film.affiche, film.id_genre, film.id_realisateur],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};

exports.updatefilm = function (film, cb) {
  connect.query(
    "UPDATE film SET titre=?,date_de_sortie=?,une_affiche=?,id_genre=?,id_realisateur=? WHERE id_film = ?",
    [
      film.titre,
      film.date,
      film.affiche,
      film.id_genre,
      film.id_realisateur,
      film.id_film,
    ],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};
exports.deletefilm = function (id_film, cb) {
  connect.query(
    "DELETE FROM `composé` WHERE id_film = ?;",
    [id_film],
    function (err) {
      if (err) {
        cb(false);
      } else {
        connect.query(
          "DELETE FROM film WHERE id_film = ?;",
          [id_film],
          function (err) {
            cb(true);
          }
        );
      }
    }
  );
};
exports.deletegenre = function (id_genre, cb) {
  connect.query(
    "DELETE FROM `genre` WHERE id_genre = ?;",
    [id_film],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};

exports.adduser = function (user, cb) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.mdp, salt);
  console.log(hash);
  connect.query(
    "INSERT INTO `user` (`nom`,`prenom`,`email`,`mdp`,`role`) VALUES(?,?,?,?,?)",
    [user.nom, user.prenom, user.email, hash, user.role],
    function (err) {
      if (err) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};

exports.login = function (login, cb) {
  connect.query(
    "SELECT *  FROM user WHERE email = ?",
    [login.email],
    function (err, user) {
      // asynchrone avec callback
      // bcrypt.compare(login.mdp, user[0].mdp, function (err, result) {
      //   if (err) {
      //     console.log(err);
      //   }
      //   cb(...user);
      // });

      // promise
      bcrypt
        .compare(login.mdp, user[0].mdp)
        .then(function (result) {
          cb(...user);
        })
        .catch(err);
    }
  );
};
