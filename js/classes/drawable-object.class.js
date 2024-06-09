class DrawableObject {
    img;
    imgCache = {};
    currentImg = 0;
    x = 100;
    y = 640;
    height = 76;
    width = 80;


    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        if (this.isDead()) {
            this.rotateImage(ctx); // Zeichne rotierendes Bild, wenn tot
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
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

    drawFrame(ctx) {
        if (this instanceof Player || this instanceof Alien) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    isDead() {
        return this.life <= 0;
    }
}