'use strict';


class CustomText {
  constructor(stage){
    this.layer = new Konva.Layer();
    this.stage = stage;
    this.initText();
    this.editText()
    this.active = false;
    // textarea = document.getElementById("textarea");
    // this.listenEditing();
  }

  initText(){
    this.textTemplate = new Konva.Text({
      x: 15,
      y: 15,
      text: 'sample text',
      fontSize: 25,
      fontFamily: 'Arial',
      fill: 'black',
      padding: 0,
    });
    this.textTemplate.setDraggable(true);

    this.layer.add(this.textTemplate);
    this.stage.add(this.layer);
    this.layer.draw();
  }

  editText(){
    let textarea, text_style;

    const change_color = (e) => textarea.style.color = showColor_indicator.value;
    const change_left = (e) => textarea.style.align = 'left';
    const change_right = (e) => textarea.style.textAlign = 'right';
    const change_center = (e) => textarea.style.textAlign = 'center';
    const change_justify = (e) => textarea.style.textAlign = 'justify';
    const change_normal = (e) => textarea.style.fontStyle = 'normal';
    const change_bold = (e) => {
      textarea.style.fontWeight = 'bold';
      textarea.style.fontStyle = 'normal';
      text_style = "bold";
    }
    const change_italic = (e) => {
      textarea.style.fontWeight = 'normal';
      textarea.style.fontStyle = 'italic';
      text_style = "italic"
    }
    const change_underline = (e) => textarea.style.textDecoration = 'underline';
    const change_font_size = (e) => textarea.style.fontSize = fontSize_range.value + 'px';
    const change_font_family = () => textarea.style.fontFamily = fontFamily_select.value;
    const change_font_alpha = () => textarea.style.opacity = opacity_range.value;
    const deleteText = () => {
      textarea.value = "";
      document.body.removeChild(textarea);
      textarea = null;
    }
    const moveUp = () => this.layer.moveUp();
    const moveDown = () => this.layer.moveDown();

    this.stage.on('click', (evt) => {
      let shape = evt.target;
      // console.log(shape, this.textTemplate);
      if (shape === this.textTemplate && !this.active){
        this.active = true;

        // construct text
        textarea = document.createElement('textarea');


        document.body.appendChild(textarea);

        const textPosition = this.textTemplate.getAbsolutePosition();
        const stageBox = this.stage.getContainer().getBoundingClientRect();
        this.textTemplate.hide();
        this.layer.draw();

        // textarea.style.display = 'initial';
        textarea.style.top = textPosition.y + stageBox.y  +'px';
        textarea.style.left = textPosition.x + stageBox.x +'px';
        textarea.value = this.textTemplate.text();
        textarea.style.width = this.textTemplate.width() + 'px';
        textarea.style.fontFamily = this.textTemplate.fontFamily();
        textarea.style.fontSize = this.textTemplate.fontSize() + 'px';
        textarea.style.color = this.textTemplate.fill();
        textarea.style.textAlign = this.textTemplate.align();
        textarea.style.textDecoration = this.textTemplate.textDecoration();
        textarea.style.opacity = this.textTemplate.opacity();

        text_style = this.textTemplate.fontStyle();
        if (text_style == "bold") {
          // textarea.style.fontStyle = "normal";
          // textarea.style.fontWeight = "bold";
          change_normal(); change_bold();
        } else if (text_style == "italic") {
          // textarea.style.fontStyle = "italic";
          textarea.style.fontWeight = "normal";
          change_italic();
        } else if (text_style == "normal"){
          // textarea.style.fontStyle = "normal";
          change_normal();
          textarea.style.fontWeight = "normal";
        }


        textarea.focus();

        color_picker.addEventListener('mouseup', change_color);
        alignLeft_btn.onclick = change_left;
        alignRight_btn.onclick = change_right;
        alignCenter_btn.onclick = change_center;
        alignJustify_btn.onclick = change_justify;
        textBold_btn.onclick = change_bold;
        textItalic_btn.onclick = change_italic;
        textUnderline_btn.onclick = change_underline;
        fontSize_range.oninput = change_font_size;
        fontFamily_select.onchange = change_font_family;
        opacity_range.oninput = change_font_alpha;
        deletePic_btn.addEventListener('click', deleteText);
        moveUp_btn.addEventListener('click', moveUp);
        moveDown_btn.addEventListener('click', moveDown);

        this.toggleControlVisibility();

      } else if (shape !== this.textTemplate && this.active) {
        this.active = false;

        if (textarea){
          if(textarea.value.length > 0 ){
            this.textTemplate.text(textarea.value);
            const width = textarea.style.width;
            this.textTemplate.width(width.substr(0, width.length-2));
            this.textTemplate.fill(textarea.style.color);
            this.textTemplate.align(textarea.style.textAlign);
            this.textTemplate.textDecoration(textarea.style.textDecoration);
            if (text_style == "normal" || text_style == "italic"){
              this.textTemplate.fontStyle(text_style)
            } else {
              this.textTemplate.fontStyle('bold')
            }
            const size = textarea.style.fontSize;
            this.textTemplate.fontSize(size.substr(0,size.length-2));
            this.textTemplate.fontFamily(textarea.style.fontFamily);
            this.textTemplate.opacity(textarea.style.opacity);

            this.textTemplate.show();
          }
        }
        if (textarea) document.body.removeChild(textarea);

        color_picker.removeEventListener("mouseup", change_color );
        alignLeft_btn.removeEventListener("click", change_left );
        alignRight_btn.removeEventListener("click", change_right );
        alignCenter_btn.removeEventListener("click", change_center );
        alignJustify_btn.removeEventListener("click", change_justify );
        textBold_btn.removeEventListener("click", change_bold);
        textItalic_btn.removeEventListener("click", change_italic );
        textUnderline_btn.removeEventListener("click", change_underline );
        fontSize_range.removeEventListener("input", change_font_size );
        fontFamily_select.removeEventListener("chagne", change_font_family );
        opacity_range.removeEventListener("input", change_font_alpha );
        deletePic_btn.removeEventListener("click", deleteText );


        moveUp_btn.removeEventListener('click', moveUp);
        moveDown_btn.removeEventListener('click', moveDown);

        this.toggleControlVisibility();

        this.stage.draw();
      }

    });

  }

  toggleControlVisibility(){
    for(let i=0; i<text_group_btn.length; i++ ){
      text_group_btn[i].classList.toggle("hide");
    }
  }

}














