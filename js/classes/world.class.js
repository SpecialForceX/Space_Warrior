class World {

    player = new Player();
    enemies = [
        new Alien(),
        new Alien(),
        new Alien()
    ];
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.draw();
    }


    draw() {
        this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);
    }
}