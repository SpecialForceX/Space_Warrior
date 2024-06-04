class Level {
    enemies;
    dusts;
    backgroundObjects;
    groundObjects;
    backgroundAmount = 4;
    groundAmount = 6;
    level_end_x = 3000;
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