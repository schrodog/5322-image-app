'use strict';

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

let a=[{'b':1},{'b': 2}];
a.forEach(i => console.log(i))



