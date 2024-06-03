class StatusBar extends DrawableObject {
    height = 64;
    width = 64;

    IMAGES = [
        'img/player/life/heart.png',
    ]

    constructor(x) {
        super();
        this.loadImgs(this.IMAGES);
        this.x = x;
        this.y = 50;
        this.setLife();
    }

    setLife() {
        let path = this.IMAGES[0];
        this.img = this.imgCache[path];
    }
}