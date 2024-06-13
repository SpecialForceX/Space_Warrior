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

    startAlien2() {
        setTimeout(() => {
            this.animate();  
        }, 1000);
    }

    animate() {
        const playAnimationWithRandomInterval = () => {
            if (this.isDead()) {
                this.isAlive = false;
            } else if (this.isAlive) {
                this.playAnimationOnce(this.IMAGES_SHOOT);
            }

            // Nächstes zufälliges Intervall zwischen 2 und 5 Sekunden
            const randomInterval = Math.random() * 3000 + 2000;
            setTimeout(playAnimationWithRandomInterval, randomInterval);
        };

        // Starten der Animation
        playAnimationWithRandomInterval();

        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
        }, 1000 / 15);
    }

    // Methode zum einmaligen Abspielen der Animation
    playAnimationOnce(images) {
        let currentImageIndex = 0;
        const interval = setInterval(() => {
            if (currentImageIndex < images.length) {
                this.img = this.imgCache[images[currentImageIndex]];
                currentImageIndex++;
                if (!this.rocketShoot) {
                    this.rocketShoot = true;
                    setTimeout(() => {
                        this.shootRocket(); // Rakete abfeuern
                    }, 500);
                }

            } else {
                clearInterval(interval);
                this.rocketShoot = false;
            }
        }, 1000 / 7); // Geschwindigkeit der einzelnen Frames (7 Bilder pro Sekunde)
    }

    shootRocket() {
        const rocket = new Rocket(this.x - 75, this.y + 95); // Erstelle eine neue Rakete
        world.level.rockets.push(rocket); // Füge die Rakete zum Level hinzu
    }

    animateRotation() {
        setInterval(() => {
            if (this.isDead()) {
                this.updateRotation();
                this.y -= 2;
            }
        }, 1000 / 30);
    }
}