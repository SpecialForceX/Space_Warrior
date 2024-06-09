class Meteorites extends MovableObject {

    IMAGES_FLY = [
        'img/meteorites/meteorit_1.png',
        'img/meteorites/meteorit_2.png',
        'img/meteorites/meteorit_3.png'
    ]

    width = 64;
    height = 64;
    speedX = -2; // Geschwindigkeit nach links
    speedY = 3; // Geschwindigkeit nach unten

    constructor(x, y) {
        super().loadImg('img/meteorites/meteorit_1.png');
        this.x = x;
        this.y = y;
        this.loadImgs(this.IMAGES_FLY);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_FLY);
        }, 1000 / 10)
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Überprüfen, ob der Boden oder eine Plattform erreicht wurde
        if (this.isTouchingGround() || this.isTouchingPlayer()) { // || this.isTouchingPlatform()
            this.remove(); // Entferne den Meteorit
        }
    }

    isTouchingGround() {
        return Math.round(this.y) > 670; // Beispielwert für Bodenniveau, anpassen entsprechend Ihrer Spielwelt
    }


    isTouchingPlayer() {
        if (this.isColliding(world.player)) {
            world.player.life -= 1;
            world.player.updateLife();
            return true;
        }
        return false;
    }

    remove() {
        const index = world.level.meteorites.indexOf(this);
        if (index > -1) {
            world.level.meteorites.splice(index, 1);
        }
    }
}