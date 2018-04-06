import mongo from 'mongodb';
import shortId from 'shortid';
import fs from 'fs';

const ObjectID = mongo.ObjectID;
const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";
let dbo, db_session;

MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  dbo = db.db("mydb");
  db_session = db.db("sessiondb");
});

exports.findAll = (req, res) => {
  dbo.collection("account").find({}).project({email: 1, _id:0}).toArray( (err,result) => {
    if(err) throw err;
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
  // console.log('data:',data);
  // console.log('req:',req);
  dbo.collection("account").insertOne(data, (err, result) => {
    if(err) throw err;
    res.send('ok')
  });
}

exports.createSession = (req, res) => {
  let data = req.body;
  req.session.userID = data.userID;
  req.session.username = data.username;
  // console.log(data)
  res.send('session set')
}

exports.findSession = (req, res) => {
  const sid = req.sessionID;
  db_session.collection("sessions").findOne({_id: sid}, (err, result) => {
    let data = JSON.parse(result.session);
    res.send(data);
  });
}

exports.loadImages = (req, res) => {
  let id = req.params.id;
  dbo.collection("images").find({userID: id}).toArray((err, data) => {
    if(err) throw err;
    res.send(data);
  });
}

exports.loadSharedImages = (req, res) => {
  // let id = req.params.id;
  dbo.collection("images").find({share: 1}).toArray((err, data) => {
    if(err) throw err;
    res.send(data);
  });
}

exports.shareImage = (req, res) => {
  let id = req.body.id;
  let shareState = req.body.share;
  dbo.collection("images").updateOne({_id: id}, {$set: {share: shareState}} , (err, data) => {
    if(err) throw err;
    res.send(data);
  });
}

exports.refreshLike = (req, res) => {
  let data = req.body;
  let id = new ObjectID(data.picID);
  // add like
  if(data.action == 1){
    // console.log(ObjectID(data.id));
    // dbo.collection("images").findOne({'_id': id }, (err,data) => {console.log(data);});
    dbo.collection("images").updateOne({'_id': id }, {$push: {'likedID': data.userID}}, (err,data) => {
      if(err) throw err;
      // console.log('data:',data);
      res.send('ok');
    })
  } else {
    dbo.collection("images").updateOne({'_id': id}, {$pull: {'likedID': data.userID}}, (err, data) => {
      if(err) throw err;
      res.send('ok');
    })
  }
}

exports.logout = (req, res) => {
  req.session.destroy();
  // res.cookie('connect.sid', '', {maxAge: Date.now()});
  res.end()
}


exports.saveStatus = (req, res) => {
  let [image_list, canvas_list, text_list] = [req.body.image_list, req.body.canvas_list, req.body.text_list];

  console.log(image_list, canvas_list, text_list);

  const sid = req.sessionID;
  db_session.collection("sessions").findOne({_id: sid}, (err, result) => {
    let data = JSON.parse(result.session);


    const createFile = target_list => {
      for (let i=0; i < target_list.length; i++){
        let img_data = target_list[i].attrs.image;
        console.log(img_data);

        let ext = (img_data.type).replace(/image\//g, '');
        let filename = shortId.generate();
        let buf = new Buffer(target_list[i].attrs.image, 'base64' );
        fs.writeFile(`./public/img/users/development/${filename}.${ext}`, buf, (err) => {
          if(err) throw err;
          console.log('saved');
        });
        target_list[i].attrs.image = `./img/users/development/${filename}.${ext}`;
        target_list[i].userID = data.id;
      }
    }
    // for (let i=0; i < canvas_list.length; i++){
    //   let buf = new Buffer(canvas_list[i].attrs.image, 'base64' );
    //   fs.writeFile('./public/img/users/development/def.png', buf, (err) => {
    //     if(err) throw err;
    //     console.log('saved');
    //   });
    //   canvas_list[i].attrs.image = 'img/users/development/abc.jpg';
    //   canvas_list[i].userID = data.id;
    // }
    createFile(image_list);
    createFile(canvas_list);

    // dbo.collection("development").insertMany(image_list.concat(canvas_list).concat(text_list), (e, r) => {
    //   if(e) throw e;
    // });

  });


}
















