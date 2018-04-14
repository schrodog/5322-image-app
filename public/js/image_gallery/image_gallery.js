'use strict';

const img_container = document.getElementById("img-container");
const workspace_container = document.getElementById("workspace-container");
const new_img = document.getElementById("new-image");
const to_gallery = document.getElementById("to-gallery");
const to_workspace = document.getElementById("to-workspace");
const title = document.getElementById("title");
const logout = document.getElementById("logout");
const workspace_items = document.getElementsByClassName("sub-work-container");

// filter
const search_txt = document.querySelector("input[name='search']");
const search_txt_btn = document.getElementById("search-txt-btn");
const start_date_control = document.querySelector("input[name='start-date']");
const end_date_control = document.querySelector("input[name='end-date']");
const img_order = document.getElementById("img-order");
const tag_select = document.getElementById("tag-select");

let userID = "";

// refresh public gallery like
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

// generate public gallery images
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

  let html = `<div class='sub-container'>
    <img class='frame-img' src='img/users/${i.path}'>
    <div class='interactive-view'>
      <div class='created-by'>by </div>
      ${i.tag}
      <div class='like-pair'>${heart}
        <img class='speech-icon' src='icon/chat2.svg'>
        <span class='speech-num'>${i.comments.length}</span>
      </div>
    </div></div>`;

  img_container.insertAdjacentHTML('beforeend',html);
}

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
const workspace_format = (i) => {
  let html = `<div><div class="sub-work-container" data-id='${i._id}' onclick='goToEdit(this)'>
    <img class='work-img' src='${i.screenshot}'>
    <p>last modified: ${i.date}</p>
    </div></div>`;
  workspace_container.insertAdjacentHTML('beforeend', html);
}

// get user image data
const loadOwnImages = (id) => {
  $.ajax({
    url: `/image_gallery/images/${id}`,
    method: 'GET',
  }).done( data => {
    data.forEach( i => format(i,0));
  });
};

// on page load workspace
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
    // document.getElementById("username").innerHTML = user;
    // let obj = {username: user}
    // let html = ejs.render('s',obj);
    // console.log(html);

    // document.getElementById("placeholder").innerHTML = html;
  });

  loadSharedImages()

  // $.ajax({
  //   url: '/image_gallery/work',
  //   method: 'GET',
  //   data: JSON.stringify({}),
  //   contentType: 'application/json',
  // }).done(data => {
  //   console.log('work',data);
  //   data.forEach( i => workspace_format(i));
  // });
};

// load public gallery image
const loadSharedImages = () => {
  $.ajax({
    url: '/image_gallery/shared_images',
    method: 'GET'
  }).done( data => {
    title.innerHTML = "Public Gallery";
    while(img_container.firstChild) {
      img_container.removeChild(img_container.firstChild)
    }
    while(workspace_container.firstChild) {
      workspace_container.removeChild(workspace_container.firstChild)
    }
    data.forEach( i => format(i,1));

    document.querySelectorAll(".like-icon").forEach( i => {
      i.onclick = () => refreshLike(i.parentElement, i.getAttribute('data-id'));
    });
  })
}

// filter public gallery
const doFilter = () => {

  let [startDate_value, endDate_value] = [start_date_control.value, end_date_control.value];
  let tag_value = $("#tag-select option:selected").val();
  let order_value = $("#img-order option:selected").val();
  let search_value = search_txt.value;

  const isValidDate = (date) => {
    let bits = date.split('/');
    let d = new Date(bits[2], bits[1]-1, bits[0]);
    return d && (d.getMonth()+1) == bits[1];
  }

  console.log(`${startDate_value},${endDate_value},${tag_value},${order_value},${search_value}`)

  let data = {'filter': {}};
  if(search_value !== '') data.filter.title = search_value;
  if(startDate_value !== '' ) data.filter.startDate = startDate_value;
  if(endDate_value !== '' ) data.filter.endDate = endDate_value;
  if(tag_value !== 'all') data.filter.tag = tag_value;
  if(order_value !== 'default') data.order = order_value;

  console.log(data);

  $.ajax({
    url: '/image_gallery/filter',
    method: 'POST',
    data: JSON.stringify({'data': data}),
    contentType: 'application/json',
  }).done(data => {
    console.log('filter arr',data);
    while(img_container.firstChild) {
      img_container.removeChild(img_container.firstChild)
    }

    if(data.length > 0)
      data.forEach( i => format(i));
  });
}

// logout
const logout_fn = () => {
  $.ajax({
    url: '/logout',
    method: 'DELETE'
  }).done(data => window.location.href="/")
}


// ==== global buttons ====

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

search_txt_btn.onclick = doFilter;
tag_select.onchange = doFilter;
img_order.onchange = doFilter;
start_date_control.onchange = doFilter;
end_date_control.onchange = doFilter;


// console.log(workspace_items);







