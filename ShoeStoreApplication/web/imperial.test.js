
const request = require("supertest");

const expect = require('expect');

const mocha = require('mocha');

const session = require('supertest-session');
// Get the app instance (e.g. the express instance exported by the web app module)
var app = require('./imperial').app;
describe("First Test: Login Page & Main Page", () => {
  it('should return 200 with login page', (done) => {
      request(app)
      .get('/')
      .expect(200)
      .expect((resp) => {
      expect(resp.text.indexOf("Imperial Nation")).toBeGreaterThanOrEqual(0)
  })
  .end(done);
});
it('should return 200  with an error message', (done) => {
    request(app)
    .post('/login')
        .type('form')
    .send({userid: "eduardo",  password: "Eduardo"})
    .expect(200)
    .expect((resp) => {
    expect(resp.text.indexOf("Username and password do not match. Please try again")).toBeGreaterThanOrEqual(0)
})
.end(done);
});

it('should return 302 with the homepage', (done) => {
    request(app)
    .post('/login')
    .type('form')
    .send({userid: 'jack',  password:'creed'})
    .expect(302)
.end(done);
});


it('should return 302 with the homepage', (done) => {
    request(app)
    .post('/login')
    .type('form')
    .send({userid: 'john',  password:'thebay'})
    .expect(302)
.end(done);
});

it('should return 200 with error message', (done) => {
    request(app)
    .post('/login')
      .type('form')
    .send({userid: "jack", password:"jack"})
    .expect(200)
    .expect((resp) => {
    expect(resp.text.indexOf("Username and password do not match. Please try again")).toBeGreaterThanOrEqual(0)
})
.end(done);
});


})

describe("Second Test: Login as administrator", () => {
var testSession = null;
beforeEach(function(done){
  testSession = session(app);
  testSession.post('/login').type('form')
  .send({userid: 'administrator', password: 'technology'})
  .expect(302).end(function(err){
    if(err) return done(err);
    return done();
  });
});

it('should be able to go to the administrator home page', (done) => {
  testSession.get('/')
  .expect(200)
  .end(done)
});

it('should be able to go to the add quantity page', (done) => {
  testSession.post('/AdminRemoveQuantity')
  .send({shoe: 'Nike Black Eagle X', category: 'Both',type :' StyleWear', code: 'removeMore'})
  .expect(200)
  .end(done)
});

it('should be able to remove some amount of NikeBlackEagleX', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Black Eagle X', category: 'Both',type :' StyleWear', code: 'removeMore', quantity: '10'})
  .expect(302)
  .end(done)
});

it('should be able to remove some amount of NikeGalaxyEagle', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Galaxy Eagle', category: 'Both',type :' StyleWear', code: 'removeMore', quantity: '15'})
  .expect(302)
  .end(done)
});


it('should be able to go to the add quantity page', (done) => {
  testSession.post('/AdminAddQuantity')
  .send({shoe: 'Nike Black Eagle X', category: 'Both',type :' StyleWear', code: 'addMore'})
  .expect(200)
  .end(done)
});
it('should be able to add some quantity of NikeBlackEagleX', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Black Eagle X', category: 'Both',type :' StyleWear', code: 'addMore', quantity: '10'})
  .expect(302)
  .end(done)
});


it('should be able to add some quantity of NikeGalaxyEagle', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Galaxy Eagle', category: 'Women',type :' StyleWear', code: 'addMore', quantity: '100'})
  .expect(302)
  .end(done)
});


it('should be able to go to the price change page', (done) => {
  testSession.post('/AdminPriceChange')
  .send({shoe: 'Nike Black Eagle X', category: 'Both', code: 'priceChange'})
  .expect(200)
  .end(done)
});

it('should be able to change price opf NikeGalaxyEagle to 199', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Galaxy Eagle', category: 'Women',type :' StyleWear', code: 'changePrice', price: '199'})
  .expect(302)
  .end(done)
});

it('should be able to change price of NikeBlackEagleX to 199.98', (done) => {
  testSession.post('/updatedStock').type('form')
  .send({shoe: 'Nike Black Eagle X', category: 'Both',type :' StyleWear', code: 'changePrice', price: '198.99'})
  .expect(302)
  .end(done)
});



it('should be able to go to the add shoes page', (done) => {
  testSession.post('/AdminAddShoes')
  .expect(200)
  .expect((resp) => {
    expect(resp.text.indexOf("Administrator Settings")).toBeGreaterThanOrEqual(0)
  })
  .end(done)
});

it('Should logout of administrator webpage', (done) => {
  testSession.post('/eliminateSession')
  .expect(302)
  .end(done)
});

  })

  describe("Third Test: Login as user", () => {
  var testSession = null;
  beforeEach(function(done){
    testSession = session(app);
    testSession.post('/login').type('form')
    .send({userid: 'esteban', password: 'table'})
    .expect(302).end(function(err){
      if(err) return done(err);
      return done();
    });
  });

  it('should be able to go to the home page', (done) => {
    testSession.get('/')
    .expect(200)
    .end(done)
  });

  it('Should display shopping history', (done) => {
    testSession.post('/showHistory')
    .expect(200)
    .expect((resp) => {
      expect(resp.text.indexOf("esteban's Shopping History:")).toBeGreaterThanOrEqual(0)
    })
    .end(done)
  });

  it('Should display shopping cart', (done) => {
    testSession.post('/showShopCart')
    .expect(200)
    .expect((resp) => {
      expect(resp.text.indexOf("esteban's Shopping cart:")).toBeGreaterThanOrEqual(0)
    })
    .end(done)
  });

  it('Should display quantity confirmed', (done) => {
    testSession.post('/quantityConfirmed')
      .send({shoeName: 'Nike Black Eagle X',price: '230', category: 'Both',type :' StyleWear'})
    .expect(200)
    .end(done)
  });

  it('Should have added some quantity of Nike Black Eagle X' , (done) => {
      testSession.post('/addToShopCart').type('form')
      .send({shoeName: 'Nike Black Eagle X',price: '230', category: 'Both',type :' StyleWear'})
      .expect(200)
      .end(done)
  });

  it('Should be able to reach the confirm removal page', (done) => {
    testSession.post('/confirmRemoval').type('form')
      .send({shoeName: 'Nike Black Eagle X'})
    .expect(200)
    .end(done)
  });
  
  it('Should be able to remove some quantity of Nike Black Eagle X' , (done) => {
      testSession.post('/removeItem').type('form')
      .send({shoeName: 'Nike Black Eagle X',quantity: '1'})
      .expect(200)
      .end(done)
  });

  it('Should logout', (done) => {
    testSession.post('/eliminateSession')
    .expect(302)
    .end(done)
  });
})
