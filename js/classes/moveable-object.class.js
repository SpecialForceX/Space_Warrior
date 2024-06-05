class MovableObject extends DrawableObject {
    speed = 0.5;
    mirrored = false;
    speedY = 0;
    acceleration = 0.25;
    life = 100;
    lastHit = 0;
    isAlive = true;
    rotationAngle = 0;
    offsetY = 9;


    duplicateLifeObjects(life) {
        let duplicateLifeObjectsArray = [];
        let pos_x = 50;
        for (let i = 0; i < life; i++) {
            duplicateLifeObjectsArray.push(new StatusBar(pos_x));
            pos_x += 30;
        }
        return duplicateLifeObjectsArray;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAlive) {
                if (this.isInAir() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                    this.y = Math.round(this.y);
                } else {
                    // Wenn der Spieler nicht in der Luft ist, setze die Vertikalgeschwindigkeit auf 0
                    this.speedY = 0;
                }
            }
        }, 1000 / 60);
    }
    
    isInAir() {
        // Überprüfe, ob der Spieler mit einer Plattform kollidiert
        for (let platform of this.world.platforms) {
            if (this.isStandingOn(platform)) {
                return false;
            }
        }
    
        // Überprüfe, ob der Spieler auf dem Boden ist
        return Math.round(this.y) < 635;
    }
    
    isStandingOn(platform) {
        const playerFeetY = this.y + this.height - this.offsetY;
        return this.x + this.width > platform.x && this.x < platform.x + platform.width &&
               playerFeetY >= platform.y && playerFeetY <= platform.y + 16; // Nur die obersten 6 Pixel
    }

    rotateImage(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Mitte des Bildes
        ctx.rotate(this.rotationAngle * Math.PI / 180); // Rotationswinkel
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height); // Zeichne Bild um den neuen Ursprung
        ctx.restore();
    }



    isColliding(obj) {
        return (this.x + this.width) >= obj.x && this.x <= (obj.x + obj.width) &&
            (this.y + this.height) >= obj.y &&
            (this.y) <= (obj.y + obj.height)
        //obj.onCollisionCourse; // Optional: hiermit könnten wir schauen, ob ein Objekt sich in die richtige Richtung bewegt. Nur dann kollidieren wir. Nützlich bei Gegenständen, auf denen man stehen kann.
    }

    hit() {
        this.life -= 1;
        if (this.life < 0) {
            this.life = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    

    moveRight() {
        if (this.isAlive) {
            this.x += this.speed; 
        }
    };

    moveLeft() {
        if (this.isAlive) {
            this.x -= this.speed;
        }
    }

    playAnimation(images) {
        let i = this.currentImg % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImg++;
    }

    jump() {
        this.speedY = 12;
    }

    // Methode zum Aktualisieren des Rotationswinkels
    updateRotation() {
        this.rotationAngle += 5; // Geschwindigkeit der Rotation
        if (this.rotationAngle >= 360) {
            this.rotationAngle = 0; // Zurücksetzen nach einer vollen Umdrehung
        }
    }
}