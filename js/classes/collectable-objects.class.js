class CollectableObject extends MovableObject {

    IMAGES_HEART = [
        'img/collectables/collectable_heart_1.png',
        'img/collectables/collectable_heart_2.png',
        'img/collectables/collectable_heart_3.png',
        'img/collectables/collectable_heart_4.png'
    ]

    IMAGES_CRYSTAL = [
        'img/collectables/crystal_1.png',
        'img/collectables/crystal_2.png',
        'img/collectables/crystal_3.png',
        'img/collectables/crystal_4.png',
        'img/collectables/crystal_5.png',
        'img/collectables/crystal_6.png',
        'img/collectables/crystal_7.png',
        'img/collectables/crystal_8.png',
    ]
    
    constructor(x, y, width, height, type) {
        super().loadImg('img/collectables/crystal_1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.loadImgs(this.IMAGES_HEART);
        this.loadImgs(this.IMAGES_CRYSTAL);
        this.animate();
        this.startCrystalAnimation();
    }

    /**
     * Starts the animation cycle for the crystal collectable.
     * The animation cycles through the crystal images every 2 seconds.
     */
    startCrystalAnimation() {
        setInterval(() => {
            this.playAnimationCycle();
        }, 2000);
    }

    /**
     * Plays one cycle of the crystal animation.
     * The animation cycles through the crystal images at a rate of 10 frames per second.
     */
    playAnimationCycle() {
        let elapsed = 0;
        const animationInterval = setInterval(() => {
            if (this.type === 'crystal') {
                this.playAnimation(this.IMAGES_CRYSTAL);
            }
            elapsed += 1;
            if (elapsed >= 8) {
                clearInterval(animationInterval);
            }
        }, 1000 / 10);
    }

    /**
     * Starts the animation for the collectable object.
     * If the object is of type 'heart', it cycles through the heart images at a rate of 5 frames per second.
     */
    animate() {
        setInterval(() => {
            if (this.type == 'heart') {
                this.playAnimation(this.IMAGES_HEART);
            }
        }, 1000 / 5);
    }

    /**
     * Marks the object for destruction.
     * Calls the markForRemoval method to set the isMarkedForRemoval flag to true.
     */
    destroy() {
        this.markForRemoval();
    }

    /**
     * Marks the object for removal from the game world.
     * Sets the isMarkedForRemoval flag to true.
     */
    markForRemoval() {
        this.isMarkedForRemoval = true;
    }
}