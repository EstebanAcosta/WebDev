/**
  @author Esteban Acosta
*/
const express = require('express');

const bodyParser = require('body-parser');

const web_logging_setup = require('./web_logging').setupWebLog;

const hbs = require('hbs');

const session = require('express-session');

const app = express();


web_logging_setup(app);

// Support URL-encoded bodies (e.g. POST payloads from web forms)
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + "/../views/partials");

app.use(bodyParser.json());

app.use(session({
  secret: 'a secret cookie signing value',
  cookie: { maxAge: 999999999 },
  resave: false,
  saveUninitialized: false
}))

  var userId ;
  var password;
  var header =  "Air Nike";

app.get('/' , (req, res) =>  {
  if (req.session.user != null) {
    console.log('User logged in');
    res.render('result.hbs', {
      userid : userId,
      message: "If this is your first time using this website, at the bottom of the page you can fill out a form that will help us find the shoes that you are looking for",
    });
  } else {
    console.log('User not logged in');
    res.render('login.hbs', {
    pageTitle: header,
    goalMessage: "Here in Nike, we believe that our goal is to provide top of the line shoes to our customers",
    motto: "Our Motto: Just Buy It!!!!",
    logininfo: "Please login to the website to view our shoes"
  });
  }
});

app.get('/settings', (req, res) => {
  res.render('settings.hbs', {
      pageTitle: header
  })
});

app.get('/shopcart', (req, res) => {
  res.render('shoppingcart.hbs', {
      pageTitle: header
  })
});

app.get('/savedpref', (req, res) => {
  res.render('savedpref.hbs', {
      pageTitle: header
  })
});

app.get('/pricecompare', (req, res) => {
  res.render('pricecomparison.hbs', {
      pageTitle: header
  })
});

app.get('/shoes', (req, res) => {
  res.render('shoes.hbs', {
      pageTitle: header
  })
});

app.post('/login', (req, res) => {
  var tasks = req.session.tasks;
  userId = req.body.userid;
  password = req.body.password;
  var errorMessage = [];

console.log(`${req.method} ${req.url} ${req.httpVersion}`);
if (!userId || userId.length == 0) {
  errorMessage.push("User Id is required");
}

if (!password || password.length == 0) {
  errorMessage.push("Password is required");
}

if (errorMessage.length == 0 && userId != password) {
  errorMessage.push("Username or Password is wrong");
}

if (errorMessage.length > 0) {
  console.log("Error logging in:", errorMessage);
  res.render('login.hbs', {
    errorMessage
  });
} else {
//  tasks = fileIO.loadTasks(userId);
  req.session.tasks = tasks;
  req.session.user = userId;
  res.redirect("/");
}
});


app.post('/settings', (req, res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}
  res.render('settings.hbs');
});

app.post('/pricecompare', (req, res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}
  res.render('pricecomparison.hbs');
 });

module.exports.app = app;
