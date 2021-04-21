class TeronGame {

    constructor() {
        this.interval = null;
        this.ctx = null;
        this.canvas = null;
        this.frameRate = 60;
        this.init();
    }

    init() {
        this.interval = setInterval(() => {
            this.elapsed = Date.now() - this.elapsed;
            this.dt = this.elapsed / this.frameRate;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.update();
            this.draw(this.ctx);
        }, 1000 / this.frameRate);

        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player("player");
        this.player.init(this.canvas);

        this.player.x = 200;
        this.player.y = 400;
        this.elapsed = Date.now();

        this.ghosts = new Array();

        this.teron = new Teron(this.canvas.width / 2, 22);

        window.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                location.reload();
            }
            this.player.input(e)
        }, false);
        window.addEventListener("keyup", (e) => { this.player.output(e) }, false);
        this.canvas.addEventListener("click", (e) => {
            let mx = e.pageX - (this.canvas.offsetLeft + this.canvas.clientLeft);
            let my = e.pageY + (this.canvas.offsetTop + this.canvas.clientTop);
            this.collider(mx, my)
        });


        console.log("init");
    }

    update() {
        this.player.move()
        if (this.player.debuff.remaining <= 0 && this.player.debuff.spawned == false) {
            this.player.debuff.spawned = true;
            this.ghosts.push(new Ghost(1, { x: this.player.x - 30, y: this.player.y - 30 }, this.canvas));
            this.ghosts.push(new Ghost(2, { x: this.player.x + 30, y: this.player.y - 30 }, this.canvas));
            this.ghosts.push(new Ghost(3, { x: this.player.x - 30, y: this.player.y + 30 }, this.canvas));
            this.ghosts.push(new Ghost(4, { x: this.player.x + 30, y: this.player.y + 30 }, this.canvas));
        }

        if (this.ghosts.length > 0) {
            this.ghosts.forEach((g) => {
                g.friends = this.ghosts;
                g.update(this.dt);
                if (g.collide(this.teron.x, this.teron.y)) {
                    g.status.alive = false;
                    this.teron.ghostHit++;
                }
            });
        }

        if (this.teron.ghostHit > 1) {
            clearInterval(this.interval);
            this.gameOver();
        } else if (this.ghosts.length <= 0 && this.player.spawned) {
            this.win();
        }
    }

    draw(ctx) {
        //teron
        ctx.drawImage(this.teron.image, this.teron.x - (this.teron.image.width / 2), this.teron.y - (this.teron.image.height / 2), this.teron.image.width, this.teron.image.height);

        //player
        if (this.player.debuff.remaining > 0) {
            ctx.drawImage(this.player.debuff.image, this.player.debuff.x, this.player.debuff.y, this.player.debuff.image.width, this.player.debuff.image.height);
            ctx.font = "20px serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            let text = this.player.debuff.remaining + "s";
            ctx.fillText(text, this.player.debuff.x + 15, this.player.debuff.y + 48);
        }
        ctx.drawImage(this.player.image, this.player.x - (this.player.image.width / 2), this.player.y - (this.player.image.height / 2), this.player.image.width, this.player.image.height);

        //ghost
        if (this.ghosts.length > 0) {
            this.ghosts.forEach((e) => {
                if (e.status.alive) {

                    ctx.beginPath();
                    ctx.rect(e.x - 15, e.y - 20, 30, 0);
                    ctx.lineWidth = 7;
                    ctx.strokeStyle = 'red';
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.lineWidth = 7;
                    ctx.fillStyle = 'green';
                    ctx.rect(e.x - 16, e.y - 24, 30 * e.getPercentHealth() + 2, 8);
                    ctx.fill();

                    ctx.drawImage(e.image, e.x - (e.image.width / 2), e.y - (e.image.height / 2), e.image.width, e.image.height);
                }
            })
        }
    }

    gameOver() {
        this.ctx.font = "40px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Ouk ouk!", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("Raid is Dead!", this.canvas.width / 2, this.canvas.height / 2 + 42);
    }

    win() {
        this.ctx.font = "40px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText("HAOU HAOU!", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("Banane pour toi!", this.canvas.width / 2, this.canvas.height / 2 + 42);
    }

    collider(mX, mY) {
        //ghost
        if (this.ghosts.length > 0) {
            let hasTouch = { state: false, target: null }
            this.ghosts.forEach((e) => {
                let x = e.x - e.image.width / 2;
                if ((mX < x + e.image.width) &&
                    (mX > x) &&
                    (mY < e.y + e.image.height) &&
                    (mY > e.y)) {
                    if (hasTouch.state) {
                        hasTouch.target.selected = false;
                    } else {
                        this.player.target = e;
                        hasTouch.state = true;
                        hasTouch.target = e;
                        e.select(true);
                    }
                } else {
                    e.select(false);
                }
            });
        }
    }
}

let game = new TeronGame();