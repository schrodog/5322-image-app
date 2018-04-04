import mongo from 'mongodb';

const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";
let dbo;

MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  dbo = db.db("mydb");
});

exports.findAll = (req, res) => {
  dbo.collection("account").find({}).project({email: 1, _id:0}).toArray( (err,result) => {
    if(err) throw err;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send(result);
  });
}

exports.findByEmail = (req, res) => {
  let email = req.params.email; // can be username or email
  dbo.collection("account").findOne( {$or: [{email: email}, {username: email}] } , (err, result) => {
    res.send(result)
  });
}

exports.createAccount = (req, res) => {
  let data = req.body;
  // console.log('data:',data.username);
  // console.log('req:',req);


  dbo.collection("account").insertOne(data, (err, result) => {
    if(err) throw err;
    res.send('ok')
  });

}



// export {findAll, findByEmail, createAccount}


// /account/abc@googlecom
