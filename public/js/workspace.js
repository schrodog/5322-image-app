'use strict';

const workspace_container = document.getElementById("workspace-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");
const logout = document.getElementById("logout");
const workspace_items = document.getElementsByClassName("sub-work-container");
let USERID, USERNAME;

// load workspace
const goToEdit = (item) => {
  let id = item.getAttribute('data-id');
  $.ajax({
    url: '/session/development',
    data: JSON.stringify({'fieldValue': id }),
    contentType: 'application/json',
    method: 'POST'
  }).done(data => window.location.href = '/imaging' );
}

// generate workspace
const loadWorkspace = (data) => {
  let html='';
  data.forEach(i => {
    html += `<div class="sub-work-container" data-id='${i._id}' onclick='goToEdit(this)'>
    <img class='work-img' src='${i.screenshot}'>
    <p><span class="last">last modified:</span> <br> ${i.date}</p>
    </div>`;
  });
  workspace_container.insertAdjacentHTML('beforeend', html);
}

// generate public gallery images
const loadImages = (data) => {

  let html='';
  data.forEach( i => {

  html += `<div class='sub-container'>
    <img class='frame-img' src='img/users/${i.path}'>
    <div class='interactive-view'>
      <span class='img-title'>${i.title}</span>

    </div></div>`;

  });
  img_container.insertAdjacentHTML('beforeend',html);
}

// get user image data
const loadOwnImages = (id) => {
  $.ajax({
    url: `/image_gallery/work`,
    method: 'GET',
  }).done( data => {

    loadWorkspace(data);

  });
};


// ===global===

window.onload = () => {
  $.ajax({
    url: '/session',
    method: 'GET',
  }).done( data => {
    USERNAME = data.username;
    USERID = data.userID;

    document.getElementById("username").innerHTML = USERNAME;
    loadOwnImages();
  });
}

to_gallery.onclick = () => {
  window.location.href='/public_gallery';
}

new_img.onclick = () => {

  $.post( '/development/new_img', data_id => {
    window.location.href='/imaging';
  });
  

}

logout.onclick = () => {
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done(data => window.location.href="/")
};