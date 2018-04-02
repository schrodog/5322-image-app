'use-strict';
// const eventWindowLoaded = () => canvasApp()
// window.addEventListener('load', eventWindowLoaded, false);

// const theCanvas = document.getElementById("canvas");
// const context = theCanvas.getContext("2d");
// const canvasHeight = theCanvas.height;
// const canvasWidth = theCanvas.width;
// const canvasRect = theCanvas.getBoundingClientRect();
// const canvasTop = canvasRect.top;
// const canvasLeft = canvasRect.left;

// class Basic_image {
//   constructor(obj, height, width) {
//     this.obj = obj;
//     this.height = height;
//     this.width = width;
//     this.x = (canvasWidth-this.width)/2;
//     this.y = (canvasHeight-this.height)/2;
//   }
//   draw(){
//     context.clearRect(0,0, canvasWidth,canvasHeight);
//     context.drawImage(this.obj, this.x , this.y, this.width, this.height );
//   }
//   resize(width, height){
//     this.width = width;
//     this.height = height;
//     this.draw();
//   }
//   move(dx, dy){
//     this.x += dx; this.y += dy;
//     this.draw();
//     // if (this.x+dx >=0 && this.x+dx <= canvasWidth-this.width &&
//     //   this.y+dy >=0 && this.y+dy <= canvasHeight-this.height){
//     // }
//   }
//   get_enterObj(mouse_x, mouse_y){
//     if (mouse_x >= this.x && mouse_x <= this.x+this.width &&
//       mouse_y >= this.y && mouse_y <= this.y+this.height){
//         return true
//       }
//     return false;
//   }
// }
//
// let object_list = [], last_x, last_y;
// const spaceShip = new Image();
// let flower = new Basic_image(spaceShip, 300, 300);
// const eventShipLoaded = () => {
//   object_list.push(flower);
//   flower.draw();
//   // flower.move(100,200)
// }
//
// const eventImgMove = (event, lastX, lastY) => {
//   let mouse_x = event.clientX - canvasLeft;
//   let mouse_y = event.clientY - canvasTop;
//
//   // console.log(mouse_x, mouse_y, last_x, last_y);
//
//   if(!last_x && !lastY){
//     last_x = lastX, last_y = lastY;
//   }
//   let dx = mouse_x-last_x, dy = mouse_y-last_y;
//   console.log(dx,dy);
//
//   last_x = mouse_x, last_y = mouse_y;
//   if(dx && dy){
//     flower.move(dx, dy);
//   }
//   // console.log(dx,dy);
// }
//
// // ======== Main ===========
//
// spaceShip.src = "big_flowers.jpg";
// spaceShip.addEventListener('load', eventShipLoaded, false);
//
// let eventImgMove_wrap;
//
// theCanvas.onmousedown = (event) => {
//   console.log('down');
//   let mouse_x = event.clientX - canvasLeft;
//   let mouse_y = event.clientY - canvasTop;
//   if (flower.get_enterObj(mouse_x, mouse_y)) {
//     console.log('enter');
//     eventImgMove_wrap = (event) => eventImgMove(event, mouse_x, mouse_y)
//     theCanvas.addEventListener('mousemove', eventImgMove_wrap, false);
//   }
// }
// window.onmouseup = () => {
//   console.log('up');
//   theCanvas.removeEventListener('mousemove', eventImgMove_wrap , false);
// }

const stage = new Konva.Stage({
  container: 'container',
  width: 500,
  height: 500
});

const layer = new Konva.Layer()

// const circle = new Konva.Circle({
//   x: stage.getWidth()/2,
//   y: stage.getHeight()/2,
//   radius: 70,
//   fill: 'red',
//   stroke: 'black',
//   strokeWidth: 4
// });
//
// const triangle = new Konva.Shape({
//   sceneFunc: function(context){
//     context.beginPath();
//     context.moveTo(20,50);
//     context.lineTo(220, 80);
//     context.quadraticCurveTo(150,100,260,170);
//     context.closePath();
//
//     context.fillStrokeShape(this);
//   },
//   fill: '#00D2FF',
//   stroke: 'black',
//   strokeWidth: 4
// });
//
// let amplitude = 100, period = 2000;
// let centerX = stage.getWidth()/2;
//
// const anim = new Konva.Animation((frame) => {
//   circle.setX(amplitude * Math.sin(frame.time*2 * Math.PI/period) + centerX)
// }, layer);
//
// layer.add(triangle)
// const tween = new Konva.Tween({
//   node: triangle,
//   duration: 1,
//   x: 140,
//   y: 90,
//   fill: 'red',
//   rotation: Math.PI*2,
//   opacity: 1,
//   strokeWidth: 6,
//   scaleX: 1.5
// });
//
// layer.add(circle);

const imageObj = new Image();
imageObj.src = './big_flowers.jpg';
imageObj.onload = () => {
  let yoda = new Konva.Image({
    x: 50,
    y: 50,
    image: imageObj,
    width: 300,
    height: 300,
    draggable: true,
  });
  yoda.shadowColor('green');
  
  console.log(yoda.getDraggable());
  layer.add(yoda)
  stage.add(layer);
}

// imageObj.draggable(true)

// anim.start()
// setTimeout(() => tween.play(), 500 )

// circle.on('mousedown', () => console.log('down'))
// circle.on('mouseup', () => console.log('up'))
// circle.draggable("true")


document.getElementById("save").onclick = () => {
  let json = stage.toJSON()
  console.log(json);
}

// document.getElementById("crop").onclick = () => {
//   imageObj.
// }


