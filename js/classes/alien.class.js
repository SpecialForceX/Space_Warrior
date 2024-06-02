class Alien extends MovableObject {
    width = 64;
    height = 64;

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
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/5)
    }
}