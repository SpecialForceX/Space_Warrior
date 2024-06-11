class World {

    player = new Player();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    cooldown = 0;
    isShoot = false;
    cameraFixed = false;
    bossRoomSet = false;
    parallaxFactor = 0.25; // Parallax-Faktor für Hintergrundobjekte




    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        this.keyboard = keyboard;


        this.draw();
        this.setWorld();
        this.run();
        this.checkCooldown();
    }

    setWorld() {
        this.player.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkShoot();
            this.checkCameraFixed();
        }, 1000 / 60)
    }

    checkCooldown() {
        setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 2;
            } else {
                this.cooldown = 0;
            }
        }, 250)
    }

    async checkShoot() {
        if (this.keyboard.ENTER && this.cooldown == 0) {
            this.isShoot = true;
            this.cooldown = 1;
            let direction = this.player.mirrored ? 'left' : 'right';
            let bullet = new ThrowableObject(this.player.x + (direction === 'right' ? 64 : 0), this.player.y + 32, direction);
            this.throwableObjects.push(bullet);
            await this.wait(70);
            this.isShoot = false;
        }
    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.player.isColliding(enemy) && !this.player.isHurt()) {
                this.player.hit();
                console.log('Collision with Player, life:', this.player.life);
                this.player.statusBar = [];
                this.player.updateLife();
            }
    
            this.throwableObjects.forEach((bullet) => {
                if (enemy.isColliding(bullet) && !enemy.isHurt() && !bullet.exploding) {
                    enemy.hit();
                    bullet.hit(); // Triff die Bullet und starte die Explosion
                }
            });
        });
    
        this.level.shield.forEach((shield) => {
            this.throwableObjects.forEach((bullet) => {
                if (shield.isColliding(bullet) && !shield.isInvulnerable && !bullet.exploding) {
                    shield.hitByBullet(); // Shield getroffen
                    bullet.hit(); // Triff die Bullet und starte die Explosion
                }
            });
        });
    
        this.level.heartObjects.forEach((heart) => {
            if (this.player.isColliding(heart)) {
                heart.destroy();
                this.player.life += 1;
                this.player.updateLife();
            }
        });
    
        this.level.crystalObjects.forEach((crystal) => {
            if (this.player.isColliding(crystal)) {
                crystal.destroy();
            }
        });
    
        this.level.trampolines.forEach((trampoline) => {
            if (this.player.isColliding(trampoline)) {
                this.player.speedY = 18;
            }
        });
    
        this.level.boss.forEach((bossObject) => {
            if (this.player.isColliding(bossObject) && !this.player.isHurt()) {
                this.player.hit();
                console.log('Collision with Player, life:', this.player.life);
                this.player.statusBar = [];
                this.player.updateLife();
            }
    
            this.throwableObjects.forEach((bullet) => {
                if (bossObject.isColliding(bullet) && !bossObject.isHurt() && !bullet.exploding) {
                    if (this.level.shield.length === 0) {
                        bossObject.hit();
                        bullet.hit(); // Triff die Bullet und starte die Explosion
                        console.log(this.level.boss[0].life);
                        if (this.level.boss[0].isAlive) {
                            setTimeout(() => {
                                this.level.shield.push(new Shield(bossObject.x, bossObject.y, 435, 230));   
                            }, 1000);
                        }


                    } else if (!this.level.shield[0].isInvulnerable) {
                        this.level.shield[0].hitByBullet();
                        bullet.hit(); // Triff die Bullet und starte die Explosion
                    }
                }
            });
        });
    
        // Entferne die getroffenen Bullets aus dem `throwableObjects`-Array
        this.level.crystalObjects = this.level.crystalObjects.filter(crystal => !crystal.isMarkedForRemoval);
        this.level.heartObjects = this.level.heartObjects.filter(heart => !heart.isMarkedForRemoval);
        this.throwableObjects = this.throwableObjects.filter(bullet => !bullet.isMarkedForRemoval);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    checkCameraFixed() {
        if (this.cameraFixed) {
            this.camera_x = -3300;
            this.level.level_end_x_left = 3300;
            if (!this.bossRoomSet) {
                this.level.trampolines.push(new Trampoline(4250, 644));
                this.level.trampolines.push(new Trampoline(3310, 644));
                this.level.boss.push(new Boss(3650, 800, 380, 415));
                this.level.healthbar.push(new StatusBar(3500, 100, 624, 56, 'boss'));
            }
            this.bossRoomSet = true;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Begrenzung der Kamera
        if (this.player.x >= 3500) {
            this.cameraFixed = true;
        }

        // Zeichne Hintergrundobjekte mit Parallax-Effekt
        this.ctx.translate(this.camera_x * this.parallaxFactor, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.dusts);
        this.ctx.translate(-this.camera_x * this.parallaxFactor, 0); // Zurücksetzen


        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.healthbar);
        this.addObjectsToMap(this.level.boss);
        this.addObjectsToMap(this.level.shield);
        this.addObjectsToMap(this.level.platforms); // Plattformen hinzufügen
        this.addObjectsToMap(this.level.groundObjects);

        this.ctx.translate(-this.camera_x, 0); // Back
        // ------ space for fixed objects ------- 
        this.addObjectsToMap(this.player.statusBar);
        this.ctx.translate(this.camera_x, 0); // Forward

        this.addObjectsToMap(this.level.heartObjects);
        this.addObjectsToMap(this.level.crystalObjects);
        this.addObjectsToMap(this.level.trampolines);
        this.addObjectsToMap(this.level.meteorites);
        this.addToMap(this.player);

        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);



        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addToMap(mo) {
        if (mo.mirrored) {
            this.flipImg(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.mirrored) {
            this.flipImgBack(mo);
        }
    }

    flipImg(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImgBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}