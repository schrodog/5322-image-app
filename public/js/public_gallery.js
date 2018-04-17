'use strict';

// nav bar buttons
const img_container = document.getElementById("img-container");
const new_img = document.getElementById("new-image");
const to_workspace = document.getElementById("to-workspace");
const logout = document.getElementById("logout");

// filter
const search_txt = document.querySelector("input[name='search']");
const search_txt_btn = document.getElementById("search-txt-btn");
const start_date_control = document.querySelector("input[name='start-date']");
const end_date_control = document.querySelector("input[name='end-date']");
const img_order = document.getElementById("img-order");
const tag_select = document.getElementById("tag-select");
let userID, USERNAME;

const comment_buffer = document.getElementById("comment-buffer");

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
const loadImages = (data) => {

  let html='';
  data.forEach( i => {

  let heart, src="";
  // determine if user already like image
  if(i.likedID.includes(userID)){
    src = 'red-heart.svg';
  } else {
    src = 'grey-heart.svg';
  }
  heart = `<img class='like-icon' data-id='${i._id}' src='icon/${src}'><span class='like-num'>${i.likedID.length}</span>`;

  html += `<div class='sub-container'>
    <img class='frame-img' src='img/users/${i.path}'>
    <div class='interactive-view'>
      <span class='img-title'>${i.title}</span>

      <div class='like-pair'>${heart}
        <img class='speech-icon' src='icon/chat2.svg'>
        <span class='speech-num'>${i.comments.length}</span>
      </div>
    </div></div>`;

  });
  img_container.insertAdjacentHTML('beforeend',html);
}

const submitComment = (img_id) => {

  let textarea = document.querySelector(".add-comment textarea");
  let content = textarea.value;
  textarea.value = "";

  let data = {'userID': userID, 'content': content };

  let html =
  `<div class="comment-box">
    <div class="author">${USERNAME}</div>
    <div class="comment-text">${content}</div>
  </div>`;

  $.ajax({
    url: '/image_gallery/comment',
    method: 'POST',
    data: JSON.stringify({'data': data, 'id': img_id}),
    contentType: 'application/json',
  }).done(res => {

    comment_buffer.insertAdjacentHTML('beforeend', html);

    let speechRef = $(`img[data-id='${img_id}']`).parent().children(".speech-num");
    speechRef.text(parseInt(speechRef.text())+1);

  });
}

const loadComments = (data, img_id) => {
  let html='';

  console.log('usr data',img_id)

  data.forEach(i => {
    html +=
    `<div class="comment-box">
      <div class="author">${i.username}</div>
      <div class="comment-text">${i.content}</div>
    </div>`;
  });
  console.log(html)
  comment_buffer.innerHTML = "";
  comment_buffer.insertAdjacentHTML('beforeend',html);

  $("#comment-submit").on('click', () => submitComment(img_id));
}

// filter public gallery
const doFilter = () => {

  let [startDate_value, endDate_value] = [start_date_control.value, end_date_control.value];
  let tag_value = $("#tag-select option:selected").val();
  let order_value = $("#img-order option:selected").val();
  let search_value = search_txt.value;

  const isValidDate = (date) => {
    let bits = date.split('-');
    let d = new Date(bits[2], bits[1]-1, bits[0]);
    console.log(bits,d)
    return d && (d.getMonth()+1) == bits[1];
  }

  console.log(`${startDate_value},${endDate_value},${tag_value},${order_value},${search_value}`)

  console.log(isValidDate(startDate_value))
  console.log(isValidDate(endDate_value))

  let data = {'filter': {}};
  if(search_value !== '' ) data.filter.title = search_value;
  if(startDate_value !== '') data.filter.startDate = startDate_value;
  if(endDate_value !== '') data.filter.endDate = endDate_value;
  if(tag_value !== 'all') data.filter.tag = tag_value;
  if(order_value !== 'default') data.order = order_value;

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

    if(data.length > 0) loadImages(data);
      // data.forEach( i => loadImages(i));

    document.querySelectorAll(".like-icon").forEach( i => {
      i.onclick = () => refreshLike(i.parentElement, i.getAttribute('data-id'));
    });

    $(".speech-icon").on('click',function(){
      $("nav, #mainpage").css("pointer-event", "none");
      $(".modalDialog").css({"opacity":"1.0", "pointer-events":"inherit" });

      let img_src = $(this).parent().parent().parent().children("img").attr("src");
      $("#openModal img").attr("src", img_src);
      let id = $(this).parent().children(".like-icon").attr("data-id");

      // get all userid with comment
      $.ajax({
        url: `/image_gallery/comment/${id}`,
        method: 'GET',
        dataType: 'html'
      }).done( data => {
        // console.log('get userdate',data)
        loadComments(JSON.parse(data), id);
      });


      // console.log(img_src)
    });

  });
}

// ===global===

window.onload = () => {
  $.ajax({
    url: '/session',
    method: 'GET',
  }).done( data => {
    USERNAME = data.username;
    userID = data.userID;

    doFilter();
  });
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

search_txt_btn.onclick = doFilter;
search_txt.addEventListener('keydown', (event) => {
  if(event.keyCode === 13){
    doFilter();
    search_txt.blur()
  }
})
tag_select.onchange = doFilter;
img_order.onchange = doFilter;
start_date_control.onchange = doFilter;
end_date_control.onchange = doFilter;

to_workspace.onclick = () => window.location.href='/workspace';

// modal

$(".close").on('click',function(){
  $("nav, #mainpage").css("pointer-event", "inherit");
  $(".modalDialog").css({"opacity":"0","pointer-events":"none"});
  $("#comment-submit").off('click');
});
