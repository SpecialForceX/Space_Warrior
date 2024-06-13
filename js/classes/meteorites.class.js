class Meteorites extends MovableObject {

    IMAGES_FLY = [
        'img/meteorites/meteorit_1.png',
        'img/meteorites/meteorit_2.png',
        'img/meteorites/meteorit_3.png'
    ]

    IMAGES_EXPLODED = [
        'img/meteorites/meteorite_explosion_1.png',
        'img/meteorites/meteorite_explosion_2.png',
        'img/meteorites/meteorite_explosion_3.png',
        'img/meteorites/meteorite_explosion_4.png',
        'img/meteorites/meteorite_explosion_5.png',
        'img/meteorites/meteorite_explosion_6.png',
        'img/meteorites/meteorite_explosion_7.png',
        'img/meteorites/meteorite_explosion_8.png',
        'img/meteorites/meteorite_explosion_9.png'
    ]

    width = 64;
    height = 64;
    speedX = -2; // Geschwindigkeit nach links
    speedY = 3; // Geschwindigkeit nach unten
    isExploding = false;

    constructor(x, y) {
        super().loadImg('img/meteorites/meteorit_1.png');
        this.x = x;
        this.y = y;
        this.loadImgs(this.IMAGES_FLY);
        this.loadImgs(this.IMAGES_EXPLODED);
        this.animate();
        this.offsetRight = 15;
        this.offsetLeft = 15;
        this.offsetTop = 5;
        this.offsetBottom = 20;
    }

    animate() {
        setInterval(() => {
            if (!this.isExploding) {
                this.playAnimation(this.IMAGES_FLY);
            }
        }, 1000 / 10)
    }

    move() {
        if (!gameStarted || gamePaused) return; 
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.isTouchingGround() || this.isTouchingPlayer()) {
            this.speedX = 0;
            this.speedY = 0;
            this.isExploding = true;
            this.exploding();
        }
    }

    isTouchingGround() {
        return Math.round(this.y) > 670; // Beispielwert für Bodenniveau, anpassen entsprechend Ihrer Spielwelt
    }


    isTouchingPlayer() {
        if (this.isColliding(world.player) && !world.player.isHurt()) {
            world.player.hit();
            console.log('Collision with Player, life:', world.player.life);
            world.player.statusBar = [];
            world.player.updateLife();
            return true;
        }
        return false;
    }

    remove() {
        const index = world.level.meteorites.indexOf(this);
        if (index > -1) {
            world.level.meteorites.splice(index, 1);
        }
    }

    exploding() {
        let explosionIndex = 0;
        const explosionInterval = setInterval(() => {
            if (explosionIndex < this.IMAGES_EXPLODED.length) {
                this.img = this.imgCache[this.IMAGES_EXPLODED[explosionIndex]];
                explosionIndex++;
            } else {
                clearInterval(explosionInterval);
                this.remove(); // Entferne den Meteorit nach der Explosion
            }
        }, 1000 / 30); // Zeitintervall zwischen den Bildern der Explosion
    }
    
}