let userList = ['5ac4798ac759e365d7728f39','5ac4798ac759e365d7728f3a','5ac4798ac759e365d7728f3b','5ac4798ac759e365d7728f3c'];
let commentList = ['marvelous', 'not bad', 'nice picture','beautiful','good work'];

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()) )
}

const randomShare = () => Math.random()<0.9 ? 1 : 0 ;
// generate exclusive random list within assigned range
const randomNum = (num,count) => {
  if (count===1) return parseInt(Math.random()*100) %num ;
  else if (count > 1) {
    let arr = [];
    while(arr.length < count){
      let rand = parseInt(Math.random()*100) %num;
      if (arr.indexOf(rand) > -1) continue;
      arr[arr.length] = rand;
    }
    return arr;
  }
}

const randomLike = () => {
  let rand = Math.random(), num, likeID=[];

  if (rand<0.65) num=0;
  else if(rand>=0.65 && rand<0.85) num=1;
  else if(rand>=0.85 && rand<0.95) num=2;
  else num=3;

  for(let i=0; i<num; i++)
    likeID.push(userList[randomNum(4,1)]);
  return likeID;
};

const randomComment = () => {
  let rand = Math.random(), num, likeID=[];

  if (rand<0.70) return [];
  else if(rand>=0.70 && rand<0.95) num=1;
  else num=2;

  let [userNum, commentNum] = [randomNum(4,num), randomNum(5,num)];
  // console.log(userNum,commentNum)
  if(num === 1) return [{'userID': userList[userNum], 'content': commentList[commentNum] }];

  for(let i=0; i<num; i++)
    likeID.push({'userID': userList[userNum[i]], 'content': commentList[commentNum[i]] });

  return likeID;
};

// === MAIN ===

let filelist = [
  ['blur_grass.jpeg','grass blur','nature'], ['cartoon_ant.jpg','cartoon ant', 'nature'], ['central_district.jpg','central district', 'city'], ['Family2.jpg','family gather', 'people'], ['Family3.jpg','family on beach','people'], ['family_beach.jpg','parents','people'],  ['forest_road.jpg', 'forest road', 'nature'], ['grassland_park.jpg', 'grassland park', 'nature'], ['hill_river', 'hill river','nature'],
  ['hong_kong_skyrise.jpg', 'hong kong skyrise', 'city'], ['hot_air_balloon.jpg', 'hot air balloon', 'nature'], ['housing_estate.jpg', 'housing estate', 'city'], ['imagem_para_landscape.jpg','imagem para landscape','nature'], ['market1.jpg','market meat', 'life'], ['mountain_boat.jpeg','mountain boat','nature'], ['mountain_lake.jpg', 'mountain lake', 'nature'], ['parrot.jpg','parrot','nature'], ['pexels-photo.jpg','pexels','nature'], ['pigeon.jpg','pigeon','life'], ['road_to_wild','road to wild','nature'], ['rubber_green.jpeg','rubber green','life'], ['small_bird1.jpg','small bird','life'], ['small_flower1.jpeg','small flower', 'nature'], ['street_food','street food', 'life']
];

let objs={'data':[]};

for (let file of filelist){
  let tmp = {'path': file[0], 'title': file[1], 'tag': file[2]};
  tmp.date = randomDate(new Date(2015,0,1), new Date());
  tmp.share = randomShare();
  tmp.userID = userList[randomNum(4,1)];
  tmp.likedID = randomLike();
  tmp.comments = randomComment();
  objs.data.push(tmp);
}

console.log(JSON.stringify(objs))