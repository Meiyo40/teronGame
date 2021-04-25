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
        this.world = canvas;
        this.friends = null;
        this.speed = 0.3;
        this.status = {
            alive: true,
            debuff: {
                snare: {
                    active: false,
                    remaining: 0,
                    effect: 0,
                    speed_reduce: 0,
                    timer: null
                },
                stun: {
                    active: false,
                    remaining: 0,
                    timer: null
                },
                damage: {
                    active: false,
                    remaining: 0,
                    timer: null
                }
            }
        };

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
        let SPEED_MODIFIER = 1;

        if (this.status.debuff.snare.active) {
            if (this.status.debuff.snare.effect == 30) {
                SPEED_MODIFIER = 0.66;
            } else if (this.status.debuff.snare.effect == 60) {
                SPEED_MODIFIER = 0.33;
            } else if (this.status.debuff.snare.effect == 90) {
                SPEED_MODIFIER = 0.10;
            } else {
                SPEED_MODIFIER = 1;
            }
        }
        if (this.status.debuff.stun.active) {
            SPEED_MODIFIER = 0;
        }

        this.vx = Tools.getVelocityX(this.x, this.y, this.world.width / 2, 30) / 15;
        this.vy = Tools.getVelocityY(this.x, this.y, this.world.width / 2, 30) / 15;

        this.x = this.x + this.vx * SPEED_MODIFIER;
        this.y = this.y + this.vy * SPEED_MODIFIER;
    }

    applyStatus(spell) {
        if (spell.name === "lance") {
            if (this.status.debuff.snare.active == false) {
                this.status.debuff.snare = {
                    active: true,
                    effect: 1 * spell.effect.value,
                    remaining: spell.effect.duration,
                    timer: setTimeout(() => {
                        this.status.debuff.snare.active = false;
                    }, spell.effect.duration * 1000)
                };
            } else {
                clearTimeout(this.status.debuff.snare.timer);
                if (this.status.debuff.snare.effect < 90) {
                    this.status.debuff.snare = {
                        active: true,
                        effect: this.status.debuff.snare.effect + spell.effect.value,
                        remaining: spell.effect.duration,
                        timer: setTimeout(() => {
                            this.status.debuff.snare.active = false;
                        }, spell.effect.duration * 1000)
                    };
                } else {
                    this.status.debuff.snare = {
                        active: true,
                        effect: 3 * spell.effect.value,
                        remaining: spell.effect.duration,
                        timer: setTimeout(() => {
                            this.status.debuff.snare.active = false;
                        }, spell.effect.duration * 1000)
                    };
                }
            }
        }
        if (spell.name === "chains") {
            clearTimeout(this.status.debuff.stun.timer);
            this.status.debuff.stun = {
                active: true,
                remaining: spell.effect.duration,
                timer: setTimeout(() => {
                    this.status.debuff.stun.active = false;
                }, spell.effect.duration * 1000)
            };
        }
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
        if (this.currentHealth <= 0) {
            this.status.alive = false;
        }
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

class Shot {
    constructor(x, y, image, target, damage, spell, player) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.image = this.setImage(image);
        this.toDelete = false;
        this.target = target;
        this.damage = damage;
        this.source = spell;
        this.player = player;
        this.timer = null;
    }

    update() {
        if (this.source.name == "lance") {
            this.move();
            if (this.collide(this.target.x, this.target.y)) {
                this.toDelete = true;
                this.target.applyStatus(this.source);
                this.target.getHit(this.damage);
            }
        } else if (this.source.name == "chains") {
            this.chains();
        }
    }

    draw(ctx) {
        if (this.source.name == "lance") {
            ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
        } else if (this.source.name == "chains") {
            this.timer = {
                nb: 0,
                interval: setInterval(() => {
                    ctx.beginPath();
                    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
                    ctx.stroke();
                    this.timer.nb++;
                    if (this.timer.nb > 5) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 500)
            };
        }
    }

    setImage(imageName) {
        let img = new Image();
        img.src = imageName;
        img.width = 15;
        img.height = 15;
        return img;
    }

    chains() {
        this.target.forEach((e) => {
            let dist = Tools.distance(this.x, this.y, e.x, e.y);
            if (dist < this.source.range * 4) {
                let damage = Math.floor(Math.random() * this.source.damage.max) + this.source.damage.min;
                e.applyStatus(this.source);
                e.getHit(damage);
                console.log("HIT: " + damage + " EFFECT: " + this.source.effect.name);
            }
        });
        this.toDelete = true;
    }

    move() {
        this.vx = Tools.getVelocityX(this.x, this.y, this.target.x, this.target.y) / 5;
        this.vy = Tools.getVelocityY(this.x, this.y, this.target.x, this.target.y) / 5;

        this.angle = Tools.getAngle(this.x, this.y, this.target.x, this.target.y);

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
}