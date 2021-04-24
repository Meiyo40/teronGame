class Player {
    constructor(pName) {
        this.name = pName;
        this.x = 0;
        this.y = 0;

        this.image = new Image();
        this.image.src = "img/player2.png"
        this.image.width = 30;
        this.image.height = 30;
        this.speed = 1.2;

        this.world = null;
        this.target = null;
        this.shots = new Array();


        this.keys = { keyRight: false, keyLeft: false, keyDown: false, keyUp: false };

        this.spells = [{
            name: "strike",
            range: 10,
            damage: { min: 638, max: 862 },
            effect: {
                name: "reduce_damage",
                value: 10,
                duration: 5
            },
            targets: { teron: true, ghosts: false },
            cooldown: 0,
            current_cooldown: 0,
            image: "img/spells/strike.jpg",
            timer: null
        }, {
            name: "lance",
            range: 40,
            damage: { min: 6175, max: 6825 },
            effect: {
                name: "reduce_speed_target_stackable",
                value: 30,
                duration: 9
            },
            targets: { teron: false, ghosts: true },
            cooldown: 1.5,
            current_cooldown: 0,
            image: "img/spells/lance.jpg",
            timer: null
        }, {
            name: "chains",
            range: 20,
            damage: { min: 1900, max: 2100 },
            effect: {
                name: "aoe_damage_root",
                value: null,
                duration: 5
            },
            targets: { teron: false, ghosts: true },
            cooldown: 15,
            current_cooldown: 0,
            image: "img/spells/chains.jpg",
            timer: null
        }, {
            name: "volley",
            range: 20,
            damage: { min: 9900, max: 12100 },
            effect: {
                name: "none",
                value: null,
                duration: null
            },
            targets: { teron: false, ghosts: true },
            cooldown: 15,
            current_cooldown: 0,
            image: "img/spells/volley.jpg",
            timer: null
        }, {
            name: "shield",
            range: 40,
            damage: { min: 0, max: 0 },
            effect: {
                name: "ally_shield_buff",
                value: { min: 11400, max: 12600 },
                duration: 30
            },
            targets: { teron: false, ghosts: true },
            cooldown: 90,
            current_cooldown: 0,
            image: "img/spells/shield.jpg",
            timer: null
        }];
    }

    init(world) {

        this.world = world;
        this.x = world.width / 2 - 40;
        this.y = 15;

        this.debuff = {
            image: new Image()
        }

        this.debuff.spawned = false;
        this.debuff.remaining = 2;
        this.debuff.image.src = "img/spells/player_debuff.jpg";
        this.debuff.image.width = 30;
        this.debuff.image.height = 30;
        this.debuff.x = world.width - 30;
        this.debuff.y = 0;
        this.timer = setInterval(() => {
            if (this.debuff.remaining > 0) {
                this.debuff.remaining--;
            } else {
                clearInterval(this.timer);
            }
        }, 1000)
    }

    move() {
        if (this.keys.keyRight) {
            if ((this.x + this.image.width / 2) < this.world.width) {
                this.x += this.speed;
            }
        }

        if (this.keys.keyLeft) {
            if ((this.x - this.image.width / 2) > 0) {
                this.x -= this.speed;
            }
        }

        if (this.keys.keyUp) {
            if ((this.y - this.image.height / 2) > 0) {
                this.y -= this.speed;
            }
        }

        if (this.keys.keyDown) {
            if ((this.y + this.image.height / 2) < this.world.height - 30) {
                this.y += this.speed;
            }
        }
    }

    shot(spell, ennemies = null) {
        if (this.target != null || spell === "chains") {
            let index = null;
            this.spells.forEach((s) => {
                if (s.name == spell) {
                    index = this.spells.indexOf(s);
                }
            })
            if (this.spells[index].current_cooldown <= 0) {
                this.doSpellEffect(this.spells[index], this.target, ennemies);
                if (this.spells[index].cooldown > 0) {
                    this.spells[index].current_cooldown = this.spells[index].cooldown;
                    this.spells[index].timer = setInterval(() => {
                        this.spells[index].current_cooldown--;
                        if (this.spells[index].current_cooldown <= 0) {
                            clearInterval(this.spells[index].timer);
                        }
                    }, 1000);
                }
            } else {
                console.log("spell on cooldown");
            }
        } else {
            console.log("No Target");
        }
    }

    doSpellEffect(spell, target, ennemies) {
        console.log("Cast: " + spell.name);
        if (spell.name == "chains") {
            if (ennemies != null) {
                let chains = new Shot(this.x, this.y, null, ennemies, null, spell, this);
                this.shots.push(chains);
            }
        } else {
            if (spell.damage.min > 0 && spell.targets.ghosts &&
                (Tools.distance(this.x, this.y, target.x, target.y) < spell.range * 4)) {
                let damage = Math.floor(Math.random() * spell.damage.max) + spell.damage.min;
                console.log("HIT: " + damage + " EFFECT: " + spell.effect.name);
                let cast = new Shot(this.x, this.y, "/img/spells/bolt_poop.png", target, damage, spell, this);
                this.shots.push(cast);
                console.log(this.shots.length)
                    //target.applyStatus(spell);
                    //target.getHit(damage);
            }
        }

    }

    update() {
        this.shotsUpdate();
    }

    shotsUpdate() {
        let toDelList = new Array();
        this.shots.forEach((e) => {
            e.update();
            if (e.toDelete) {
                toDelList.push(this.shots.indexOf(e));
            }
        });
        if (toDelList.length > 0) {
            for (let i = 0; i < toDelList.length; i++) {
                this.shots.splice(toDelList[i], 1);
            }
        }
    }

    selectTarget(ghosts) {
        if (this.target == null) {
            let min = 1000;
            let index = null;
            ghosts.forEach((g) => {
                let dist = Tools.distance(g.x, g.y, this.x, this.y);
                if (dist < min) {
                    min = dist;
                    index = ghosts.indexOf(g);
                }
                g.select(false);
            })
            this.target = ghosts[index];
            this.target.select(true);
        } else {
            this.target.select(false);
            let index = ghosts.indexOf(this.target);
            if (index < ghosts.length - 1) {
                this.target = ghosts[index + 1];
            } else {
                this.target = ghosts[0];
            }
            this.target.select(true);
        }
    }

    input(key) {
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