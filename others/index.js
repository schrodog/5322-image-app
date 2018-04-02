
const takePicture = document.querySelector("#take-pic");
const showPicture = document.getElementById("show-pic");

takePicture.onchange = (event) => {
  let files = event.target.files, file;
  if(files && files.length>0){
    file = files[0];
  }
  // console.log(file)

  let reader = new FileReader();
  reader.onload = (function(theFile){
    return (e) => {
      showPicture.setAttribute("src", e.target.result);
      showPicture.setAttribute("title", escape(theFile.name));
    };
  })(file);

  reader.readAsDataURL(file);

};

// play video in desktop
// const constraints = {video: true};
// navigator.mediaDevices.getUserMedia(constraints)
//   .then((mediaStream) => {
//     let video = document.querySelector('video');
//     video.srcObject = mediaStream;
//     video.onloadedmetadata = (e) => video.play()
//
//   }).catch( err => console.log(`${err.name}: ${err.message}`));





