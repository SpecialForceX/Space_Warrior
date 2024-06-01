class Dust extends MovableObject {

    width = 316;
    height = 212;

    constructor() {
        super().loadImg('/img/background/space_dust/space_dust.png');

        this.x = 200 + Math.random() * 500;
        this.y = 50;
        
    }
}