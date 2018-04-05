'use strict';

class CustomImage extends BaseShape {
  constructor(img, stage){
    super(img, stage);
    this.initImage();
    this.active = false;
    super.turnColorScale();
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
        console.log('go');
        this.changeSelf(this);
        this.active = true;
        // super.turnColorScale();
        this.baseImage.shadowBlur(10);
        this.baseImage.cache();
        this.baseImage.draw();
        this.register_listener();
      } else if (shape !== this.baseImage && this.active) {
        this.active = false;
        if(this.anchorGroup){
          super.saveResize()
        }
        this.baseImage.shadowBlur(0);
        console.log('leave');
        this.baseImage.cache();
        this.stage.draw();
        this.remove_listener();
      }
    });
  }

  // exportJSON(){
  //   return {'id': this.baseImage._id, 'image': this.baseImage.attrs.image, 'filterMode': this.filterMode};
  // }

  // destroySelf(){
  //   super.destroyAll();
  //   this.remove_listener();
  //   this.stage.off('click')
  // }

  // listenStage(evt){
  //   let shape = evt.target;
  //   if (shape === this.baseImage && !this.active){
  //     console.log('go');
  //     this.changeSelf(this);
  //     this.active = true;
  //     // super.turnColorScale();
  //     this.baseImage.shadowBlur(10);
  //     this.baseImage.cache();
  //     this.baseImage.draw();
  //     this.register_listener();
  //   } else if (shape !== this.baseImage && this.active) {
  //     this.active = false;
  //     this.baseImage.shadowBlur(0);
  //     console.log('leave');
  //     this.layer.cache();
  //     this.layer.draw();
  //     this.remove_listener();
  //   }
  // }

  // register listener
  register_listener(){
    resize_btn.addEventListener('click', super.buildAllAnchor);
    saveResize_btn.addEventListener('click', super.saveResize);
    crop_btn.addEventListener('click', super.startCrop);
    saveCrop_btn.addEventListener('click', super.saveCrop);
    deletePic_btn.addEventListener('click', super.destroyAll);

    grey_btn.addEventListener('click', super.turnGreyScale);
    color_btn.addEventListener('click', super.turnColorScale);
    invert_btn.addEventListener('click', super.invert);
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
  }

  remove_listener(){
    resize_btn.removeEventListener('click', super.buildAllAnchor);
    saveCrop_btn.removeEventListener('click', super.saveCrop);
    crop_btn.removeEventListener('click', super.startCrop);
    saveCrop_btn.removeEventListener('click', super.saveCrop);
    deletePic_btn.removeEventListener('click', super.destroyAll);

    grey_btn.removeEventListener('click', super.turnGreyScale);
    color_btn.removeEventListener('click', super.turnColorScale);
    invert_btn.removeEventListener('click', super.invert)
    mask_btn.removeEventListener('click', super.turnMaskScale)
    sepia_btn.removeEventListener('click', super.turnSepia)
    solarize_btn.removeEventListener('click', super.turnSolarize)

    brightness_range.removeEventListener('input', super.brightness)
    contrast_range.removeEventListener('input', super.contrast)
    blur_range.removeEventListener('input', super.blur)
    hue_range.removeEventListener('change', super.hue)
    saturate_range.removeEventListener('input', super.saturate)
    lightness_range.removeEventListener('input', super.lightness)
    mask_range.removeEventListener('input', super.mask)
    noise_range.removeEventListener('input', super.noise)
    pixelate_range.removeEventListener('input', super.pixelate)
    posterize_range.removeEventListener('input',super.posterize)
    rotate_range.removeEventListener('input', super.rotate)
    alpha_range.removeEventListener('input', super.alpha)

  }




}



