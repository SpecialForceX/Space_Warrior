class Alien extends MovableObject {
    width = 64;
    height = 64;
    life = 2;

    IMAGES_WALKING = [
        '/img/enemys/alien1/alien_walk_1.png',
        '/img/enemys/alien1/alien_walk_2.png',
        '/img/enemys/alien1/alien_walk_3.png'
    ]

    IMAGES_HURT = [
        'img/enemys/alien1/hurt/alien1_hurt_2.png',
        'img/enemys/alien1/hurt/alien1_hurt_1.png',
        'img/enemys/alien1/hurt/alien1_hurt_3.png'
    ]

    constructor(x, y) {
        super().loadImg('/img/enemys/alien1/alien_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.loadImgs(this.IMAGES_HURT);
        this.x = x;
        this.y = y;
        this.speed = 0.4 + Math.random() * 0.25;

        this.animate();
        this.animateRotation();
        this.enableGravityFunction();

        this.offsetRight = 10;
        this.offsetLeft = 10;
        this.offsetTop = 10;
        this.offsetBottom = 0;
    }


    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/60)
        

        setInterval(() => {
            if (this.isDead()) {
                this.isAlive = false;
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000/7)

        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
        }, 1000/15)

    }

    animateRotation() {
        setInterval(() => {
            if (this.isDead()) {
                this.updateRotation();
                this.y -= 2;
            }
        }, 1000 / 30);
    }

    enableGravityFunction() {
        setTimeout(() => {
            this.applyGravity();
        }, 100);
    }

}