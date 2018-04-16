'use strict';

const fs = require("fs");
const path = require('path');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;
const url = "mongodb://127.0.0.1:27017/";

// MongoClient.connect(url, (err,db) => {
//   if (err) throw err;
//   const dbo = db.db("mydb");
// 
//   dbo.collection('images').updateOne( {_id: ObjectID("5ad0af85189135159c8ed42e")}, {$set:{ 'comments': [], 'commentNum': 0} } , (err,res) => {
//     if (err) console.log(err)
//   });
//   db.close()
// });

// Sk6n7kTjG
let files = path.resolve('../public/img/users/development/Sk6n7kTjG.png')
if(fs.existsSync(files)){
  console.log(files)
  fs.unlink(files, err => {})
}






