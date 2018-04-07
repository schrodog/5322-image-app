'use strict';

const img_container = document.getElementById("img-container");
const workspace_container = document.getElementById("workspace-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");
const to_workspace = document.getElementById("to-workspace");
const title = document.getElementById("title");
const logout = document.getElementById("logout");
const workspace_items = document.getElementsByClassName("sub-work-container");
let userID = "";

const refreshLike = (container, picID) => {
  let action;
  const icon = container.querySelector('.like-icon');
  if (icon.getAttribute("src") == "icon/grey-heart.svg"){
    action = 1;
  } else {
    action = -1;
  }

  $.ajax({
    url: '/image_gallery/like',
    method: 'POST',
    data: JSON.stringify({'picID': picID, 'userID': userID, 'action': action}),
    contentType: 'application/json',
  }).done( data => {
    let src;
    if(action == 1){
      src = 'icon/red-heart.svg';
    } else {
      src = 'icon/grey-heart.svg';
    }
    icon.setAttribute('src', src);
    let likenum = parseInt(container.querySelector('.like-num').innerHTML);
    container.querySelector('.like-num').innerHTML = likenum + action;
  });

}

const format = (i,flag) => {
  let heart;
  if (flag==1){
    let src="";
    // determine if user already like image
    if(i.likedID.includes(userID)){
      src = 'red-heart.svg';
    } else {
      src = 'grey-heart.svg';
    }
    heart = `<img class='like-icon' data-id='${i._id}' src='icon/${src}'><span class='like-num'>${i.likedID.length}</span>`;
  } else {
    heart = "";
  }
  let html = `<div>
    <div class='sub-container'><img class='frame-img' src='${i.filename}'></div>
    ${heart}</div>`;
  img_container.insertAdjacentHTML('beforeend',html);
}

const goToEdit = (item) => {
  let id = item.getAttribute('data-id');
  $.ajax({
    url: '/session/development',
    data: JSON.stringify({'fieldValue': id }),
    contentType: 'application/json',
    method: 'POST'
  }).done(data => window.location.href = '/imaging' );
}

const workspace_format = (i) => {
  let html = `<div><div class="sub-work-container" data-id='${i._id}' onclick='goToEdit(this)'>
    <img class='work-img' src='${i.screenshot}'>
    <p>last modified: ${i.date}</p>
    </div></div>`;
  workspace_container.insertAdjacentHTML('beforeend', html);
}

const loadOwnImages = (id) => {
  $.ajax({
    url: `/image_gallery/images/${id}`,
    method: 'GET',
  }).done( data => {
    data.forEach( i => format(i,0));
  });
};

const initLoad = () => {
  $.ajax({
    url: '/session',
    method: 'GET',
  }).done( data => {
    let user = data.username;
    // console.log(data.userID)
    title.innerHTML = "Saved Workspace";
    while(img_container.firstChild) {
      img_container.removeChild(img_container.firstChild)
    }
    userID = data.userID;
    loadOwnImages(data.userID);
    document.getElementById("username").innerHTML = user;
  });

  $.get('/image_gallery/work').done(data => {
    console.log('work',data);
    data.forEach( i => workspace_format(i));
  });


};

const loadSharedImages = () => {
  $.ajax({
    url: '/image_gallery/shared_images',
    method: 'GET'
  }).done( data => {
    title.innerHTML = "Public Gallery";
    while(img_container.firstChild) {
      img_container.removeChild(img_container.firstChild)
    }
    data.forEach( i => format(i,1));

    document.querySelectorAll(".like-icon").forEach( i => {
      i.onclick = () => refreshLike(i.parentElement, i.getAttribute('data-id'));
    });
  })
}

const logout_fn = () => {
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done(data => window.location.href="/")
}

window.onload = initLoad;

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
to_gallery.onclick = loadSharedImages;
to_workspace.onclick = initLoad;
logout.onclick = logout_fn;

console.log(workspace_items);







