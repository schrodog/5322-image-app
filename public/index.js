'use strict';

let Base_ref, Crop_ref, Shadow_layer, Text_ref;

const STAGE = new Konva.Stage({
  container: 'container',
  width: 700,
  height: 500
});

// custom image
const imageTemplate = imageObj => new Konva.Image({
  x: 10,
  y: 10,
  image: imageObj,
  draggable: true,
  id: 'img'
});



// load picture from url to node
const loadPicToStage = src => {
  let imageObj = new Image();
  imageObj.src = src;

  imageObj.onload = () => {
    new CustomImage(imageTemplate(imageObj), STAGE);
  }
}

// Base_ref = new BaseShape(imageObj), STAGE);


// add picture
const handleFiles = () => {
  let files = addPic_btn.files;
  for(let file of files){
    let src = window.URL.createObjectURL(file);
    loadPicToStage(src);
  }
}

addPic_btn.addEventListener('change', handleFiles);
startPaint_btn.onclick = () => {
  // custom drawing
  const canvasTemplate = document.createElement('canvas');
  canvasTemplate.width =  STAGE.getWidth()/2;
  canvasTemplate.height = STAGE.getHeight()/2;
  const drawing_board = new Konva.Image({
    image: canvasTemplate,
    x : 10,
    y : 10,
    stroke: 'green',
    strokeWidth: 1,
    // shadowBlur: 1,
    name: 'canvas',
    draggable: true
  });
  new Paint(canvasTemplate, drawing_board, STAGE);
}
inputText_btn.onclick = () => new CustomText(STAGE);


// ==== MAIN ====

loadPicToStage('./img/big_flowers.jpg');

$("#colorpicker").farbtastic("#show-color");

