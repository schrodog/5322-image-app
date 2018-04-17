'use strict';

class CustomImage extends BaseShape {
  constructor(img, stage){
    super(img, stage);
    this.initImage();
    this.active = false;
    this.stage = stage;
    super.turnColorScale();
    self = this;

    // console.log(this);
  }

  initImage(){
    let base_layer = super.buildPicture();
    this.stage.add(base_layer);
    // this.register_listener();

    let click_mark=0;
    this.stage.on('click', (evt) => {
      let shape = evt.target;
      if (shape === this.baseImage && !this.active){
        console.log('image go');
        this.changeSelf(this);
        this.active = true;
        // super.turnColorScale();
        this.baseImage.shadowBlur(10);
        this.baseImage.cache();
        this.baseImage.draw();
        this.register_listener();
        // this.toggleControlVisibility();
        for(let i=0; i<image_group_btn.length; i++ ){
          image_group_btn[i].classList.remove("hide");
        }
      } else if (shape !== this.baseImage && this.active) {
        this.active = false;
        if(this.anchorGroup){
          super.saveResize()
        }
        if(this.cropMode){
          super.saveCrop()
        }
        this.baseImage.shadowBlur(0);
        console.log('leave');
        this.baseImage.cache();
        this.stage.draw();
        this.remove_listener();
        // this.toggleControlVisibility();
        for(let i=0; i<image_group_btn.length; i++ ){
          image_group_btn[i].classList.add("hide");
        }
      }
    });
  }

  // tensorflow style transfer
  styleTransfer(style){

    // console.log('style',style)

    let img = self.baseImage.getImage()
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0,0);

    let dataURI = canvas.toDataURL('image/jpeg');

    // convert base64 to blob
    // let dataURI = self.baseImage.toDataURL({'mimeType': 'image/jpeg'});
    // let mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0]

    let byteString = atob(dataURI.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], {type: 'image/jpeg'});
    // let file_ext = mimeType.match(/\/[0-9a-z]+$/i)[0].replace('/','.');

    let path = 'abc.jpg';
    let formData = new FormData();
    formData.append('ImageFileField', blob, path);
    formData.append('style', style);

    $.ajax({
      url: '/python',
      data: formData,
      type: 'POST',
      cache: false,
      contentType: false,
      processData: false
    }).done( src => {

      // replace with new img
      let imageObj = new Image();
      imageObj.src = `img/users/development/${src}`;
      imageObj.onload = () => {
        self.baseImage.setImage(imageObj);
        self.baseImage.cache();
        self.baseImage.draw();

        $("#loader").remove();
        $("#box").css("filter", "");

      }
    });

  }


  toggleControlVisibility(){
    for(let i=0; i<image_group_btn.length; i++ ){
      image_group_btn[i].classList.toggle("hide");
    }
  }

  togglePopover(){
    popover_wrapper.classList.toggle("hide")
  }

  // register listener
  register_listener(){
    resize_btn.addEventListener('click', super.buildAllAnchor);
    saveResize_btn.addEventListener('click', super.saveResize);
    crop_btn.addEventListener('click', super.startCrop);
    saveCrop_btn.addEventListener('click', super.saveCrop);
    deletePic_btn.addEventListener('click', super.destroyAll);
    moveUp_btn.addEventListener('click', super.moveUp);
    moveDown_btn.addEventListener('click', super.moveDown);

    grey_btn.addEventListener('click', super.turnGreyScale);
    color_btn.addEventListener('click', super.turnColorScale);
    invert_btn.addEventListener('click', super.turnInvert);
    mask_btn.addEventListener('click', super.turnMaskScale);
    sepia_btn.addEventListener('click', super.turnSepia);
    solarize_btn.addEventListener('click', super.turnSolarize);

    brightness_range.addEventListener('input', super.brightness);
    contrast_range.addEventListener('input', super.contrast);
    blur_range.addEventListener('input', super.blur);
    hue_range.addEventListener('change', super.hue);
    saturate_range.addEventListener('input', super.saturate);
    lightness_range.addEventListener('input', super.lightness);
    mask_range.addEventListener('input', super.mask);
    noise_range.addEventListener('input', super.noise);
    pixelate_range.addEventListener('input', super.pixelate);
    posterize_range.addEventListener('input', super.posterize);
    rotate_range.addEventListener('input', super.rotate);
    alpha_range.addEventListener('input', super.alpha);

    showStyle_btn.addEventListener('click', this.togglePopover);

    // start style transfer
    $(".style-transfer-btn").on("click", function(){
      popover_wrapper.classList.add("hide");
      $("#contentAreaRight").append("<div id='loader'></div>");

      $("#loader").ready(function(){
        let con = $("#container");
        let pos = con.position();
        let [width, height] = [con.width(), con.height()];
        $("#loader").css({"top": `${height/2+pos.top-40}px`, "left": `${width/2+pos.left-40}px`});
        $("#box").css("filter", "brightness(60%)");
        console.log($(this), pos,width,height);
      })
      self.styleTransfer($(this).attr("data-id"));
    });
  }

  remove_listener(){
    resize_btn.removeEventListener('click', super.buildAllAnchor);
    saveResize_btn.removeEventListener('click', super.saveResize);
    crop_btn.removeEventListener('click', super.startCrop);
    saveCrop_btn.removeEventListener('click', super.saveCrop);
    deletePic_btn.removeEventListener('click', super.destroyAll);
    moveUp_btn.removeEventListener('click', super.moveUp);
    moveDown_btn.removeEventListener('click', super.moveDown);

    grey_btn.removeEventListener('click', super.turnGreyScale);
    color_btn.removeEventListener('click', super.turnColorScale);
    invert_btn.removeEventListener('click', super.turnInvert);
    mask_btn.removeEventListener('click', super.turnMaskScale);
    sepia_btn.removeEventListener('click', super.turnSepia);
    solarize_btn.removeEventListener('click', super.turnSolarize);

    brightness_range.removeEventListener('input', super.brightness);
    contrast_range.removeEventListener('input', super.contrast);
    blur_range.removeEventListener('input', super.blur);
    hue_range.removeEventListener('change', super.hue);
    saturate_range.removeEventListener('input', super.saturate);
    lightness_range.removeEventListener('input', super.lightness);
    mask_range.removeEventListener('input', super.mask);
    noise_range.removeEventListener('input', super.noise);
    pixelate_range.removeEventListener('input', super.pixelate);
    posterize_range.removeEventListener('input',super.posterize);
    rotate_range.removeEventListener('input', super.rotate);
    alpha_range.removeEventListener('input', super.alpha);

    showStyle_btn.removeEventListener('click', this.togglePopover);
    $(".style-transfer-btn").off("click");
  }




}



