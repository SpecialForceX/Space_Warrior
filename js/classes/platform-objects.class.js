class Platform extends MovableObject{

    width = 320;
    height = 256;
    constructor(x, y, width, height, imgPath) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImg(imgPath);
    }
}