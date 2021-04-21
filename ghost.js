class Ghost {
    constructor(id, position) {
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.health = 2000;
        this.selected = false;
        this.status = null;

        this.image = new Image();
        this.image.src = "img/ghost.png";
        this.image.width = 30;
        this.image.height = 30;
    }

    select(value) {
        if (value) {
            this.image.src = "img/selected_ghost.png";
        } else {
            this.image.src = "img/ghost.png";
        }
        this.selected = value;
    }
}