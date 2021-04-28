class Tank {
    constructor(x, y) {
        this.states = {
            IDLE: 'idle',
            LEFT: 'moveLeft',
            RIGHT: 'moveLeft',
            UP: 'moveLeft',
            DOWN: 'moveLeft'
        };
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 0;
        this.angle = 0;
        this.cannonWidth = 40;
        this.cannonHeight = 10;

        this.bodyImg = new Image();
        this.bodyImg.src = 'images/body.png';
        this.bodyWidth = this.bodyImg.width / 4;
        this.bodyHeight = this.bodyImg.height / 4;

        this.cannonImg = new Image();
        this.cannonImg.src = 'images/cannon.png';
        this.cannonWidth = this.cannonImg.width / 4;
        this.cannonHeight = this.cannonImg.height / 4;
        this.ratio = 15;

        this.bullets = [];
    }

    draw(context) {
        //draw tank
        context.beginPath();
        context.fillStyle = "blue";
        // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        context.fill();
        context.closePath();
        //draw cannon
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.beginPath();
        context.fillStyle = 'orange';
        context.rect(0, -this.cannonHeight / 2, this.cannonWidth, this.cannonHeight);
        context.fill();
        context.closePath();
        context.restore();
    }

    drawImg(context) {
        //draw tank
        // context.save();
        // context.translate(200, 200);
        // context.rotate(Math.PI);
        context.drawImage(this.bodyImg, this.x - this.bodyWidth / 2, this.y - this.bodyHeight / 2, this.bodyWidth, this.bodyHeight);

        //draw cannon
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        // context.rect(0, -this.cannonHeight / 2, this.cannonWidth, this.cannonHeight);
        context.drawImage(this.cannonImg, -this.ratio, -this.cannonHeight / 2, this.cannonWidth, this.cannonHeight);
        context.restore();
        // this.drawBullets();
    }

    rotateCannon(mouseX, mouseY) {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        this.angle = Math.atan2(dy, dx);
    }

    fire(){
        let dirX = Math.cos(this.angle);
        let dirY = Math.sin(this.angle);

        let bullet = new Bullet(this.x, this.y,dirX,dirY);
        this.bullets.push(bullet);
    }

    drawBullets(canvas){
        let context = canvas.getContext('2d');
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update();
            this.bullets[i].draw(context);
            if(this.bullets[i].checkOut(canvas)){
                this.bullets.splice(i,1);
            }
        }
    }
}

