import fs from 'fs';
import express from 'express';
import http from 'http';
import util from 'util';
import cors from 'cors';
import mongo from 'mongodb';
import * as account from './public/js/account.js';
import session from 'express-session';
const MongoStore = require('connect-mongo')(session);

const app = express();
const httpServer = http.createServer(app);
// const upload = multer({dest: 'upload/'});

app.use(express.static('./public'));
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(session({
  secret: 'recommand 128B random',
  store: new MongoStore({url: 'mongodb://localhost:27017/sessiondb'}),
  cookie: {maxAge: new Date(new Date().getTime() + (24*60*60*1000))},
  saveUninitialized: true,
  resave: true
}));


// log in
app.get('/account/:email', account.findByEmail );
// sign up
app.post('/account', account.createAccount );
app.post('/session', account.createSession );
app.get('/session', account.findSession );

app.delete('/logout', account.logout );
app.get('/image_gallery/images/:id', account.loadImages );
app.get('/image_gallery/shared_images', account.loadSharedImages);
app.post('/image_gallery/like', account.refreshLike);

app.post('/imaging/status', account.saveStatus);
app.post('/imaging/images', account.uploadImages);
app.get('/uniqueId', account.getUniqueId);
app.post('/session/development', account.addSession);
app.post('/development', account.initDevelopment);
app.get('/development', account.loadDevelopment);
app.delete('/development', account.clearDevelopment);
app.get('/image_gallery/work', account.getWork);
app.post('/image_gallery/filter', account.doFilter);

app.get('/image_gallery/comment/:id', account.getComments);
app.post('/image_gallery/comment', account.setComments);

app.post('/python', account.runPython);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// login page
app.get('/', (req,res) => res.render('index') );


// app.get('/public_gallery', (req,res) => res.render('image_gallery', {'page': 'workspace'} ) );
app.get('/public_gallery', (req,res) => res.render('public_gallery') );
app.get('/workspace', (req,res) => res.render('workspace') );
app.get('/imaging', (req,res) => res.render('imaging') );


httpServer.listen(8000, () => console.log('start...'));

// handle download file
// function decodeBase64Image(dataString) {
//   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
//   var response = {};
//
//   if (matches.length !== 3)
//   {
//     return new Error('Invalid input string');
//   }
//
//   response.type = matches[1];
//   response.data = new Buffer(matches[2], 'base64');
//
//   return response;
// }

http.createServer((req, res) => {
  // console.log('req received:');

  req.setEncoding('utf8')
  req.on('data', (data_write) => {

    let data2 = decodeURIComponent(data_write);
    data2 = data2.substr(6, data2.length);

    // unique name for each save
    let d = new Date();
    let filename = `img/test_${d.getTime()}.png`;
    fs.writeFile(`./public/${filename}`, data2, {encoding: 'base64'}, (err)=>{
      if (err) throw err;
      console.log('file saved!');

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end(filename);
    });

  });
  // req.on('end', () => {
  //   res.end('received')
  // })

}).listen(8001);










// let order = [
//   {_id: 1, product_id: 154, status: 1}
// ];
// let product = [
//   {_id: 154, name: 'chocolate heaven'},
//   {_id: 155, name: 'Tasty Lemons'},
//   {_id: 156, name: 'Vanilla Dreams'}
// ];

// dbo.createCollection("order", (err,res) => {});
// dbo.createCollection("product", (err,res) => {});
//
// dbo.collection("order").insertMany(order, (err, res) => {})
// dbo.collection("product").insertMany(product, (err, res) => {})


// dbo.collection("account").find().toArray( (err,result) => {
//   if(err) throw err;
//   console.log(result);
// });
// dbo.collection("account").findOne( {username: 'peter chu'}, (err,result) => {
//   if(err) throw err;
//   console.log(result._id);
// });

// let query = { username: /^p/};
// dbo.collection("account").find({}).project({email: 1, _id:0}).toArray( (err,result) => {
//   if(err) throw err;
//   console.log(result);
// });


// dbo.collection("account").find(query, {username: 1}).sort({username: -1}).toArray( (err,result) => {
//   if(err) throw err;
//   console.log(result);
// });

// dbo.collection("account").deleteOne(query, (err, result) => {
//   console.log('doc del');
// });

// let newValue = {$set: {username: 'micky', email:'lll@yahoo'}};
// dbo.collection("account").updateOne(query, newValue, (err, res) => {
//   console.log(res);
// })

// dbo.collection('order').aggregate([
//   { $lookup: {
//     from: 'product',
//     localField: 'product_id',
//     foreignField: '_id',
//     as: 'orderdetails'
//   }}
// ]).toArray((err,res) => {
//   if(err) throw err;
//   console.log(JSON.stringify(res));
// });


// db.close();



