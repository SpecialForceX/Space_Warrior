class Boss extends MovableObject {
    IMAGES_INTRO = [
        'img/enemys/boss/boss_intro_1.png',
        'img/enemys/boss/boss_intro_2.png',
        'img/enemys/boss/boss_intro_3.png',
        'img/enemys/boss/boss_intro_4.png',
        'img/enemys/boss/boss_intro_5.png',
        'img/enemys/boss/boss_intro_6.png'
    ]

    IMAGES_BEAM = [
        'img/enemys/boss/energy_beam/energy_beam_1.png',
        'img/enemys/boss/energy_beam/energy_beam_2.png',
        'img/enemys/boss/energy_beam/energy_beam_3.png'
    ]

    introDone = false;
    bossRoutine = false;
    speed = 2;
    state = 'moving';
    moveDuration = 15000;
    startTime;
    targetX = 3650;
    targetY = 200;
    randomTargetX;
    randomTargetY;
    isAttacking = false;
    energyBeamOn = false;
    targetBeamX = 4100;
    targetBeamY = 310;

    constructor(x, y, width, height) {
        super().loadImg('img/enemys/boss/boss_intro_1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES_INTRO);
        this.loadImgs(this.IMAGES_BEAM);
        this.animate();
        this.startIntro();
    }

    animate() {
        setInterval(() => {
            if (!this.introDone) {
                this.playAnimation(this.IMAGES_INTRO);
            } else if (this.energyBeamOn) {
                this.playAnimation(this.IMAGES_BEAM);
            }
        }, 1000 / 10);
    }

    startIntro() {
        const introInterval = setInterval(() => {
            if (!this.introDone && this.y > 200) {
                this.y -= 1;
            } else {
                this.introDone = true;
                this.bossRoutine = true;
                clearInterval(introInterval); // Stoppe das Intro
                this.startBossRoutine(); // Starte die Boss-Routine
            }
        }, 1000 / 40);
    }

    startBossRoutine() {
        if (this.bossRoutine) {
            this.startTime = Date.now();
            this.setRandomTarget();
            setInterval(() => {
                this.update();
            }, 1000 / 60);
        }
    }

    setRandomTarget() {
        this.randomTargetX = Math.random() * (4000 - 3100) + 3100;
        this.randomTargetY = Math.random() * (400 - 150) + 150;
    }

    update() {
        const currentTime = Date.now();

        switch (this.state) {
            case 'moving':
                this.moveTowardsRandomTarget();
                if (currentTime - this.startTime >= this.moveDuration) {
                    this.state = 'returning';
                }
                break;

            case 'returning':
                this.moveToTarget(this.targetX, this.targetY);
                break;

            case 'idle':
                // Verhalten im idle-Zustand
                break;
        }
    }

    moveTowardsRandomTarget() {
        if (this.x < this.randomTargetX) {
            this.x += this.speed;
        } else if (this.x > this.randomTargetX) {
            this.x -= this.speed;
        }

        if (this.y < this.randomTargetY) {
            this.y += this.speed;
        } else if (this.y > this.randomTargetY) {
            this.y -= this.speed;
        }

        // Wenn das Ziel erreicht ist, ein neues Ziel setzen
        if (Math.abs(this.x - this.randomTargetX) < this.speed && Math.abs(this.y - this.randomTargetY) < this.speed) {
            this.setRandomTarget();
        }
    }

    moveToTarget(targetX, targetY) {
        if (this.x < targetX) {
            this.x += this.speed;
        } else if (this.x > targetX) {
            this.x -= this.speed;
        }

        if (this.y < targetY) {
            this.y += this.speed;
        } else if (this.y > targetY) {
            this.y -= this.speed;
        }

        if (this.x === targetX && this.y === targetY) {
            this.state = 'idle';
            this.isAttacking = true;
            this.onReachTarget();

        }
    }

    onReachTarget() {
        console.log('Boss hat den Zielpunkt erreicht und wechselt in den nächsten Zustand.');

        setInterval(() => {
            if (this.isAttacking) {
                this.startAttacking();
            }
        }, 1000 / 60)

    }

    startAttacking() {
        // console.log('Boss beginnt anzugreifen.');
        this.energyBeam();
    }

    energyBeam() {
        if (this.x < this.targetBeamX) {
            this.x += this.speed;
        }

        if (this.y < this.targetBeamY) {
            this.y += this.speed;
        }

        if (Math.abs(this.x - this.targetBeamX) < this.speed && Math.abs(this.y - this.targetBeamY) < this.speed) {
            console.log('Attack Position arrived');
            this.isAttacking = false;
            this.energyBeamOn = true;
        }

        if (this.x > 3500 && this.energyBeamOn) {
            setInterval(() => {
                this.x -= 1;
            }, 1000 / 60)
        }
    }
}