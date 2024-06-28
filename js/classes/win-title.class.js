class WinTitle extends DrawableObject {

    IMAGES = [
        'img/winScreen/win_title.png',
        'img/winScreen/win_title_hover.png'
    ]

    constructor() {
        super().loadImg('img/winScreen/win_title.png');
        this.width = 1024;
        this.height = 768;
        this.x = 0;
        this.y = 0;
        this.button = {
            x: 352,
            y: 228,
            width: 336,
            height: 84,
            hovered: false
        };
        this.loadImgs(this.IMAGES);
    }

    /**
    * Draws the WinTitle screen with the appropriate button state.
    * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
    */
    draw(ctx) {
        this.img = this.imgCache[this.IMAGES[this.button.hovered ? 1 : 0]];
        super.draw(ctx);
        this.drawButton(ctx);
    }

    /**
    * Draws the interactive button on the WinTitle screen.
    * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
    */
    drawButton(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        ctx.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
    }

    /**
    * Checks if the mouse cursor is hovering over the button.
    * Updates the button's hovered state accordingly.
    * @param {number} mouseX - The x-coordinate of the mouse cursor.
    * @param {number} mouseY - The y-coordinate of the mouse cursor.
    */
    checkHover(mouseX, mouseY) {
        this.button.hovered = mouseX >= this.button.x &&
                              mouseX <= this.button.x + this.button.width &&
                              mouseY >= this.button.y &&
                              mouseY <= this.button.y + this.button.height;
    }
}