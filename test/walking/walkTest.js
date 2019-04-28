
let start = null;
let charImages =new Image();
charImages.src = "img/testchar.png";
let canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
let ctx = canvas.getContext("2d");
ctx.globalCompositeOperation="destination-over";
ctx.drawImage(charImages, 0, 0);
let draw = timestamp =>{
    if (!start) start = timestamp;
    var progress = timestamp - start;

    window.requestAnimationFrame(draw);
}
requestAnimationFrame(draw);