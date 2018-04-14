'use strict';

const logout_btn = document.getElementById("logout-btn");
const imgGallery_btn = document.getElementById("img-gallery-btn");
const saveStatus_btn = document.getElementById("save-status-btn");
const export_btn = document.getElementById("export-btn");
const takePhoto_btn = document.getElementById("take-photo-btn");
const cameraVideo = document.getElementById("camera-video");
const cameraSnap_btn = document.getElementById("camera-snap-btn");
const mainpage_block = document.getElementById("mainpage");
const photoSnap_block = document.getElementById("photo-snap");
const cameraCanvas = document.getElementById("camera-canvas");

// prevent unsaved changes
$(function() {
  $(window).areYouSure({
    message: 'Are you sure to leave the editing page before saving? Your changes will be lost.'
  })
});


// export current images
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

const uploadScreenshot = (path) => {
  let dataURI = STAGE.toDataURL();

  let byteString = atob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  let blob = new Blob([ab], {type: mimeString});

  let formData = new FormData();
  formData.append('ImageFileField', blob, path);

  $.ajax({
    url: '/imaging/images',
    data: formData,
    type: 'POST',
    cache: false,
    contentType: false,
    processData: false
  }).done((e) => console.log('done'));
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
  for (let i = 0; i < tmp.length; i += 2) {
    if (["Stage", "Image", "Text"].includes(tmp[i + 1])) {
      final.push({
        'name': tmp[i + 1],
        'attrs': tmp[i]
      })
    }
  }
  return final;
}


const saveStatus = () => {

  // clear previous images in current session
  // let xhr = new XMLHttpRequest();
  // xhr.open('DELETE', '/development', true);
  // xhr.send();

  let image_list = [],
    text_list = [],
    canvas_list = [],
    base64_data;

  const getUniqueId = () => new Promise((resolve, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/uniqueId');
    xhr.responseType = "text";
    xhr.onload = function(e) {
      if (this.status === 200) {
        resolve(this.response)
      }
    }
    xhr.send();
  });

  const uploadImage = (object_url, path) => {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', object_url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (this.status === 200) {
        let uint8array = new Uint8Array(this.response);
        let i = uint8array.length;
        let binaryString = new Array(i);
        while (i--) {
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

        // document.getElementById("myImage").src = "data:image/png;base64,"+base64_data;
        let blob = new Blob(byteArrays);

        let formData = new FormData();
        formData.append('ImageFileField', blob, path);

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

  (async function() {
    for (let i of Text_ref) {
      let json = JSON.parse(i.textTemplate.toJSON());
      json.attrs.zindex = i.layer.getZIndex();

      text_list.push(json);
    }

    for (let i of Canvas_ref) {
      if (i.destroyFlag) continue;

      let json = JSON.parse(i.baseImage.toJSON());
      let url = i.canvas.toDataURL('image/png');
      // i.img_draw can be string, not base64
      // let url = i.img_draw;
      let byteChars = url.replace(/^data:([A-Za-z-+\/]+);base64,/g, '');
      // console.log(byteChars);
      byteChars = atob(byteChars)

      let id = await getUniqueId();
      let path = `img/users/development/${id}.png`
      json.attrs.image = path;
      json.attrs.width = i.baseImage.getWidth();
      json.attrs.height = i.baseImage.getHeight();
      json.attrs.zindex = i.layer.getZIndex();

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


    for (let i of Image_ref) {
      if (i.destroyFlag) continue;

      let json = JSON.parse(i.baseImage.toJSON());

      json.attrs.filters = i.filterMode;
      json.attrs.width = i.baseImage.getWidth();
      json.attrs.height = i.baseImage.getHeight();
      json.attrs.zindex = i.layer.getZIndex();

      let id = await getUniqueId();
      let ext = i.extension;
      json.attrs.image = `img/users/development/${id}.${ext}`;

      let object_url = i.baseImage.attrs.image.src;
      image_list.push(json);
      console.log('id', id)

      uploadImage(object_url, `${id}.${ext}`);
    }

    // upload screenshot
    let id = await getUniqueId();
    uploadScreenshot(`${id}.png`);

    $.ajax({
      url: '/imaging/status',
      data: JSON.stringify({
        'image_list': image_list,
        'canvas_list': canvas_list,
        'text_list': text_list,
        'screenshot': `img/users/development/${id}.png`
      }),
      contentType: 'application/json',
      method: 'POST'
    }).done(data => {});

  })();

}

const loadDrawboard = () => {
  STAGE.destroy();
  // STAGE.clearCache();
  const box_size = document.getElementById("box");

  STAGE = new Konva.Stage({
    container: 'container',
    width: box_size.clientWidth,
    height: box_size.clientHeight
  });
  STAGE.draw();
  Image_ref=[], Text_ref=[], Canvas_ref=[];
  // console.log(Image_ref);

  $.get('/development', json => {
    // resume class instances

    // skip loading if no data
    if(!json.data) return;
    if(json.data.length === 0) return;

    for (let i = 0; i < json.data.length; i++) {

      (async function() {
        if (json.data[i].className === "Image") {
          let attr_data = json.data[i].attrs;
          let src = attr_data.image;

          let ref = await async_loadPicToStage(src, src.match(/[0-9a-z]+$/i)[0]);

          let attr = JSON.parse(JSON.stringify(attr_data));
          delete attr.filters;
          delete attr.image;
          delete attr.zindex;

          const applyFilter = filter => ({
            'color': ref.turnColorScale,
            'invert': ref.turnInvert,
            'mask': ref.turnMaskScale,
            'solarize': ref.turnSolarize,
            'sepia': ref.turnSepia,
            'grey': ref.turnGreyScale
          }[filter] || ref.turnColorScale)();

          applyFilter(json.data[i].attrs.filters);
          ref.baseImage.setAttrs(attr);
          ref.layer.setZIndex(attr_data.zindex);

          ref.baseImage.cache();
          ref.baseImage.draw();
          STAGE.draw()

        } else if (json.data[i].className === "Canvas") {

          let src = json.data[i].attrs.image;
          let attr_data = json.data[i].attrs;
          let ref = await async_initDrawing(src, attr_data.width, attr_data.height);

          let attr = JSON.parse(JSON.stringify(attr_data));
          delete attr.filters;
          delete attr.image;
          delete attr.zindex;

          ref.baseImage.setAttrs(attr);
          ref.layer.setZIndex(attr_data.zindex);

          STAGE.draw()

        } else if (json.data[i].className === "Text") {

          let attr_data = json.data[i].attrs;
          let attr = JSON.parse(JSON.stringify(attr_data));
          delete attr.zindex;

          let ref = new CustomText(STAGE);
          Text_ref.push(ref);
          ref.layer.setZIndex(attr_data.zindex);

          ref.textTemplate.setAttrs(attr);

          STAGE.draw();
        }
      })();
    }
  });

}

const toggleControlVisibility = () => {
  for(let i=0; i<text_group_btn.length; i++ ){
    text_group_btn[i].classList.add("hide");
  }
  for(let i=0; i<image_group_btn.length; i++ ){
    image_group_btn[i].classList.add("hide");
  }
  for(let i=0; i<paint_group_btn.length; i++ ){
    paint_group_btn[i].classList.add("hide");
  }
}

saveStatus_btn.onclick = saveStatus;
document.getElementById("load-status-btn").onclick = loadDrawboard;

$(document).ready(() => {
  // loadDrawboard();
  toggleControlVisibility();
});
$(window).on('beforeunload', saveStatus )

logout_btn.onclick = () => {
  saveStatus();
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done(data => window.location.href = "/")
};

imgGallery_btn.onclick = () => {
  saveStatus();
  window.location.href = "/public_gallery";
}
document.getElementById("to-workspace-btn").onclick = () => {
  saveStatus();
  window.location.href = "/workspace";
}


let local_stream;
takePhoto_btn.onclick = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    navigator.mediaDevices.getUserMedia({ video: true }).then( stream => {
      mainpage_block.classList.add('hide');
      photoSnap_block.classList.remove('hide');
      cameraVideo.srcObject = stream;
      local_stream = stream;
      // cameraVideo.src = window.URL.createObjectURL(stream);
      cameraVideo.play();
    });
}

cameraSnap_btn.onclick = () => {
  cameraVideo.pause();
  local_stream.getTracks().forEach(track => track.stop());
  local_stream.srcObject = "";


  const context = cameraCanvas.getContext('2d');
  mainpage_block.classList.remove('hide');
  photoSnap_block.classList.add('hide');

  context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height );
  let dataURL = cameraCanvas.toDataURL();
  async_loadPicToStage(dataURL);
}







