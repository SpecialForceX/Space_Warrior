class Level {
    enemies;
    dusts;
    backgroundObjects;
    backgroundAmount = 6;
    level_end_x = 700;

    constructor(enemies, dusts) {
        this.enemies = enemies;
        this.dusts = dusts;
        this.backgroundObjects = this.duplicateBackgroundObjects(this.backgroundAmount);
    }

    duplicateBackgroundObjects(amount) {
        let duplicateBackgroundObjectsArray = [];
        let pos_x = -2048;
        for (let i = 0; i < amount; i++) {
            duplicateBackgroundObjectsArray.push(new BackgroundObject('img/background/sky.png', pos_x));
            duplicateBackgroundObjectsArray.push(new BackgroundObject('img/background/background.png', pos_x));
            duplicateBackgroundObjectsArray.push(new BackgroundObject('img/background/ground/ground.png', pos_x));
            pos_x += 1024;
        }
        return duplicateBackgroundObjectsArray;
    }
}