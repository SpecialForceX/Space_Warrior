class Border extends DrawableObject {

    constructor(x, y) {
        super().loadImg('img/background/border_left.png');
        this.width = 768;
        this.height = 768;
        this.x = x;
        this.y = y;
    }
}