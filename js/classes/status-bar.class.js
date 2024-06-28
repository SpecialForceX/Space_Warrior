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

    /**
    * Sets the image based on the object type.
    * If the object type is 'player', sets the main image.
    * If the object type is not 'player', sets the health bar image.
    */
    setLife() {
        if (this.type == 'player') {
            let path = this.IMAGES[0];
            this.img = this.imgCache[path];
        } else {
            let path = this.IMAGES_HEALTHBAR[0];
            this.img = this.imgCache[path];
        }
    }

    /**
    * Sets the correct health bar image based on the boss's current life.
    */
    setRightImg() {
        if (this.type === 'boss') {
            setInterval(() => {
                this.updateBossHealthBarImage();
            }, 1000 / 30);
        }
    }

    /**
     * Updates the boss's health bar image based on its current life.
     */
    updateBossHealthBarImage() {
        const boss = world.level.boss[0];
        if (boss) {
            const bossLife = boss.life;
            let path;
            switch (bossLife) {
                case 5:
                    path = this.IMAGES_HEALTHBAR[0];
                    break;
                case 4:
                    path = this.IMAGES_HEALTHBAR[1];
                    break;
                case 3:
                    path = this.IMAGES_HEALTHBAR[2];
                    break;
                case 2:
                    path = this.IMAGES_HEALTHBAR[3];
                    break;
                case 1:
                    path = this.IMAGES_HEALTHBAR[4];
                    break;
                case 0:
                    path = this.IMAGES_HEALTHBAR[5];
                    break;
                default:
                    break;
            }
            if (path) {
                this.updateHealthBarImage(path);
            }
        }
    }

    /**
     * Updates the image of the health bar based on the provided path.
     * @param {string} path - The path to the image.
     */
    updateHealthBarImage(path) {
        this.img = this.imgCache[path];
    }
}