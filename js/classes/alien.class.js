class Alien extends MovableObject {


    constructor() {
        super().loadImg('/img/enemys/alien1/alien_walk_1.png');

        this.x = 200 + Math.random() * 500;
    }
}