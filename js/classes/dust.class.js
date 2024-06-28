class Dust extends MovableObject {

    width = 316;
    height = 212;

    constructor() {
        super().loadImg('/img/background/space_dust/space_dust.png');
        this.x = 200 + Math.random() * 500;
        this.y = 50;
        this.speed = 0.25;
        this.animate();
    }

    /**
    * Animates the dust particle by moving it to the left.
    * The animation runs at 60 frames per second.
    * Stops animating if the game is not started or is paused.
    */
    animate() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            this.moveLeft();
        }, 1000 / 60)
    
    }
}