class CrystalCounter extends DrawableObject {
    
    constructor() {
        super().loadImg('img/collectables/crystal_1.png');
        this.x = 840;
        this.y = 20;
        this.width = 20;
        this.height = 40;
        this.count = 0;
    }

    /**
     * Increments the count of the crystal counter by one.
     */
    increment() {
        this.count++;
    }

    /**
     * Draws the crystal counter on the given canvas context.
     * Draws the crystal image and the count next to the crystal image.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        super.draw(ctx); 
        ctx.font = '36px myPixel';
        ctx.fillStyle = 'white';
        ctx.fillText('x ' + this.count + '/130', this.x + this.width + 10, this.y + this.height / 2 + 10);
    }
}

