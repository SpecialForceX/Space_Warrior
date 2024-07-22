/**
    * Check collision between the player and a specific crystal object.
    * If the player collides with the crystal, destroy the crystal, play a crystal sound,
    * and increment the crystal counter.
    * @param {Crystal} crystal - The crystal object to check collision with.
    */
World.prototype.checkPlayerCrystalCollision = function(crystal) {
    if (this.player.isColliding(crystal)) {
        crystal.destroy();
        this.playCrystalSound();
        this.crystalCounter.increment();
    }
}

/**
* Check collisions between the player and trampoline objects.
* For each trampoline object, check if the player collides with it.
* If collision occurs, set the player's vertical speed to 18 and play a trampoline sound.
* @param {Trampoline} trampoline - The trampoline object to check collision with.
*/
World.prototype.checkPlayerTrampolineCollisions = function() {
    this.level.trampolines.forEach((trampoline) => {
        this.checkPlayerTrampolineCollision(trampoline);
    });
}

/**
* Check collision between the player and a trampoline object.
* If the player collides with the trampoline, set the player's vertical speed to 18
* and play a trampoline sound effect.
* @param {Trampoline} trampoline - The trampoline object to check collision with.
*/
World.prototype.checkPlayerTrampolineCollision = function(trampoline) {
    if (this.player.isColliding(trampoline)) {
        this.player.speedY = 18;
        this.playTrampolineSound();
    }
}

/**
* Check collisions between the player and all boss objects.
* For each boss object, check if the player collides with it and handle collisions.
*/
World.prototype.checkPlayerBossCollisions = function() {
    this.level.boss.forEach((bossObject) => {
        this.checkPlayerBossCollision(bossObject);
        this.checkBossBulletCollisionWithPlayer(bossObject);
    });
}

/**
* Check collision between the player and a specific boss object.
* If the player collides with the boss object and is not hurt,
* mark the player as hit, play a player hit sound, update player's life status,
* and display the win screen if the boss is defeated and the win screen is not already shown.
* @param {BossObject} bossObject - The boss object to check collision with.
*/
World.prototype.checkPlayerBossCollision = function(bossObject) {
    if (this.player.isColliding(bossObject) && !this.player.isHurt()) {
        this.player.hit();
        this.playPlayerHitSound();
        this.player.statusBar = [];
        this.player.updateLife();
    }

    if (!bossObject.isAlive && this.winScreen === null) {
        setTimeout(() => {
            this.showWinScreen();
        }, 5000);
    }
}

/**
* Check collisions between boss bullets and the player.
* For each boss bullet, check if it collides with the player.
* Handle the collision based on whether the boss has a shield or not and the state of the bullet.
* @param {BossObject} bossObject - The boss object whose bullets are being checked.
*/
World.prototype.checkBossBulletCollisionWithPlayer = function(bossObject) {
    this.throwableObjects.forEach((bullet) => {
        if (bossObject.isColliding(bullet) && !bossObject.isHurt() && !bullet.exploding && this.level.boss[0].introDone) {
            if (this.level.shield.length === 0) {
                this.handleBossBulletCollisionWithNoShield(bossObject, bullet);
            } else if (!this.level.shield[0].isInvulnerable) {
                this.handleBossBulletCollisionWithShield(bullet);
            }
        }
    });
}

/**
* Handle collision between a boss bullet and a boss object without a shield.
* Mark both the boss object and the bullet as hit, play a hit sound,
* and if the boss is still alive, add a shield after a delay.
* @param {BossObject} bossObject - The boss object involved in the collision.
* @param {ThrowableObject} bullet - The bullet object involved in the collision.
*/
World.prototype.handleBossBulletCollisionWithNoShield = function(bossObject, bullet) {
    bossObject.hit();
    bullet.hit();
    this.playHitSound();
    if (this.level.boss[0].isAlive) {
        setTimeout(() => {
            this.level.shield.push(new Shield(bossObject.x, bossObject.y, 435, 230));
        }, 1000);
    }
}

/**
* Handle collision between a boss bullet and the player's shield.
* Mark the shield as hit by the bullet, mark the bullet as hit, and play a hit sound.
* @param {ThrowableObject} bullet - The bullet object involved in the collision with the shield.
*/
World.prototype.handleBossBulletCollisionWithShield = function(bullet) {
    this.level.shield[0].hitByBullet();
    bullet.hit();
    this.playHitSound();
}

/**
* Check collisions between the player and all rocket objects.
* For each rocket object, check if the player collides with it and handle collisions.
*/
World.prototype.checkPlayerRocketCollisions = function() {
    this.level.rockets.forEach((rocket) => {
        this.checkPlayerRocketCollision(rocket);
    });
}

/**
* Check collision between the player and a specific rocket object.
* If the player collides with the rocket object and is not hurt,
* mark the player as hit, play a player hit sound, update player's life status,
* and log the player's life after the collision.
* Also check collisions between the rocket and all throwable objects (bullets).
* @param {Rocket} rocket - The rocket object to check collision with.
*/
World.prototype.checkPlayerRocketCollision = function(rocket) {
    if (this.player.isColliding(rocket) && !this.player.isHurt()) {
        this.player.hit();
        this.playPlayerHitSound();
        this.player.updateLife();
    }

    this.throwableObjects.forEach((bullet) => {
        if (rocket.isColliding(bullet) && !bullet.exploding) {
            bullet.hit();
            this.playHitSound();
        }
    });
}

/**
* Clean up marked objects in the game.
* Remove crystals, hearts, and bullets that are marked for removal from their respective arrays.
*/
World.prototype.cleanupMarkedObjects = function() {
    this.level.crystalObjects = this.level.crystalObjects.filter(crystal => !crystal.isMarkedForRemoval);
    this.level.heartObjects = this.level.heartObjects.filter(heart => !heart.isMarkedForRemoval);
    this.throwableObjects = this.throwableObjects.filter(bullet => !bullet.isMarkedForRemoval);
}

/**
* Show the win screen by initializing a new WinScreen object, initializing a WinTitle object,
* and toggling the game pause state.
*/
World.prototype.showWinScreen = function() {
    this.winScreen = new WinScreen();
    this.winTitle = new WinTitle(); // Initialisiere den WinTitle
    togglePause();
}

/**
* Wait for a specified amount of time asynchronously using setTimeout.
* @param {number} ms - The number of milliseconds to wait.
* @returns {Promise<void>} A promise that resolves after the specified time.
*/
World.prototype.wait = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* Check if the camera is fixed. If so, set specific positions and objects related to the fixed camera state.
* If not fixed, reset certain level settings.
*/
World.prototype.checkCameraFixed = function() {
    if (this.cameraFixed) {
        this.camera_x = -3300;
        this.level.level_end_x_left = 3300;
        if (!this.bossRoomSet) {
            this.level.trampolines.push(new Trampoline(4250, 644));
            this.level.trampolines.push(new Trampoline(3310, 644));
            this.level.boss.push(new Boss(3650, 800, 380, 415));
            this.level.healthbar.push(new StatusBar(3500, 100, 624, 56, 'boss'));
            playMusic('bossMusic');
            setInitialVolume();
        }
        this.bossRoomSet = true;
    }
    else {
        this.level.level_end_x_left = -2750;
    }
}

/**
* Continuously draw the game objects and update the canvas using requestAnimationFrame.
* This method clears the canvas, then draws background, fixed objects, player-related objects, and the win screen.
*/
World.prototype.draw = function() {
    if (!gameStarted) return; // Zeichnen nur wenn das Spiel gestartet wurde
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackgroundObjects();
    this.drawFixedObjects();
    this.drawPlayerRelatedObjects();
    this.drawWinScreen();

    let self = this;
    requestAnimationFrame(function () {
        self.draw();
    });
}

/**
* Draw background objects with parallax effect based on the camera position.
* Translates the canvas context to achieve parallax effect, then draws background and dust objects.
*/
World.prototype.drawBackgroundObjects = function() {
    // Begrenzung der Kamera
    if (this.player.x >= 3500) {
        this.cameraFixed = true;
    }

    // Zeichne Hintergrundobjekte mit Parallax-Effekt
    this.ctx.translate(this.camera_x * this.parallaxFactor, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.dusts);
    this.ctx.translate(-this.camera_x * this.parallaxFactor, 0); // Zurücksetzen
}

/**
* Draw fixed objects on the canvas, such as controls, health bars, bosses, shields, platforms, and ground objects.
* Translates the canvas context to position fixed objects relative to the camera.
*/
World.prototype.drawFixedObjects = function() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.controlsIngame);
    this.addObjectsToMap(this.level.healthbar);
    this.addObjectsToMap(this.level.boss);
    this.addObjectsToMap(this.level.beamProtection);
    this.addObjectsToMap(this.level.shield);
    this.addObjectsToMap(this.level.platforms); // Plattformen hinzufügen
    this.addObjectsToMap(this.level.groundObjects);
    this.addObjectsToMap(this.level.border);
    this.ctx.translate(-this.camera_x, 0);
}

/**
* Draw player-related objects on the canvas.
* Includes player status bar, crystal counter, hearts, crystals, trampolines, meteorites,
* player object itself, enemies, rockets, and throwable objects.
*/
World.prototype.drawPlayerRelatedObjects = function() {
    this.addObjectsToMap(this.player.statusBar);
    this.crystalCounter.draw(this.ctx); // Zeichne den Kristallzähler
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.heartObjects);
    this.addObjectsToMap(this.level.crystalObjects);
    this.addObjectsToMap(this.level.trampolines);
    this.addObjectsToMap(this.level.meteorites);
    this.addToMap(this.player);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.rockets);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
}

/**
* Draw the win screen and optionally the win title if it exists.
* The win screen is drawn if `this.winScreen` is not null.
*/
World.prototype.drawWinScreen = function() {
    if (this.winScreen) {
        this.addToMap(this.winScreen); // Zeichne den Gewinnbildschirm
        if (this.winTitle) {
            this.addToMap(this.winTitle); // Zeichne den WinTitle über dem WinScreen
        }
    }
}

/**
* Add multiple objects to the canvas by calling `addToMap` for each object in the `objects` array.
* @param {Array} objects - An array of objects to be added to the canvas.
*/
World.prototype.addObjectsToMap = function(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    })
}

/**
* Add a single object to the canvas by calling its `draw methods.
* If the object is mirrored (`mo.mirrored` is true), it flips the context horizontally during drawing.
* @param {Object} mo - The object to be added and drawn on the canvas.
*/
World.prototype.addToMap = function(mo) {
    if (mo.mirrored) {
        this.flipImg(mo);
    }
    mo.draw(this.ctx);

    if (mo.mirrored) {
        this.flipImgBack(mo);
    }
}

/**
* Flip the canvas context horizontally to mirror an object before drawing it.
* @param {Object} mo - The object that needs to be mirrored.
*/
World.prototype.flipImg = function(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

/**
* Restore the canvas context after drawing a mirrored object.
* @param {Object} mo - The object that was mirrored and needs to be restored.
*/
World.prototype.flipImgBack = function(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
}

/**
* Create an Easter egg pattern on the game level by placing collectable objects (hearts and crystals).
* @param {Array} pattern - 2D array representing the pattern of the Easter egg.
* @param {number} x - Starting x-coordinate for placing the pattern.
* @param {number} y - Starting y-coordinate for placing the pattern.
*/
World.prototype.createEasterEgg = function(pattern, x, y) {
    const startX = x;
    const startY = y;
    const gridSize = 50;

    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] === 'C') {
                this.level.crystalObjects.push(new CollectableObject(startX + col * gridSize, startY + row * gridSize, 20, 40, 'crystal'));
            } else if (pattern[row][col] === 'H') {
                this.level.heartObjects.push(new CollectableObject(startX + col * gridSize, startY + row * gridSize, 28, 24, 'heart'));
            }
        }
    }
}