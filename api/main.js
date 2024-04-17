var client_id = "15c69804388c42f6be2460ee79d5be74";
var client_secret = "98ccdd95887545e1b6531106596dfbca";
var redirect_uri = "http://localhost:3000/";

const express = require("express");
const app = express();
var cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

var querystring = require("querystring");

app.get("/login", function (req, res) {
  var state = Math.random() * 100000;
  var scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  //   var state = req.query.state || null;

  //   if (state === null) {
  //     res.redirect(
  //       "/#" +
  //         querystring.stringify({
  //           error: "state_mismatch",
  //         })
  //     );
  //   } else {

  var bodyString = `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${code}`;

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: bodyString,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  })
    .then((i) => {
      return i.json();
    })
    .then((i) => {
      res.json(i);
    })
    .catch((i) => {
      console.log(i);
      res.status(500).json(i);
    });
  //   }
});

app.listen(3001, () => {
  console.log(`Example app listening on port ${3001}`);
});
