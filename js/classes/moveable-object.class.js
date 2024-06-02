class MovableObject {
    x = 100;
    y = 640;
    img;
    height = 64;
    width = 64;
    imgCache = {};
    currentImg = 0;
    speed = 0.5;
    mirrored = false;

    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * 
     * @param {Array} arr - ['img1.png', 'img2.png', ...]
     */
    loadImgs(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }

    moveRight() {
        console.log('move right');
    };

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000/60)
    }
}