/**
  File I/O for saving and retrieving shoes
*/

const fs = require('fs');

const files_location = "files";

module.exports.checkingCredentials = (userId, password) => {

  var credentials = [];
  var credentialsAccepted = false;

  try {
    var theData = fs.readFileSync(`${files_location}/credentials.json`);

    credentials = JSON.parse(theData);

    // loops through each entry
    //   to determine if the password and username
    //   that the user has put exists in our file
    for(i = 0; i < credentials.length; i++){
      //if the username and password match, then return true
      //if the username and password don't match, then return false
    if(credentials[i].userId == userId && credentials[i].password == password){

      credentialsAccepted = true;

      console.log("Congrats You Are In")
    }
    //otherwise continue looping through the array
    else{
      continue;
    }
  }
  }
  catch (error) {
    credentials = [];
    console.log("Better luck next time");
  }

  return credentialsAccepted;
};

module.exports.changeCredentials = (userId, password, newPwd) => {

  var credentials = [];
  try {
    var theData = fs.readFileSync(`${files_location}/credentials.json`);

    credentials = JSON.parse(theData);

    // loops through each entry
    //   to determine if the password and username
    //   that the user has put exists in our file
    for(i = 0; i < credentials.length; i++){
      //if the username and password match, then return true
      //if the username and password don't match, then return false
    if(credentials[i].userId == userId && credentials[i].password == password){
      console.log("You have entered");
      credentials[i].password = newPwd;

      console.log("changed their password");
    }
    //otherwise continue looping through the array
    else{
      continue;
    }
  }
      }

  catch (error) {
    credentials = [];
    console.log("Credentials do not exist");
  }
  fs.writeFileSync(`${files_location}/credentials.json`, JSON.stringify(credentials));
};

module.exports.saveShoppingToken = (userid, token) =>{
  var theData = [];
  var listOfShoes = [];
  theData = fs.readFileSync(`${files_location}/${userid}ShoppingCart.json`);
  listOfShoes = JSON.parse(theData);
  for(i = 0; i < listOfShoes.length; i++){
    listOfShoes[i].token = token;
  }

  fs.writeFileSync(`${files_location}/${userid}ShoppingCart.json`, JSON.stringify(listOfShoes));
  return listOfShoes;
};
module.exports.saveToken = (token) => {
  var theData = [];
  var listOfShoes = [];
  theData = fs.readFileSync(`${files_location}/newShoes.json`);

  listOfShoes = JSON.parse(theData);

  for(i = 0; i < listOfShoes.length; i++){
    listOfShoes[i].token = token;
  }

fs.writeFileSync(`${files_location}/newShoes.json`, JSON.stringify(listOfShoes));

///////////////////////////LOAD MEN SHOES DATA//////////////////////////////////////
theData = fs.readFileSync(`${files_location}/menShoes.json`);

listOfShoes = JSON.parse(theData);

for(i = 0; i < listOfShoes.length; i++){
  listOfShoes[i].token = token;
}

fs.writeFileSync(`${files_location}/menShoes.json`, JSON.stringify(listOfShoes));

////////////////////////////LOAD WOMEN SHOES DATA////////////////////////////////////
theData = fs.readFileSync(`${files_location}/womenShoes.json`);

listOfShoes = JSON.parse(theData);

for(i = 0; i < listOfShoes.length; i++){
  listOfShoes[i].token = token;
}

fs.writeFileSync(`${files_location}/womenShoes.json`, JSON.stringify(listOfShoes));


};

module.exports.saveUpdatedNewStock = (userid) => {

  var listOfShoes = [];
  var theData = [];
  var shoppingCart = [];

  shoppingCart = fs.readFileSync(`${files_location}/${userid}ShoppingCart.json`);
  theData = fs.readFileSync(`${files_location}/newShoes.json`);


  shoppingCart = JSON.parse(shoppingCart);
  listOfShoes = JSON.parse(theData);

  for(i = 0; i < shoppingCart.length; i++){
    for(j = 0 ; j < listOfShoes.length; j++){
        if(shoppingCart[i].shoe == listOfShoes[j].shoeName){
            listOfShoes[j].quantity -= shoppingCart[i].quantity;
        }
}
}

  fs.writeFileSync(`${files_location}/newShoes.json`, JSON.stringify(listOfShoes));

};

module.exports.saveUpdatedMenStock = (userid) => {

  var listOfShoes = [];
  var theData = [];
  var shoppingCart = [];

  shoppingCart = fs.readFileSync(`${files_location}/${userid}ShoppingCart.json`);
  theData = fs.readFileSync(`${files_location}/menShoes.json`);


  shoppingCart = JSON.parse(shoppingCart);
  listOfShoes = JSON.parse(theData);

  for(i = 0; i < shoppingCart.length; i++){
    for(j = 0 ; j < listOfShoes.length; j++){
        if(shoppingCart[i].shoe == listOfShoes[j].shoeName){
            listOfShoes[j].quantity -= shoppingCart[i].quantity;
        }
}
}

  fs.writeFileSync(`${files_location}/menShoes.json`, JSON.stringify(listOfShoes));

};

module.exports.saveUpdatedWomenStock = (userid) => {

  var listOfShoes = [];
  var theData = [];
  var shoppingCart = [];

  shoppingCart = fs.readFileSync(`${files_location}/${userid}ShoppingCart.json`);
  theData = fs.readFileSync(`${files_location}/womenShoes.json`);


  shoppingCart = JSON.parse(shoppingCart);
  listOfShoes = JSON.parse(theData);

  for(i = 0; i < shoppingCart.length; i++){
    for(j = 0 ; j < listOfShoes.length; j++){
        if(shoppingCart[i].shoe == listOfShoes[j].shoeName){
            listOfShoes[j].quantity -= shoppingCart[i].quantity;
        }
}
}

  fs.writeFileSync(`${files_location}/womenShoes.json`, JSON.stringify(listOfShoes));

};

module.exports.loadMenStock = (userId)  => {
    var currentMenStock = [];

    var stockData = fs.readFileSync(`${files_location}/menShoes.json`);

    currentMenStock = JSON.parse(stockData);
    // for(i = 0; i < currentMenStock.length; i++){
    //
    //       console.log(currentMenStock[i]);
    // }

    return currentMenStock;
};

module.exports.loadWomenStock = (userId)  => {
    var currentWomenStock = [];

    var stockData = fs.readFileSync(`${files_location}/womenShoes.json`);


    currentWomenStock = JSON.parse(stockData);
            //
            // for(i = 0; i <   currentWomenStock.length; i++){
            //   console.log(currentWomenStock[i]);
            //
            // }
    return currentWomenStock;
};

module.exports.loadNewStock = (userId)  => {
    var currentNewStock = [];

    var stockData = fs.readFileSync(`${files_location}/newShoes.json`);

    currentNewStock = JSON.parse(stockData);

    // for(i = 0; i < currentNewStock.length; i++){
    //   console.log(currentNewStock[i]);
    //
    // }

    return currentNewStock;
};
module.exports.loadShoppingCart = (userId) => {
  var listOfShoes = [];

  try {
    assureFilesDir();
    var theData = fs.readFileSync(`${files_location}/${userId}ShoppingCart.json`);
    listOfShoes = JSON.parse(theData);
  }
  catch (error) {
    listOfShoes = [];
  }

  return listOfShoes;
};

module.exports.loadShoppingHistory = (userId) => {
  var listOfShoes = [];
  try {
  assureFilesDir();
  var theData =  fs.readFileSync(`${files_location}/${userId}ShoppingHistory.json`);
  listOfShoes = JSON.parse(theData);
  }
  catch(error){
    listOfShoes = [];
  }
  return listOfShoes;
};

module.exports.loadQuantity = (category, shoe) => {
    var theData;
    var quantity = 0;
    var listOfShoes = [];
    if(category == "Men"){
      theData = fs.readFileSync(`${files_location}/menShoes.json`);
    }
    else if(category == "Women"){
      theData = fs.readFileSync(`${files_location}/womenShoes.json`);
    }
    else if(category == "Both"){
      theData = fs.readFileSync(`${files_location}/newShoes.json`);
    }

     listOfShoes = JSON.parse(theData);
    // loops through each entry

    for(i = 0; i < listOfShoes.length; i++){

    if(listOfShoes[i].shoeName == shoe){

      quantity = listOfShoes[i].quantity;

    }
  }


    return quantity;
};

module.exports.saveUserHistory = (userId, shoes) => {
  assureFilesDir();
  fs.writeFileSync(`${files_location}/${userId}ShoppingHistory.json`,JSON.stringify(shoes));
};

module.exports.saveShoppingCart = (userId,shoes) => {
  assureFilesDir();
  console.log(`Saved in ${userId}'s shopping cart`);
  fs.writeFileSync(`${files_location}/${userId}ShoppingCart.json`, JSON.stringify(shoes));
};

module.exports.adminChange = (userId, shoe, category,code,quantity,price,image,type,token) => {
  var theData;
  var index = 0;
  var listOfShoes = [];

  if(category == "Men"){
    theData = fs.readFileSync(`${files_location}/menShoes.json`);
    category = "men";
  }
  else if(category == "Women"){
    theData = fs.readFileSync(`${files_location}/womenShoes.json`);
    category = "women";
  }
  else if(category == "Both"){
    theData = fs.readFileSync(`${files_location}/newShoes.json`);
    category = "new";
  }

   listOfShoes = JSON.parse(theData);
//If code is equal to delete completely, delete the entire shoe from history
if(code == "deleteCompletely"){
  for(i = 0; i < listOfShoes.length; i++){

  if(listOfShoes[i].shoeName == shoe){

    index = i;
    break;
  }
}

listOfShoes.splice(index,1);

  fs.writeFileSync(`${files_location}/${category}Shoes.json`, JSON.stringify(listOfShoes));
}

//Add more of that shoe
else if(code == "addMore"){
  for(i = 0; i < listOfShoes.length; i++){
    if(listOfShoes[i].shoeName == shoe){
      listOfShoes[i].quantity += Number(quantity);
    }
  }

    fs.writeFileSync(`${files_location}/${category}Shoes.json`, JSON.stringify(listOfShoes));
}

//Remove some of that shoe
else if(code == "removeMore"){
  for(i = 0; i < listOfShoes.length; i++){
    if(listOfShoes[i].shoeName == shoe){
      listOfShoes[i].quantity -= Number(quantity);
    }
  }

  fs.writeFileSync(`${files_location}/${category}Shoes.json`, JSON.stringify(listOfShoes));

}

//Change the price of the shoe
else if(code == "priceChange"){
  for(i = 0; i < listOfShoes.length; i++){
    if(listOfShoes[i].shoeName == shoe){
      listOfShoes[i].price =  Number(price);
    }
  }

  fs.writeFileSync(`${files_location}/${category}Shoes.json`, JSON.stringify(listOfShoes));
}

//Add new shoes
else if(code == "newshoes"){
  var shoeName = shoe;
  if(category == "men" ){
    category = "Men"
  }

  else if(category == "women"){
    category = "Women";
  }

  else if (category == "new"){
    category = "Both";
  }
  listOfShoes.push({shoeName , price , category, type, quantity , image ,token});
  if(category == "Men" ){
    category = "men"
  }

  else if(category == "Women"){
    category = "women";
  }

  else if (category == "Both"){
    category = "new";
  }

  fs.writeFileSync(`${files_location}/${category}Shoes.json`, JSON.stringify(listOfShoes));
}
};


var assureFilesDir = () => {
  if (!fs.existsSync(files_location)) {
    fs.mkdirSync(files_location);
  }
}
