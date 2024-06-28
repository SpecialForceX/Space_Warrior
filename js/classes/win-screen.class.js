class WinScreen extends DrawableObject {

    IMAGES = [
        'img/winScreen/win_screen_1.png',
        'img/winScreen/win_screen_2.png',
        'img/winScreen/win_screen_3.png',
        'img/winScreen/win_screen_4.png',
        'img/winScreen/win_screen_5.png',
        'img/winScreen/win_screen_6.png',
        'img/winScreen/win_screen_7.png',
        'img/winScreen/win_screen_8.png',
        'img/winScreen/win_screen_9.png',
        'img/winScreen/win_screen_10.png',
        'img/winScreen/win_screen_11.png',
        'img/winScreen/win_screen_12.png',
        'img/winScreen/win_screen_13.png'
    ]

    constructor() {
        super().loadImg('img/winScreen/win_screen_1.png');
        this.width = 1024;
        this.height = 768;
        this.x = 0;
        this.y = 0;
        this.loadImgs(this.IMAGES);
        this.animate();
    }

    /**
     * Initiates the animation of the win screen.
     * Plays the animation loop.
     */
    animate() {
        this.playAnimation(this.IMAGES);

        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 1000 / 10); 
    }
}
