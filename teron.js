class TeronGame {

    constructor() {
        this.interval = null;
        this.ctx = null;
        this.canvas = null;
        this.init();
    }

    init() {
        this.interval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.update();
            this.draw(this.ctx);
        }, 1000 / 60);

        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player("player");
        this.player.init(this.canvas);

        this.ghosts = new Array();

        this.teron = new Teron(this.canvas.width / 2, 22);

        window.addEventListener("keydown", (e) => { this.player.input(e) }, false);
        window.addEventListener("keyup", (e) => { this.player.output(e) }, false);
        this.canvas.addEventListener("click", (e) => {
            let mx = e.pageX - (this.canvas.offsetLeft + this.canvas.clientLeft);
            let my = e.pageY + (this.canvas.offsetTop + this.canvas.clientTop);
            this.collider(mx, my)
        });

        this.ghosts.push(new Ghost(1, { x: this.canvas.width / 2 - 20, y: this.canvas.height - 40 }))
        this.ghosts.push(new Ghost(2, { x: this.canvas.width / 2 + 20, y: this.canvas.height - 40 }))
        console.log("init");
    }

    update() {
        this.player.move()
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
                ctx.drawImage(e.image, e.x - (e.image.width / 2), e.y - (e.image.height / 2), e.image.width, e.image.height);
            })
        }
    }

    collider(mX, mY) {
        //ghost
        if (this.ghosts.length > 0) {
            this.ghosts.forEach((e) => {
                let x = e.x - e.image.width / 2;
                if ((mX < x + e.image.width) &&
                    (mX > x) &&
                    (mY < e.y + e.image.height) &&
                    (mY > e.y)) {
                    e.select(true);
                } else {
                    e.select(false);
                }
            });
        }
    }
}

let game = new TeronGame();