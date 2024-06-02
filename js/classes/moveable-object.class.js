class MovableObject {
    x = 100;
    y = 640;
    img;
    height = 76;
    width = 64;
    imgCache = {};
    currentImg = 0;
    speed = 0.5;
    mirrored = false;
    speedY = 0;
    acceleration = 0.25;

    applyGravity() {
        setInterval(() => {
            if(this.isInAir() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 60)
    }

    isInAir() {
        // console.log(this.y);
        return this.y < 637.8;
    }

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

    playAnimation(images) {
        let i = this.currentImg % this.IMAGES_WALKING.length;
            let path = images[i];
            this.img = this.imgCache[path];
            this.currentImg++;
    }
}