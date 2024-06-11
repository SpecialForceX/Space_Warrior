class Boss extends MovableObject {
    IMAGES_INTRO = [
        'img/enemys/boss/boss_intro_1.png',
        'img/enemys/boss/boss_intro_2.png',
        'img/enemys/boss/boss_intro_3.png',
        'img/enemys/boss/boss_intro_4.png',
        'img/enemys/boss/boss_intro_5.png',
        'img/enemys/boss/boss_intro_6.png'
    ];

    IMAGES_BEAM = [
        'img/enemys/boss/energy_beam/energy_beam_1.png',
        'img/enemys/boss/energy_beam/energy_beam_2.png',
        'img/enemys/boss/energy_beam/energy_beam_3.png'
    ];

    IMAGES_DIED = [
        'img/enemys/boss/explosion/boss_explosion_1.png',
        'img/enemys/boss/explosion/boss_explosion_2.png',
        'img/enemys/boss/explosion/boss_explosion_3.png',
        'img/enemys/boss/explosion/boss_explosion_4.png',
        'img/enemys/boss/explosion/boss_explosion_5.png',
        'img/enemys/boss/explosion/boss_explosion_6.png',
        'img/enemys/boss/explosion/boss_explosion_7.png',
        'img/enemys/boss/explosion/boss_explosion_8.png',
        'img/enemys/boss/explosion/boss_explosion_9.png'
    ]


    introDone = false;
    bossRoutine = false;
    speed = 2;
    increasedSpeed = 4;
    state = 'moving';
    moveDuration = 15000;
    startTime;
    targetX = 3650;
    targetY = 200;
    targetBeamX = 4050;
    targetBeamY = 310;
    randomTargetX;
    randomTargetY;
    isAttacking = false;
    energyBeamOn = false;
    isAttackingEnergyBeam = false;
    meteoriteAttackCounter = 15;
    alienDropping = false;
    isAttackingAlienDrop = false;
    alienDropCounter = 0;
    alienDropMax = 6;
    life = 5;

    constructor(x, y, width, height) {
        super().loadImg('img/enemys/boss/boss_intro_1.png');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImgs(this.IMAGES_INTRO);
        this.loadImgs(this.IMAGES_BEAM);
        this.loadImgs(this.IMAGES_DIED);
        this.animate();
        this.startIntro();
        this.bossRush();
        this.offsetRight = 20;
        this.offsetLeft = 20;
        this.offsetTop = 40;
        this.offsetBottom = 270;
    }

    animate() {
        setInterval(() => {
            if (this.energyBeamOn && this.isAlive) {
                this.playAnimation(this.IMAGES_BEAM);
            } else if (!this.isAlive) {
                this.playAnimation(this.IMAGES_DIED);
            } else {
                this.playAnimation(this.IMAGES_INTRO);
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
                world.level.shield.push(new Shield(3650, 800, 435, 230));
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
        if (this.isAlive) {
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
                if (!this.isAttackingAlienDrop) {
                    this.setRandomTarget();
                }
            }

            world.level.shield.forEach(shield => shield.updatePositionShield());
        }
    }

    moveToTarget(targetX, targetY) {
        if (this.isAlive) {


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

            if (Math.abs(this.x - targetX) < this.speed && Math.abs(this.y - targetY) < this.speed) {
                this.state = 'idle';
                this.isAttacking = true;
                this.onReachTarget();
            }

            world.level.shield.forEach(shield => shield.updatePositionShield());
        }
    }

    onReachTarget() {
        console.log('Boss hat den Zielpunkt erreicht und wechselt in den nächsten Zustand.');
        this.startAttacking();
    }

    startAttacking() {
        const attackType = 0; // Wähle eine zufällige Attacke aus 3 möglichen Math.floor(Math.random() * 3)
        this.executeAttack(attackType);
    }

    executeAttack(attackType) {
        switch (attackType) {
            case 0:
                this.attackType1();
                break;
            case 1:
                this.attackType2();
                break;
            case 2:
                this.attackType3();
                break;
        }
    }

    attackType1() {
        if (this.isAlive) {
            console.log('Boss führt Attacke 1 aus.');
            this.isAttackingEnergyBeam = true;
            const energyBeamIntervall = setInterval(() => {
                this.energyBeam();
                if (!this.isAttackingEnergyBeam) {
                    clearInterval(energyBeamIntervall);
                }
            }, 1000 / 60);
        }
    }

    attackType2() {
        if (this.isAlive) {
            console.log('Boss führt Attacke 2 aus.');
            this.speed = 10;
            const meteoriteAttackInterval1 = setInterval(() => {
                if (this.x < 5000) {
                    world.level.shield.forEach(shield => shield.updatePositionShield());
                    this.x += this.speed;
                } else {
                    this.meteoriteAttack();
                    clearInterval(meteoriteAttackInterval1);
                }
            }, 1000 / 60)
        }

    }

    attackType3() {
        if (this.isAlive) {


            console.log('Boss führt Attacke 3 aus.');
            this.isAttackingAlienDrop = true;
            this.alienDropCounter = 0;
            this.speed = this.increasedSpeed;
            this.alienDrop();
        }
    }

    finishAttack() {
        setTimeout(() => {
            this.energyBeamOn = false;
            this.state = 'moving';
            this.startTime = Date.now();
            this.setRandomTarget();
        }, 5000); // Nach 5 Sekunden wird der Angriff beendet und der Boss bewegt sich wieder
    }

    energyBeam() {
        if (this.isAlive) {
            this.targetBeamX = 4050;
            this.targetBeamY = 310;
            world.level.shield.forEach(shield => shield.updatePositionShield());
            if (this.x < this.targetBeamX && !this.energyBeamOn) {
                this.x += this.speed;
            }

            if (this.y < this.targetBeamY && !this.energyBeamOn) {
                this.y += this.speed;
            }

            if (Math.abs(this.x - this.targetBeamX) < this.speed && Math.abs(this.y - this.targetBeamY) < this.speed) {
                console.log('Attack Position arrived');
                this.isAttacking = false;
                this.energyBeamOn = true;
            }

            if (this.energyBeamOn) {
                this.offsetRight = 100;
                this.offsetLeft = 100;
                this.offsetTop = 40;
                this.offsetBottom = 0;
                this.x -= 2;
                if (this.x < 3200) {
                    this.isAttackingEnergyBeam = false;
                    this.offsetRight = 20;
                    this.offsetLeft = 20;
                    this.offsetTop = 40;
                    this.offsetBottom = 270;
                    this.finishAttack();
                }
            }
        }
    }

    meteoriteAttack() {
        world.level.meteoriteAttack = true;
        this.meteoriteAttackCounter = 15;
        const meteoriteAttackInterval = setInterval(() => {

            this.meteoriteAttackCounter -= 1
            if (this.meteoriteAttackCounter <= 0) {



                const returnToTargetInterval = setInterval(() => {
                    if (this.x > this.targetX) {
                        world.level.shield.forEach(shield => shield.updatePositionShield());
                        this.x -= this.speed;
                    } else {
                        this.finishAttack();
                        clearInterval(returnToTargetInterval);
                        this.meteoriteAttackCounter = 0;
                        world.level.meteoriteAttack = false;
                        this.finishAttack();
                        clearInterval(meteoriteAttackInterval);
                        this.speed = 2
                    }
                }, 1000 / 60);
                console.log('attack End');



            }
        }, 1000);
    }

    alienDrop() {
        if (this.alienDropCounter < this.alienDropMax) {
            this.setRandomTarget(); // Setze ein zufälliges Ziel
            const moveInterval = setInterval(() => {
                this.moveTowardsRandomTarget();
                if (Math.abs(this.x - this.randomTargetX) < this.speed && Math.abs(this.y - this.randomTargetY) < this.speed) {
                    clearInterval(moveInterval);
                    world.level.enemies.push(new Alien(this.x + 150, this.y + 150)); // Wirf ein Alien ab
                    this.alienDropCounter++;
                    setTimeout(() => {
                        this.alienDrop(); // Wiederhole den Vorgang nach einer Sekunde Verzögerung
                    }, 1000); // Verzögerung von einer Sekunde
                }
            }, 1000 / 60);
        } else {
            this.finishAttack();
            this.isAttackingAlienDrop = false;
            this.speed = 2;
        }
    }

    bossRush() {
        setInterval(() => {
            if (this.life < 2) {
                this.speed = 3;
            }
        }, 1000 / 60);
    }


}
