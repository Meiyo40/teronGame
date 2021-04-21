class Utils {
    getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    distance(x1, y1, x2, y2) {
        return ((x2 - x1) ^ 2 + (y2 - y1) ^ 2) ^ 0.5;
    }

    getVelocityX(x1, y1, x2, y2) {
        let angle = this.getAngle(x1, y1, x2, y2);
        return 10 * Math.cos(angle);
    }

    getVelocityY(x1, y1, x2, y2) {
        let angle = this.getAngle(x1, y1, x2, y2);
        return 10 * Math.sin(angle);
    }
}

let Tools = new Utils();