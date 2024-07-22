    /**
    * Executes Attack Type 1 (Energy Beam).
    * If the boss is alive, this function activates the Energy Beam attack.
    * The Energy Beam attack is executed periodically until isAttackingEnergyBeam is set to false.
    */
    Boss.prototype.attackType1 = function() {
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
    Boss.prototype.attackType2 = function() {
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
    Boss.prototype.attackType3 = function() {
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
    Boss.prototype.finishAttack = function() {
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
    Boss.prototype.energyBeam = function() {
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
    Boss.prototype.moveTowardsTargetX = function() {
        this.x += this.speed;
    }
    
    /**
    * Moves the boss towards the Y coordinate of the attack position.
    */
    Boss.prototype.moveTowardsTargetY = function() {
        this.y += this.speed;
    }
    
    /**
    * Handles the event when the boss reaches the attack position.
    * Activates the beam protection and the energy beam.
    */
    Boss.prototype.arriveAtAttackPosition = function() {
        this.isAttacking = false;
        this.energyBeamOn = true;
    }
    
    /**
    * Activates the Energy Beam attack and generates the beam if the beam protection is set.
    */
    Boss.prototype.activateEnergyBeam = function() {
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
    Boss.prototype.setupBeamProtection = function() {
        world.level.beamProtection.push(new EnergieBeamProtection(this.x + 95, this.y + 150));
        this.isBeamProtectionSet = true;
    }
    
    /**
    * Adjusts the offsets for the boss to correctly display the energy beam.
    * This method is called when the energy beam is activated.
    */
    Boss.prototype.adjustOffsets = function() {
        this.offsetRight = 100;
        this.offsetLeft = 100;
        this.offsetTop = 40;
        this.offsetBottom = 0;
    }
    
    /**
    * Ends the boss's energy beam.
    * Sets isAttackingEnergyBeam to false, resets the offsets, finishes the attack, and removes the beam protection from the world.
    */
    Boss.prototype.finishEnergyBeam = function() {
        this.isAttackingEnergyBeam = false;
        this.resetOffsets();
        this.finishAttack();
        world.level.beamProtection.splice(0, 1);
    }
    
    /**
    * Resets the boss's offsets to the default values.
    * Called to reset the offsets after the energy beam ends.
    */
    Boss.prototype.resetOffsets = function() {
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
    Boss.prototype.meteoriteAttack = function() {
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
    Boss.prototype.executeMeteoriteAttack = function(meteoriteAttackInterval) {
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
    Boss.prototype.returnToTargetAfterAttack = function(meteoriteAttackInterval) {
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
    Boss.prototype.moveBackToTarget = function() {
        world.level.shield.forEach(shield => shield.updatePositionShield());
        this.x -= this.speed;
    }
    
    /**
    * Ends the meteorite attack.
    * Performs necessary cleanup and resets the boss's speed.
    * @param {number} returnToTargetInterval - The interval for returning to the target.
    * @param {number} meteoriteAttackInterval - The interval for the meteorite attack.
    */
    Boss.prototype.finishMeteoriteAttack = function(returnToTargetInterval, meteoriteAttackInterval) {
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
    Boss.prototype.alienDrop = function() {
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
    Boss.prototype.initiateAlienDrop = function() {
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
    Boss.prototype.hasReachedTarget = function() {
        return Math.abs(this.x - this.randomTargetX) < this.speed && Math.abs(this.y - this.randomTargetY) < this.speed;
    }
    
    /**
    * Drops an alien, increases the counter, and starts the alien drop sequence again.
    * @param {number} moveInterval - The interval for moving to the random target.
    */
    Boss.prototype.dropAlienAndRepeat = function(moveInterval) {
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
    Boss.prototype.cleanupAfterAttack = function() {
        this.finishAttack();
        this.isAttackingAlienDrop = false;
        this.speed = 2;
    }
    
    /**
    * Starts an interval for the "boss rush" mode.
    * Increases the boss's speed when its health drops below 2.
    */
    Boss.prototype.bossRush = function() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            if (this.life < 2) {
                this.speed = 3;
            }
        }, 1000 / 60);
    }