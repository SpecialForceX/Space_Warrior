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
            if (direction === 'right'){
                let bullet = new ThrowableObject(this.player.x + 64, this.player.y + 44, direction);
                this.throwableObjects.push(bullet);
            } else {
                let bullet = new ThrowableObject(this.player.x, this.player.y + 44, direction);
                this.throwableObjects.push(bullet);
            }
            await this.wait(70);
            this.isShoot = false;
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.player.isColliding(enemy) && !this.player.isHurt()) {
                this.player.hit();
                console.log('Collision with Player, life:', this.player.life);
                this.player.statusBar = [];
                this.player.updateLife();
            }

            // Erstelle ein temporäres Array für Bullets, die entfernt werden sollen
            let bulletsToRemove = [];

            this.throwableObjects.forEach((bullet) => {
                if (enemy.isColliding(bullet) && !enemy.isHurt()) {
                    enemy.hit();
                    // Füge die Bullet dem temporären Array hinzu
                    bulletsToRemove.push(bullet);
                }
            })
            // Entferne die getroffenen Bullets aus dem `throwableObjects`-Array
            this.throwableObjects = this.throwableObjects.filter(bullet => !bulletsToRemove.includes(bullet));
        })
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Zeichne Hintergrundobjekte mit Parallax-Effekt
        this.ctx.translate(this.camera_x * this.parallaxFactor, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.dusts);
        this.ctx.translate(-this.camera_x * this.parallaxFactor, 0); // Zurücksetzen

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.groundObjects);

        this.ctx.translate(-this.camera_x, 0); // Back
        // ------ space for fixed objects ------- 
        this.addObjectsToMap(this.player.statusBar);
        this.ctx.translate(this.camera_x, 0); // Forward


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