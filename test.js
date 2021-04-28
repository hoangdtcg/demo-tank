let canvas = document.getElementById("mycanvas");
let max_score = document.getElementById("max_score");
let score = document.getElementById("score");
let life = document.getElementById("life");
let balloons = document.getElementById("balloons");
let bpm = document.getElementById("bpm");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let c = canvas.getContext("2d");
let max_score_get = 0;
let score_get = 0;
let life_get = 3;
let balloon_get = 0;
let bpm_get = 0;
let total_balloons_get = 0;
let timeout_score = 0;
let damage = 20;
let bullets = [];
let targets = [];
let g;
let music = new Audio("DaftPunk.mp3");
let shoot = new Audio("Gun13.wav");
let explosion = new Audio("Explosion2.wav");
let timeout = 3500;
let scale = 0.075;
let timestamp = Date.now();
let time = 0;

let isShootPlaying = function () {
    return shoot
        && shoot.currentTime > 0
        && !shoot.paused
        && !shoot.ended
        && shoot.readyState > 2;
}
let isExplosionPlaying = function () {
    return explosion
        && explosion.currentTime > 0
        && !explosion.paused
        && !explosion.ended
        && explosion.readyState > 2;
}

let createBalloon = function () {
    targets.push(new Target());
    time = (Date.now() - timestamp) / 1000;
    bpm_get = total_balloons_get / (time / 60);
    balloon_get++;
    total_balloons_get++;
}

let createBalloons = setInterval(createBalloon, timeout); //tạo thêm bóng theo thời gian được gán (milisecond)

function distance(x1, y1, x2, y2) {// hàm tính tọa độ giữa 2 điểm trên màn hình
    let x_d = x2 - x1;
    let y_d = y2 - y1;
    return (Math.sqrt(Math.pow(x_d, 2) + Math.pow(y_d, 2)));
}

let mouse = { //tọa độ con trỏ chuột
    x: canvas.width / 2,
    y: canvas.height / 2
};

let bull_start = { //biến vị trí và góc bắn viên đạn
    x: undefined,
    y: undefined,
    angle: undefined
};

canvas.addEventListener("click", function () {//mỗi khi lick chuột thì bắn một viên đạn
    if (isShootPlaying) {
        shoot.pause();
        shoot.currentTime = 0;
        shoot.play();
    } else {
        shoot.play();
    }
    bullets.push(new Bullet());
});

canvas.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;//lấy vị trí chuột theo tọa độ
    mouse.y = event.clientY;
});//khi di chuyển chuột thì vị trí chuột sẽ được cập nhật lại

function getRandomHex() {//hàm xử lý random màu
    return Math.floor(Math.random() * 255);
}

function getRandomColor() {// hàm xử lý random màu
    let red = getRandomHex();
    let green = getRandomHex();
    let blue = getRandomHex();
    return "rgb(" + red + "," + green + "," + blue + ")";
}

function Target() { //lớp mục tiêu
    this.x = canvas.width;// vị trí cơ bản
    this.y = canvas.height;
    this.radius = Math.random() * 100 + 20;// random kích thước
    this.point = this.radius;
    this.hp = this.radius;
    this.ang = Math.random();//(canvas.height / 2) / canvas.width;
    this.dx = -Math.random() * 7 - 2;//random tốc độ di chuyển của mục tiêu
    this.color = getRandomColor();
    this.draw = function () {// vẽ và xử lý chuyển động
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = "red";
        c.lineWidth = 1;
        c.stroke();
        c.closePath();
    }
    this.update = function (bullets, targets) {
        let target_index = 0;
        for (let i = 0; i < targets.length; i++) {//lấy vị trí trong mảng của mục tiêu
            if (this === targets[i]) {
                target_index = i;
                break;
            }
        }
        for (let i = 0; i < bullets.length; i++) {// xử lý va chạm, khi đạn chạm vào mục tiêu thì xóa cả 2
            if (distance(this.x, this.y, bullets[i].x, bullets[i].y) < (this.radius + bullets[i].radius)) {
                if (this.hp > 20) {
                    this.hp = this.hp - damage;
                    this.radius = (this.radius - damage) >= 0 ? this.radius - damage : 0;
                }
                bullets.splice(i, 1);
                if (this.hp <= 20) {
                    targets.splice(target_index, 1);
                    balloon_get--;
                    score_get += parseInt(300 - this.point);
                    max_score_get += parseInt(300 - this.point);
                    timeout_score += parseInt(300 - this.point);
                    if (isExplosionPlaying) {
                        explosion.pause();
                        explosion.currentTime = 0;
                        explosion.play();
                    } else {
                        explosion.play();
                    }
                }
                //thưởng điểm
                if (score_get > 500) {//xử lý thưởng mạng
                    life_get++;
                    score_get = score_get - 500;
                    damage++;
                }
                if (timeout_score > 1000 && timeout >= 100) {//tăng tốc độ tạo bóng
                    timeout_score -= 1000;
                    timeout = timeout - (timeout * scale);
                    clearInterval(createBalloons);
                    createBalloons = setInterval(createBalloon, timeout);
                }
            }
        }
        this.x += this.dx;
        this.y = this.ang * this.x + canvas.height / 10; // xử lý vị trí xuất hiện của mục tiêu
        if (this.x < 0) {//phạt điểm, mạng
            balloon_get--;
            targets.splice(target_index, 1);
            // score_get -= parseInt(this.radius);
            life_get--;
        }
        this.draw();
    }
}

function Bullet() {//lớp đạn
    const velocity = 25;// lực bắn
    this.x = bull_start.x;//khởi tạo vị trí ban đầu của viên đạn, đầu vòi súng
    this.y = bull_start.y;
    this.dx = Math.cos(bull_start.angle) * velocity;//tạo góc bắn
    this.dy = Math.sin(bull_start.angle) * velocity;
    this.color = "black";
    this.radius = 10;
    this.gravity = 0.3;// lực hút cho đạn
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    this.update = function (bullets) {//lấy vị trí của phần tử đạn trong mảng
        let bullet_index = 0;
        for (let i = 0; i < bullets.length; i++) {
            if (this === bullets[i]) {
                bullet_index = i;
                break;
            }
        }
        this.x += this.dx;//xử lý chuyển động của đạn
        this.y += this.dy;
        this.dy += this.gravity;
        if (this.x > canvas.width || this.y > canvas.height) {//khi đạn bay ra khỏi khung thì xóa nó khỏi mảng
            // score_get -= 5;// và trừ điểm
            bullets.splice(bullet_index, 1);
        }
        this.draw();
    }
}

function Gun() {//lớp súng
    this.x = 20;
    this.y = canvas.height - 20;
    this.length = 200;
    this.color = "black";
    this.draw = function () { //vẽ nòng súng
        c.beginPath();
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        c.moveTo(10, canvas.height - 10);
        c.lineTo(this.x, this.y);
        c.lineWidth = 30;
        c.fill();
        c.stroke();
        c.closePath();
    }
    this.update = function () {//cập nhật góc bắn cho đạn, góc được tạo bởi góc của vòi súng
        const angle = -Math.atan2(canvas.height - mouse.y, mouse.x);// góc bị ảnh hưởng bởi tọa độ chuột
        this.x = 35 + Math.cos(angle) * this.length;
        this.y = canvas.height - 35 + Math.sin(angle) * this.length;
        bull_start.x = this.x;
        bull_start.y = this.y;
        bull_start.angle = angle;
        this.draw();
    }
}

function set_score() {// xử lý hiện thị điểm
    max_score.innerHTML = max_score_get;
    score.innerHTML = score_get;
    life.innerHTML = life_get;
    balloons.innerHTML = balloon_get;
    bpm.innerHTML = bpm_get.toFixed(2);
}

function confirm() {
    alert("Bạn đã thua!\n" + "Bạn có muốn chơi lại không?");
    document.location.reload();
}

function animate() { //tổng hợp hoạt cảnh
    if (life_get > 0) {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        g.update();
        set_score();
        c.beginPath();
        c.arc(0, canvas.height, 150, 0, 2 * Math.PI, false);
        c.fillStyle = "black";
        c.fill();
        c.closePath();
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update(bullets);
        }
        for (let i = 0; i < targets.length; i++) {
            targets[i].update(bullets, targets);
        }
    } else {
        confirm();
    }
}

function start() {
    music.play();
    alert("Chào mừng bạn đến với game bắn bóng!\n" +
        "Được tạo bởi Trần Công Minh, lớp C0520H1.");
    alert("Hướng dẫn chơi game:\n" +
        "- Di chuyển chuột để điều khiển nòng súng!\n" +
        "- Click chuột để bắn!");
    alert("- Khởi đầu bạn sẽ có 3 mạng.\n" +
        "- Mỗi lần bóng bay mất sẽ mất 1 mạng.\n" +
        "- Mỗi khi đạt 500 điểm sẽ được thưởng 1 mạng!");
    alert("Chúc các bạn chơi game vui vẻ!");
    g = new Gun();
    animate();
}

start();