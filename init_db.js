'use strict';

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
    
    let imageData = 
[{"path":"blur_grass.jpeg","title":"grass blur","tag":"nature","date":"2017-08-15T13:53:08.425Z","share":1,"userID":"5ac4798ac759e365d7728f3a","likedID":[],"comments":[]},{"path":"cartoon_ant.jpg","title":"cartoon ant","tag":"nature","date":"2016-03-16T12:22:14.968Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":["5ac4798ac759e365d7728f39"],"comments":[]},{"path":"central_district.jpg","title":"central district","tag":"city","date":"2015-09-22T04:45:59.754Z","share":1,"userID":"5ac4798ac759e365d7728f3c","likedID":[],"comments":[]},{"path":"Family2.jpg","title":"family gather","tag":"people","date":"2018-04-07T06:37:22.449Z","share":1,"userID":"5ac4798ac759e365d7728f3a","likedID":["5ac4798ac759e365d7728f3a"],"comments":[{"userID":"5ac4798ac759e365d7728f39","content":"nice picture"}]},{"path":"Family3.jpg","title":"family on beach","tag":"people","date":"2015-11-18T01:09:15.357Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":[],"comments":[]},{"path":"family_beach.jpg","title":"parents","tag":"people","date":"2018-03-24T16:43:38.830Z","share":1,"userID":"5ac4798ac759e365d7728f3c","likedID":[],"comments":[{"userID":"5ac4798ac759e365d7728f3c","content":"nice picture"},{"userID":"5ac4798ac759e365d7728f39","content":"marvelous"}]},{"path":"forest_road.jpg","title":"forest road","tag":"nature","date":"2016-06-18T03:44:31.454Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":["5ac4798ac759e365d7728f3b","5ac4798ac759e365d7728f3b"],"comments":[]},{"path":"grassland_park.jpg","title":"grassland park","tag":"nature","date":"2017-06-26T14:34:18.885Z","share":0,"userID":"5ac4798ac759e365d7728f3b","likedID":["5ac4798ac759e365d7728f3a","5ac4798ac759e365d7728f3a"],"comments":[]},{"path":"hill_river.jpeg","title":"hill river","tag":"nature","date":"2016-06-29T21:43:11.743Z","share":1,"userID":"5ac4798ac759e365d7728f3c","likedID":[],"comments":[]},{"path":"hong_kong_skyrise.jpg","title":"hong kong skyrise","tag":"city","date":"2018-03-08T09:16:09.445Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":[],"comments":[]},{"path":"hot_air_balloon.jpg","title":"hot air balloon","tag":"nature","date":"2016-11-21T17:43:07.642Z","share":0,"userID":"5ac4798ac759e365d7728f39","likedID":["5ac4798ac759e365d7728f3a","5ac4798ac759e365d7728f3b","5ac4798ac759e365d7728f3a"],"comments":[]},{"path":"housing_estate.jpg","title":"housing estate","tag":"city","date":"2016-09-17T18:56:22.613Z","share":1,"userID":"5ac4798ac759e365d7728f3c","likedID":[],"comments":[]},{"path":"imagem_para_landscape.jpg","title":"imagem para landscape","tag":"nature","date":"2016-06-22T09:46:39.374Z","share":1,"userID":"5ac4798ac759e365d7728f3c","likedID":["5ac4798ac759e365d7728f3a"],"comments":[{"userID":"5ac4798ac759e365d7728f39","content":"nice picture"}]},{"path":"market1.jpg","title":"market meat","tag":"life","date":"2016-06-24T03:59:16.950Z","share":0,"userID":"5ac4798ac759e365d7728f3b","likedID":["5ac4798ac759e365d7728f3b"],"comments":[{"userID":"5ac4798ac759e365d7728f3b","content":"good work"}]},{"path":"mountain_boat.jpeg","title":"mountain boat","tag":"nature","date":"2016-12-13T02:20:41.126Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":["5ac4798ac759e365d7728f3b"],"comments":[]},{"path":"mountain_lake.jpg","title":"mountain lake","tag":"nature","date":"2015-09-23T15:12:42.127Z","share":1,"userID":"5ac4798ac759e365d7728f3a","likedID":[],"comments":[{"userID":"5ac4798ac759e365d7728f39","content":"marvelous"},{"userID":"5ac4798ac759e365d7728f3b","content":"not bad"}]},{"path":"parrot.jpg","title":"parrot","tag":"nature","date":"2018-03-30T20:00:30.243Z","share":1,"userID":"5ac4798ac759e365d7728f3b","likedID":[],"comments":[]},{"path":"pexels-photo.jpg","title":"pexels","tag":"nature","date":"2015-01-20T21:58:41.537Z","share":1,"userID":"5ac4798ac759e365d7728f3b","likedID":[],"comments":[{"userID":"5ac4798ac759e365d7728f3b","content":"marvelous"}]},{"path":"pigeon.jpg","title":"pigeon","tag":"life","date":"2015-11-15T17:40:44.629Z","share":1,"userID":"5ac4798ac759e365d7728f3a","likedID":[],"comments":[]},{"path":"road_to_wild.jpg","title":"road to wild","tag":"nature","date":"2017-07-24T21:39:49.783Z","share":1,"userID":"5ac4798ac759e365d7728f3a","likedID":[],"comments":[]},{"path":"rubber_green.jpeg","title":"rubber green","tag":"life","date":"2017-09-21T15:55:49.556Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":[],"comments":[{"userID":"5ac4798ac759e365d7728f3c","content":"nice picture"},{"userID":"5ac4798ac759e365d7728f3a","content":"marvelous"}]},{"path":"small_bird1.jpg","title":"small bird","tag":"life","date":"2016-08-07T17:11:44.771Z","share":0,"userID":"5ac4798ac759e365d7728f3b","likedID":[],"comments":[{"userID":"5ac4798ac759e365d7728f3b","content":"marvelous"}]},{"path":"small_flower1.jpeg","title":"small flower","tag":"nature","date":"2016-06-19T20:40:25.742Z","share":1,"userID":"5ac4798ac759e365d7728f39","likedID":[],"comments":[]},{"path":"street_food.jpg","title":"street food","tag":"life","date":"2017-09-04T03:24:19.905Z","share":0,"userID":"5ac4798ac759e365d7728f3c","likedID":["5ac4798ac759e365d7728f3b"],"comments":[]}]

    
    dbo.collection('images').insert(imageData, (err, res) => {
      console.log('inserting')
    });

  });
  
  
  
  // TODO: need to use promise/async to notify completion of all operations before close
  // db.close();
});
