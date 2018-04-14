'use strict';

const workspace_container = document.getElementById("workspace-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");
const logout = document.getElementById("logout");
const workspace_items = document.getElementsByClassName("sub-work-container");
let userID;

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
  data.forEach(i => {

    let html = `<div><div class="sub-work-container" data-id='${i._id}' onclick='goToEdit(this)'>
    <img class='work-img' src='${i.screenshot}'>
    <p>last modified: ${i.date}</p>
    </div></div>`;
    workspace_container.insertAdjacentHTML('beforeend', html);
  });
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

window.onload = loadOwnImages;
to_gallery.onclick = () => {
  window.location.href='/public_gallery';
}

new_img.onclick = () => {

  $.post( '/development', data_id => {
    console.log('data_id',data_id);
    $.ajax({
      url: '/session/development',
      data: JSON.stringify({'fieldValue': data_id }),
      contentType: 'application/json',
      method: 'POST'
    }).done(data => console.log(data))
  });

  window.location.href='/imaging';
}

logout.onclick = () => {
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done(data => window.location.href="/")
};