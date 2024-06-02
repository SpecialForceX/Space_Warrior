class Player extends MovableObject {

    IMAGES_WALKING = [
        '/img/player/walk/player_walk_1.png',
        '/img/player/walk/player_walk_2.png'
    ]

    IMAGES_JUMPING = [
        '/img/player/jump/jump_1.png',
        '/img/player/jump/jump_2.png',
        '/img/player/jump/jump_3.png'
    ]

    IMAGES_IDLE = [
        '/img/player/idle/player_idle_1.png',
        '/img/player/idle/player_idle_2.png'
    ]

    world;
    speed = 4;
    y = 550;

    constructor() {
        super().loadImg('/img/player/walk/player_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.loadImgs(this.IMAGES_JUMPING);
        this.loadImgs(this.IMAGES_IDLE);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.mirrored = false;
            }

            if (this.world.keyboard.LEFT && this.x > -2048) {
                this.x -= this.speed;
                this.mirrored = true;
            }

            if (this.world.keyboard.SPACE && !this.isInAir()) {
                this.speedY = 14;
            }
            this.world.camera_x = -this.x + 200;
        }, 1000 / 60)

        setInterval(() => {
            if (this.isInAir()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }

            
        }, 1000 / 7)


    }

    jump() {

    };
}