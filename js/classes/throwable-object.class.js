class ThrowableObject extends MovableObject {
    height = 8
    width = 24

    constructor(x, y, direction) {
        super().loadImg('/img/player/bullet/bullet.png');
        this.x = x;
        this.y = y;
        this.shoot();
        this.direction = direction;
    }

    shoot() {
        setInterval(() => {
            if(this.direction === 'left') {
                this.x -= 5;
            } else {
                this.x += 5
            }

        }, 1000/60)
    }
}