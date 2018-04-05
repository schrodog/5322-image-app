'use strict';

const logout_btn = document.getElementById("logout-btn");
const imgGallery_btn = document.getElementById("img-gallery-btn");
const saveStatus_btn = document.getElementById("save-status-btn");
const export_btn = document.getElementById("export-btn");

// prevent unsaved changes
$(function(){
  $(window).areYouSure({
    message: 'Are you sure to leave the editing page before saving? Your changes will be lost.'
  })
});

logout_btn.onclick = () => {
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done( data => window.location.href="/")
};

imgGallery_btn.onclick = () => window.location.href="/image_gallery";

const downloadURI = (uri, name) => {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export_btn.onclick = () => {
  let dataurl = STAGE.toDataURL();
  downloadURI(dataurl, 'final.png');
}


const processJSON = (data) => {
  let tmp = [];

  const interate = (parent) => {
    for (let i in parent) {
      if (i === "children") {
        interate(parent[i])
      } else if (i === "attrs") {
        tmp.push(parent[i]);
      } else if (i === "className") {
        tmp.push(parent[i]);
      } else {
        interate(parent[i]);
      }
    }
  }

  interate(JSON.parse(data));

  let final = [];
  for (let i=0; i<tmp.length; i+=2){
    if(["Stage", "Image", "Text"].includes(tmp[i+1]) ){
      final.push({'name': tmp[i+1], 'attrs': tmp[i]})
    }
  }
  return final;
}


saveStatus_btn.onclick = () => {

  let image_list=[], text_list=[], canvas_list=[];

  for(let i of Image_ref){
    let json = JSON.parse(i.baseImage.toJSON());
    json.attrs.filters = i.filterMode;
    json.attrs.image = i.baseImage.attrs.image.src;
    json.attrs.width = i.baseImage.getWidth();
    json.attrs.height = i.baseImage.getHeight();
    image_list.push(json);
  }
  for(let i of Text_ref){
    let json = JSON.parse(i.textTemplate.toJSON());
    text_list.push(json);
  }
  for(let i of Canvas_ref){
    let json = JSON.parse(i.baseImage.toJSON());
    console.log(i.baseImage.attrs);
    json.attrs.image = i.canvas.toDataURL('image/png');
    json.attrs.width = i.baseImage.getWidth();
    json.attrs.height = i.baseImage.getHeight();
    image_list.push(json);
  }

  console.log(image_list);
  console.log(canvas_list);
  console.log(text_list);

  $.ajax({
    url: '/imaging/status',
    data: JSON.stringify({'image_list': image_list, 'canvas_list': canvas_list, 'text_list': text_list}),
    contentType: 'application/json',
    method: 'POST'
  }).done(data => {});

}

document.getElementById("load-status-btn").onclick = () => {
  STAGE.destroy();
  // STAGE = Konva.Node.create(json, 'container');
  // STAGE.draw();



  // console.log(STAGE);
}



