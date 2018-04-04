'use strict';

const img_container = document.getElementById("img-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");

const loadImages = (id) => {
  $.ajax({
    url: `/image_gallery/images/${id}`,
    method: 'GET',
  }).done( data => {
    // console.log('img:',data)
    data.forEach( i => {
      let img = document.createElement("img");
      img.setAttribute('src', i.filename );
      img.setAttribute('width', '500px');
      img_container.appendChild(img);
    });
  });
};

const showName = () => {
  $.ajax({
    url: '/session',
    method: 'GET',
  }).done( data => {
    let user = data.username;
    console.log(data.userID)
    loadImages(data.userID);
    document.getElementById("username").innerHTML = user;
  }) 
};

const loadSharedImages = () => {
  $.ajax({
    url: '/image_gallery/shared_images',
    method: 'GET'
  }).done( data => {
    while(img_container.firstChild) {
      img_container.removeChild(img_container.firstChild)
    }
    data.forEach( i => {
      let img = document.createElement("img");
      img.setAttribute('src', i.filename );
      img.setAttribute('width', '500px');
      img_container.appendChild(img);
    });
  })
}

window.onload = showName;

new_img.onclick = () => window.location.href='/imaging';
to_gallery.onclick = loadSharedImages;







