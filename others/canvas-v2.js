'use-strict';

// allow max, min on array by array.max(), array.min()
Array.prototype.max = function(){
  return Math.max.apply(null, this);
}
Array.prototype.min = function(){
  return Math.min.apply(null, this);
}

// construct class to bind image, anchor together
class PicAnchor {
  constructor(image, layer, anchor){
    this.image = image;
    this.imageLayer = layer;
    this.anchorLayer = anchor;
  }
}

const buildAnchor = (x,y,i, anchorLayer, baseImage, imageLayer) => {
  
  let point = 
  // resize handler hint
  square.on ('mouseover', () => {
    // console.log('over');
    square.fill('rgb(226,226,226)');
    anchorLayer.draw();
  });
  square.on('mouseout', () => {
    // console.log('out');
    square.fill('rgb(139,139,139)');
    anchorLayer.draw();
  });
  
  // when anchor move, update anchor and pic
  square.on('dragmove', () => {
    updateAnchor(i, anchorLayer);
    let coor = picFollowAnchor(point);
    updatePicture(coor, baseImage, imageLayer);
  });
  
  // anchor.add(square);
  return square;
}


// align 4 corners
const updateAnchor = (i, anchorLayer) => {
  let point = anchorLayer.find('.anchor');
  let x = point[i].getX(), y = point[i].getY();
  // console.log(x,y)
  switch(i){
    case 0:
      point[1].setY(y);
      point[2].setX(x);
      break;
    case 1:
      point[0].setY(y);
      point[3].setX(x);
      break;
    case 2:
      point[3].setY(y);
      point[0].setX(x);
      break;
    case 3:
      point[2].setY(y);
      point[1].setX(x);
      break;
  }
}

// calc how pic follow anchor
const picFollowAnchor = (point) => {
  let x_list = [], y_list = [];
  point.each((shape) => {
    x_list.push(shape.getX());
    y_list.push(shape.getY()); 
  });

  return [x_list.min()+7, y_list.min()+7, Math.abs(point[0].getX()-point[1].getX()), Math.abs(point[1].getY()-point[3].getY()) ];
}


const movePicWithAnchor = (baseImage, anchorLayer) => {
  // baseImage.shadowColor('green');
  
  baseImage.on('dragmove', () => {
    // let points = Layer.find('.anchor');
    let width = baseImage.getWidth(), height = baseImage.getHeight();
    let x = baseImage.getX(), y = baseImage.getY();

    points[0].setX(x-7); points[0].setY(y-7);
    points[1].setX(x-7+width); points[1].setY(y-7);
    points[2].setX(x-7); points[2].setY(y-7+height);
    points[3].setX(x-7+width); points[3].setY(y-7+height);
    anchorLayer.draw();
  })
} 

const updatePicture = (coor, baseImage, imageLayer) => {
  baseImage.setX(coor[0]);
  baseImage.setY(coor[1]);
  baseImage.setWidth(coor[2]);
  baseImage.setHeight(coor[3]);
  imageLayer.draw()
}



const buildCropLayer = () => {
  let cropShape = buildPicture()
}

// ===== Define elements =======
const anchor_sq =  new Konva.Rect({
  x: x-7,
  y: y-7,
  width: 15,
  height: 15,
  fill: 'rgb(139, 139, 139)',
  stroke: 'black',
  strokeWidth: 1,
  draggable: true,
  name: 'anchor'
  // id: i,
});

const getImage = imageObj => 
  new Konva.Image({
    x: 50,
    y: 50,
    image: imageObj,
    width: 300,
    height: 300,
    draggable: false,
  });
  
const STAGE = new Konva.STAGE({
  container: 'container',
  width: 500,
  height: 500
});

// ========= MAIN ==========

const imageObj = new Image();
imageObj.src = './big_flowers.jpg';

let baseRef;

imageObj.onload = () => {
  let baseImage = getImage(imageObj)
  let layer = new Konva.Layer()
  layer.add(baseImage)
  STAGE.add(layer);
  baseRef = new PicAnchor(baseImage, layer, new Konva.Layer())
}

// document.getElementById("save").onclick = () => {
//   let json = STAGE.toJSON()
//   console.log(json);
// }

document.getElementById("resizeBaseImage").onclick = () => {
  let baseImage = baseRef.image;
  let anchorLayer = baseRef.anchorLayer;
  
  // constrcut anchors
  let x = baseImage.getX(), y = baseImage.getY();
  let width = baseImage.getWidth(), height = baseImage.getHeight();
  let coor = [x,y, x+width,y, x,y+height, x+width,y+height];
  for(let i=0; i<coor.length; i+=2){
    anchorLayer.add(buildAnchor(coor[i], coor[i+1], i/2, anchorLayer, baseImage, baseRef.imageLayer )) ;
  }
  // register pic movement
  movePicWithAnchor(baseImage, anchorLayer);
  baseImage.setDraggable(true);

  STAGE.add(anchorLayer);
}

document.getElementById("crop").onclick = () => {
  buildCropLayer();
}

document.getElementById("stop").onclick = () => {
  baseRef.image.setDraggable(false);
  baseRef.anchorLayer.destroy()
}


