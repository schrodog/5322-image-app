'use strict';

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";

let dbo;
MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  dbo = db.db("mydb");

  dbo.createCollection("account", (err, res) => {
    if(err) throw err;
    console.log('collection!');
  });

  let obj = [
    {_id: '5ac4798ac759e365d7728f39' , username: 'peter chu', email: 'abc@google.com', password: 'highway37'},
    {_id: '5ac4798ac759e365d7728f3a' , username: 'john hui', email: 'fdsj@con.com', password: 'fadsljk'},
    {_id: '5ac4798ac759e365d7728f3b' , username: 'may may', email: 'mays@google.com', password: 'fihudais'}
  ];

  dbo.collection('account').deleteMany({}, (err,res) => {});
  dbo.collection("account").insertMany(obj, (err, res) => {
    // (res.ops).forEach(i => console.log(i));
  });

  dbo.createCollection("images", (err, res) => {})

  const upload = (file) => {
    // let imgBinary = fs.readFileSync(file);
    // console.log(imgBinary);
    let obj = {filename: `img/users/${file.filename}`, userID: file.userID, share: file.share, likedID: file.likedID};
    // obj.data = new mongo.Binary(imgBinary);
    dbo.collection('images').insert(obj, (err, res) => {
      console.log('inserting')
    });
  }

  dbo.collection('images').deleteMany({}, (err,res) => {});
  let objs = [
    {'filename': '121.jpg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
    {'filename': 'image8.jpg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
    {'filename': 'image9.jpeg', 'userID': '5ac4798ac759e365d7728f39', 'share': 1, 'likedID':[]},
    {'filename': 'image10.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
    {'filename': 'image11.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':['5ac4798ac759e365d7728f39']},
    {'filename': 'image12.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 0, 'likedID':[]},
    {'filename': 'image13.jpg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
    {'filename': 'images4.jpeg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
    {'filename': 'images5.jpeg', 'userID': '5ac4798ac759e365d7728f3a', 'share': 1, 'likedID':[]},
    {'filename': 'images6.jpeg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]},
    {'filename': 'images7.jpeg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 0, 'likedID':[]},
    {'filename': 'sample1.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID': ['5ac4798ac759e365d7728f3b','5ac4798ac759e365d7728f3a']},
    {'filename': 'sample2.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 0, 'likedID':[]},
    {'filename': 'sample3.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':['5ac4798ac759e365d7728f39']},
    {'filename': 'sample4.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]},
    {'filename': 'pexels-photo.jpg', 'userID': '5ac4798ac759e365d7728f3b', 'share': 1, 'likedID':[]}
  ]
  objs.forEach( i => upload(i));
});
