//Függvénykönyvtárak importálása
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

const fs = require('fs');

const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const http = require('http');
const server = http.createServer(app);
app.use(express.static('views'))
app.set("view engine", "ejs");
app.use(require('body-parser').urlencoded({ extended: false }));

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('34242585475-n7rb0iodm7m9lphe60knplli29gfbj5t.apps.googleusercontent.com');

var votes = new JsonDB(new Config("./db/votes", true, true, '/'));


const szavazas = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 20,
  message:
    "Túl sok kérés, próbáld újra később!"
});

const main = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 30,
  message:
    "Túl sok kérés, próbáld újra később!"
});

//A használt id
function use(search, dbi) {
  var data = votes.getData(`/k${dbi}`)
  for (var i = 0; i < data.voted.length; i++) {
    if (data.voted[i] == search) {
    return true;
    }

  }
}


//Token hitelesítése 
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '34242585475-n7rb0iodm7m9lphe60knplli29gfbj5t.apps.googleusercontent.com',
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return ticket
}

//Express útvonalak
//Főoldal lekérése
app.get("/", main, function(req, res) {
  var json = votes.getData("/")
  var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
  res.render("index.ejs", { data: result });
});

app.get("/vote.html", main, function(req, res) {
  var json = votes.getData("/")
  var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
  res.render("vote", { data: result });
});



//Szavazási kérés és lezelése

app.post('/vote', szavazas, async function(req, res) {
  var ver = await verify(req.body.token)
  if (ver.payload.email_verified == true || req.body.point > 10 || req.body.point < 0) {
    //A JWT Tokenből olvassa ki az emailt
    if (ver.payload.email.substr(ver.payload.email.length - 9) == '@e5vos.hu') {

      var dbchk = use(req.body.id,req.body.cls)  //A token egyszeri használatának ellenőrzése

      if (!dbchk) {

        var json = votes.getData(`/k${req.body.cls}`)
        var terem = json.terem
        var name = json.name
        var id = json.id
        var votedt = json.voted
        var scoret = parseInt(json.score) + parseInt(req.body.point)
        votedt.push(req.body.id)
        votes.push(`/k${req.body.cls}`, {name: name, score: scoret, id:id, voted:votedt,terem: terem});

        res.send('Rögzítve!');


      } else {
        res.send('Ezzel a tokennel már szavaztak!')
      }
    } else {
      res.send('Csak eötvösös emaillel megy a szavazás!')
    }
  } else {
    res.send('Nem tudom mit csinálsz, de nagyon úgy fest, hogy hacklesz. (JWT lejárt, integritása hibás')
  }
});




//Yandere DEV (Egyébként adatbázisok törlése)
function initialize() {
  votes.push("/k1", {name:"7.A", score:0, id:1, voted:[], terem: false});
  votes.push("/k2", {name:"7.B", score:0, id:2, voted:[], terem: false});
  votes.push("/k3", {name:"8.A", score:0, id:3, voted:[], terem: false});
  votes.push("/k4", {name:"8.B", score:0, id:4, voted:[], terem: false});
  votes.push("/k5", {name:"9.Ny", score:0, id:5, voted:[], terem: false});
  votes.push("/k6", {name:"9.A", score:0, id:6, voted:[], terem: false});
 votes.push("/k7", {name:"9.B", score:0, id:7, voted:[], terem: false});
 votes.push("/k8", {name:"9.C", score:0, id:8, voted:[], terem: false});
 votes.push("/k9", {name:"9.D", score:0, id:9, voted:[], terem: false});
 votes.push("/k10", {name:"9.E", score:0, id:10, voted:[], terem: false});
 votes.push("/k11", {name:"9.F", score:0, id:11, voted:[], terem: false});
 votes.push("/k12", {name:"10.A", score:0, id:12, voted:[], terem: false});
 votes.push("/k13", {name:"10.B", score:0, id:13, voted:[], terem: false});
 votes.push("/k14", {name:"10.C", score:0, id:14, voted:[], terem: false});
 votes.push("/k15", {name:"10.D", score:0, id:15, voted:[], terem: false});
 votes.push("/k16", {name:"10.E", score:0, id:16, voted:[], terem: false});
 votes.push("/k17", {name:"10.F", score:0, id:17, voted:[], terem: false});
 votes.push("/k18", {name:"11.A", score:0, id:18, voted:[], terem: false});
 votes.push("/k19", {name:"11.B", score:0, id:19, voted:[], terem: false});
 votes.push("/k20", {name:"11.C", score:0, id:20, voted:[], terem: false});
 votes.push("/k21", {name:"11.D", score:0, id:21, voted:[], terem: false});
 votes.push("/k22", {name:"11.E", score:0, id:22, voted:[], terem: false});
 votes.push("/k23", {name:"11.F", score:0, id:23, voted:[], terem: false});
 votes.push("/k24", {name:"12.A", score:0, id:24, voted:[], terem: false});
 votes.push("/k25", {name:"12.B", score:0, id:25, voted:[], terem: false});
 votes.push("/k26", {name:"12.C", score:0, id:26, voted:[], terem: false});
 votes.push("/k27", {name:"12.D", score:0, id:27, voted:[], terem: false});
 votes.push("/k28", {name:"12.E", score:0, id:28, voted:[], terem: false});
 votes.push("/k29", {name:"12.F", score:0, id:29, voted:[], terem: false});
}



/*
Adatbázis felépítése
key osztály
1     7.A
2     7.B
3     8.A
4     8.B
5     9.Ny
6     9.A
7     9.B
8     9.C
9     9.D
10    9.E
11    9.F
12    10.A
13    10.B
14    10.C
15    10.D
16    10.E
17    10.F
18    11.A
19    11.B
20    11.C
21    11.D
22    11.E
23    11.F
24    12.A
25    12.B
26    12.C
27    12.D
28    12.E
29    12.F
*/




server.listen(433, () => {
  initialize();
  console.log('\x1b[32m', '[EXPRESS]', "\x1b[37m", 'Alkalmazás elindítva a 433-as porton.')
});
