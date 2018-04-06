'use strict';

const img_container = document.getElementById("img-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");
const to_workspace = document.getElementById("to-workspace");
const title = document.getElementById("title");
const logout = document.getElementById("logout");
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
  })
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
  window.location.href='/imaging';
  
  $.post({
    
  })

  $.post({
    url: '/session/development',
    data: JSON.stringify({'fieldName': 'drawboardID', 'fieldValue': })
  })
} 
to_gallery.onclick = loadSharedImages;
to_workspace.onclick = initLoad;
logout.onclick = logout_fn;







