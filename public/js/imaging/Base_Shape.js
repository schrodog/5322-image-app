'use strict';

// allow max, min on array by array.max(), array.min()
Array.prototype.max = function(){
  return Math.max.apply(null, this);
}
Array.prototype.min = function(){
  return Math.min.apply(null, this);
}

let self;

class BaseShape {

  constructor(targetImage, stage){
    this.baseImage = targetImage;
    // this.turnColorScale();
    this.filterMode = '';
    this.layer = new Konva.Layer();
    this.anchorGroup = new Konva.Group();
    this.group = new Konva.Group();
    this.stage = stage;
    this.extension = null;
    this.destroyFlag = false;
    this.cropMode = false;
    self = this;
    // this.img_draw = null;

    // let base_layer = this.buildPicture();
    // this.stage.add(base_layer)
  }

  buildPicture() {
    this.group.add(this.baseImage);
    this.layer.add(this.group);

    this.baseImage.on('dragmove', () => {
      let points = this.anchorGroup.find('.anchor');
      let width = this.baseImage.getWidth(), height = this.baseImage.getHeight();
      let x = this.baseImage.getX(), y = this.baseImage.getY();

      if(points.length > 0){
        points[0].setX(x-7); points[0].setY(y-7);
        points[1].setX(x-7+width); points[1].setY(y-7);
        points[2].setX(x-7); points[2].setY(y-7+height);
        points[3].setX(x-7+width); points[3].setY(y-7+height);
        this.anchorGroup.draw();
      }

    });

    return this.layer;
  }



  // === resize and crop =======

  buildAllAnchor(mode='resize') {
    let x = self.baseImage.getX(), y = self.baseImage.getY();
    let width = self.baseImage.getWidth(), height = self.baseImage.getHeight();
    let coor = [x,y, x+width,y, x,y+height, x+width,y+height];
    for (let i=0; i<coor.length; i+=2){
      self.buildAnchor(coor[i], coor[i+1], i/2, mode);
    }
    self.group.setDraggable(true);
    if (mode != 'crop'){
      self.group.add(self.anchorGroup);
      self.layer.draw()
    } else {
      self.shadow_layer.add(self.anchorGroup);
      self.shadow_layer.draw()
    }

  }

  updatePicture(coor){
    self.baseImage.cache();

    self.baseImage.setX(coor[0]);
    self.baseImage.setY(coor[1]);
    self.baseImage.setWidth(coor[2]);
    self.baseImage.setHeight(coor[3]);

    self.group.draw()
  }

  startCrop(){
    const baseImage = self.baseImage;

    self.baseImage.draggable(false);
    self.shadow_layer = self.layer.clone();
    self.stage.add(self.shadow_layer);

    self.baseImage.brightness(-0.45);
    self.baseImage.cache()
    self.baseImage.draw();

    self.buildAllAnchor('crop');
    self.anchorGroup.moveToTop();
    // self.shadow_layer.cache();
    self.anchorGroup.draw();
    self.cropMode = true;
    // self.anchorGroup.cache();
    // self.anchorGroup.draw();

    // self.buildAllAnchor();

    // const crop = new Konva.Rect({
    //   x: self.baseImage.getX(),
    //   y: self.baseImage.getY(),
    //   fill: 'rgba(255, 255, 255, 0.0)',
    //   width: self.baseImage.getWidth(),
    //   height: self.baseImage.getHeight(),
    //   draggable: true,
    //   dragBoundFunc: function(pos){
    //     let x=pos.x, y=pos.y;
    //     let boundX=self.baseImage.getX(), boundY=self.baseImage.getY();
    //     let height=self.baseImage.getHeight(), width=self.baseImage.getWidth();
    //     let myH = self.getHeight(), myW = self.getWidth();
    //     if (x < boundX) x = boundX;
    //     if (y < boundY) y = boundY;
    //     // console.log(height, width)
    //     if (x+myW > width+boundX ) x = boundX+(width-myW);
    //     if (y+myH > height+boundY ) y = boundY+(height-myH);
    //     return {
    //       x: x, y: y
    //     }
    //   }
    // });

    // register listener to resize handler



    // const crop_base = crop_ref.baseImage;
    // self.stage.draw()
    // let shadow_img = self.shadow_layer.find('.img');
    // const shadowResize = () => {
    //   self.shadow_layer.setClip({
    //     x: crop_base.getX(),
    //     y: crop_base.getY(),
    //     width: crop_base.getWidth(),
    //     height: crop_base.getHeight()
    //   });
    //   self.shadow_layer.draw();
    // }
    // console.log(crop_base.getWidth(),crop_base.getHeight(),crop_base.getX(),crop_base.getY());
    //
    // crop_ref.anchorGroup.on('dragmove', () => {
    //   shadowResize()
    // });
    // crop_ref.layer.on('dragmove', () => {
    //   shadowResize()
    // });

  }

  shadowResize(){
    self.shadow_layer.setClip({
      x: self.anchorGroup.getX(),
      y: self.anchorGroup.getY(),
      width:  self.anchorGroup.getWidth(),
      height: self.anchorGroup.getHeight()
    });
    self.shadow_layer.draw();
  }

  saveCrop(){
    // let coor = [self.shadow_layer.getX(), self.shadow_layer.getY()]
    // let size = [self.shadow_layer.getWidth(), self.shadow_layer.getHeight()]
    let coor = [self.cropX-self.baseImage.getX(), self.cropY-self.baseImage.getY()];
    let size = [self.cropWidth, self.cropHeight];
    let pos = [self.cropX, self.cropY];
    console.log(coor,size,pos)
    self.cropPicture(coor, size, pos);

    self.shadow_layer.destroy();
    self.brightness();

    self.group.setDraggable(true);
    self.anchorGroup.destroy();
    self.stage.draw();
    self.cropMode = false;
  }

  cropPicture(coor, size, pos){
    self.baseImage.crop({
      x: coor[0],
      y: coor[1],
      width: size[0],
      height: size[1]
    });
    // self.baseImage.cropWidth(size[0]);
    // self.baseImage.cropHeight(size[1]);

    self.baseImage.setWidth(size[0]);
    self.baseImage.setHeight(size[1]);
    self.baseImage.setX(pos[0]);
    self.baseImage.setY(pos[1]);

    self.baseImage.draw();
  }

  updateAnchor(i,mode='resize'){
    let point = self.anchorGroup.find('.anchor');
    let x = point[i].getX(), y = point[i].getY();

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

    let x_list = [], y_list = [];
    point.each((shape) => {
      x_list.push(shape.getX());
      y_list.push(shape.getY());
    });

    if(mode == 'crop'){
      self.cropX = x_list.min()+7;
      self.cropY = y_list.min()+7;
      self.cropHeight = Math.abs(point[1].getY()-point[3].getY());
      self.cropWidth = Math.abs(point[0].getX()-point[1].getX());
      // console.log('min',minx,miny,width,height )
      self.shadow_layer.setClip({
        x: self.cropX,
        y: self.cropY,
        width:  self.cropWidth,
        height: self.cropHeight
      });
      self.shadow_layer.cache();
      self.shadow_layer.draw();
      self.anchorGroup.draw()
    }
    return [x_list.min()+7, y_list.min()+7, Math.abs(point[0].getX()-point[1].getX()), Math.abs(point[1].getY()-point[3].getY()) ];
  }

  // build each anchor
  buildAnchor(x,y, i, mode){

    let square = new Konva.Rect({
      x: x-7,
      y: y-7,
      width: 14,
      height: 14,
      fill: 'rgb(139, 139, 139)',
      stroke: 'black',
      strokeWidth: 1,
      draggable: true,
      id: i,
      name: 'anchor'
    });

    square.on ('mouseover', () => {
      square.fill('rgb(226,226,226)');
      self.anchorGroup.draw();
    });
    square.on('mouseout', () => {
      square.fill('rgb(139,139,139)');
      self.anchorGroup.draw();
    });

    square.on('dragmove', () => {
      let coor = self.updateAnchor(i, mode);
      if(mode!='crop'){
        self.updatePicture(coor);
      } else {
        // self.shadowResize();
      }
    });

    self.anchorGroup.add(square);
  }

  destroyAll(){
    self.layer.destroy();
    self.anchorGroup.destroy();
    self.stage.draw();

    self.destroyFlag = true;
    // self.stage.off('click');

    console.log('destroyed');
    // delete window.self;
  }

  saveResize(){
    self.anchorGroup.destroy();
    self.layer.draw();
    // self.baseImage.off('dragmove');
  }


  rotate(){
    self.layer.cache();
    self.baseImage.rotation(rotate_range.value)
    self.layer.draw();
  }

  changeSelf(val){
    self = val;
  }

  moveUp(){
    self.layer.moveUp();
    self.layer.draw();
  }

  moveDown(){
    self.layer.moveDown();
    self.layer.draw();
  }

// ========= colors =========

  brightness(){
    self.baseImage.cache();
    self.baseImage.brightness(brightness_range.value);
    self.baseImage.draw();
  }
  contrast(){
    self.baseImage.cache();
    self.baseImage.contrast(contrast_range.value);
    self.baseImage.draw();
  }

  blur(){
    // self.baseImage.clearCache();
    self.baseImage.cache();
    self.baseImage.blurRadius(blur_range.value);
    // console.log(self.baseImage.blurRadius());
    self.baseImage.draw();
  }

  hue(){
    self.baseImage.cache();
    self.baseImage.hue(hue_range.value);
    self.baseImage.draw();
  }
  saturation(){
    self.baseImage.cache();
    self.baseImage.saturation(saturate_range.value);
    self.baseImage.draw();
  }
  lightness(){
    self.baseImage.cache();
    self.baseImage.luminance(lightness_range.value);
    self.baseImage.draw();
  }

  turnGreyScale(){
    self.filterMode = 'grey';
    self.baseImage.cache();
    self.baseImage.filters([Konva.Filters.Grayscale, Konva.Filters.Blur, Konva.Filters.Brighten, Konva.Filters.Contrast]);
    self.baseImage.draw()
  }

  turnColorScale(){
    // cache will affect scaling
    // self.baseImage.cache();
    self.filterMode = 'color';
    self.baseImage.filters([Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.Blur, Konva.Filters.HSL, Konva.Filters.Noise, Konva.Filters.Pixelate, Konva.Filters.Posterize]);
    self.baseImage.noise(0);
    self.baseImage.pixelSize(0.001);
    self.baseImage.levels(1);
    if (self.layer) {
      self.baseImage.draw();
    }
  }

  turnInvert(){
    self.filterMode = 'invert';
    self.baseImage.cache();
    self.baseImage.filters([Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.Blur, Konva.Filters.HSL, Konva.Filters.Invert]);
    self.baseImage.draw()
  }

  turnMaskScale(){
    // self.baseImage.cache();
    self.filterMode = 'mask';
    self.baseImage.filters([Konva.Filters.Mask, Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.Blur, Konva.Filters.Threshold]);
    self.mask(0.5);
  }

  mask(){
    self.baseImage.cache();
    self.baseImage.threshold(mask_range.value);
    self.baseImage.draw();
  }

  noise(){
    self.baseImage.cache();
    self.baseImage.noise(noise_range.value);
    self.baseImage.draw();
  }

  pixelate(){
    self.baseImage.cache();
    self.baseImage.pixelSize(pixelate_range.value);
    self.baseImage.draw();
  }
  posterize(){
    self.baseImage.cache();
    self.baseImage.levels(posterize_range.value);
    self.baseImage.draw();
  }

  alpha(){
    self.baseImage.cache();
    self.baseImage.setOpacity(alpha_range.value);
    self.baseImage.draw();
  }

  turnSepia(){
    self.filterMode = 'sepia';
    self.baseImage.cache();
    self.baseImage.filters([Konva.Filters.Sepia]);
    self.baseImage.draw();
  }
  turnSolarize(){
    self.filterMode = 'solarize';
    console.log(self.filterMode);
    self.baseImage.cache();
    self.baseImage.filters([Konva.Filters.Solarize]);
    self.baseImage.draw()
  }



}






