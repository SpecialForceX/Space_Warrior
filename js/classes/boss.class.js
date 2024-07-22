class Boss extends MovableObject {
    IMAGES_INTRO = [
        'img/enemys/boss/boss_intro_1.png',
        'img/enemys/boss/boss_intro_2.png',
        'img/enemys/boss/boss_intro_3.png',
        'img/enemys/boss/boss_intro_4.png',
        'img/enemys/boss/boss_intro_5.png',
        'img/enemys/boss/boss_intro_6.png'
    ];

    IMAGES_BEAM = [
        'img/enemys/boss/energy_beam/energy_beam_1.png',
        'img/enemys/boss/energy_beam/energy_beam_2.png',
        'img/enemys/boss/energy_beam/energy_beam_3.png'
    ];

    IMAGES_DIED = [
        'img/enemys/boss/explosion/boss_explosion_1.png',
        'img/enemys/boss/explosion/boss_explosion_2.png',
        'img/enemys/boss/explosion/boss_explosion_3.png',
        'img/enemys/boss/explosion/boss_explosion_4.png',
        'img/enemys/boss/explosion/boss_explosion_5.png',
        'img/enemys/boss/explosion/boss_explosion_6.png',
        'img/enemys/boss/explosion/boss_explosion_7.png',
        'img/enemys/boss/explosion/boss_explosion_8.png',
        'img/enemys/boss/explosion/boss_explosion_9.png'
    ];

    introDone = false;
    bossRoutine = false;
    speed = 2;
    increasedSpeed = 4;
    state = 'moving';
    moveDuration = 10000;
    startTime;
    targetX = 3650;
    targetY = 200;
    targetBeamX = 4050;
    targetBeamY = 310;
    randomTargetX;
    randomTargetY;
    isAttacking = false;
    energyBeamOn = false;
    isAttackingEnergyBeam = false;
    meteoriteAttackCounter = 15;
    alienDropping = false;
    isAttackingAlienDrop = false;
    alienDropCounter = 0;
    alienDropMax = 6;
    life = 5;
    isBeamProtectionSet = false;
    ufoHoverSound;

    constructor(x, y, width, height) {
        super().loadImg('img/enemys/boss/boss_intro_1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES_INTRO);
        this.loadImgs(this.IMAGES_BEAM);
        this.loadImgs(this.IMAGES_DIED);
        this.animate();
        this.startIntro();
        this.bossRush();
        this.offsetRight = 20;
        this.offsetLeft = 20;
        this.offsetTop = 40;
        this.offsetBottom = 270;

        this.winSound = new Audio('audio/sounds/win.ogg');
        this.ufoHoverSound = new Audio('audio/sounds/ufo_hover.ogg');
        this.ufoHoverSound.volume = 0.01;
        this.ufoHoverSound.loop = true;

        this.playUfoHoverSound();

        this.winSoundPlayCount = 0;

        this.winSound.addEventListener('ended', () => {
            this.winSoundPlayCount++;
            if (this.winSoundPlayCount < 3 && !this.isAlive) {
                this.winSound.play();
            }
        });
    }

    /**
    * Executes the boss's animation based on its current state.
    * Called every 1/10 second as long as the game is running and not paused.
    */
    animate() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.energyBeamOn && this.isAlive) {
                this.playAnimation(this.IMAGES_BEAM);
            } else if (!this.isAlive) {
                this.playAnimation(this.IMAGES_DIED);
                this.playWinSound();
            } else {
                this.playAnimation(this.IMAGES_INTRO);
            }
        }, 1000 / 10);
    }

    /**
    * Starts the boss's intro animation, moving it upward until it reaches the target height.
    * Once the intro animation is complete, it sets the boss routine flag and places a shield.
    */
    startIntro() {
        const introInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (!this.introDone && this.y > 200) {
                this.y -= 1;
            } else {
                this.introDone = true;
                this.bossRoutine = true;
                world.level.shield.push(new Shield(3650, 800, 435, 230));
                clearInterval(introInterval);
                this.startBossRoutine();
            }
        }, 1000 / 40);
    }

    /**
    * Starts the boss's routine, which manages its movements and attacks.
    * The routine is started when the boss is active in the game and not paused.
    */
    startBossRoutine() {
        if (this.bossRoutine) {
            this.startTime = Date.now();
            this.setRandomTarget();
            setInterval(() => {
                if (!gameStarted || gamePaused) return;
                this.update();
            }, 1000 / 60);
        }
    }

    /**
    * Sets a random target for the boss on the horizontal and vertical axes.
    * The targets are in the range between 3100-4000 and 150-400.
    */
    setRandomTarget() {
        this.randomTargetX = Math.random() * (4000 - 3100) + 3100;
        this.randomTargetY = Math.random() * (400 - 150) + 150;
    }

    /**
    * Updates the boss's state based on its current condition.
    * Moves the boss to a random target or a specified target point, depending on the state.
    */
    update() {
        const currentTime = Date.now();
        switch (this.state) {
            case 'moving':
                this.moveTowardsRandomTarget();
                if (currentTime - this.startTime >= this.moveDuration) {
                    this.state = 'returning';
                }
                break;

            case 'returning':
                this.moveToTarget(this.targetX, this.targetY);
                break;

            case 'idle':
                break;
        }
    }

    /**
    * Moves the boss towards a randomly set target if it is alive.
    * When the boss reaches the target, a new random target is set unless it is performing an alien drop attack.
    */
    moveTowardsRandomTarget() {
        if (this.isAlive) {
            if (this.x < this.randomTargetX) {
                this.x += this.speed;
            } else if (this.x > this.randomTargetX) {
                this.x -= this.speed;
            }

            if (this.y < this.randomTargetY) {
                this.y += this.speed;
            } else if (this.y > this.randomTargetY) {
                this.y -= this.speed;
            }

            if (Math.abs(this.x - this.randomTargetX) < this.speed && Math.abs(this.y - this.randomTargetY) < this.speed) {
                if (!this.isAttackingAlienDrop) {
                    this.setRandomTarget();
                }
            }
            world.level.shield.forEach(shield => shield.updatePositionShield());
        }
    }

    /**
    * Moves the boss towards the specified target point if it is alive.
    * When the boss reaches the target, it switches to the 'idle' state and starts attacking.
    * @param {number} targetX - The X coordinate of the target point.
    * @param {number} targetY - The Y coordinate of the target point.
    */
    moveToTarget(targetX, targetY) {
        if (this.isAlive) {
            if (this.x < targetX) {
                this.x += this.speed;
            } else if (this.x > targetX) {
                this.x -= this.speed;
            }

            if (this.y < targetY) {
                this.y += this.speed;
            } else if (this.y > targetY) {
                this.y -= this.speed;
            }

            if (Math.abs(this.x - targetX) < this.speed && Math.abs(this.y - targetY) < this.speed) {
                this.state = 'idle';
                this.isAttacking = true;
                this.onReachTarget();
            }
            world.level.shield.forEach(shield => shield.updatePositionShield());
        }
    }

    /**
    * Called when the boss reaches the target point.
    * Starts the boss's attack.
    */
    onReachTarget() {
        this.startAttacking();
    }

    /**
    * Starts a random attack by the boss.
    * Selects a random attack type and executes it.
    */
    startAttacking() {
        const attackType = Math.floor(Math.random() * 3);
        this.executeAttack(attackType);
    }

    /**
    * Executes the attack according to the specified type.
    * @param {number} attackType - The type of attack (0 for Energy Beam, 1 for Meteor Shower, 2 for Alien Drop).
    */
    executeAttack(attackType) {
        switch (attackType) {
            case 0:
                this.attackType1();
                break;
            case 1:
                this.attackType2();
                break;
            case 2:
                this.attackType3();
                break;
        }
    }

    /**
    * Plays the UFO hover sound.
    * Checks the game status and the boss's life status to play or pause the sound accordingly.
    */
    playUfoHoverSound() {
        if (!world.muted) {
            setInterval(() => {
                if (!gameStarted || gamePaused) return;
    
                if (this.life > 0 && this.isAlive) {
                    if (this.ufoHoverSound.paused) { 
                        this.ufoHoverSound.play();
                        this.ufoHoverSound.volume = 0.01;
                    }
                } else {
                    this.ufoHoverSound.pause();
                }
            }, 1000 / 60); 
        }
    }

    /**
    * Plays the victory sound.
    * Checks if the sound is paused and if it has been played less than three times.
    * Resets the start time of the sound to the beginning and plays it.
    */
    playWinSound() {
        if (!world.muted) {
            if (this.winSound.paused && this.winSoundPlayCount < 3) {
                this.winSound.currentTime = 0;
                this.winSound.play();
                this.winSound.volume = 0.01;
            }   
        }
    }
}