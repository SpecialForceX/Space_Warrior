class Level {
    enemies;
    dusts;
    backgroundObjects;
    groundObjects;
    heartObjects = [
        new CollectableObject(100, 200, 28, 24, 'heart')
    ]
    crystalObjects = [
        new CollectableObject(450, 400, 20, 40, 'crystal'),
        new CollectableObject(500, 400, 20, 40, 'crystal'),
        new CollectableObject(550, 400, 20, 40, 'crystal'),
        new CollectableObject(600, 400, 20, 40, 'crystal'),
        new CollectableObject(650, 400, 20, 40, 'crystal')
    ]
    platforms = [
        new Platform(400, 450, 320, 256, 'img/background/ground/platform.png'),
        new Platform(600, 600, 320, 256, 'img/background/ground/platform.png')
        // new Platform(3300, 600, 192, 256, 'img/background/ground/platform_boss.png')
    ]; // Array für Plattformen
    trampolines = [];
    boss = [];
    meteorites = [];
    backgroundAmount = 5;
    groundAmount = 8;
    level_end_x = 4250;
    level_end_x_left = -1800;
    startTime = Date.now();
    moveDuration = 2000;
    meteoritePosX;
    meteoritePosY = -100;
    meteoriteAttack = false;


    constructor(enemies, dusts) {
        this.enemies = enemies;
        this.dusts = dusts;
        this.backgroundObjects = this.duplicateBackgroundObjects(this.backgroundAmount);
        this.groundObjects = this.duplicateGroundObjects(this.groundAmount);
        this.initializeMeteorites();
    }

    duplicateBackgroundObjects(amount) {
        let duplicateBackgroundObjectsArray = [];
        let pos_x = -2048;
        for (let i = 0; i < amount; i++) {
            duplicateBackgroundObjectsArray.push(new BackgroundObject('img/background/sky.png', pos_x));
            duplicateBackgroundObjectsArray.push(new BackgroundObject('img/background/background.png', pos_x));
            pos_x += 1024;
        }
        return duplicateBackgroundObjectsArray;
    }

    duplicateGroundObjects(amount) {
        let duplicateGroundObjectsArray = [];
        let pos_x = -2048;
        for (let i = 0; i < amount; i++) {
            duplicateGroundObjectsArray.push(new GroundObject('img/background/ground/ground.png', pos_x));
            pos_x += 1024;
        }
        return duplicateGroundObjectsArray;
    }

    initializeMeteorites() {
        setInterval(() => {
            const currentTime = Date.now();

            if (currentTime - this.startTime >= this.moveDuration) {
                this.generateRandomPosX();
                this.meteorites.push(new Meteorites(this.meteoritePosX, this.meteoritePosY));
                this.startTime = currentTime; // Reset the start time for the next meteorite
            }

            // Aktualisiere alle Meteoriten
            this.updateMeteorites();
        }, 1000 / 60);

    }

    updateMeteorites() {
        this.meteorites.forEach(meteorite => {
            meteorite.move();
        });
    }

    generateRandomPosX() {
        if (this.meteoriteAttack) {
            this.meteoritePosX = Math.random() * (4500 - 3500) + 3500;
            this.moveDuration = 500;
        } else {
            this.meteoritePosX = Math.random() * 4300;
            this.moveDuration = 2000;
        }

    }
}