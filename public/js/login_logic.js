const username = document.querySelector("input[name='username_us']");
const email = document.querySelector("input[name='email_us']");
const password = document.querySelector("input[name='pass_us']");
const password_confirm = document.querySelector("input[name='conf_pass_us']");
const sign_in_btn = document.getElementById("sign-in-btn");
const sign_up_btn = document.getElementById("sign-up-btn");

window.onload = design.starter;
const key_login = (evt) => {
  evt.preventDefault();
  if(evt.keyCode === 13) sign_in_btn.click();
};

document.getElementById("sign_in_tab").onclick = () => {
  design.sign_in();
  password.addEventListener('keyup', key_login);
}
document.getElementById("sign_up_tab").onclick = () => {
  design.sign_up();
  password.removeEventListener('keyup', key_login);
}

password.addEventListener('keyup', key_login);



const naivgate_to_gallery = (username, id) => {
  window.location.href='/image_gallery';
  $.ajax({
    url: '/session',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({'username': username, 'userID': id })
  }).done( res => console.log('great!'));

}

sign_in_btn.onclick = () => {
  $.ajax({
    url: `/account/${username.value}`,
    method: 'GET',
    dataType: 'html'
  }).done( data => {
    console.log(data);
    if(data){
      let data2 = JSON.parse(data);
      // console.log(password.value, data2.password);
      if(password.value == data2.password){
        console.log('authen');
        naivgate_to_gallery(data2.username, data2._id );
      } else {
        alert('incorrect uername or password');
      }
    } else {
      alert('incorrect uername or password');
    }
  })
}



sign_up_btn.onclick = () => {

  let pwd1 = password.value, pwd2 = password_confirm.value;
  let user_value = username.value, email_value = email.value;
  if (pwd1==='' || pwd2==='' || user_value==='' || email_value===''){
    alert('Please fill in all information !');
    return;
  } else if(pwd1 !== pwd2){
    alert('passwords are inconsistent!');
    return;
  }

  $.ajax({
    url: '/account',
    data: JSON.stringify({'username': user_value , 'password': pwd1,
      'email': email_value}),
    method: 'post',
    contentType: 'application/json',
  }).done(res => {
    console.log(res);
    alert('Successfully registered.');

    password.value = "";
    email.value = "";
    password_confirm.value = "";
    username.value = "";
  });


}




