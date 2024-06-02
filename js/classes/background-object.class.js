class BackgroundObject extends MovableObject {

    width = 1024;
    height = 768;
    constructor(imagePath, x) {
        super().loadImg(imagePath);
        this.x = x;
        this.y = 768 - this.height;
    }
}