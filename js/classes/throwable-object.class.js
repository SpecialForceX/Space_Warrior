class ThrowableObject extends MovableObject {
    height = 36
    width = 28
    isHit = false;
    exploding = false;

    IMAGES_EXPLODE = [
        'img/player/bullet/explosion_1.png',
        'img/player/bullet/explosion_2.png',
        'img/player/bullet/explosion_3.png',
        'img/player/bullet/explosion_4.png',
        'img/player/bullet/explosion_5.png'
    ]

    constructor(x, y, direction) {
        super().loadImg('img/player/bullet/bullet.png');
        this.loadImgs(this.IMAGES_EXPLODE);
        this.x = x;
        this.y = y;
        this.shoot();
        this.direction = direction;
    }

    /**
    * Initiates the movement of the throwable object.
    */
    shoot() {
        this.movementInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (!this.exploding) { 
                if(this.direction === 'left') {
                    this.x -= 5;
                } else {
                    this.x += 5;
                }
            }
        }, 1000/60);
    }

    /**
    * Handles what happens when the object is hit.
    * Clears movement interval, initiates explosion sequence.
    */
    hit() {
        this.isHit = true;
        this.exploding = true;
        clearInterval(this.movementInterval);
        this.explode();
    }

    /**
    * Initiates the explosion sequence.
    * Displays explosion frames sequentially.
    * Clears exploding flag and marks for removal after animation.
    */
    explode() {
        let explosionFrame = 0;
        const explosionInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (explosionFrame < this.IMAGES_EXPLODE.length) {
                this.img = this.imgCache[this.IMAGES_EXPLODE[explosionFrame]];
                explosionFrame++;
            } else {
                clearInterval(explosionInterval);
                this.exploding = false;
                this.markForRemoval();
            }
        }, 1000 / 20);
    }

    /**
    * Marks the object for removal from the game.
    */
    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}