/**
  @author Esteban Acosta
*/
const express = require('express');

const bodyParser = require('body-parser');

const web_logging_setup = require('./web_logging').setupWebLog;

const logger = require('../utils/logging.js').logger;

const fileIO = require('../data/fileio.js');

const hbs = require('hbs');

const session = require('express-session');

const morgan = require('morgan');

const winston = require('winston');

const crypto =  require('crypto');

const app = express();

const validator = require('validator');

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

var header =  "Imperial Nation";

app.get('/' , (req, res) =>  {
  if (req.session.user != null) {
    console.log('User logged in');

    var csrf =  csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);

    menStock = fileIO.loadMenStock(req.session.user);
    womenStock = fileIO.loadWomenStock(req.session.user);
    newStock = fileIO.loadNewStock(req.session.user);
    req.session.history = fileIO.loadShoppingHistory(req.session.user);
    req.session.menStock = menStock;
    req.session.womenStock = womenStock;
    req.session.newStock = newStock;

    if(req.session.user == "administrator"){
      res.render('updateStock.hbs',{
        menStock,
        womenStock,
        newStock,
        token: req.session.csrf
      });
    }
    else{
    logger.info(`${req.session.user} has logged onto the imperial nation website`);
    res.render('mainpage.hbs', {
      userid : req.session.user,
      womenStock,
      newStock,
      menStock,
      token: req.session.csrf
    });
  }
  } else {
    console.log('User not logged in');
    logger.info('User not logged in');
    res.render('loginpage.hbs', {
    pageTitle: header,
    motto: " Just Go For It",
    logininfo: "Please login to the website to view our shoes"
  });
  }
});

function csrfTokenGenerator(bytes) {
 randArray = new Buffer.alloc(bytes);
 crypto.randomFillSync(randArray);
 return randArray.toString("base64");
}

//This route checks the credentials user put in
app.post('/login', (req, res) => {
  var userId = validator.escape(req.body.userid);
  var password = validator.escape(req.body.password);
  var errorMessage = [];

logger.debug(`Values received: userId: ${userId}, password: ${password}`)
console.log(`${req.method} ${req.url} ${req.httpVersion}`);
//Takes the user's username and password and checks to see if the account exists
credentialsAccepted = fileIO.checkingCredentials(userId,password);

//if the account doesn't exist, then send an error message
if(credentialsAccepted == false){
  errorMessage.push("Username and password do not match. Please try again");
  console.log("Error logging in:", errorMessage);
  logger.error(`credentials have not been accepted`);
  res.render('loginpage.hbs', {
    errorMessage
  });
}
//if the account does exist, then redirect them to the home page
else{
  if(userId == "administrator"){

    logger.info(`${userId} has entered the administration settings page`);
  }
  else{
  logger.info(`${userId} has officially entered the site`);
}
  req.session.user = userId;
  //load the user's shopping cart
  listOfShoes = fileIO.loadShoppingCart(req.session.user);

  req.session.listOfShoes = listOfShoes;
  shoeHistory = fileIO.loadShoppingHistory(req.session.user);
  req.session.history = shoeHistory;
  res.redirect("/");

}

});

app.post('/AdminAddQuantity', (req, res) => {
var shoe = req.body.shoe;
var price = Number(req.body.price);
var category = req.body.category;
var type = req.body.type;
var code ="addMore";

var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  res.render('updateStock.hbs', {
    csrfError,
    menStock,
    womenStock,
    newStock,
    token: req.session.csrf
  });
}

else{
logger.info(`${req.session.user} wishes to add more of ${shoe}`);
var csrf = csrfTokenGenerator(30);
req.session.csrf = csrf;
fileIO.saveToken(req.session.csrf);
res.render('adminAdd.hbs', {
shoe,
price,
category,
type,
code,
token: req.session.csrf
});
}

});

app.post('/AdminRemoveQuantity', (req, res) => {

  var shoe = req.body.shoe;
  var price = Number(req.body.price);
  var category = req.body.category;
  var type = req.body.type;
  var quantity = Number(req.body.quantity);
  var max = fileIO.loadQuantity(category, shoe);
  var code = "removeMore";

  csrfError = [];
  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
    res.render('updateStock.hbs', {
      csrfError,
      menStock,
      womenStock,
      newStock,
        token: req.session.csrf
    });
  }

  else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
  logger.info(`${req.session.user} wishes to remove more of ${shoe}`);
    fileIO.saveToken(req.session.csrf);

res.render('adminRemove.hbs',{
  shoe,
  price,
  category,
  type,
  quantity,
  max,
  code,
  token: req.session.csrf
});
}
});
app.post('/AdminRemoveCompletely', (req, res) => {

    var shoe = req.body.shoe;
    var price = req.body.price;
    var category = req.body.category;
    var code = "deleteCompletely"

    if(req.session.csrf != req.body.token){
      csrfError.push("CSRF error");
      logger.error(`${req.session.user} did not submit this form`);
      var csrf = csrfTokenGenerator(30);
      req.session.csrf = csrf;

      fileIO.saveToken(req.session.csrf);
      res.render('updateStock.hbs', {
        csrfError,
        menStock,
        womenStock,
        newStock,
        token: req.session.csrf
      });
    }

    else{
      var csrf = csrfTokenGenerator(30);
      req.session.csrf = csrf;
      fileIO.saveToken(req.session.csrf);
    fileIO.adminChange(req.session.user, shoe, category, code , 0, 0, "");
    logger.info(`${req.session.user} has removed ${shoe}`)
    menStock = fileIO.loadMenStock(req.session.user);
    womenStock = fileIO.loadWomenStock(req.session.user);
    newStock = fileIO.loadNewStock(req.session.user);

    req.session.menStock = menStock;
    req.session.womenStock = womenStock;
    req.session.newStock = newStock;
res.render('updateStock.hbs',{
menStock,
womenStock,
newStock,
token: req.session.csrf
});
}
});

app.post('/AdminPriceChange' , (req,res) => {
  var shoe = req.body.shoe;
  var price = req.body.price;
  var category = req.body.category;
  var code = "priceChange";
  var csrfError = [];
  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);
    res.render('updateStock.hbs', {
      csrfError,
      menStock,
      womenStock,
      newStock,
      token: req.session.csrf
    });
  }

  else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
res.render('priceChange.hbs',{
  shoe,
  price,
  category,
  code,
  token: req.session.csrf
});

}
});

app.post('/AdminAddShoes', (req,res) => {
  var code = "newshoes";
  var csrfError = [];
  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;


    fileIO.saveToken(req.session.csrf);
    res.render('updateStock.hbs', {
      csrfError,
      menStock,
      womenStock,
      newStock,
      token: req.session.csrf
    });
  }

  else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
res.render('newShoe.hbs',{
  code,
  token: req.session.csrf
});
}
});


app.post('/updatingNewShoes', (req,res) => {

  var code = req.body.code;
  var shoe = validator.escape(req.body.shoe);
  var price = Number(req.body.price);
  var type = validator.escape(req.body.type);
  var category = validator.escape(req.body.category);
  var quantity = Number(req.body.quantity);
  var image = req.body.link;
  var errorMessage = [];
  var csrfError = [];

  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);

    res.render('newShoe.hbs', {
      csrfError,
      menStock,
      womenStock,
      newStock,
      token: req.session.csrf
  });

}

  else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
  if(price == 0 || quantity == 0 || image == null || shoe == null){
    errorMessage.push("Some fields are empty");
    res.render('newShoe.hbs',{
      errorMessage,
      code,
      token: req.session.csrf
    });
  }

  else{

    fileIO.adminChange(req.session.user, shoe, category, code, quantity, price,image,type, req.session.csrf);

      menStock = fileIO.loadMenStock(req.session.user);
      womenStock = fileIO.loadWomenStock(req.session.user);
      newStock = fileIO.loadNewStock(req.session.user);

      req.session.menStock = menStock;
      req.session.womenStock = womenStock;
      req.session.newStock = newStock;
    res.render('updateStock.hbs',{
      menStock,
      womenStock,
      newStock,
      token: req.session.csrf
  });
}
}
});

app.post('/updatedStock', (req,res) => {

  var code = req.body.code;
  var shoe = req.body.shoe;
  var price = req.body.price;
  var type = req.body.type;
  var category = req.body.category;
  var max = req.body.max;
  var quantity = Number(req.body.quantity);
  var image = req.body.link
  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);

    if(code =="addMore"){
    res.render('addminAdd.hbs', {
      csrfError,
      shoe,
      price,
      category,
      type,
      code,
      token: req.session.csrf
    });
  }

  else if(code == "priceChange"){
    res.render('priceChange.hbs', {
      csrfError,
      shoe,
      category,
      type,
      code,
      token: req.session.csrf
    });
  }
  else{
    res.render('adminRemove.hbs', {
      csrfError,
      shoe,
      price,
      category,
      type,
      quantity,
      code,
      max,
      token: req.session.csrf
    });
  }
  }

  else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    if(code == "addMore"){
  logger.info(`${req.session.user} wishes to add this quantity: ${quantity} of this shoe: ${shoe} `);
}

else if(code == "removeMore"){
    logger.info(`${req.session.user} wishes to remove this quantity: ${quantity} of this ${shoe}`);
}
else{
    logger.info(`${req.session.user} wishes to change the price of ${shoe}`);
}
  fileIO.adminChange(req.session.user, shoe, category, code, quantity, price,image,type);

  menStock = fileIO.loadMenStock(req.session.user);
  womenStock = fileIO.loadWomenStock(req.session.user);
  newStock = fileIO.loadNewStock(req.session.user);

  req.session.menStock = menStock;
  req.session.womenStock = womenStock;
  req.session.newStock = newStock;
  res.redirect('/');
}

});

/////////////////////////////////////////////////////////////////ABOVE ARE METHODS FOR THE administrator////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This routes logs the user out
app.post('/eliminateSession',(req,res) =>{

  var csrfError = [];
  if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);
    fileIO.saveShoppingToken(req.session.user, req.session.csrf);
    if(req.session.user != "administrator"){
    res.render('mainpage.hbs',{
      csrfError,
      userid: req.session.userId,
      womenStock: req.session.womenStock ,
      newStock:req.session.newStock,
      menStock: req.session.menStock,
      token: req.session.csrf
    });
  }
  else if(req.session.user == "administrator"){
    res.render('updateStock.hbs',{
      csrfError,
      womenStock: req.session.womenStock ,
      newStock:req.session.newStock,
      menStock: req.session.menStock,
      token: req.session.csrf

    })
    }
  }

  else{
  logger.info(`${req.session.user} has logged out`)
  req.session.destroy();
  res.redirect('/');
}
});

//This route hits only when user changes the password
app.post('/changePwd', (req,res) => {

if (!req.session.user) {
  res.redirect('/');
  return
}
var newPwd= validator.escape(req.body.newpwd);
var currentPwd = validator.escape(req.body.currentpwd);
var userName = req.session.user;
var confirmingPwd = validator.escape(req.body.confirmingpwd);

logger.debug(`Values entered: current password: ${currentPwd},
  confirming password: ${confirmingPwd}, new password: ${newPwd}`);

var errorMessage = [];

credentialsAccepted = fileIO.checkingCredentials(userName,currentPwd);

var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;

  fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);

  res.render('mainpage.hbs',{
    csrfError,
    userid: req.session.user,
    womenStock: req.session.womenStock ,
    newStock:req.session.newStock,
    menStock: req.session.menStock,
    token: req.session.csrf
  });

}

else{
if(credentialsAccepted){
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
    fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  if(newPwd == confirmingPwd){
    fileIO.changeCredentials(userName,currentPwd, newPwd);
    errorMessage.push("Password has been successfully changed")
    logger.info(`${req.session.user} has successfully changed their password`);

    res.render('mainpage.hbs', {
      errorMessage,
      userid: req.session.user,
      womenStock: req.session.womenStock ,
      newStock:req.session.newStock,
      menStock: req.session.menStock,
      token: req.session.csrf
    });
  }

  else{
    errorMessage.push("The new password and the confirming password do not match");
    logger.error(`${req.session.user}'s  new password and confirming password do not match`);
    res.render('mainpage.hbs',{
      errorMessage,
      userid: req.session.user,
      womenStock: req.session.womenStock ,
      newStock:req.session.newStock,
      menStock: req.session.menStock,
      token: req.session.csrf
    });
  }
}

else{
fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  errorMessage.push("The current password you have entered is incorrect");
  logger.error(`${req.session.user} has entered the wrong current password`);
  res.render('mainpage.hbs', {
    errorMessage,
    userid: req.session.user,
    womenStock: req.session.womenStock ,
    newStock:req.session.newStock,
    menStock: req.session.menStock
  });
}

}
});

//This route is hit only when the user wants to remove a certain number of items from their shopping cart
app.post('/removeItem', (req, res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}
var listOfShoes = req.session.listOfShoes;
var quantityRemoved = req.body.quantity;
var shoe = req.body.shoeName;
var csrfError = [];
var max = req.body.max;
var currentTotalPrice = 0;
//Determines if the user is trying to delete all of that item from shopping cart
var erasedComplete = false;
//Stores the removed item index
var removedItemIndex = 0;


if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;

  fileIO.saveToken(req.session.csrf);
  listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);

res.render('confirmRemoval', {
shoe,
token:req.session.csrf,
max,
pageTitle: header
});
}

else{
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);

for(i = 0; i < listOfShoes.length; i++ ){
  if(listOfShoes[i].shoe == shoe){
      if(listOfShoes[i].quantity == quantityRemoved){
        erasedComplete = true;
        removedItemIndex = i;
      }
      listOfShoes[i].quantity -= quantityRemoved;

      break;
  }
}
logger.info(`${req.session.user} wants this quantity: ${quantityRemoved} of this shoe: ${shoe} to be removed
  from shopping cart`);
if(erasedComplete){
  listOfShoes.splice(removedItemIndex,1);
  logger.info(`${req.session.user} wants ${shoe} to be removed completely from shopping cart`);

}

for(i = 0 ;i < listOfShoes.length; i++){
  currentTotalPrice += (listOfShoes[i].quantity * listOfShoes[i].price);
}
//Save the new shopping cart list
fileIO.saveShoppingCart(req.session.user,listOfShoes);

req.session.listOfShoes = listOfShoes;
  res.render('shoppingCart.hbs',{
    listOfShoes,
    user: req.session.user,
    totalPrice: currentTotalPrice,
    token: req.session.csrf
  });
}
});

//This route is hit when user removes all items in the shopping cart
app.post('/removeAll',(req,res) => {
//load all the shoes
  var listOfShoes = req.session.listOfShoes;
var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
    fileIO.saveShoppingToken(req.session.user, req.session.csrf);
res.render('shoppingCart.hbs',{
  listOfShoes,
  user: req.session.user,
  token: req.session.csrf,
  csrfError
});
}

else{

  //remove all of the shoes in the array
    listOfShoes.splice(0,listOfShoes.length);

  //save that array in user's shopping cart
    fileIO.saveShoppingCart(req.session.user, listOfShoes);

  //update the session's list of shoes
    req.session.listOfShoes =  listOfShoes;

    logger.info(`${req.session.user} has removed all items from shopping cart`);


    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
    //send that data to the page
    res.render('shoppingCart.hbs',{
      listOfShoes,
      user: req.session.user,
      totalPrice: 0,
      token: req.session.csrf
  });

}
});

app.post('/confirmRemoval' , (req,res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}

  var totalPrice= 0;
  var listOfShoes = req.session.listOfShoes;
  var shoe = req.body.shoeName;
  var csrfError = [];
  var max = 0;
  for(i = 0; i < listOfShoes.length ; i++){
    if(shoe == listOfShoes[i].shoe){
        max = listOfShoes[i].quantity;
        break;
    }
  }
  for(i = 0 ;i < listOfShoes.length; i++){
    totalPrice += (listOfShoes[i].quantity * listOfShoes[i].price);
  }
  console.log(req.session.csrf);
 if(req.session.csrf != req.body.token){
   csrfError.push("CSRF error");
   logger.error(`${req.session.user} did not submit this form`);
   var csrf = csrfTokenGenerator(30);
   req.session.csrf = csrf;
   fileIO.saveToken(req.session.csrf);
     fileIO.saveShoppingToken(req.session.user, req.session.csrf);

   res.render('shoppingCart.hbs',{
    csrfError,
    listOfShoes,
    totalPrice,
    user:req.session.user,
    token:req.session.csrf
   });
 }

 else{
   var csrf = csrfTokenGenerator(30);
   req.session.csrf = csrf;
   fileIO.saveToken(req.session.csrf);
    listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);
   logger.info(`${req.session.user} is going to determine how many of this item: ${shoe} they want to remove`);
   res.render('confirmRemoval.hbs',{
     header,
     shoe,
     max,
     token: req.session.csrf
   });
 }

});

//Shows user's shopping history
app.post('/showHistory', (req,res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}

var shoeHistory = req.session.history;

var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
   fileIO.saveToken(req.session.csrf);
    fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  res.render('mainpage.hbs',{
    csrfError,
    userid: req.session.userId,
    womenStock: req.session.womenStock ,
    newStock:req.session.newStock,
    menStock: req.session.menStock,
    token: req.session.csrf
  });

}

else{
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
   fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  logger.info(`${req.session.user} has requested to view their shopping history`);
  res.render('shopHistory.hbs',{
    shoeHistory,
    user: req.session.user,
    token: req.session.csrf
});

}
});

//This route is when user wants to see what's in their shopping cart
app.post('/showShopCart',(req,res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}
var listOfShoes = req.session.listOfShoes;

var currentTotalPrice = 0;

//Loop through each element of the list and take the price of each item and the quantity of each
//multiply them together and store it as the current total price
for(i = 0; i < listOfShoes.length; i++ ){
    currentTotalPrice+=(listOfShoes[i].price * listOfShoes[i].quantity);
}

var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  res.render('mainpage.hbs',{
    csrfError,
    userid: req.session.userId,
    womenStock: req.session.womenStock ,
    newStock:req.session.newStock,
    menStock: req.session.menStock,
    token: req.session.csrf
  });

}

else{
var csrf = csrfTokenGenerator(30);
req.session.csrf = csrf;
 fileIO.saveToken(req.session.csrf);
listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);
logger.info(`${req.session.user} has requested to view their shopping cart`);
res.render('shoppingCart.hbs',{
  listOfShoes,
  user: req.session.user,
  totalPrice: currentTotalPrice,
  token: req.session.csrf
  });

}
});

//This route renders the purchase confirmation page
app.post('/purchaseItems', (req,res) => {
var listOfShoes =  req.session.listOfShoes;
var totalPrice = 0;
var errorMessage = "";
var csrfError = [];
for(i = 0; i < listOfShoes.length; i++){
  totalPrice+=(listOfShoes[i].price * listOfShoes[i].quantity);
}
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  res.render('shoppingCart.hbs',{
    listOfShoes,
    totalPrice,
    user: req.session.user,
    errorMessage,
    token : req.session.csrf
  });
}
else{
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);

if(totalPrice == 0){
  errorMessage = "You can't purchase any items unless you have item(s) in your shopping cart";
  logger.error(`${req.session.user} has requested to purchase items with zero items in their shopping cart`);
  res.render('shoppingCart.hbs',{
    listOfShoes,
    totalPrice,
    user: req.session.user,
    errorMessage,
    token: req.session.csrf
  });
}
else{
logger.info(`${req.session.user} has requested to purchase items in their shopping cart`);
res.render('purchaseItems.hbs', {
  totalPrice,
  user: req.session.user,
  token: req.session.csrf
});
}

}
});

//This route is hit once the user has confirmed they want to buy everything that's in their shopping cart
app.post('/justPurchased' , (req,res) => {
  var listOfShoes = req.session.listOfShoes;
  var quantity = 0;

  var firstName = validator.escape(req.body.firstName);
  var lastName = validator.escape(req.body.lastName);
  var cvc = Number(validator.escape(req.body.cvc));
  var cc = Number(validator.escape(req.body.cc));
  var shoppingHistory = req.session.history;

  var totalPrice = 0;

  for(i = 0; i < listOfShoes.length; i++){
    totalPrice+=(listOfShoes[i].price * listOfShoes[i].quantity);
  }

  var csrfError = [];
  //Check to see if the user submitted this form
if(req.session.csrf != req.body.token){
    csrfError.push("CSRF error");
    logger.error(`${req.session.user} did not submit this form`);
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;

    fileIO.saveToken(req.session.csrf);
    fileIO.saveShoppingToken(req.session.user, req.session.csrf);

    res.render('purchaseItems.hbs',{
        totalPrice,
        user: req.session.user,
        token: req.session.csrf
    });
}
//If it was the user who submitted this form
else{
  //Generate a new CSRF token
  var csrf = csrfTokenGenerator(30);
  //Store it
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
var errorMessage = "";
//If anny of these fields are empty
if(firstName.length == 0 || lastName.length == 0 || cvc == 0 || cc == 0){
  //log the error
logger.error(`${req.session.user} has not filled out all the forms on the page`);
  //display the error message to the user
errorMessage = "Some of these fields are empty. Please fill out this form to purchase your items";
res.render('purchaseItems.hbs',{
  errorMessage,
  totalPrice,
  user: req.session.user,
  token: req.session.csrf
});
}

//If all fields have been field
else{
//and if this is not the first time the user has purchased something from this site
  if(shoppingHistory.length > 0){
    //Loop through the shoppingcart and store each aspect of the shoe
    for(i = 0; i < listOfShoes.length; i++){
      shoe = listOfShoes[i].shoe;
      type = listOfShoes[i].type;
      category = listOfShoes[i].category;
      price = listOfShoes[i].price;
      quantity = listOfShoes[i].quantity;
      token =  listOfShoes[i].token;
      //and push that JSON value into the array
      shoppingHistory.push({ shoe , type , category , price , quantity, token});
    }
    //Then save the updated array
    fileIO.saveUserHistory(req.session.user, shoppingHistory);
  }
  //if this is the user's first time purchasing an item from this site
  //Just save the user's purchased items in the shopping history file
  else{
    shoppingHistory = listOfShoes;

    fileIO.saveUserHistory(req.session.user,shoppingHistory);
  }

  //Since the user purchased all the items in their shopping cart,
  //the site has to reflect that change by keeping track of how many of those shoes
  //are still left in stock
  fileIO.saveUpdatedNewStock(req.session.user);
  fileIO.saveUpdatedMenStock(req.session.user);
  fileIO.saveUpdatedWomenStock(req.session.user);

  //Since the user purchased all the items in their shopping cart,
  //eliminate all the items in the shopping cart
  listOfShoes.splice(0, listOfShoes.length);

  //And save the updated (now empty) shopping cart
  fileIO.saveShoppingCart(req.session.user,listOfShoes);

  req.session.listOfShoes = listOfShoes;
  req.session.history = shoppingHistory;

  logger.info(`${req.session.user} has purchased all the items in their shopping cart`);
  logger.info(`${req.session.user} no longer has any items in their shopping cart`);

  res.redirect("/");
}

}
});

//This route is hit when the user wants to determine how many of those items they wish to purchase
app.post('/quantityConfirmed', (req,res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}

var csrfError = [];
//Check to see if the user submitted this form
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error("User did not submit this form");
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;
  fileIO.saveToken(req.session.csrf);
  if(listOfShoes.length > 0){
  fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  }
  res.render('mainpage.hbs',{
    csrfError,
    userid : req.session.user,
    womenStock,
    newStock,
    menStock,
    token: req.session.csrf
  });
}
//If the user submitted this form
else{
  //Generate a new token value
  var csrf =  csrfTokenGenerator(30);
  req.session.csrf = csrf;
  //Save the new token value for the shoes in stock
  fileIO.saveToken(req.session.csrf);

  var listOfShoes = req.session.listOfShoes;
  //if there are shoes currently in their shopping cart
  if(listOfShoes.length > 0){
    //save the current token in the list of shoes
  listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);
  }
  //Retrive all the shoe information from the hmtl body
  var shoe = req.body.shoeName;
  var type = req.body.type;
  var category = req.body.category;
  var price = Number(req.body.price);

  //This stores the stock quantity of the shoe
  var max = fileIO.loadQuantity(category, shoe);
  for( i = 0 ; i < listOfShoes.length; i++){
    if(listOfShoes[i].shoe == shoe){
      max-= listOfShoes[i].quantity;
    }
  }

  logger.info(`${req.session.user} is going to determine how many items they want in their shopping cart`);

  res.render('qtConfirmPage', {
    shoe,
    category,
    price,
    type,
    header,
    max,
    token: req.session.csrf
  });
}

});

//This route is hit when user wants to add an item to the shopping cart
app.post('/addToShopCart', (req, res) => {
  if (!req.session.user) {
  res.redirect('/');
  return;
}
var listOfShoes = req.session.listOfShoes;
// Load the shoe, type, category and total price
var shoe = req.body.shoeName;
var type = req.body.type;
var category = req.body.category;
var currentTotalPrice = 0;
var quantity = Number(req.body.quantity);
var storedQuantity = 0;
//Stores the price of the currently added item
var price = Number(req.body.price);
var errorMessage = [];
var stockQuantity = Number(fileIO.loadQuantity(category,shoe));
var max = req.body.max;

for(i = 0 ; i < listOfShoes.length; i++){
    if(listOfShoes[i].shoe == shoe){
        storedQuantity = listOfShoes[i].quantity;
        break;
    }
}

var found = false;
var csrfError = [];
if(req.session.csrf != req.body.token){
  csrfError.push("CSRF error");
  logger.error(`${req.session.user} did not submit this form`);
  var csrf = csrfTokenGenerator(30);
  req.session.csrf = csrf;

  fileIO.saveToken(req.session.csrf);
  listOfShoes =fileIO.saveShoppingToken(req.session.user, req.session.csrf);

  res.render('qtConfirmPage.hbs',{
    csrfError,
    userid: req.session.userId,
    max,
    price,
    category,
    shoe,
    token: req.session.csrf
  });

}

else{
    var csrf = csrfTokenGenerator(30);
    req.session.csrf = csrf;
    fileIO.saveToken(req.session.csrf);
    if(listOfShoes.length > 0){
    listOfShoes = fileIO.saveShoppingToken(req.session.user, req.session.csrf);
    }
    var token = req.session.csrf;
    //if the shoe is in the shopping cart, just update the quantity
    for(i = 0; i < listOfShoes.length; i++){
      if(listOfShoes[i].shoe == shoe){
        listOfShoes[i].quantity += quantity;
        found = true;
      }
    }
    //if this shoe is not in the shopping cart
    if(found == false){
      //Create a JSON with those respective values and add it to the array of shoes
      listOfShoes.push({ shoe, type, category, price,quantity,token});
    }

    //Save the new array of shoes into the user's shopping cart
    fileIO.saveShoppingCart(req.session.user, listOfShoes);

    req.session.listOfShoes = listOfShoes;

    for(i = 0; i < listOfShoes.length; i++ ){
      currentTotalPrice += (listOfShoes[i].quantity * listOfShoes[i].price);
    }

    logger.info(`${req.session.user} has added this quantity: ${quantity} of this shoe: ${shoe}`);

  res.render('shoppingCart.hbs', {
    shoe,
    user: req.session.user,
    totalPrice: currentTotalPrice,
    listOfShoes,
    price,
    token: req.session.csrf
  });
}
 });

 // Default missing route handler
app.use(function (req, res, next) {
  handleError(404, "No route defined at the requested URL", res);
});

// Default error handler
app.use(function (err, req, res, next) {
  logger.error("Express error encountered: " + err.stack)
  handleError(500, err, res);
});

var handleError = (code, err, res) => {
  res.status(code);
  if (!err) {
    err = "No specific error message reported, check the logs";
  }
  logger.error(`Display error page: code:${code} message:${err}`);
  res.render('bad_request', {
    err
  });
};

module.exports.app = app;
