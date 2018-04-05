// const fs = require('fs')
// const express = require("express")
// const http = require('http')

import fs from 'fs';
import express from 'express';
import http from 'http';
import util from 'util';
import cors from 'cors';
import mongo from 'mongodb';
import * as account from './public/account.js';
import session from 'express-session';
const MongoStore = require('connect-mongo')(session);

import shortId from 'shortid';

const app = express();
const httpServer = http.createServer(app);

// const MongoClient = mongo.MongoClient;
// const url = "mongodb://127.0.0.1:27017/";
// let dbo;
// MongoClient.connect(url, (err,db) => {
//   if (err) throw err;
//   dbo = db.db("mydb");
//
//   // dbo.createCollection("account", (err, res) => {
//   //   if(err) throw err;
//   //   console.log('collection!');
//   // });
//
//   // let obj = [
//   //   {_id: '5ac4798ac759e365d7728f39' , username: 'peter chu', email: 'abc@google.com', password: 'highway37'},
//   //   {_id: '5ac4798ac759e365d7728f3a' , username: 'john hui', email: 'fdsj@con.com', password: 'fadsljk'},
//   //   {_id: '5ac4798ac759e365d7728f3b' , username: 'may may', email: 'mays@google.com', password: 'fihudais'}
//   // ];
//   //
//   // dbo.collection('account').deleteMany({}, (err,res) => {});
//   // dbo.collection("account").insertMany(obj, (err, res) => {
//   //   // (res.ops).forEach(i => console.log(i));
//   // });
//
//   // dbo.createCollection("images", (err, res) => {})
//   //
//   const upload = (file) => {
//     // let imgBinary = fs.readFileSync(file);
//     // console.log(imgBinary);
//     let obj = {filename: `img/users/${file.filename}`, userID: file.userID, share: file.share, likedID: file.likedID};
//     // obj.data = new mongo.Binary(imgBinary);
//     dbo.collection('images').insert(obj, (err, res) => {
//       console.log('inserting')
//     });
//   }
//
//   dbo.collection('images').deleteMany({}, (err,res) => {});
//   let objs = [
//     {'filename': '121.jpg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
//     {'filename': 'image8.jpg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
//     {'filename': 'image9.jpeg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
//     {'filename': 'image10.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
//     {'filename': 'image11.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':['5ac4798ac759e365d7728f39']},
//     {'filename': 'image12.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 0, 'likedID':[]},
//     {'filename': 'image13.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
//     {'filename': 'images4.jpeg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
//     {'filename': 'images5.jpeg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
//     {'filename': 'images6.jpeg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]},
//     {'filename': 'images7.jpeg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 0, 'likedID':[]},
//     {'filename': 'sample1.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID': ['5ac4798ac759e365d7728f3b','5ac4798ac759e365d7728f3a']},
//     {'filename': 'sample2.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 0, 'likedID':[]},
//     {'filename': 'sample3.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':['5ac4798ac759e365d7728f39']},
//     {'filename': 'sample4.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]},
//     {'filename': 'pexels-photo.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]}
//   ]
//   objs.forEach( i => upload(i));
// });


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


// app.get('/email', account.findAll);
app.get('/account', account.findAll);
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


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// login page
app.get('/', (req,res) => res.render('index') );
app.get('/image_gallery', (req,res) => res.render('image_gallery') );
app.get('/imaging', (req,res) => res.render('imaging') );


httpServer.listen(8000, () => console.log('start...'));

// // handle download file
// // function decodeBase64Image(dataString) {
// //   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
// //   var response = {};
// //
// //   if (matches.length !== 3)
// //   {
// //     return new Error('Invalid input string');
// //   }
// //
// //   response.type = matches[1];
// //   response.data = new Buffer(matches[2], 'base64');
// //
// //   return response;
// // }
//
// http.createServer((req, res) => {
//   // console.log('req received:');
//
//   req.setEncoding('utf8')
//   req.on('data', (data_write) => {
//
//     let data2 = decodeURIComponent(data_write);
//     data2 = data2.substr(6, data2.length);
//
//     // unique name for each save
//     let d = new Date();
//     let filename = `img/test_${d.getTime()}.png`;
//     fs.writeFile(`./public/${filename}`, data2, {encoding: 'base64'}, (err)=>{
//       if (err) throw err;
//       console.log('file saved!');
//
//       res.setHeader('Access-Control-Allow-Origin', '*');
//       res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//       res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//       res.end(filename);
//     });
//
//   });
//   // req.on('end', () => {
//   //   res.end('received')
//   // })
//
// }).listen(8001);










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



