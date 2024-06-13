class Shield extends MovableObject {
    IMAGES_SHIELD = [
        'img/enemys/boss/shield/shield_1.png',
        'img/enemys/boss/shield/shield_2.png',
        'img/enemys/boss/shield/shield_3.png',
        'img/enemys/boss/shield/shield_4.png'
    ];

    shieldStatus = 0;
    isInvulnerable = false;

    constructor(x, y, width, height) {
        super().loadImg('img/enemys/boss/shield/shield_1.png');
        this.loadImgs(this.IMAGES_SHIELD);
        this.x = x;
        this.y = y;
        this.width = width; // Adjust the width as needed
        this.height = height; // Adjust the height as needed
        this.animate();
        this.offsetRight = 40;
        this.offsetLeft = 40;
        this.offsetTop = 30;
        this.offsetBottom = 30;
    }

    animate() {
        const animateIntervall = setInterval(() => {
            switch (this.shieldStatus) {
                case 0:
                    this.loadImg(this.IMAGES_SHIELD[0]);
                    break;
    
                case 1:
                    this.loadImg(this.IMAGES_SHIELD[1]);
                    break;
    
                case 2:
                    this.loadImg(this.IMAGES_SHIELD[2]);
                    break;
                case 3:
                    this.loadImg(this.IMAGES_SHIELD[3]);
                    setTimeout(() => {
                        world.level.shield = [];
                        clearInterval(animateIntervall);    
                    }, 1000);

                break;
            }
 
        }, 1000 / 10);
    }

    updatePositionShield() {
        this.x = world.level.boss[0].x - 30; // Adjust the position as needed
        this.y = world.level.boss[0].y - 25; // Adjust the position as needed
    }


    hitByBullet() {
        if (!this.isInvulnerable) {
            this.shieldStatus += 1;
            this.isInvulnerable = true;
            setTimeout(() => {
                this.isInvulnerable = false;
            }, 2000); // 2 Sekunden Unverwundbarkeit
        }
    }


}