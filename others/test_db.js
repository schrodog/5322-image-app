'use strict';

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  const dbo = db.db("mydb");

  dbo.collection('images').find( {'date': {$gt: new Date('2017-03-02'), $lt: new Date('2018-1-1')}  } ).sort({likeNum: -1}).toArray(
    (err,res) => console.log(res)
  )

  // dbo.collection('images').update(
  //   {'title':'street food'},
  //   {$inc: {'commentNum': -2}}
  // )
  

  db.close()
});

