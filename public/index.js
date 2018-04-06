'use strict';


let STAGE = new Konva.Stage({
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
});



// load picture from url to node
const loadPicToStage = (src,type) => {
  let imageObj = new Image();
  imageObj.src = src;

  imageObj.onload = () => {
    let img = imageTemplate(imageObj)
    img.id = img._id;
    let ref = new CustomImage(img, STAGE);
    Image_ref.push(ref);
    ref.extension = type;
    console.log('type',type)
  }
}

// Base_ref = new BaseShape(imageObj), STAGE);


// add picture
const handleFiles = () => {
  let files = addPic_btn.files;
  for(let file of files){
    // console.log('file',file)
    let type = file.type.replace(/^image\//,'');
    let src = window.URL.createObjectURL(file);
    loadPicToStage(src,type);
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
  drawing_board.id = drawing_board._id;
  Canvas_ref.push(new Paint(canvasTemplate, drawing_board, STAGE));
}
inputText_btn.onclick = () => Text_ref.push(new CustomText(STAGE));


// ==== MAIN ====

// loadPicToStage('./img/big_flowers.jpg');

$("#colorpicker").farbtastic("#show-color");

