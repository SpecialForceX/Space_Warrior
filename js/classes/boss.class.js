class Boss extends MovableObject {

    IMAGES_INTRO = [
        'img/enemys/boss/boss_intro_1.png',
        'img/enemys/boss/boss_intro_2.png',
        'img/enemys/boss/boss_intro_3.png',
        'img/enemys/boss/boss_intro_4.png',
        'img/enemys/boss/boss_intro_5.png',
        'img/enemys/boss/boss_intro_6.png'
    ]

    introDone = false;

    constructor(x, y, width, height) {
        super().loadImg('img/enemys/boss/boss_intro_1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES_INTRO);
        this.animate();
        this.startIntro();
    }


    animate() {
        setInterval(() => {
            if (!this.introDone) {
                this.playAnimation(this.IMAGES_INTRO);
            }
        }, 1000 / 10)
    }

    startIntro() {
        setInterval(() => {
            if (!this.introDone && this.y > 200) {
                this.y -= 1;
            }
        }, 1000 / 40)


    }


}