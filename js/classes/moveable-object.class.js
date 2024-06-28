class MovableObject extends DrawableObject {
    speed = 0.5;
    mirrored = false;
    speedY = 0;
    acceleration = 0.25;
    life = 100;
    lastHit = 0;
    isAlive = true;
    rotationAngle = 0;
    offsetY = 9;
    offsetTop = 0;
    offsetBottom = 0;
    offsetLeft = 0;
    offsetRight = 0;

    /**
    * Creates duplicate life objects (status bars) for the movable object.
    * @param {number} life - Number of life objects to duplicate.
    * @returns {Array} - Array of StatusBar objects representing life bars.
    */
    duplicateLifeObjects(life) {
        let duplicateLifeObjectsArray = [];
        let pos_x = 20;
        let pos_y = 20;
        for (let i = 0; i < life; i++) {
            duplicateLifeObjectsArray.push(new StatusBar(pos_x, pos_y, 64, 64, 'player'));
            pos_x += 30;
        }
        return duplicateLifeObjectsArray;
    }

    /**
    * Applies gravity to the movable object, making it fall when not standing on a platform.
    */
    applyGravity() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.isAlive) {
                if (this.isInAir() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                    this.y = Math.round(this.y);
                } else {
                    this.speedY = 0;
                }
            }
        }, 1000 / 60);
    }
    
    /**
    * Checks if the object is in the air (not standing on any platform).
    * @returns {boolean} - True if the object is in the air, false otherwise.
    */
    isInAir() {
        for (let platform of world.level.platforms) {
            if (this.isStandingOn(platform)) {
                return false;
            }
        }
        return Math.round(this.y) < 635;
    }
    
    /**
    * Checks if the object is standing on a given platform.
    * @param {Platform} platform - The platform object to check against.
    * @returns {boolean} - True if the object is standing on the platform, false otherwise.
    */
    isStandingOn(platform) {
        const objFeetY = this.y + this.height - this.offsetY;
        return this.x + this.width > platform.x && this.x < platform.x + platform.width &&
               objFeetY >= platform.y && objFeetY <= platform.y + 16; 
    }

    /**
    * Rotates the image of the object around its center.
    * @param {CanvasRenderingContext2D} ctx - The rendering context to draw the rotated image.
    */
    rotateImage(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); 
        ctx.rotate(this.rotationAngle * Math.PI / 180); 
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height); 
        ctx.restore();
    }

    /**
    * Checks if this object is colliding with another object.
    * @param {MovableObject} obj - The other movable object to check collision against.
    * @returns {boolean} - True if there is a collision, false otherwise.
    */
    isColliding(obj) {
        return  (this.x + this.width - this.offsetRight) >= (obj.x + obj.offsetLeft) && 
        (this.x + this.offsetLeft) <= (obj.x + obj.width - obj.offsetRight) && 
        (this.y + this.height - this.offsetBottom) >= (obj.y + obj.offsetTop) && 
        (this.y + this.offsetTop) <= (obj.y + obj.height - obj.offsetBottom); 
    }

    /**
    * Reduces the life of the object when hit and updates its state.
    */
    hit() {
        this.life -= 1;
        if (this.life <= 0) {
            this.life = 0;
            this.isAlive = false;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
    * Checks if the object is currently in a hurt state (recently hit).
    * @returns {boolean} - True if the object is in a hurt state, false otherwise.
    */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
    * Moves the object to the right.
    */
    moveRight() {
        if (this.isAlive) {
            this.x += this.speed; 
        }
    };

    /**
    * Moves the object to the left.
    */
    moveLeft() {
        if (this.isAlive) {
            this.x -= this.speed;
        }
    }

    /**
    * Makes the object jump by setting its vertical speed.
    */
    jump() {
        this.speedY = 12;
    }

    /**
    * Updates the rotation angle of the object for animation.
    */
    updateRotation() {
        this.rotationAngle += 5;
        if (this.rotationAngle >= 360) {
            this.rotationAngle = 0;
        }
    }
}