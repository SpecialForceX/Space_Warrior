class CrystalCounter extends DrawableObject {
    constructor() {
        super().loadImg('img/collectables/crystal_1.png'); // Das Bild des Kristalls
        this.x = 840; // Position oben rechts
        this.y = 20;
        this.width = 20;
        this.height = 40;
        this.count = 0; // Anfangszähler
    }

    increment() {
        this.count++;
    }

    draw(ctx) {
        // Zeichne das Kristallbild
        super.draw(ctx); 
        
        // Zeichne den Zähler neben dem Kristallbild
        ctx.font = '36px myPixel';
        ctx.fillStyle = 'white';
        ctx.fillText('x ' + this.count + '/130', this.x + this.width + 10, this.y + this.height / 2 + 10);
    }
}

