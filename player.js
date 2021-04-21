class Player {
    constructor(pName) {
        this.name = pName;
        this.x = 0;
        this.y = 0;

        this.image = new Image();
        this.image.src = "img/player.png"
        this.image.width = 30;
        this.image.height = 30;

        this.world = null;


        this.keys = { keyRight: false, keyLeft: false, keyDown: false, keyUp: false };
    }

    move() {
        if (this.keys.keyRight) {
            if ((this.x + this.image.width / 2) < this.world.width) {
                this.x++;
            }
        }

        if (this.keys.keyLeft) {
            if ((this.x - this.image.width / 2) > 0) {
                this.x--;
            }
        }

        if (this.keys.keyUp) {
            if ((this.y - this.image.height / 2) > 0) {
                this.y--;
            }
        }

        if (this.keys.keyDown) {
            if ((this.y + this.image.height / 2) < this.world.height) {
                this.y++;
            }
        }
    }

    input(key) {
        console.log(key)
        if (key.key === "d") {
            this.keys.keyRight = true;
        }
        if (key.key === "q") {
            this.keys.keyLeft = true;
        }
        if (key.key === "z") {
            this.keys.keyUp = true;
        }
        if (key.key === "s") {
            this.keys.keyDown = true;
        }
    }

    output(key) {
        if (key.key === "d") {
            this.keys.keyRight = false;
        }
        if (key.key === "q") {
            this.keys.keyLeft = false;
        }
        if (key.key === "z") {
            this.keys.keyUp = false;
        }
        if (key.key === "s") {
            this.keys.keyDown = false;
        }
    }
}