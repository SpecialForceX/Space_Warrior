class Player extends MovableObject {

    IMAGES_WALKING = [
        '/img/player/walk/player_walk_1.png',
        '/img/player/walk/player_walk_2.png'
    ]

    world;
    speed = 4;


    constructor() {
        super().loadImg('/img/player/walk/player_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);

        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.mirrored = false;
            }

            if (this.world.keyboard.LEFT) {
                this.x -= this.speed;
                this.mirrored = true;
            }
            this.world.camera_x = -this.x;
        }, 1000 / 60)

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let i = this.currentImg % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imgCache[path];
                this.currentImg++;
            }
        }, 1000 / 7)


    }

    jump() {

    };
}