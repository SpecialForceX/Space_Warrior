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

    IMAGES_DEAD = [
        '/img/player/dead/player_dead_1.png',
        '/img/player/dead/player_dead_2.png'
    ]

    IMAGES_HURT = [
        '/img/player/hurt/player_hurt_1.png',
        '/img/player/hurt/player_hurt_2.png'
    ]

    world;
    speed = 4;
    y = 550;
    statusBar;
    life = 4;

    constructor() {
        super().loadImg('/img/player/walk/player_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.loadImgs(this.IMAGES_JUMPING);
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_DEAD);
        this.loadImgs(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
        this.animateRotation();
        this.statusBar = this.duplicateLifeObjects(this.life);
        this.updateLife();
    }

    updateLife() {
        this.statusBar = this.duplicateLifeObjects(this.life);
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.isAlive) {
                this.moveRight();
                this.mirrored = false;
            }

            if (this.world.keyboard.LEFT && this.x > -2048 && this.isAlive) {
                this.moveLeft();
                this.mirrored = true;
            }

            if (this.world.keyboard.SPACE && !this.isInAir() && this.isAlive) {
                this.jump();
            }
            this.world.camera_x = -this.x + 200;
        }, 1000 / 60)

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.isAlive = false;
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isInAir()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 1000 / 7)
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