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
    trampolines = [];
    boss = [];
    backgroundAmount = 5;
    groundAmount = 8;
    level_end_x = 4250;
    level_end_x_left = -1800;

    constructor(enemies, dusts) {
        this.enemies = enemies;
        this.dusts = dusts;
        this.backgroundObjects = this.duplicateBackgroundObjects(this.backgroundAmount);
        this.groundObjects = this.duplicateGroundObjects(this.groundAmount);
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
}