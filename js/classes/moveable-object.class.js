class MovableObject {
    x = 100;
    y = 500;
    img;
    height = 64;
    width = 64;

    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log('move right');
    };

    moveLeft() {

    }
}