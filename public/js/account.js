import mongo from 'mongodb';
import shortId from 'shortid';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';
import moment from 'moment-timezone';
import pythonShell from 'python-shell';

const ObjectID = mongo.ObjectID;
const MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1:27017/";
let dbo, db_session;

MongoClient.connect(url, (err,db) => {
  if (err) throw err;
  dbo = db.db("mydb");
  db_session = db.db("sessiondb");
});

// exports.findAll = (req, res) => {
//   dbo.collection("account").find({}).project({email: 1, _id:0}).toArray( (err,result) => {
//     if(err) throw err;
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.send(result);
//   });
// }

// login authentication
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

// when login, register userid, username
exports.createSession = (req, res) => {
  let data = req.body;
  req.session.userID = data.userID;
  req.session.username = data.username;
  // console.log(data)
  res.send('session set')
}

// momorize which drawboard user loads
exports.addSession = (req,res) => {
  let data = req.body;
  // console.log(data);
  req.session.drawboardID = data.fieldValue;
  res.end();
}

// return user ID
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

// refresh like in image gallery
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

exports.getUniqueId = (req, res) => {
  let id = shortId.generate();
  // console.log(id)
  res.send(id)
}


exports.saveStatus = (req, res) => {
  let [image_list, canvas_list, text_list] = [req.body.image_list, req.body.canvas_list, req.body.text_list];

  // console.log('get:',image_list, canvas_list, text_list);

  const sid = req.sessionID;
  const drawboardID = req.session.drawboardID;

  db_session.collection("sessions").findOne({_id: sid}, (err, result) => {
    let data = JSON.parse(result.session);

    let datetime = new Date();
    let data_inserted = {
      'data': image_list.concat(canvas_list).concat(text_list),
      'userID': req.session.userID,
      'date': moment.utc(datetime).local().format('DD MMMM YYYY H:mm:ss'),
      'screenshot': req.body.screenshot
    };

    dbo.collection("development").updateOne({_id: ObjectID(drawboardID)}, {$set: data_inserted}, (e, r) => {
      if(e) throw e;
    });

  });
}


exports.uploadImages = (req, res) => {
  const form = new formidable.IncomingForm();

  form.uploadDir = 'public/img/users/development';
  form.on('fileBegin', (fields, file) => {
    file.path = form.uploadDir+"/"+file.name;
  });
  // console.log(form);
  form.parse(req, (err, fields, file) => {
  });
  form.on('end', () => {return;})
}

exports.initDevelopment = (req, res) => {
  dbo.collection("development").insertOne({}, (e,r) => {
    res.send(r.insertedId);
  })
}

exports.loadDevelopment = (req, res) => {
  let drawboardID = req.session.drawboardID;
  dbo.collection("development").findOne({_id: ObjectID(drawboardID)}, (e,r) => {
    res.send(r);
  });
}

exports.clearDevelopment = (req, res) => {
  let drawboardID = req.session.drawboardID;
  dbo.collection("development").findOne({_id: ObjectID(drawboardID)}, (e,r) => {

    console.log('del',r);
    if(r.data){
      for(let i=0; i<r.data.length; i++){
        let file = r.data[i].attrs.image;
        let url = path.join(__dirname  , `../${file}`);
        if(fs.existsSync(url)){
          console.log('no',url);
          fs.unlink( url, (err) => {if(err) throw err});
        }
      }
    }

    res.end();
  });
}

exports.getWork = (req, res) => {
  let sort = req.params.sort;
  let order = parseInt(req.params.order);
  dbo.collection("development").find({userID: req.session.userID}).sort({sort: order}).toArray( (e,r) => {
    if(e) throw e;
    console.log('getwork',r);
    res.send(r);
  });
}

exports.runPython = (req,res) => {

  let fileSrc = shortId.generate();
  let fileDes = shortId.generate();
  let fileDir = 'public/img/users/development/';
  let style, file_ext='.jpeg';

  console.log('file',fileSrc, fileDes);

  const form = new formidable.IncomingForm();
  form.uploadDir = fileDir;

  // console.log('form',form);
  form.on('field', (name, value) => {
    console.log('field:',name,value)
    if(name === "style")
      style = value;
  });
  form.on('fileBegin', (fields, file) => {
    // file_ext = (file.name).match(/\.[0-9a-z]+$/i)[0];
    file.path = form.uploadDir+fileSrc+file_ext;
    console.log(file.path)
  });
  form.parse(req, (err, fields, file) => {
  });
  form.on('end', () => {

    console.log(`${fileDir}${fileSrc}${file_ext}`);

    const options = {
      mode: 'text',
      pythonPath: '/usr/bin/python3',
      pythonOptions: ['-u'],
      args: ['--content',`${fileDir}${fileSrc}${file_ext}` , '--style_model',`./tensorflow-style-transfer/models/${style}.ckpt`,
      '--output', `${fileDir}${fileDes}${file_ext}`]
    };

    const pyshell = new pythonShell('/tensorflow-style-transfer/run_test.py', options);
    pyshell.on('message', msg => {
      console.log(msg)
    });
    pyshell.end((err,code,signal) => {
      // if (err) throw err;
      console.log('end');
      res.send(`${fileDes}${file_ext}`)
      return;
    });
  })

}


// const createFile = (target_list, ext) => {
//   for (let i=0; i < target_list.length; i++){
//     let img_data = target_list[i].attrs.image;
//     // console.log(img_data);
//     // let ext = (img_data.type).replace(/image\//g, '');
//     // let ext = 'jpg';
//     let filename = shortId.generate();
//     let buf = new Buffer(target_list[i].attrs.image, 'base64' );
//
//     // console.log(filename, ext);
//     //
//     // fs.writeFile(`./public/img/users/development/${filename}.${ext}`, buf, (err) => {
//     //   if(err) throw err;
//     //   console.log('saved');
//     // });
//
//     // target_list[i].attrs.image = `./img/users/development/${filename}.${ext}`;
//     // target_list[i].userID = data.id;
//   }
// }
//
// createFile(image_list, 'jpg');
// createFile(canvas_list, 'png');








