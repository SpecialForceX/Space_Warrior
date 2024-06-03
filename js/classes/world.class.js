class World {

    player = new Player();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        this.keyboard = keyboard;
        
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.player.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.player.isColliding(enemy) && !this.player.isHurt()) {
                    this.player.hit();
                    console.log('Collision with Player, life:', this.player.life);
                    this.player.statusBar = [];
                    this.player.updateLife();
                }
            })
        }, 200)

    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); // Back
        // ------ space for fixed objects ------- 
        this.addObjectsToMap(this.player.statusBar);
        this.ctx.translate(this.camera_x, 0); // Forward


        this.addToMap(this.player);
        this.addObjectsToMap(this.level.dusts);
        this.addObjectsToMap(this.level.enemies);
        

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function() {
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
        this.ctx.scale(-1,1);
        mo.x = mo.x * -1;
    }

    flipImgBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}