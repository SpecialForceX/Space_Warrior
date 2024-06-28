class Rocket extends MovableObject {

    IMAGES = [
        'img/enemys/alien2/rocket_1.png',
        'img/enemys/alien2/rocket_2.png',
        'img/enemys/alien2/rocket_3.png',
    ]

    constructor(x, y) {
        super().loadImg('img/enemys/alien2/rocket_1.png');
        this.loadImgs(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 108; // Setze die Breite der Rakete
        this.height = 44; // Setze die Höhe der Rakete
        this.speedX = 3; // Setze die Geschwindigkeit der Rakete
        this.animate();
    }

    /**
    * Animates the rocket by moving it horizontally and playing its animation.
    */
    animate() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return;
            this.x -= this.speedX; // Bewege die Rakete nach links
            this.playAnimation(this.IMAGES); // Spiele die Raketen-Animation ab
        }, 1000 / 60); // Aktualisiere die Position 60 mal pro Sekunde
    }
}