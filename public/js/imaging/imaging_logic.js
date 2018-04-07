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

  let image_list=[], text_list=[], canvas_list=[], base64_data;

  const getUniqueId = () => new Promise((resolve,rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/uniqueId');
    xhr.responseType = "text";
    xhr.onload = function(e){
      if(this.status === 200){
        resolve(this.response)
      }
    }
    xhr.send();
  });

  const uploadImage = (object_url, path) => {

      let xhr = new XMLHttpRequest();
      xhr.open('GET', object_url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(e){
        if (this.status === 200){
          let uint8array = new Uint8Array(this.response);
          let i = uint8array.length;
          let binaryString = new Array(i);
          while(i--){
            binaryString[i] = String.fromCharCode(uint8array[i]);
          }
          let byteChars = binaryString.join('');

          let byteArrays = [];
          let sliceSize = 1024;

          for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
              let slice = byteChars.slice(offset, offset + sliceSize);
              let byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
              }
              let byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
          }

          // base64_data = window.btoa(data);
          // document.getElementById("myImage").src = "data:image/png;base64,"+base64_data;
          let blob = new Blob(byteArrays);

          let formData = new FormData();
          formData.append('ImageFileField', blob, path);
          // console.log(blob)

          $.ajax({
            url: '/imaging/images',
            data: formData,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false
          }).done((e) => console.log('done'));

        }
      }
      xhr.send();

  };

  (async function(){
    for(let i of Text_ref){
      let json = JSON.parse(i.textTemplate.toJSON());
      text_list.push(json);
    }

    for(let i of Canvas_ref){
      if(i.destroyFlag) continue;

      let json = JSON.parse(i.baseImage.toJSON());
      let url = i.canvas.toDataURL('image/png');
      let byteChars = url.replace(/^data:([A-Za-z-+\/]+);base64,/g, '');
      byteChars = atob(byteChars)

      let id = await getUniqueId();
      let path = `img/users/development/${id}.png`
      json.attrs.image = path;
      json.attrs.width = i.baseImage.getWidth();
      json.attrs.height = i.baseImage.getHeight();
      json.className = 'Canvas';
      canvas_list.push(json);

      // convert from base64 to blob
      let byteArrays = [];
      let sliceSize = 1024;

      for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
          let slice = byteChars.slice(offset, offset + sliceSize);
          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
      }

      let blob = new Blob(byteArrays);
      // console.log(byteChars);
      // console.log(blob);
      let formData = new FormData();
      formData.append('ImageFileField', blob, `${id}.png`);

      $.ajax({
        url: '/imaging/images',
        data: formData,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false
      }).done((e) => console.log('done'));

    }


    for(let i of Image_ref){
      if(i.destroyFlag) continue;

      let json = JSON.parse(i.baseImage.toJSON());

      json.attrs.filters = i.filterMode;
      json.attrs.width = i.baseImage.getWidth();
      json.attrs.height = i.baseImage.getHeight();

      let id = await getUniqueId();
      let ext = i.extension;
      // console.log('hi', json, id)
      json.attrs.image = `img/users/development/${id}.${ext}`;

      let object_url = i.baseImage.attrs.image.src;
      image_list.push(json);
      console.log('id',id)

      uploadImage(object_url, `${id}.${ext}`);
    }

    // console.log(image_list);
    // console.log(canvas_list);
    // console.log(text_list);

    $.ajax({
      url: '/imaging/status',
      data: JSON.stringify({'image_list': image_list, 'canvas_list': canvas_list, 'text_list': text_list}),
      contentType: 'application/json',
      method: 'POST'
    }).done(data => {});

  })();

}

document.getElementById("load-status-btn").onclick = () => {
  STAGE.clear();
  // STAGE = Konva.Node.create(json, 'container');
  // STAGE.draw();
  // console.log(STAGE);
  let json =
  {
    "data": [{
      "attrs": {
        "x": 10,
        "y": 10,
        "draggable": true,
        "name": "img-draw",
        "image": "img/users/development/rJDk2hroz.png",
        "width": 350,
        "height": 250
      },
      "className": "Canvas"
    }],
    "userID": "WF1NhlpIaWp_W9L4Qq3SS8B9e9owil-w"
  }

  // resume class instances
  for (let i=0; i<json.data.length; i++){

    (async function(){
    if(json.data[i].className === "Image"){
      let src = json.data[i].attrs.image;

      let ref = await async_loadPicToStage(src, src.match(/[0-9a-z]+$/i)[0]);

      let attr = JSON.parse(JSON.stringify(json.data[i].attrs));
      delete attr.filters;
      delete attr.image;

      const applyFilter = filter => ({
        'color': ref.turnColorScale,
        'invert': ref.turnInvert,
        'mask': ref.turnMaskScale,
        'solarize': ref.turnSolarize,
        'sepia': ref.turnSepia,
        'grey': ref.turnGreyScale
      }[filter] || ref.turnColorScale )();

      applyFilter(json.data[i].attrs.filters);
      ref.baseImage.setAttrs(attr);
      console.log(i,attr,src);

      // STAGE.cache();
      ref.baseImage.cache();
      ref.baseImage.draw();
      STAGE.draw()

    } else if (json.data[i].className === "Canvas"){

      let src = json.data[i].attrs.image;
      let attr_data = json.data[i].attrs;
      let ref = await async_initDrawing(src, attr_data.width, attr_data.height);

      let attr = JSON.parse(JSON.stringify(attr_data));
      delete attr.filters;
      delete attr.image;

      ref.baseImage.setAttrs(attr);

    }

  })();
  }


}

window.onload = () => {
  $.get('/development', data => {
    // console.log('all',data);


  })
}

