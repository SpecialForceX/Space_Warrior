class Player extends MovableObject {

    IMAGES_WALKING = [
        'img/player/walk/player_walk_1.png',
        'img/player/walk/player_walk_2.png'
    ];

    IMAGES_JUMPING = [
        'img/player/jump/jump_1.png',
        'img/player/jump/jump_2.png',
        'img/player/jump/jump_3.png'
    ];

    IMAGES_IDLE = [
        'img/player/idle/player_idle_1.png',
        'img/player/idle/player_idle_2.png'
    ];

    IMAGES_DEAD = [
        'img/player/dead/player_dead_1.png',
        'img/player/dead/player_dead_2.png'
    ];

    IMAGES_HURT = [
        'img/player/hurt/player_hurt_1.png',
        'img/player/hurt/player_hurt_2.png'
    ];

    IMAGES_SHOOT = [
        'img/player/shoot/player_shoot_1.png',
        'img/player/shoot/player_shoot_2.png',
        'img/player/shoot/player_shoot_3.png',
        'img/player/shoot/player_shoot_4.png'
    ];

    IMAGES_SLEEP = [
        'img/player/sleep/sleep_1.png',
        'img/player/sleep/sleep_1.png',
        'img/player/sleep/sleep_1.png',
        'img/player/sleep/sleep_2.png',
        'img/player/sleep/sleep_2.png',
        'img/player/sleep/sleep_1.png',
        'img/player/sleep/sleep_1.png',
        'img/player/sleep/sleep_1.png'
    ];

    speed = 4;
    y = 550;
    statusBar;
    life = 3;
    sleepCounter = 0;
    deathSoundPlayed = false;

    constructor() {
        super().loadImg('img/player/walk/player_walk_1.png');
        this.loadImgs(this.IMAGES_WALKING);
        this.loadImgs(this.IMAGES_JUMPING);
        this.loadImgs(this.IMAGES_IDLE);
        this.loadImgs(this.IMAGES_DEAD);
        this.loadImgs(this.IMAGES_HURT);
        this.loadImgs(this.IMAGES_SHOOT);
        this.loadImgs(this.IMAGES_SLEEP);
        this.applyGravity();
        this.animate();
        this.animateRotation();
        this.statusBar = this.duplicateLifeObjects(this.life);
        this.updateLife();
        this.sleep();
        this.offsetRight = 28;
        this.offsetLeft = 10;
        this.offsetTop = 10;
        this.offsetBottom = 10;
        this.jumpSound = new Audio('audio/sounds/jump2.ogg');
        this.deathSound = new Audio('audio/sounds/death.ogg');
    }

    /**
    * Updates the status bar based on current life points.
    */
    updateLife() {
        this.statusBar = this.duplicateLifeObjects(this.life);
    }

    /**
    * Plays the jump sound effect.
    */
    playJumpSound() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play();
    }

    /**
    * Plays the death sound effect if it hasn't been played yet.
    */
    playDeathSound() {
        if (!this.deathSoundPlayed) {
            this.deathSound.currentTime = 0;
            this.deathSound.play();
            this.deathSoundPlayed = true;
        }
    }

    /**
    * Sets up the main animation loops for movement, actions, and shooting.
    */
    animate() {
        this.setupMovementAnimation();
        this.setupActionAnimation();
        this.setupShootAnimation();
    }
    
    /**
    * Sets up the animation loop for player movement.
    */
    setupMovementAnimation() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.isAlive) {
                this.moveRight();
                this.mirrored = false;
            }
            if (this.world.keyboard.LEFT && this.x > this.world.level.level_end_x_left && this.isAlive) {
                this.moveLeft();
                this.mirrored = true;
            }
            if (this.world.keyboard.SPACE && !this.isInAir() && this.isAlive) {
                this.jump();
                this.playJumpSound();
            }
            if (!world.cameraFixed) {
                this.world.camera_x = -this.x + 400;
            }
        }, 1000 / 60);
    }
    
    /**
    * Sets up the animation loop for player actions (e.g., idle, walking, jumping, hurting, sleeping).
    */
    setupActionAnimation() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.isDead()) {
                this.handleDeadAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isInAir()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (this.sleepCounter > 10) {
                this.playAnimation(this.IMAGES_SLEEP);
            } else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 1000 / 7);
    }
    
    /**
    * Sets up the animation loop for shooting.
    */
    setupShootAnimation() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.world.isShoot) {
                this.playAnimation(this.IMAGES_SHOOT);
            }
        }, 1000 / 30);
    }
    
    /**
    * Handles the animation and actions when the player character dies.
    */
    handleDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        this.isAlive = false;
        this.playDeathSound();
        setTimeout(() => {
            location.reload();
        }, 5000);
    }
    
    /**
    * Sets up the rotation animation loop when the player character dies.
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

    /**
    * Sets up the sleep counter to detect when the player character is idle.
    */
    sleep() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE && !this.world.keyboard.ENTER) {
                this.sleepCounter += 1;
            } else {
                this.sleepCounter = 0;
            }
        }, 1000 / 2);
    }
}
