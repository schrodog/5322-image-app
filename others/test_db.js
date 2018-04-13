'use strict';

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  const dbo = db.db("mydb");

  // dbo.collection('images').find( {$and: [ {'date': {$lt: '2017-12-21', $gt: '2016-12-1'}}, {'tag': 'life'}] } ).toArray(
  //   (err,res) => console.log(res)
  // )

  dbo.collection('images').aggregate([
    // {$project: {'tag':1, 'likedID':1, 'comments':1}},
    {$match: {}}, 
    // {$unwind: '$comments'},
    {$group: {_id: '$_id', numlikes:{$sum:'$comments.length'}} },
    {$sort: {'numlikes': -1}}
  ] ).toArray(
    (err,res) => console.log(res)
  )
  

  db.close()
});

