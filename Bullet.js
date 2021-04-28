class Bullet {
    constructor(x,y,directionX,directionY) {
        this.x = x;
        this.y = y;
        this.power = 5;
        this.radius = 4;
        this.speedX = directionX*this.power;
        this.speedY = directionY*this.power;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(context){
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }

    checkOut(canvas){
        return (this.x < 0 || this.x > canvas.width || this.y < 0 ||this.y > canvas.height)
    }
}