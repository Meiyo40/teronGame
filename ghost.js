class Ghost {
    constructor(id, position) {
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.health = 2000;
        this.selected = false;
        this.status = null;

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
}

class Teron {
    constructor(pX, pY) {
        this.image = new Image();
        this.image.src = "img/teron.png";
        this.image.width = 50;
        this.image.height = 50;

        this.x = pX;
        this.y = pY;
    }
}