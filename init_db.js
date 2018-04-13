'use strict';

exports.toMongo = (input) => {
  
  const mongo = require('mongodb');
  const MongoClient = mongo.MongoClient;
  const url = "mongodb://127.0.0.1:27017/";
  
  MongoClient.connect(url, (err,db) => {
    if (err) throw err;
    const dbo = db.db("mydb");
    
    dbo.listCollections().toArray( (err,res) => {
      let collectionList = res.map(i=>i.name);
      
      if(collectionList.indexOf("account") === -1)
      dbo.createCollection("account", (err, res) => {console.log(res)} );
      else {
        dbo.collection('account').deleteMany({}, (err,res) => {if(err) throw err});
      }
      
      if(collectionList.indexOf("images") === -1)
      dbo.createCollection("images", (err, res) => {} );
      else{
        dbo.collection('images').deleteMany({}, (err,res) => {});
      }
      
      if(collectionList.indexOf("development") === -1)
      dbo.createCollection("development", (err, res) => {} );
      else
      dbo.collection('development').deleteMany({}, (err,res) => {});
      
      let accountData = [
        {_id: '5ac4798ac759e365d7728f39' , username: 'peter', email: 'abc@google.com', password: 'highway37'},
        {_id: '5ac4798ac759e365d7728f3a' , username: 'john', email: 'fdsj@connect.com', password: 'fadish'},
        {_id: '5ac4798ac759e365d7728f3b' , username: 'may', email: 'mays@123.com', password: 'fishie'},
        {_id: '5ac4798ac759e365d7728f3c' , username: 'moral', email: 'moral@gmail.com', password: 'manmade'},
        {_id: '5ac4798ac759e365d7728f3e' , username: 'mandy', email: 'mandy@gmail.com', password: 'mandy123'}
      ];
      
      dbo.collection("account").insertMany(accountData, (err, res) => {});
      
      let imageData = input.data;
      
      dbo.collection('images').insert(imageData, (err, res) => {
        if(err) throw err;
        console.log('inserting')
      });
      
    });
    
    // TODO: need to use promise/async to notify completion of all operations before close
    // db.close();
  });
}

