class MovableObject {
    x = 100;
    y = 100;
    img;
    height = 16;
    width = 16;

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