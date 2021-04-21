class Ghost {
    constructor(id, position, canvas) {
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.vx = 0;
        this.vy = 0;
        this.maxHealth = 41567;
        this.currentHealth = this.maxHealth;
        this.selected = false;
        this.status = { alive: true };
        this.world = canvas;
        this.friends = null;
        this.speed = 0.3;

        this.image = new Image();
        this.image.src = "img/ghost_banane.png";
        this.image.width = 40;
        this.image.height = 40;
    }

    select(value) {
        if (value) {
            this.image.src = "img/selected_banane.png";
        } else {
            this.image.src = "img/ghost_banane.png";
        }
        this.selected = value;
    }

    update(dt) {
        this.move(dt);
        if (this.currentHealth <= 0) {
            this.status.alive = false;
        }
    }

    move(dt) {
        this.vx = Tools.getVelocityX(this.x, this.y, this.world.width / 2, 30) / 15;
        this.vy = Tools.getVelocityY(this.x, this.y, this.world.width / 2, 30) / 15;
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    collide(tX, tY) {
        if (Tools.distance(this.x, this.y, tX, tY) < 10) {
            return true;
        } else {
            return false;
        }
    }

    getPercentHealth() {
        let rawPct = this.currentHealth / this.maxHealth * 100;
        let decimal = parseFloat("0." + rawPct);
        return rawPct == 100 ? 1 : decimal;
    }

    getHit(amount) {
        this.currentHealth -= amount;
    }
}

class Teron {
    constructor(pX, pY) {
        this.image = new Image();
        this.image.src = "img/teron.png";
        this.image.width = 50;
        this.image.height = 50;
        this.ghostHit = 0;

        this.x = pX;
        this.y = pY;
    }
}