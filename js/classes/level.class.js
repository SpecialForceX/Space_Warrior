class Level {
    enemies;
    dusts;
    backgroundObjects;
    groundObjects;
    heartObjects = [
        // new CollectableObject(1100, 200, 28, 24, 'heart')
    ]
    crystalObjects = [
        new CollectableObject(-2500, 380, 20, 40, 'crystal'),
        new CollectableObject(-2600, 380, 20, 40, 'crystal'),
        new CollectableObject(1225, 550, 20, 40, 'crystal'),
        new CollectableObject(1275, 550, 20, 40, 'crystal'),
        new CollectableObject(1325, 550, 20, 40, 'crystal'),
        new CollectableObject(1375, 550, 20, 40, 'crystal'),
        new CollectableObject(1425, 550, 20, 40, 'crystal'),
        new CollectableObject(1475, 550, 20, 40, 'crystal'),
        new CollectableObject(1425, 400, 20, 40, 'crystal'),
        new CollectableObject(1475, 400, 20, 40, 'crystal'),
        new CollectableObject(1525, 400, 20, 40, 'crystal'),
        new CollectableObject(1575, 400, 20, 40, 'crystal'),
        new CollectableObject(1625, 400, 20, 40, 'crystal'),
        new CollectableObject(1675, 400, 20, 40, 'crystal'),
        new CollectableObject(1725, 300, 20, 40, 'crystal'),
        new CollectableObject(1775, 200, 20, 40, 'crystal'),
        new CollectableObject(1825, 100, 20, 40, 'crystal'),
        new CollectableObject(1875, 100, 20, 40, 'crystal'),
        new CollectableObject(1925, 200, 20, 40, 'crystal'),
        new CollectableObject(1675, 650, 20, 40, 'crystal'),
        new CollectableObject(1625, 650, 20, 40, 'crystal'),
        new CollectableObject(1575, 650, 20, 40, 'crystal'),
        new CollectableObject(2525, 400, 20, 40, 'crystal'),
        new CollectableObject(2575, 400, 20, 40, 'crystal'),
        new CollectableObject(2625, 400, 20, 40, 'crystal'),
        new CollectableObject(2675, 400, 20, 40, 'crystal'),
        new CollectableObject(2325, 550, 20, 40, 'crystal'),
        new CollectableObject(2375, 550, 20, 40, 'crystal'),
        new CollectableObject(2425, 550, 20, 40, 'crystal'),
        new CollectableObject(2475, 550, 20, 40, 'crystal'),
        new CollectableObject(2525, 550, 20, 40, 'crystal'),
        new CollectableObject(2575, 550, 20, 40, 'crystal')
        
    ]
    platforms = [
        new Platform(-1800, 550, 320, 256, 'img/background/ground/platform.png'),
        new Platform(-1000, 550, 320, 256, 'img/background/ground/platform.png'),
        new Platform(1400, 450, 320, 256, 'img/background/ground/platform.png'),
        new Platform(1200, 600, 320, 256, 'img/background/ground/platform.png'),
        new Platform(2400, 450, 320, 256, 'img/background/ground/platform.png'),
        new Platform(2200, 500, 320, 256, 'img/background/ground/platform.png'),
        new Platform(2300, 600, 320, 256, 'img/background/ground/platform.png'),
        new Platform(2950, 600, 320, 256, 'img/background/ground/platform.png'),

    ];
    trampolines = [
        new Trampoline(-1270, 644),
        new Trampoline(1950, 644),
        new Trampoline(3075, 644)
    ];
    boss = [];
    shield = [];
    meteorites = [];
    healthbar = [];
    backgroundAmount = 5;
    groundAmount = 10;
    level_end_x = 4250;
    level_end_x_left = -2750;
    startTime = Date.now();
    moveDuration = 2000;
    meteoritePosX;
    meteoritePosY = -100;
    meteoriteAttack = false;
    beamProtection = [];
    rockets = [];
    border = [new Border(-3500, 0)]


    constructor(enemies, dusts) {
        this.enemies = enemies;
        this.dusts = dusts;
        this.backgroundObjects = this.duplicateBackgroundObjects(this.backgroundAmount);
        this.groundObjects = this.duplicateGroundObjects(this.groundAmount);
        this.initializeMeteorites();
    }

    /**
    * Duplicates background objects to create a seamless scrolling background.
    * @param {number} amount - The number of background objects to duplicate.
    * @returns {Array} - An array of duplicated background objects.
    */
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

    /**
    * Duplicates ground objects to create a seamless scrolling ground.
    * @param {number} amount - The number of ground objects to duplicate.
    * @returns {Array} - An array of duplicated ground objects.
    */
    duplicateGroundObjects(amount) {
        let duplicateGroundObjectsArray = [];
        let pos_x = -3072;
        for (let i = 0; i < amount; i++) {
            duplicateGroundObjectsArray.push(new GroundObject('img/background/ground/ground.png', pos_x));
            pos_x += 1024;
        }
        return duplicateGroundObjectsArray;
    }

    /**
    * Initializes meteorites in the level. Meteorites will be generated and moved periodically.
    */
    initializeMeteorites() {
        setInterval(() => {
            if (!gameStarted || gamePaused) return; 
            const currentTime = Date.now();

            if (currentTime - this.startTime >= this.moveDuration) {
                this.generateRandomPosX();
                this.meteorites.push(new Meteorites(this.meteoritePosX, this.meteoritePosY));
                this.startTime = currentTime;
            }
            this.updateMeteorites();
        }, 1000 / 60);

    }

    /**
    * Updates the position of meteorites in the level.
    */
    updateMeteorites() {
        if (!gameStarted || gamePaused) return;
        this.meteorites.forEach(meteorite => {
            meteorite.move();
        });
    }

    /**
    * Generates a random x position for meteorites based on whether a meteorite attack is occurring.
    */
    generateRandomPosX() {
        if (this.meteoriteAttack) {
            this.meteoritePosX = Math.random() * (4500 - 3500) + 3500;
            this.moveDuration = 500;
        } else {
            this.meteoritePosX = Math.random() * 4300;
            this.moveDuration = 2000;
        }
    }

    /**
    * Initializes enemies in the level.
    */
    initializeEnemys() {
        this.enemies.push(new Alien2(2425, 310),
        new Alien(1700, 300),
        new Alien(2400, 640),
        new Alien(2000, 640),
        new Alien(2800, 640),
        new Alien(2600, 300))
    }
}