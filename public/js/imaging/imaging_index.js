'use strict';

const box_obj = document.getElementById("box");
const box_size = document.getElementById("tmp_box").getBoundingClientRect();
$("#tmp_box").remove();

box_obj.style.width = box_size.width+'px';
box_obj.style.height = box_size.height+'px';

let STAGE = new Konva.Stage({
  container: 'container',
  width: box_size.width,
  height: box_size.height,
  scaleX: 1.0,
  scaleY: 1.0
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
    // console.log('type',type)

    return ref;
  }
}

// async version
const async_loadPicToStage = (src,type) =>
  new Promise( (resolve,rej) => {
    let imageObj = new Image();
    imageObj.src = src;

    imageObj.onload = () => {
      let img = imageTemplate(imageObj)
      img.id = img._id;
      let ref = new CustomImage(img, STAGE);
      Image_ref.push(ref);
      ref.extension = type;

      resolve(ref);
    }
});


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

const initDrawing = () => {
  // custom drawing
  const canvasTemplate = document.createElement('canvas');
  canvasTemplate.width =  STAGE.getWidth()/2;
  canvasTemplate.height = STAGE.getHeight()/2;

  const drawing_board = new Konva.Image({
    image: canvasTemplate,
    x : 10,
    y : 10,
    // width: canvasTemplate.width,
    // height: canvasTemplate.height,
    stroke: 'green',
    strokeWidth: 1,
    // shadowBlur: 1,
    name: 'canvas',
    draggable: true
  });
  drawing_board.id = drawing_board._id;
  let ref = new Paint(canvasTemplate, drawing_board, STAGE);
  Canvas_ref.push(ref);
}

const async_initDrawing = (img_src, width, height) =>
  new Promise((resolve, rej) => {
  // custom drawing
  const canvasTemplate = document.createElement('canvas');
  canvasTemplate.width =  width;
  canvasTemplate.height = height;

  let img = new Image();
  img.src = img_src;
  // console.log(img.src)
  img.onload = () => {

    const drawing_board = new Konva.Image({
      image: img,
      x : 10,
      y : 10,
      // stroke: 'green',
      // strokeWidth: 1,
      name: 'canvas',
      draggable: true
    });

    drawing_board.id = drawing_board._id;
    let ref = new Paint(canvasTemplate, drawing_board, STAGE, img_src);
    Canvas_ref.push(ref);

    resolve(ref)
  }

});


startPaint_btn.onclick = () => initDrawing();
inputText_btn.onclick = () => Text_ref.push(new CustomText(STAGE));

const updateResizeNum = () => {
  let size = resize_range.value;
  STAGE.scaleX(size);
  STAGE.scaleY(size);
  resize_factor.innerHTML = parseInt(size*100) + '%';
  STAGE.draw();
}

resize_range.onchange = updateResizeNum;

enlarge_btn.addEventListener('click', () => {
  // let size = parseInt(resize_range.value)
  if (parseFloat(resize_range.value) < 5){
    // console.log('resize',parseFloat(resize_range.value))
    resize_range.value = parseFloat(resize_range.value)+0.1;
  }
  updateResizeNum();
});

reduce_btn.onclick = () => {
  if (resize_range.value > 0.1)
    resize_range.value -= 0.1;
    // console.log('resize',resize_range.value)
  updateResizeNum();
}

// crop_btn.onclick = () => {
//   for (i of Image_ref){
//     if(i.active){
// 
//     }
//   }
// }

// ==== MAIN ====

// loadPicToStage('./img/big_flowers.jpg');

$("#colorpicker").farbtastic("#show-color");
