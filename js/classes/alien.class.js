class Alien extends MovableObject {
    width = 64;
    height = 64;
    life = 2;

    IMAGES_WALKING = [
        '/img/enemys/alien1/alien_walk_1.png',
        '/img/enemys/alien1/alien_walk_2.png',
        '/img/enemys/alien1/alien_walk_3.png'
    ]

    constructor() {
        super().loadImg('/img/enemys/alien1/alien_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;

        this.speed = 0.4 + Math.random() * 0.25;

        this.animate();
        this.animateRotation();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/60)
        

        setInterval(() => {
            if (this.isDead()) {
                // this.playAnimation(this.IMAGES_DEAD);
                this.isAlive = false;
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000/5)
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