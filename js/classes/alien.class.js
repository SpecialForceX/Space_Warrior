class Alien extends MovableObject {

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
            let i = this.currentImg % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imgCache[path];
            this.currentImg++;
        }, 1000/5)
    }
}