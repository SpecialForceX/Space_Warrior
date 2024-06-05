class Trampoline extends DrawableObject {

    IMAGES_TRAMPOLINE = [
        'img/trampoline/trampolin_1.png',
        'img/trampoline/trampolin_2.png'
    ]

    width = 64;
    height = 64;

    constructor(x, y) {
        super().loadImg('img/trampoline/trampolin_1.png');
        this.x = x;
        this.y = y;

    }
}