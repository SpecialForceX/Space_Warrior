class StatusBar extends DrawableObject {
    height = 64;
    width = 64;

    IMAGES = [
        'img/player/life/heart.png',
    ]

    IMAGES_HEALTHBAR = [
        'img/enemys/boss/healthbar/boss_healthbar_1.png',
        'img/enemys/boss/healthbar/boss_healthbar_2.png',
        'img/enemys/boss/healthbar/boss_healthbar_3.png',
        'img/enemys/boss/healthbar/boss_healthbar_4.png',
        'img/enemys/boss/healthbar/boss_healthbar_5.png',
        'img/enemys/boss/healthbar/boss_healthbar_6.png'
    ]

    constructor(x, y, width, height, type) {
        super().loadImg('img/enemys/boss/healthbar/boss_healthbar_1.png');
        this.loadImgs(this.IMAGES);
        this.loadImgs(this.IMAGES_HEALTHBAR);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.type = type;
        this.setLife();
        this.setRightImg();
    }

    setLife() {
        if (this.type == 'player') {
            let path = this.IMAGES[0];
            this.img = this.imgCache[path];     
        } else {
            let path = this.IMAGES_HEALTHBAR[0];
            this.img = this.imgCache[path];   
        }
    }

    setRightImg() {
        if (this.type == 'boss') {
            setInterval(() => {
                let bossLife = world.level.boss[0].life; // Abrufen des aktuellen Lebensstatus des Bosses
                let path;
                switch (bossLife) {
                    case 5:
                        path = this.IMAGES_HEALTHBAR[0];
                        this.img = this.imgCache[path];   
                        break;
        
                    case 4:
                        path = this.IMAGES_HEALTHBAR[1];
                        this.img = this.imgCache[path];   
                        break;
        
                    case 3:
                        path = this.IMAGES_HEALTHBAR[2];
                        this.img = this.imgCache[path];  
                        break;

                    case 2:
                        path = this.IMAGES_HEALTHBAR[3];
                        this.img = this.imgCache[path];  
                        break;

                    case 1:
                        path = this.IMAGES_HEALTHBAR[4];
                        this.img = this.imgCache[path];  
                        break;

                    case 0:
                        path = this.IMAGES_HEALTHBAR[5];
                        this.img = this.imgCache[path];  
                        break;
                }
            }, 1000/30)
        }
    }
}