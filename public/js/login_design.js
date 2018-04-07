'use strict';

const design = {

  sign_up: () => {
    const inputs = document.querySelectorAll('.input_form_sign');
    const ul_tabs_li = document.querySelectorAll('.ul_tabs > li');
    const link_forgot_pass = document.querySelector('.link_forgot_pass');

    ul_tabs_li[0].className = "";
    ul_tabs_li[1].className = "active";

    [1,3].forEach( i => inputs[i].className = "input_form_sign d_block");

    // show active
    setTimeout(() => [1,3].forEach( i => inputs[i].className = "input_form_sign d_block active_inp") , 100);

    link_forgot_pass.style.cssText = 'opacity: 0; top: -5px ';

    // document.querySelector('.btn_sign').innerHTML = "SIGN UP";
    document.getElementById('sign-up-btn').style.display = "inherit";
    document.getElementById('sign-in-btn').style.display = "none";

    setTimeout( () => link_forgot_pass.className = "link_forgot_pass d_none" , 500);

  },


  sign_in: () => {
    const inputs = document.querySelectorAll('.input_form_sign');
    const ul_tabs_li = document.querySelectorAll('.ul_tabs > li');
    const link_forgot_pass = document.querySelector('.link_forgot_pass');

    ul_tabs_li[0].className = "active";
    ul_tabs_li[1].className = "";

    [0,2].forEach( i => inputs[i].className = "input_form_sign d_block");

    // in 100ms animate show inputs
    setTimeout(function() {
      [1,3].forEach( i => inputs[i].className = "input_form_sign");
      [0,2].forEach( i => inputs[i].className = "input_form_sign d_block active_inp");
    }, 300);

    setTimeout( () => link_forgot_pass.className = "link_forgot_pass d_block" , 300);
    setTimeout( () => link_forgot_pass.style.cssText = 'opacity: 1; top: 5px ', 500);

    document.getElementById('sign-in-btn').style.display = "inherit";
    document.getElementById('sign-up-btn').style.display = "none";
  },

  // window.onload =
  starter: () => {
    document.querySelector('.cont_middle').className = "cont_middle cent_active";
  }

}




