//	import "libst.css"
document.body.innerHTML+="<style type='text/css'>.db {border-radius: 10px;transition: background-color .3s;font-size:100%;}.db:hover {border-radius: 10px;background-color:#77cccc;color:green;}dialog {border-radius: 10px;font-size:130%;}</style>";
window.openW=(x,y,width,height)=>{
	return open("about:blank","",`left=${x}px,top=${y}px,width=${width}px,height=${height}px`);
}
window.say = (text,lang="ja-JP",rate=1,pitch=1) =>{
	var msg = new SpeechSynthesisUtterance();
	msg.lang = lang;
	msg.text = text;
	msg.rate = rate;
	msg.pitch = pitch;
	speechSynthesis.speak(msg);
}
window.dialog = async (message="message",no="cansel",ok="OK",otherb) =>{
  return new Promise(resolve=>{
  var dial = document.createElement("dialog");
  var form = document.createElement("form");
  form.setAttribute("method","dialog");
  form.innerHTML += message;
  form.innerHTML +=  "<br>";
  var menu = document.createElement("menu");
  var okbutton = document.createElement("button");
  okbutton.setAttribute("class","db");
  okbutton.textContent += ok;
  var nobutton = document.createElement("button");
  nobutton.setAttribute("class","db");
  nobutton.textContent += no;
  dial.appendChild(form);
  form.appendChild(menu);
  if(otherb!=undefined){
    var otbutton = document.createElement("button");
    otbutton.textContent += otherb;
	otbutton.setAttribute("class","db");
    menu.appendChild(otbutton)
    otbutton.addEventListener("click",()=>{resolve(otherb); document.body.removeChild(dial)},false);
  }
  menu.appendChild(nobutton);
  menu.appendChild(okbutton);
  document.body.appendChild(dial);
  dial.showModal();
  okbutton.addEventListener("click",()=>{resolve(true); document.body.removeChild(dial)},false);
  nobutton.addEventListener("click",()=>{resolve(false); document.body.removeChild(dial)},false);

  })
}

window.listen = async (lang="ja-JP",ev) =>{
    return new Promise(resolve =>{
		var rec = new webkitSpeechRecognition() || new SpeechRecognition();
		rec.lang=lang;
		rec.start();
		rec.onresult = (e) =>{
			resolve(e.results[0][0].transcript);
			rec.stop();
		}
		rec.onerror = (e) =>{
			ev.error = e;
			resolve()
		}
		rec.onnomatch = (e) =>{
			ev.error = e;
			resolve();
		}
		
    })
}
var input_key = new Array();
document.addEventListener('keydown', (e) => {
	input_key[e.key]=true;
})
document.addEventListener('keyup', (e) => {
	input_key[e.key]=false;
})
window.addEventListener('blur',()=>{
	// 配列をクリアする
	input_key.length = 0;
	console.log("event blur");
});
var keyIsDown = (key) =>{
	if(input_key[key])return true;
	return false;
}
customElements.define('slib-gobj',
	class extends HTMLElement {
		constructor() {
			super();
			
		}
		connectedCallback(){
			var emojiSt = this.style;
			var frame = 0;
			
			//when the case(height x width): 1 x 4
			//0,1,2 or 3,4,5
			//0~2,3~5
			//0~frnum/2,frnum/2+1,frnum+1
			//(1 x f) ... (0~f/2),(f/2+1~f+1)
			emojiSt.position = "absolute";
			emojiSt.width=(this.h)+"px";
			emojiSt.height=(this.w)+"px";
			emojiSt.backgroundImage = `url(${this.imsrc})`;
			emojiSt.backgroundSize = `auto ${this.h}px`;
			var midd=(this.frnum)/2;
			console.log(this.frnum)
			var anim = setInterval(()=>{
				emojiSt.backgroundPosition = (-frame*this.w)+"px 0px";
				if(this.dataset.dir==1){
					if(midd<=frame){
						frame=0;
					}else{
						frame++;
					}
				}else{
					if(this.frnum+1<=frame || frame<=midd){
						frame=midd+1;
					}else{
						frame++;
					}
				}
			},100)
		}
	}
);

function getPoints(ele) {
    var rect = ele.getBoundingClientRect();
    var rect = {
        top: rect.top - 13 + window.pageYOffset,
        left: rect.left - 13 + window.pageXOffset,
    };
    //幅と高さ
    var ele_height = ele.offsetHeight;
    var ele_width = ele.offsetWidth;
    //matrixを取得
    try {
        var matrix = getStyleSheetValue(ele, "transform").match(/^matrix\((.*)\)$/)[1].split(/,\s*/).map((value)=>{return Number(value);});
    }
    //transformなしの場合
    catch(e) {
        var points = [
            [rect.left,rect.top],
            [rect.left+ele_width,rect.top],
            [rect.left+ele_width,rect.top+ele_height],
            [rect.left,rect.top+ele_height]
        ]
        return points;
    }
    //中心を[0, 0]とした座標
    var points = [
        [0, 0],
        [ele_width*matrix[0], ele_width*matrix[1]],
        [ele_width*matrix[0]+ele_height*matrix[2],ele_width*matrix[1]+ele_height*matrix[3]],
        [ele_height*matrix[2], ele_height*matrix[3]]
    ];
    //一番小さい座標
    var ele_x_min = 0;
    var ele_y_min = 0;
    points.forEach((value)=>{
        if (value[0] < ele_x_min) {
            ele_x_min = value[0];
        }
        if (value[1] < ele_y_min) {
            ele_y_min = value[1];
        }
    });
    //中心の絶対座標
    var ele_x = rect.left-ele_x_min;
    var ele_y = rect.top-ele_y_min;
    //絶対座標
    return points.map((value)=>{return [value[0]+ele_x, value[1]+ele_y];});
}

//cssを取得する関数
function getStyleSheetValue(element, property) {
    if (!element || !property) {
        return null;
    }
    var style = window.getComputedStyle(element);
    var value = style.getPropertyValue(property);
    return value;
}

//ある点pがeleの中に入ってるかを判定
function pIsIn(p, ele) {
    var points = getPoints(ele);
    var cross_count = 0;
    //辺と、辺に垂直な点を通る線の交差判定
    for (var i=0; i<2; i++) {
        var t1 = (points[i][0]-points[i+1][0])*(p[0]-points[i][0])+(points[i][1]-points[i+1][1])*(p[1]-points[i][1]);
        var t2 = (points[i][0]-points[i+1][0])*(p[0]-points[i+1][0])+(points[i][1]-points[i+1][1])*(p[1]-points[i+1][1]);
        if (t1*t2<=0) {
            cross_count ++;
        }
    }
    if (cross_count==2) {
        return true;
	}else{
		return false;
}}
/*
example:

<slib-emoji data-emoji="mmm">
*/
customElements.define('slib-emoji',
	class extends HTMLElement {
		constructor() {
			super();
		}
		connectedCallback(){
			var emojiSt = this.style;
			var h = 160;
			var frame = 0;
			emojiSt.position = "absolute";
			emojiSt.width=h+"px";
			emojiSt.height=h+"px";
			emojiSt.backgroundImage = "url(https://static-asm.secure.skypeassets.com/pes/v1/emoticons/"+this.dataset.emoji+"/views/default_160_anim_f?etag=v7)";
			var imh = emojiSt.naturalHeight;
			var anim = setInterval(()=>{
				emojiSt.backgroundPosition = "0px "+(frame*h)+"px";
				if((imh/h)<frame){
					frame=0;
				}else{
					frame--;
				}
			},25)
		}
	}
);
var appendEmoji = (em,x,y) =>{
	var emo = document.createElement("slib-emoji");
	emo.dataset.emoji = em;
	emo.style.position="absolute";
	emo.style.left = x+"px";
	emo.style.top = y+"px";
	document.body.appendChild(emo);
	emo.erase = ()=>{document.body.removeChild(emo)}
	return emo;
}

























