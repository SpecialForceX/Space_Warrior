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
        // if (this instanceof Player || this instanceof Alien || this instanceof Boss || this instanceof Shield) {
        //     ctx.beginPath();
        //     ctx.lineWidth = '5';
        //     ctx.strokeStyle = 'blue';
        //     ctx.rect(this.x, this.y, this.width, this.height);
        //     ctx.stroke();

        //     // Zeichne das rote Rechteck für den Kollisionsbereich mit den Offsets
        //     const collisionX = this.x + this.offsetLeft;
        //     const collisionY = this.y + this.offsetTop;
        //     const collisionWidth = this.width - this.offsetLeft - this.offsetRight;
        //     const collisionHeight = this.height - this.offsetTop - this.offsetBottom;

        //     ctx.beginPath();
        //     ctx.lineWidth = '2'; // Optional: dünnere Linie für das Kollisionsrechteck
        //     ctx.strokeStyle = 'red';
        //     ctx.rect(collisionX, collisionY, collisionWidth, collisionHeight);
        //     ctx.stroke();
        // }
    }

    isDead() {
        return this.life <= 0;
    }
}