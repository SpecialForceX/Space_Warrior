class DrawableObject {
    img;
    imgCache = {};
    currentImg = 0;
    x = 100;
    y = 640;
    height = 76;
    width = 80;

    /**
    * Loads an image from the given path and assigns it to the img property.
    * @param {string} path - The path to the image file.
    */
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
    * Draws the image on the given canvas context.
    * If the object is dead, it draws a rotating image instead.
    * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
    */
    draw(ctx) {
        if (this.isDead()) {
            this.rotateImage(ctx); // Zeichne rotierendes Bild, wenn tot
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
    * Loads multiple images from the given array of paths into the imgCache.
    * @param {Array<string>} arr - Array of image paths ['img1.png', 'img2.png', ...].
    */
    loadImgs(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }

    /**
    * Checks if the object is dead based on its life property.
    * @returns {boolean} - True if the object's life is less than or equal to 0, otherwise false.
    */
    isDead() {
        return this.life <= 0;
    }

    /**
    * Plays an animation by cycling through the given images.
    * Updates the img property with the current image from the imgCache.
    * @param {Array<string>} images - Array of image paths for the animation.
    */
    playAnimation(images) {
        let i = this.currentImg % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImg++;
    }
}