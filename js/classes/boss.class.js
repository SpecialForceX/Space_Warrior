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
    * Executes Attack Type 1 (Energy Beam).
    * If the boss is alive, this function activates the Energy Beam attack.
    * The Energy Beam attack is executed periodically until isAttackingEnergyBeam is set to false.
    */
    attackType1() {
        if (this.isAlive) {
            this.isAttackingEnergyBeam = true;
            const energyBeamIntervall = setInterval(() => {
                if (!gameStarted || gamePaused) return;
                this.energyBeam();
                if (!this.isAttackingEnergyBeam) {
                    clearInterval(energyBeamIntervall);
                }
            }, 1000 / 60);
        }
    }

    /**
    * Executes Attack Type 2 (Meteor Shower).
    * If the boss is alive, it speeds up and moves to the right until it reaches the end of the screen.
    * Then it executes the Meteor Shower attack.
    */
    attackType2() {
        if (this.isAlive) {
            this.speed = 10;
            const meteoriteAttackInterval1 = setInterval(() => {
                if (!gameStarted || gamePaused) return;
                if (this.x < 5000) {
                    world.level.shield.forEach(shield => shield.updatePositionShield());
                    this.x += this.speed;
                } else {
                    this.meteoriteAttack();
                    clearInterval(meteoriteAttackInterval1);
                }
            }, 1000 / 60)
        }
    }

    /**
    * Executes Attack Type 3 (Alien Drop).
    * If the boss is alive, this function activates the Alien Drop attack.
    * The Alien Drop attack is executed until the maximum number of alien drops is reached.
    * The boss increases its speed for this attack.
    */
    attackType3() {
        if (this.isAlive) {
            this.isAttackingAlienDrop = true;
            this.alienDropCounter = 0;
            this.speed = this.increasedSpeed;
            this.alienDrop();
        }
    }

    /**
    * Ends the current attack after a delay of 5 seconds.
    * Resets the Energy Beam and the Beam Protection, changes the state to 'moving',
    * sets the start time for the next movement, and selects a new random target.
    */
    finishAttack() {
        setTimeout(() => {
            if (!gameStarted || gamePaused) return;
            this.energyBeamOn = false;
            this.isBeamProtectionSet = false;
            this.state = 'moving';
            this.startTime = Date.now();
            this.setRandomTarget();
        }, 5000);
    }

    /**
    * Executes the boss's Energy Beam attack if it is alive.
    * The boss moves to the attack position (targetBeamX, targetBeamY),
    * updates the position of the shields in the world, and activates the Energy Beam
    * once the attack position is reached.
    */
    energyBeam() {
        if (this.isAlive) {
            this.targetBeamX = 4050;
            this.targetBeamY = 310;
            world.level.shield.forEach(shield => shield.updatePositionShield());
    
            if (this.x < this.targetBeamX && !this.energyBeamOn) {
                this.moveTowardsTargetX();
            }
    
            if (this.y < this.targetBeamY && !this.energyBeamOn) {
                this.moveTowardsTargetY();
            }
    
            if (Math.abs(this.x - this.targetBeamX) < this.speed && Math.abs(this.y - this.targetBeamY) < this.speed) {
                this.arriveAtAttackPosition();
            }
    
            if (this.energyBeamOn) {
                this.activateEnergyBeam();
            }
        }
    }
    
    /**
    * Moves the boss towards the X coordinate of the attack position.
    */
    moveTowardsTargetX() {
        this.x += this.speed;
    }
    
    /**
    * Moves the boss towards the Y coordinate of the attack position.
    */
    moveTowardsTargetY() {
        this.y += this.speed;
    }
    
    /**
    * Handles the event when the boss reaches the attack position.
    * Activates the beam protection and the energy beam.
    */
    arriveAtAttackPosition() {
        this.isAttacking = false;
        this.energyBeamOn = true;
    }
    
    /**
    * Activates the Energy Beam attack and generates the beam if the beam protection is set.
    */
    activateEnergyBeam() {
        if (!this.isBeamProtectionSet) {
            this.setupBeamProtection();
        }
    
        this.adjustOffsets();
    
        world.level.beamProtection[0].x -= 2;
        this.x -= 2;
    
        if (this.x < 3200) {
            this.finishEnergyBeam();
        }
    }
    
    /**
    * Initializes the beam protection for the energy beam.
    * Adds a new instance of EnergieBeamProtection to the world and sets isBeamProtectionSet to true.
    */
    setupBeamProtection() {
        world.level.beamProtection.push(new EnergieBeamProtection(this.x + 95, this.y + 150));
        this.isBeamProtectionSet = true;
    }
    
    /**
    * Adjusts the offsets for the boss to correctly display the energy beam.
    * This method is called when the energy beam is activated.
    */
    adjustOffsets() {
        this.offsetRight = 100;
        this.offsetLeft = 100;
        this.offsetTop = 40;
        this.offsetBottom = 0;
    }
    
    /**
    * Ends the boss's energy beam.
    * Sets isAttackingEnergyBeam to false, resets the offsets, finishes the attack, and removes the beam protection from the world.
    */
    finishEnergyBeam() {
        this.isAttackingEnergyBeam = false;
        this.resetOffsets();
        this.finishAttack();
        world.level.beamProtection.splice(0, 1);
    }
    
    /**
    * Resets the boss's offsets to the default values.
    * Called to reset the offsets after the energy beam ends.
    */
    resetOffsets() {
        this.offsetRight = 20;
        this.offsetLeft = 20;
        this.offsetTop = 40;
        this.offsetBottom = 270;
    }
    
    /**
    * Starts the boss's meteorite attack.
    * Sets the meteorite attack variable and initializes the counter.
    * Starts an interval to execute the attack.
    */
    meteoriteAttack() {
        world.level.meteoriteAttack = true;
        this.meteoriteAttackCounter = 15;
        const meteoriteAttackInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
    
            this.executeMeteoriteAttack(meteoriteAttackInterval);
        }, 1000);
    }
    
    /**
    * Executes the meteorite attack.
    * Decreases the attack counter.
    * Ends the attack when the counter reaches zero.
    * @param {number} meteoriteAttackInterval - The interval for the meteorite attack.
    */
    executeMeteoriteAttack(meteoriteAttackInterval) {
        this.meteoriteAttackCounter--;
        if (this.meteoriteAttackCounter <= 0) {
            this.returnToTargetAfterAttack(meteoriteAttackInterval);
        }
    }
    
    /**
    * Returns to the target after the meteorite attack.
    * Starts an interval to move the boss back to the target.
    * Ends the attack and the return interval when the boss reaches the target.
    * @param {number} meteoriteAttackInterval - The interval for the meteorite attack.
    */
    returnToTargetAfterAttack(meteoriteAttackInterval) {
        const returnToTargetInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.x > this.targetX) {
                this.moveBackToTarget();
            } else {
                this.finishMeteoriteAttack(returnToTargetInterval, meteoriteAttackInterval);
            }
        }, 1000 / 60);
    }
    
    /**
    * Moves the boss back to the target after the meteorite attack.
    * Updates the position of the shields during the return.
    */
    moveBackToTarget() {
        world.level.shield.forEach(shield => shield.updatePositionShield());
        this.x -= this.speed;
    }
    
    /**
    * Ends the meteorite attack.
    * Performs necessary cleanup and resets the boss's speed.
    * @param {number} returnToTargetInterval - The interval for returning to the target.
    * @param {number} meteoriteAttackInterval - The interval for the meteorite attack.
    */
    finishMeteoriteAttack(returnToTargetInterval, meteoriteAttackInterval) {
        this.finishAttack();
        clearInterval(returnToTargetInterval);
        this.meteoriteAttackCounter = 0;
        world.level.meteoriteAttack = false;
        this.finishAttack();
        clearInterval(meteoriteAttackInterval);
        this.speed = 2;
    }
    
    /**
    * Starts the boss's alien drop.
    * Checks if the alien drop counter is less than the maximum.
    * Initiates the alien drop or performs necessary cleanup after the attack.
    */
    alienDrop() {
        if (this.alienDropCounter < this.alienDropMax) {
            this.initiateAlienDrop();
        } else {
            this.cleanupAfterAttack();
        }
    }
    
    /**
    * Initiates the boss's alien drop.
    * Sets a random target and starts an interval to move towards it.
    * Checks if the target is reached, then drops an alien and repeats the process.
    */
    initiateAlienDrop() {
        this.setRandomTarget();
        const moveInterval = setInterval(() => {
            if (!gameStarted || gamePaused) return;
            this.moveTowardsRandomTarget();
            if (this.hasReachedTarget()) {
                this.dropAlienAndRepeat(moveInterval);
            }
        }, 1000 / 60);
    }
    
    /**
    * Checks if the boss has reached the random target.
    * @returns {boolean} - Returns true if the target is reached, otherwise false.
    */
    hasReachedTarget() {
        return Math.abs(this.x - this.randomTargetX) < this.speed && Math.abs(this.y - this.randomTargetY) < this.speed;
    }
    
    /**
    * Drops an alien, increases the counter, and starts the alien drop sequence again.
    * @param {number} moveInterval - The interval for moving to the random target.
    */
    dropAlienAndRepeat(moveInterval) {
        clearInterval(moveInterval);
        world.level.enemies.push(new Alien(this.x + 150, this.y + 150));
        this.alienDropCounter++;
        setTimeout(() => {
            this.alienDrop();
        }, 1000);
    }
    
    /**
    * Performs necessary cleanup after the alien drop.
    * Ends the attack state, resets the alien drop variable, and restores the boss's speed.
    */
    cleanupAfterAttack() {
        this.finishAttack();
        this.isAttackingAlienDrop = false;
        this.speed = 2;
    }
    
    /**
    * Starts an interval for the "boss rush" mode.
    * Increases the boss's speed when its health drops below 2.
    */
    bossRush() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.life < 2) {
                this.speed = 3;
            }
        }, 1000 / 60);
    }

    /**
    * Plays the UFO hover sound.
    * Checks the game status and the boss's life status to play or pause the sound accordingly.
    */
    playUfoHoverSound() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;

            if (this.life > 0 && this.isAlive) {
                if (this.ufoHoverSound.paused) { 
                    this.ufoHoverSound.play();
                }
            } else {
                this.ufoHoverSound.pause();
            }
        }, 1000 / 60);
    }

    /**
    * Plays the victory sound.
    * Checks if the sound is paused and if it has been played less than three times.
    * Resets the start time of the sound to the beginning and plays it.
    */
    playWinSound() {
        if (this.winSound.paused && this.winSoundPlayCount < 3) {
            this.winSound.currentTime = 0;
            this.winSound.play();
        }
    }
}

