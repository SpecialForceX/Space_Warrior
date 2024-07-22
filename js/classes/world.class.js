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

        // Füge alle Sounds in eine Liste ein
        this.sounds = [
            this.shootSound,
            this.hitSound,
            this.crystalsSound,
            this.playerHitSound,
            this.jumpSound,
            this.clickSound
        ];
        this.shootSound.volume = 0.01;
        this.hitSound.volume = 0.01;
        this.playerHitSound.volume = 0.01;
        this.jumpSound.volume = 0.01;
        this.clickSound.volume = 0.01;
        this.player.deathSound.volume = 0.01;
        

        this.muted = false; // Flag zum Überprüfen, ob Sounds gemutet sind
    }

    /**
   * Mute or unmute all sounds.
   */
    muteSounds() {
        this.muted = !this.muted;
        this.sounds.forEach(sound => {
            sound.muted = this.muted;
        });
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
        if (!this.muted) {
            this.shootSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
            this.shootSound.play();
        }
    }

    /**
     * Play the click sound, resetting its playback position to the beginning.
     */
    playClickSound() {
        if (!this.muted) {
            this.clickSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
            this.clickSound.play();
        }
    }

    /**
    * Play the hit sound, resetting its playback position to the beginning.
    */
    playHitSound() {
        if (!this.muted) {
            this.hitSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
            this.hitSound.play();
        }
    }

    /**
    * Play the player hit sound, resetting its playback position to the beginning.
    */
    playPlayerHitSound() {
        if (!this.muted) {
            this.playerHitSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
            this.playerHitSound.play();
        }
    }

    /**
    * Play the trampoline sound, resetting its playback position to the beginning.
    */
    playTrampolineSound() {
        if (!this.muted) {
            this.jumpSound.currentTime = 0; // Setze den Startzeitpunkt auf den Anfang
            this.jumpSound.play();
        }
    }

    /**
    * Play the crystal sound by creating a new Audio object and playing it.
    */
    playCrystalSound() {
        if (!this.muted) {
            const crystalSound = new Audio('audio/sounds/crystals.ogg');
            crystalSound.play();
            crystalSound.volume = 0.01;
        }
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
}