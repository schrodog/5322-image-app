'use strict';

class Paint extends BaseShape {
  constructor(canvas, targetImage, stage, src=''){
    super(targetImage, stage);

    this.stage.add(super.buildPicture());
    this.canvas = canvas;

    this.context = this.canvas.getContext('2d');
    // console.log(this.context);
    this.active = false;
    if (src !== '') this.img_draw = src;


    this.stage.draw();

    this.manageListener();
  }

  chooseTool(choice){
    const pen = {"strokeStyle": "#000000", "lineJoin": "round", "lineCap": "butt", "lineWidth": 3};
    const pencil = {"strokeStyle": "#000000", "lineJoin": "bevel", "lineCap": "round", "lineWidth": 2};
    const brush = {"strokeStyle": "#000000", "lineJoin": "round", "lineCap": "round", "lineWidth": 5};

    let drawing_tool;
    switch(choice){
      case 'pen':
        drawing_tool = pen;
        break;
      case 'pencil':
        drawing_tool = pencil;
        break;
      case 'brush':
        drawing_tool = brush;
        break;
      default:
        drawing_tool = brush;
    }
    // this.context.strokeStyle = drawing_tool.strokeStyle;
    this.context.lineJoin = drawing_tool.lineJoin;
    this.context.lineWidth = drawing_tool.lineWidth;
    this.context.lineCap = drawing_tool.lineCap;
    penWidth_range.value = drawing_tool.lineWidth;

  }

  switchTool() { self.chooseTool(paintTool_select.value) }
  switchLineWidth() { self.context.lineWidth = penWidth_range.value }
  switchColor() { self.context.strokeStyle = showColor_indicator.value }
  switchOpacity() { self.context.globalAlpha = opacity_range.value }

  manageListener(){
    // console.log(this.stage);

    this.stage.on('click', (evt) => {
      let shape = evt.target;
      // console.log(shape, this.baseImage);
      if (shape === this.baseImage && !this.active){
        console.log('paint go');
        this.active = true;

        this.baseImage.strokeWidth(1);
        this.baseImage.draggable(false);
        // this.baseImage.cache();
        // this.baseImage.draw();
        super.changeSelf(this);
        this.initPaint();
      }

      else if (shape !== this.baseImage && this.active) {
        this.active = false;
        if(this.anchorGroup){
          this.canvas_saveResize()
        }
        this.baseImage.strokeWidth(0);
        this.baseImage.draggable(true);
        this.savePaint();
      }
    });
  }

  addControlVisibility(){
    for(let i=0; i<paint_group_btn.length; i++ ){
      paint_group_btn[i].classList.remove("hide");
    }
  }
  removeControlVisibility(){
    for(let i=0; i<paint_group_btn.length; i++ ){
      paint_group_btn[i].classList.add("hide");
    }
  }

  initPaint(){
    // set tool style
    let drawing_tool = paintTool_select.value;
    this.context.strokeStyle = showColor_indicator.value;
    this.context.globalAlpha = opacity_range.value;

    let mode = paintTool_select.value;
    this.chooseTool(mode);

    // if there is old drawing, replce image with canvas
    if(this.img_draw){
      let photo = new Image();
      photo.src = this.img_draw;
      photo.onload = () => this.context.drawImage(photo, 0, 0, this.baseImage.getWidth(), this.baseImage.getHeight());
      this.baseImage.setAttrs({
        image: this.canvas,
        stroke: 'green',
        strokeWidth: 1,
      });
      this.baseImage.draw()
    }



    let isPaint = false;
    let lastPointerPosition = undefined;

    this.stage.on('contentMousedown.proto', () => {
      isPaint = true;
      lastPointerPosition = this.stage.getPointerPosition();
    });

    this.stage.on('contentMouseup.proto', () => isPaint = false );
    this.stage.on('contentMousemove.proto', () => {
      if (!isPaint) {
        return;
      }
      if (paintTool_select.value !== 'eraser') {
        this.context.globalCompositeOperation = 'source-over';
      } else {
        this.context.globalCompositeOperation = 'destination-out';
      }

      let canvas_x = this.baseImage.getX(), canvas_y = this.baseImage.getY();

      this.context.beginPath();
      let localPos = {
        x: lastPointerPosition.x - canvas_x,
        y: lastPointerPosition.y - canvas_y
      };
      this.context.moveTo(localPos.x, localPos.y);

      let pos = this.stage.getPointerPosition();
      localPos = {
        x: pos.x - canvas_x,
        y: pos.y - canvas_y
      };
      this.context.lineTo(localPos.x, localPos.y);

      this.context.closePath();
      this.context.stroke();

      lastPointerPosition = pos;

      // this.layer.cache();
      this.layer.draw();
    });

    // console.log(this.stage);
    this.register_listener();
  }

  savePaint(){
    self.stage.off('contentMouseup.proto');
    self.stage.off('contentMousemove.proto');
    self.stage.off('contentMousedown.proto');

    // let image = self.canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
    let src = self.canvas.toDataURL('image/png');

    // create off-screen canvas
    let canvas_off = document.createElement('canvas'), ctx = canvas_off.getContext('2d');
    let new_width = self.baseImage.getWidth(), new_height = self.baseImage.getHeight();
    canvas_off.width = new_width; canvas_off.height = new_height;
    let new_img = new Image();
    new_img.src = src;
    new_img.onload = () => {

      ctx.drawImage(new_img, 0,0, new_width, new_height);

      // console.log(src);
      src = canvas_off.toDataURL('image/png');
      // console.log(src);
      self.img_draw = src;

      self.canvas.width = self.baseImage.getWidth();
      self.canvas.height = self.baseImage.getHeight();

      const imageObj = new Image();
      imageObj.src = src;

      // console.log(self.img_draw);

      imageObj.onload = () => {
        const img = new Konva.Image({
          x: self.baseImage.getX(),
          y: self.baseImage.getY(),
          image: imageObj,
          draggable: true,
          name: 'img-draw'
        });
        self.baseImage.destroy();
        self.layer.add(img);
        self.baseImage = img;
        self.layer.draw();
      }


      let canvas = self.layer.find(".canvas");
      if(canvas) canvas.destroy();
      // self.layer.cache();
      self.layer.draw();
      self.remove_listener();
    }

  }

  clearPaint(){
    let canvas = this.layer.find(".canvas");
    if(canvas) canvas.destroy();
    let img_draw = this.layer.find(".img-draw");
    img_draw.destroy();
    this.img_draw = null;
    this.layer.draw();
    this.remove_listener();
  }

  saveProcess(){
    self.active = false;
    self.baseImage.strokeWidth(0);
    self.baseImage.draggable(true);
    self.savePaint();
    self.removeControlVisibility();
  }

  canvas_saveResize(){
    super.saveResize();
    self.saveProcess();
  }

  canvas_buildAllAnchor(){
    super.buildAllAnchor();

    self.stage.off('contentMouseup.proto');
    self.stage.off('contentMousemove.proto');
    self.stage.off('contentMousedown.proto');
  }

  moveUp(){
    self.layer.moveUp();
    self.saveProcess();
  }

  moveDown(){
    self.layer.moveDown();
    self.saveProcess();
  }
  
  destroyAllPaint(){
    super.destroyAll();
    self.stage.off('contentMouseup.proto');
    self.stage.off('contentMousemove.proto');
    self.stage.off('contentMousedown.proto');
    self.remove_listener();
  }


  register_listener(){
    resize_btn.addEventListener('click', this.canvas_buildAllAnchor);
    saveResize_btn.addEventListener('click', this.canvas_saveResize);
    // crop_btn.addEventListener('click', super.startCrop);
    // saveCrop_btn.addEventListener('click', super.saveCrop);
    deletePic_btn.addEventListener('click', this.destroyAllPaint);
    moveUp_btn.addEventListener('click', this.moveUp);
    moveDown_btn.addEventListener('click', this.moveDown);

    clearPaint_btn.addEventListener("click", this.clearPaint );
    savePaint_btn.addEventListener("click", this.savePaint );
    paintTool_select.addEventListener('change', this.switchTool);
    penWidth_range.addEventListener('input', this.switchLineWidth);
    color_picker.addEventListener('mouseup', this.switchColor);
    opacity_range.addEventListener('input', this.switchOpacity );

    this.addControlVisibility();
  }

  remove_listener(){
    resize_btn.removeEventListener('click', this.canvas_buildAllAnchor);
    saveResize_btn.removeEventListener('click', this.canvas_saveResize);
    // crop_btn.removeEventListener('click', super.startCrop);
    // saveCrop_btn.removeEventListener('click', super.saveCrop);
    deletePic_btn.removeEventListener('click', this.destroyAllPaint);
    moveUp_btn.removeEventListener('click', this.moveUp);
    moveDown_btn.removeEventListener('click', this.moveDown);

    clearPaint_btn.removeEventListener("click", this.clearPaint );
    savePaint_btn.removeEventListener("click", this.savePaint );
    paintTool_select.removeEventListener('change', this.switchTool);
    penWidth_range.removeEventListener('input', this.switchLineWidth);
    color_picker.removeEventListener('mouseup', this.switchColor);
    opacity_range.removeEventListener('input', this.switchOpacity );

    this.removeControlVisibility();
  }

}




