class World {

    player = new Player();
    level = level1;
    crystalCounter = new CrystalCounter();
    controlsIngame = new ControlsIngame(50, 100, 552, 316);

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    setEnemies = false;
    throwableObjects = [];
    cooldown = 0;
    isShoot = false;
    cameraFixed = false;
    bossRoomSet = false;
    parallaxFactor = 0.25; // Parallax-Faktor für Hintergrundobjekte
    winScreen = null;
    winTitle = null; // Neue Eigenschaft für den WinTitle
    alienPattern = [
        [0, 0, 0, 0, 'C', 'C', 'C', 0, 0, 0, 0],
        [0, 0, 0, 'C', 'C', 'C', 'C', 'C', 0, 0, 0],
        [0, 0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0, 0],
        [0, 0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0, 0],
        [0, 0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0, 0],
        [0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0],
        ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
        [0, 0, 0, 0, 'H', 'H', 'H', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 'H', 0, 0, 0, 0, 0],
    ];
    skullPattern = [
        [0, 0, 'C', 'C', 'C', 'C', 'C', 0, 0],
        [0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0],
        [0, 'C', 0, 0, 'C', 0, 0, 'C', 0],
        [0, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 0],
        [0, 0, 'C', 'C', 'C', 'C', 'C', 0, 0],
        [0, 0, 'C', 0, 'C', 0, 'C', 0, 0],
        ['C', 0, 0, 0, 0, 0, 0, 0, 'C'],
        ['C', 'C', 'C', 0, 0, 0, 'C', 'C', 'C'],
        [0, 0, 0, 'C', 'C', 'C', 0, 0, 0],
        ['C', 'C', 'C', 0, 0, 0, 'C', 'C', 'C'],
        ['C', 0, 0, 0, 0, 0, 0, 0, 'C']
    ]




    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        this.keyboard = keyboard;

        this.canvas.addEventListener('mousemove', (event) => this.checkMouseMove(event));
        this.canvas.addEventListener('click', (event) => this.checkMouseClick(event));

        this.draw();
        this.setWorld();
        this.run();
        this.checkCooldown();
        this.createEasterEgg(this.alienPattern, -1500, 50);
        this.createEasterEgg(this.skullPattern, 2900, 50);

        this.shootSound = new Audio('audio/sounds/shoot_player.ogg');
        this.hitSound = new Audio('audio/sounds/shoot_hit.ogg');
        this.crystalsSound = new Audio('audio/sounds/crystals.ogg');
        this.playerHitSound = new Audio('audio/sounds/player_hit.ogg');
        this.jumpSound = new Audio('audio/sounds/jump2.ogg');
        this.clickSound = new Audio('audio/sounds/menu_click.ogg');
    }

    /**
    * Set the current world for the player.
    */
    setWorld() {
        this.player.world = this;
    }

    /**
    * Run the game loop.
    * This function sets up an interval to run at 60 frames per second,
    * checking game conditions such as collisions, shooting, camera position,
    * enemy initialization, and level completion.
    */
    run() {
        setInterval(() => {
            if (gameStarted && !gamePaused) {
                this.checkCollisions();
                this.checkShoot();
                this.checkCameraFixed();
                this.checkEnemiesInitalization();
                this.checkLevelEnd();
            }
        }, 1000 / 60)
    }

    /**
    * Check if the level should end based on game conditions.
    * If neither the boss room is set nor the camera is fixed,
    * adjust the level's left end position to -2750.
    */
    checkLevelEnd() {
        if (!this.bossRoomSet && !this.cameraFixed) {
            this.level.level_end_x_left = -2750;
        }
    }

    /**
    * Check if enemies should be initialized based on player position.
    * If the player's x-coordinate is greater than 700 and enemies are not yet set,
    * initialize enemies and mark them as set.
    */
    checkEnemiesInitalization() {
        if (this.player.x > 700 && !this.setEnemies) {
            this.level.initializeEnemys();
            this.setEnemies = true;
        }
    }

    /**
    * Check and update the cooldown period at regular intervals.
    * The cooldown decreases by 2 every 250 milliseconds until it reaches 0.
    */
    checkCooldown() {
        setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 2;
            } else {
                this.cooldown = 0;
            }
        }, 250)
    }

    /**
    * Check shooting conditions and handle shooting logic asynchronously.
    * If the ENTER key is pressed and the cooldown is 0, set shooting flag to true,
    * decrease cooldown to 1, create a new bullet object, play shooting sound,
    * wait for 70 milliseconds, then set shooting flag to false.
    * @returns {Promise<void>} A promise that resolves when shooting animation is complete.
    */
    async checkShoot() {
        if (this.keyboard.ENTER && this.cooldown == 0) {
            this.isShoot = true;
            this.cooldown = 1;
            let direction = this.player.mirrored ? 'left' : 'right';
            let bullet = new ThrowableObject(this.player.x + (direction === 'right' ? 64 : 0), this.player.y + 32, direction);
            this.throwableObjects.push(bullet);
            this.playShootSound(); // Schuss-Sound abspielen
            await this.wait(70);
            this.isShoot = false;
        }
    }

    /**
    * Play the shooting sound, resetting its playback position to the beginning.
    */
    playShootSound() {
        this.shootSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
        this.shootSound.play();
    }

    /**
    * Play the click sound, resetting its playback position to the beginning.
    */
    playClickSound() {
        this.clickSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
        this.clickSound.play();
    }

    /**
    * Play the hit sound, resetting its playback position to the beginning.
    */
    playHitSound() {
        this.hitSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
        this.hitSound.play();
    }

    /**
    * Play the player hit sound, resetting its playback position to the beginning.
    */
    playPlayerHitSound() {
        this.playerHitSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
        this.playerHitSound.play();
    }

    /**
    * Play the trampoline sound, resetting its playback position to the beginning.
    */
    playTrampolineSound() {
        this.jumpSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
        this.jumpSound.play();
    }

    /**
    * Play the crystal sound by creating a new Audio object and playing it.
    */
    playCrystalSound() {
        const crystalSound = new Audio('audio/sounds/crystals.ogg');
        crystalSound.play();
    }

    /**
    * Check mouse movement event to handle hover state of win title button.
    * @param {MouseEvent} event - The mouse event object containing clientX and clientY properties.
    */
    checkMouseMove(event) {
        if (this.winTitle) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            this.winTitle.checkHover(mouseX, mouseY);
        }
    }

    /**
    * Check mouse click event to handle click on win title button.
    * If win title and its button are present and hovered, return to the menu.
    * @param {MouseEvent} event - The mouse event object.
    */
    checkMouseClick(event) {
        if (this.winTitle && this.winTitle.button.hovered) {
            this.returnToMenu();
        }
    }

    /**
    * Return to the main menu by reloading the page after playing a click sound.
    */
    returnToMenu() {
        this.playClickSound();
        location.reload();
    }

    /**
    * Check all collision types in the game to handle interactions between objects.
    * This function checks collisions between player and enemies, enemy bullets,
    * shield bullets, player hearts, boss bullets, player crystals, trampolines,
    * bosses, and rockets. After checking collisions, it cleans up marked objects.
    */
    checkCollisions() {
        this.checkPlayerEnemyCollisions();
        this.checkEnemyBulletCollisions();
        this.checkShieldBulletCollisions();
        this.checkPlayerHeartCollisions();
        this.checkBossBulletCollisions();
        this.checkPlayerCrystalCollisions();
        this.checkPlayerTrampolineCollisions();
        this.checkPlayerBossCollisions();
        this.checkPlayerRocketCollisions();

        this.cleanupMarkedObjects();
    }

    /**
    * Check collisions between the player and enemies.
    * If the player collides with an enemy and is not already hurt,
    * the player gets hit, a player hit sound is played, and the player's life is updated.
    */
    checkPlayerEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.player.isColliding(enemy) && !this.player.isHurt()) {
                this.player.hit();
                this.playPlayerHitSound();
                this.player.statusBar = [];
                this.player.updateLife();
            }
        });
    }

    /**
    * Check collisions between enemy bullets and enemies.
    * For each enemy bullet and enemy pair, check if the bullet collides with the enemy.
    * If collision occurs and neither the enemy nor the bullet is already hurt or exploding,
    * mark the enemy and bullet as hit and play a hit sound.
    */
    checkEnemyBulletCollisions() {
        this.throwableObjects.forEach((bullet) => {
            this.level.enemies.forEach((enemy) => {
                this.checkBulletEnemyCollision(bullet, enemy);
            });
        });
    }

    /**
    * Check collision between a specific bullet and enemy.
    * If the enemy collides with the bullet and neither is already hurt or exploding,
    * mark the enemy and bullet as hit and play a hit sound.
    * @param {ThrowableObject} bullet - The bullet object.
    * @param {Enemy} enemy - The enemy object.
    */
    checkBulletEnemyCollision(bullet, enemy) {
        if (enemy.isColliding(bullet) && !enemy.isHurt() && !bullet.exploding) {
            enemy.hit();
            bullet.hit();
            this.playHitSound();
        }
    }

    /**
    * Check collisions between shield bullets and shields.
    * For each shield and bullet pair, check if the bullet collides with the shield.
    * If collision occurs and the shield is not invulnerable and the bullet is not exploding,
    * mark the shield as hit by the bullet and play a hit sound.
    */
    checkShieldBulletCollisions() {
        this.level.shield.forEach((shield) => {
            this.throwableObjects.forEach((bullet) => {
                this.checkBulletShieldCollision(bullet, shield);
            });
        });
    }

    /**
    * Check collision between a specific bullet and shield.
    * If the shield collides with the bullet and the shield is not invulnerable
    * and the bullet is not exploding, mark the shield as hit by the bullet and play a hit sound.
    * @param {ThrowableObject} bullet - The bullet object.
    * @param {Shield} shield - The shield object.
    */
    checkBulletShieldCollision(bullet, shield) {
        if (shield.isColliding(bullet) && !shield.isInvulnerable && !bullet.exploding) {
            shield.hitByBullet();
            bullet.hit();
            this.playHitSound();
        }
    }

    /**
    * Check collisions between the player and heart objects.
    * For each heart object, check if the player collides with it.
    * If collision occurs, destroy the heart, play a crystal sound, increase player's life,
    * and update the player's life status.
    */
    checkPlayerHeartCollisions() {
        this.level.heartObjects.forEach((heart) => {
            this.checkPlayerHeartCollision(heart);
        });
    }

    /**
    * Check collision between the player and a heart object.
    * If the player collides with the heart, destroy the heart, play a crystal sound,
    * increase player's life by 1, and update the player's life status.
    * @param {Heart} heart - The heart object to check collision with.
    */
    checkPlayerHeartCollision(heart) {
        if (this.player.isColliding(heart)) {
            heart.destroy();
            this.playCrystalSound();
            this.player.life += 1;
            this.player.updateLife();
        }
    }

    /**
    * Check collisions between boss bullets and beam protections.
    * For each boss bullet, check collision with beam protections if the boss has beam protection set.
    * If collision occurs, mark the bullet as hit and play a hit sound.
    */
    checkBossBulletCollisions() {
        this.throwableObjects.forEach((bullet) => {
            if (this.level.boss.length > 0 && this.level.boss[0].isBeamProtectionSet) {
                this.level.beamProtection.forEach((protection) => {
                    this.checkBulletBossCollision(bullet, protection);
                });
            }
        });
    }

    /**
    * Check collision between a specific bullet and boss object.
    * If the boss object collides with the bullet, mark the bullet as hit and play a hit sound.
    * @param {ThrowableObject} bullet - The bullet object.
    * @param {BossObject} bossObject - The boss object to check collision with.
    */
    checkBulletBossCollision(bullet, bossObject) {
        if (bossObject.isColliding(bullet)) {
            bullet.hit();
            this.playHitSound();
        }
    }

    /**
    * Check collisions between the player and crystal objects.
    * For each crystal object, check if the player collides with it.
    * If collision occurs, destroy the crystal, play a crystal sound, and increment the crystal counter.
    */
    checkPlayerCrystalCollisions() {
        this.level.crystalObjects.forEach((crystal) => {
            this.checkPlayerCrystalCollision(crystal);
        });
    }

    /**
    * Check collision between the player and a specific crystal object.
    * If the player collides with the crystal, destroy the crystal, play a crystal sound,
    * and increment the crystal counter.
    * @param {Crystal} crystal - The crystal object to check collision with.
    */
    checkPlayerCrystalCollision(crystal) {
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
    checkPlayerTrampolineCollisions() {
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
    checkPlayerTrampolineCollision(trampoline) {
        if (this.player.isColliding(trampoline)) {
            this.player.speedY = 18;
            this.playTrampolineSound();
        }
    }

    /**
    * Check collisions between the player and all boss objects.
    * For each boss object, check if the player collides with it and handle collisions.
    */
    checkPlayerBossCollisions() {
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
    checkPlayerBossCollision(bossObject) {
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
    checkBossBulletCollisionWithPlayer(bossObject) {
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
    handleBossBulletCollisionWithNoShield(bossObject, bullet) {
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
    handleBossBulletCollisionWithShield(bullet) {
        this.level.shield[0].hitByBullet();
        bullet.hit();
        this.playHitSound();
    }

    /**
    * Check collisions between the player and all rocket objects.
    * For each rocket object, check if the player collides with it and handle collisions.
    */
    checkPlayerRocketCollisions() {
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
    checkPlayerRocketCollision(rocket) {
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
    cleanupMarkedObjects() {
        this.level.crystalObjects = this.level.crystalObjects.filter(crystal => !crystal.isMarkedForRemoval);
        this.level.heartObjects = this.level.heartObjects.filter(heart => !heart.isMarkedForRemoval);
        this.throwableObjects = this.throwableObjects.filter(bullet => !bullet.isMarkedForRemoval);
    }

    /**
    * Show the win screen by initializing a new WinScreen object, initializing a WinTitle object,
    * and toggling the game pause state.
    */
    showWinScreen() {
        this.winScreen = new WinScreen();
        this.winTitle = new WinTitle(); // Initialisiere den WinTitle
        togglePause();
    }

    /**
    * Wait for a specified amount of time asynchronously using setTimeout.
    * @param {number} ms - The number of milliseconds to wait.
    * @returns {Promise<void>} A promise that resolves after the specified time.
    */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
    * Check if the camera is fixed. If so, set specific positions and objects related to the fixed camera state.
    * If not fixed, reset certain level settings.
    */
    checkCameraFixed() {
        if (this.cameraFixed) {
            this.camera_x = -3300;
            this.level.level_end_x_left = 3300;
            if (!this.bossRoomSet) {
                this.level.trampolines.push(new Trampoline(4250, 644));
                this.level.trampolines.push(new Trampoline(3310, 644));
                this.level.boss.push(new Boss(3650, 800, 380, 415));
                this.level.healthbar.push(new StatusBar(3500, 100, 624, 56, 'boss'));
                playMusic('bossMusic');
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
    draw() {
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
    drawBackgroundObjects() {
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
    drawFixedObjects() {
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
    drawPlayerRelatedObjects() {
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
    drawWinScreen() {
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
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    /**
    * Add a single object to the canvas by calling its `draw methods.
    * If the object is mirrored (`mo.mirrored` is true), it flips the context horizontally during drawing.
    * @param {Object} mo - The object to be added and drawn on the canvas.
    */
    addToMap(mo) {
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
    flipImg(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
    * Restore the canvas context after drawing a mirrored object.
    * @param {Object} mo - The object that was mirrored and needs to be restored.
    */
    flipImgBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
    * Create an Easter egg pattern on the game level by placing collectable objects (hearts and crystals).
    * @param {Array} pattern - 2D array representing the pattern of the Easter egg.
    * @param {number} x - Starting x-coordinate for placing the pattern.
    * @param {number} y - Starting y-coordinate for placing the pattern.
    */
    createEasterEgg(pattern, x, y) {
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
}