class ThrowableObject extends MovableObject {
    height = 36
    width = 28
    isHit = false;
    exploding = false;

    IMAGES_EXPLODE = [
        '/img/player/bullet/explosion_1.png',
        '/img/player/bullet/explosion_2.png',
        '/img/player/bullet/explosion_3.png',
        '/img/player/bullet/explosion_4.png',
        '/img/player/bullet/explosion_5.png'
    ]

    constructor(x, y, direction) {
        super().loadImg('/img/player/bullet/bullet.png');
        this.loadImgs(this.IMAGES_EXPLODE);
        this.x = x;
        this.y = y;
        this.shoot();
        this.direction = direction;
    }

    shoot() {
        this.movementInterval = setInterval(() => {
            if (!this.exploding) { // Bewege die Bullet nur, wenn sie nicht explodiert
                if(this.direction === 'left') {
                    this.x -= 5;
                } else {
                    this.x += 5;
                }
            }
        }, 1000/60);
    }

    hit() {
        this.isHit = true;
        this.exploding = true;
        clearInterval(this.movementInterval); // Stoppe die Bewegung der Bullet
        this.explode();
    }

    explode() {
        let explosionFrame = 0;
        const explosionInterval = setInterval(() => {
            if (explosionFrame < this.IMAGES_EXPLODE.length) {
                this.img = this.imgCache[this.IMAGES_EXPLODE[explosionFrame]];
                explosionFrame++;
            } else {
                clearInterval(explosionInterval);
                this.exploding = false; // Beende die Explosion
                this.markForRemoval(); // Markiere die Bullet zur Entfernung
            }
        }, 1000 / 20);
    }

    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}