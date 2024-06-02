class World {

    player = new Player();
    enemies = [
        new Alien(),
        new Alien(),
        new Alien()
    ];
    dusts = [
        new Dust()
    ];
    backgroundAmount = 6;
    backgroundObjects = [
        // new BackgroundObject('img/background/sky.png', 0),
        // new BackgroundObject('img/background/background.png', 0),
        // new BackgroundObject('img/background/ground/ground.png', 0),
        // new BackgroundObject('img/background/sky.png', 1024),
        // new BackgroundObject('img/background/background.png', 1024),
        // new BackgroundObject('img/background/ground/ground.png', 1024)
    ]

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        this.keyboard = keyboard;
        this.duplicateBackgroundObjects(this.backgroundAmount);
        
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.player.world = this;
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.player);
        this.addObjectsToMap(this.dusts);
        this.addObjectsToMap(this.enemies);

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
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1,1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.mirrored) {
            mo.x = mo.x * -1;
            this.ctx.restore();
            
        }
    }

    duplicateBackgroundObjects(amount) {
        let pos_x = -1024;
        for (let i = 0; i < amount; i++) {
            this.backgroundObjects.push(new BackgroundObject('img/background/sky.png', pos_x));
            this.backgroundObjects.push(new BackgroundObject('img/background/background.png', pos_x));
            this.backgroundObjects.push(new BackgroundObject('img/background/ground/ground.png', pos_x));
            pos_x += 1024;
        }
    }
}