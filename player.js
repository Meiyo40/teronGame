class Player {
    constructor(pName) {
        this.name = pName;
        this.x = 0;
        this.y = 0;

        this.image = new Image();
        this.image.src = "img/player2.png"
        this.image.width = 30;
        this.image.height = 30;

        this.world = null;


        this.keys = { keyRight: false, keyLeft: false, keyDown: false, keyUp: false };

        this.spells = {
            strike: {
                range: 10,
                damage: { min: 638, max: 862 },
                effect: {
                    name: "reduce_damage",
                    value: 10,
                    duration: 5
                },
                targets: { teron: true, ghosts: false },
                cooldown: 0
            },
            lance: {
                range: 40,
                damage: { min: 6175, max: 6825 },
                effect: {
                    name: "reduce_speed_target_stackable",
                    value: 30,
                    duration: 9
                },
                targets: { teron: false, ghosts: true },
                cooldown: 0
            },
            chain: {
                range: 20,
                damage: { min: 1900, max: 2100 },
                effect: {
                    name: "aoe_damage_root",
                    value: null,
                    duration: 5
                },
                targets: { teron: false, ghosts: true },
                cooldown: 15
            },
            volley: {
                range: 20,
                damage: { min: 9900, max: 12100 },
                effect: {
                    name: "none",
                    value: null,
                    duration: null
                },
                targets: { teron: false, ghosts: true },
                cooldown: 15
            },
            shield: {
                range: 40,
                damage: { min: 1900, max: 2100 },
                effect: {
                    name: "ally_shield_buff",
                    value: { min: 11400, max: 12600 },
                    duration: 30
                },
                targets: { teron: false, ghosts: true },
                cooldown: 90
            }
        }
    }

    init(world) {

        this.world = world;
        this.x = world.width / 2 - 40;
        this.y = 15;

        this.debuff = {
            image: new Image()
        }

        this.debuff.remaining = 20;
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

    shot(target) {

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

/*
    Spirit Strike - key '1' - A melee attack which does 638 to 862 frost damage and reduces damage dealt by the target by 10% for 5 seconds. Ability can only be used on Teron Gorefiend.
    Spirit Lance - key '3' - A ranged attack which does 6,175 to 6,825 damage and applies a debuff on the target which reduces its movement speed by 30% for 9 seconds. The debuff stacks up to the three times. Ability has a 30 yard range and can only be used on Shadowy Constructs.
    Spirit Chains - key '4' - A short-range AoE shackle which does 1,900 to 2,100 frost damage to targets within 12 yards. Targets are held in place for 5 seconds. Ability has a 15 second cooldown and only affects Shadowy Constructs.
    Spirit Volley - key '5' - A short range AoE which does 9,900 to 12,100 frost damage. Ability has a 15 second cooldown and only affects Shadowy Constructs.
    Spirit Shield - key '7' - Applies a 30 second buff on a friendly target which absorbs 11,400 to 12,600 shadow damage. Ability has a 1.5 minute cooldown. Because Ghosts last for 60 seconds, this ability can only be used once per Ghost.
*/