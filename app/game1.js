var canvas = document.getElementById('canvas');
canvas.width=innerWidth-100;
canvas.height=innerHeight-100;
let Jiki = new Image();
Jiki.src = "pacmanmemo.png"
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation="destination-over";
let start = null;
//0,1,2
//3,4,0(5)
let x=innerWidth/2,y=innerHeight/2,dir=0,frame = 0,time1=500;

let draw = timestamp =>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    var progress = timestamp - start;
    if(progress>65){
        progress=0;
        start = null;
        if(keyIsDown("ArrowRight")){dir=0;x+=10;frame++;}
        if(keyIsDown("ArrowLeft")){dir=1;x-=10;frame++;}
    }
    if(dir==0&&frame>2){
        frame=0
    }else if(dir==1&&frame<3){
        frame=3
    }else if(dir==1&&frame>5){
        frame=3
    }
    ctx.drawImage(Jiki,(frame%5)*260,0,260,260,x,y,70,70)

    console.log(progress)
    if (!start) start = timestamp;
    
    //ctx.drawImage(charImages, 0, 0);
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);