'use strict';

const addPic_btn = document.getElementById("add-pic-btn");
const deletePic_btn = document.getElementById("delete-pic-btn");
const moveUp_btn = document.getElementById("move-up-btn");
const moveDown_btn = document.getElementById("move-down-btn");


const rotate_btn = document.getElementById("rotate-btn");
const crop_btn = document.getElementById("crop-btn");
const saveCrop_btn = document.getElementById("save-crop-btn");
const resize_btn = document.getElementById("resize-btn");
const saveResize_btn = document.getElementById("save-resize-btn");

const grey_btn = document.getElementById("grey-btn");
const color_btn = document.getElementById("color-btn");
const invert_btn = document.getElementById("invert-btn");
const mask_btn = document.getElementById("mask-btn");
const sepia_btn = document.getElementById("sepia-btn");
const solarize_btn = document.getElementById("solarize-btn");

const alignLeft_btn = document.getElementById("align-left-btn");
const alignRight_btn = document.getElementById("align-right-btn");
const alignCenter_btn = document.getElementById("align-center-btn");
const alignJustify_btn = document.getElementById("align-justify-btn");
const textBold_btn = document.getElementById("text-bold-btn");
const textItalic_btn = document.getElementById("text-italic-btn");
const textUnderline_btn = document.getElementById("text-underline-btn");
const fontSize_range = document.getElementById("font-size-range");
const fontFamily_select = document.getElementById("font-family-select");
const paintTool_select = document.getElementById("paint-tool-select");

const color_picker = document.getElementById("colorpicker");
const showColor_indicator = document.getElementById("show-color");
const opacity_range = document.getElementById("opacity-range");

const penWidth_range = document.getElementById("pen-width-range");
const startPaint_btn = document.getElementById("start-paint-btn");
const savePaint_btn = document.getElementById("save-paint-btn");
const clearPaint_btn = document.getElementById("clear-paint-btn");
const inputText_btn = document.getElementById("input_text");

const brightness_range = document.getElementById("brightness-range");
const contrast_range = document.getElementById("contrast-range");
const blur_range = document.getElementById("blur-range");
const hue_range = document.getElementById("hue-range");
const saturate_range = document.getElementById("saturate-range");
const lightness_range = document.getElementById("lightness-range")
const mask_range = document.getElementById("mask-range");
const noise_range = document.getElementById("noise-range");
const pixelate_range = document.getElementById("pixelate-range");
const posterize_range = document.getElementById("posterize-range");
const rotate_range = document.getElementById("rotate-range");
const alpha_range = document.getElementById("alpha-range");

const enlarge_btn = document.getElementById("stage-enlarge-btn");
const reduce_btn = document.getElementById("stage-reduce-btn");
const resize_factor = document.getElementById("resize-factor");
const resize_range = document.getElementById("resize-range");

const normal_group_btn = document.getElementsByClassName("normal-group-btn");
const image_group_btn = document.getElementsByClassName("image-group-btn");
const text_group_btn = document.getElementsByClassName("text-group-btn");
const paint_group_btn = document.getElementsByClassName("paint-group-btn");

const showStyle_btn = document.getElementById("show-style-btn");
const popover_wrapper = document.getElementById("style-popover-wrapper");
// const style_transfer_btns = document.getElementsByClassName("style-transfer-btn");

// const styleTransfer_btn = document.getElementById("style-transfer-btn");


let Image_ref=[], Text_ref=[], Canvas_ref=[];











