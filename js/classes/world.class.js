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

    canvas;
    ctx;
    
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.canvas = canvas;
        
        this.draw();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);
        this.enemies.forEach(enemy => {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        })

        this.dusts.forEach(dust => {
            this.ctx.drawImage(dust.img, dust.x, dust.y, dust.width, dust.height);
        })

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        })
    }
}