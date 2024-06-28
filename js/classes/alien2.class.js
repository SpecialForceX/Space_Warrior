class Alien2 extends MovableObject {

    IMAGES_SHOOT = [
        'img/enemys/alien2/Alien2_1.png',
        'img/enemys/alien2/Alien2_2.png',
        'img/enemys/alien2/Alien2_3.png',
        'img/enemys/alien2/Alien2_4.png',
        'img/enemys/alien2/Alien2_5.png',
        'img/enemys/alien2/Alien2_6.png',
        'img/enemys/alien2/Alien2_7.png',
        'img/enemys/alien2/Alien2_8.png',
        'img/enemys/alien2/Alien2_9.png',
        'img/enemys/alien2/Alien2_10.png',
        'img/enemys/alien2/Alien2_11.png',
        'img/enemys/alien2/Alien2_1.png'
    ]

    IMAGES_HURT = [
        'img/enemys/alien2/alien2_hurt_1.png',
        'img/enemys/alien2/alien2_hurt_2.png'
    ]

    rocketShoot = false;
    life = 3;

    constructor(x, y) {
        super().loadImg('img/enemys/alien2/Alien2_1.png');
        this.loadImgs(this.IMAGES_SHOOT);
        this.loadImgs(this.IMAGES_HURT);
        this.x = x;
        this.y = y;
        this.width = 92;
        this.height = 144;
        this.startAlien2();
        this.animateRotation();
    }

    /**
     * Starts the animations for the alien.
     * Sets up periodic shooting animation and hurt animation.
     */
    startAlien2() {
        setTimeout(() => {
            this.animate();  
        }, 1000);
    }

    /**
     * Sets up periodic animations for the alien.
     * Plays shooting animation and hurt animation based on game state.
     */
    animate() {
        if (!this.isAlive || !gameStarted || gamePaused) return;
        const playAnimationWithRandomInterval = () => {
            if (!gameStarted || gamePaused) return;
            if (this.isDead()) {
                this.isAlive = false;
            } else if (this.isAlive) {
                this.playAnimationOnce(this.IMAGES_SHOOT);
            }
            const randomInterval = Math.random() * 3000 + 2000;
            setTimeout(playAnimationWithRandomInterval, randomInterval);
        };
        playAnimationWithRandomInterval();
        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
        }, 1000 / 15);
    }

     /**
     * Plays an animation once using provided images.
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimationOnce(images) {
        let currentImageIndex = 0;
        const interval = setInterval(() => {
            if (currentImageIndex < images.length) {
                this.img = this.imgCache[images[currentImageIndex]];
                currentImageIndex++;
                if (!this.rocketShoot) {
                    this.rocketShoot = true;
                    setTimeout(() => {
                        this.shootRocket();
                    }, 500);
                }
            } else {
                clearInterval(interval);
                this.rocketShoot = false;
            }
        }, 1000 / 7);
    }

    /**
     * Fires a rocket from the alien.
     * Creates a new Rocket object and adds it to the game level.
     */
    shootRocket() {
        if (!gameStarted || gamePaused) return;
        if (world.level.enemies.length > 0) {
            const rocket = new Rocket(this.x - 75, this.y + 95);
            world.level.rockets.push(rocket);
        }
    }

    /**
     * Sets up periodic animation for the alien's rotation when dead.
     * Moves the alien upward and updates rotation if dead.
     */
    animateRotation() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.isDead()) {
                this.updateRotation();
                this.y -= 2;
            }
        }, 1000 / 30);
    }
}