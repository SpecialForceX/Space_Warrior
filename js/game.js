let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gamePaused = false;

const menuImage = new Image();
const playImage = new Image();
const settingsImage = new Image();
const controlsImage = new Image();
const controlsMenu = new Image();
const controlsMenuHover = new Image();
const settingsMenu = new Image();
const settingsMenuMusic = new Image();
const settingsMenuSounds = new Image();
const settingsMenuImprint = new Image();
const settingsMenuPrivacy = new Image();
const settingsMenuReturn = new Image();

menuImage.src = 'img/menu/Menu.png';
playImage.src = 'img/menu/Menu_play_hover.png';
settingsImage.src = 'img/menu/Menu_settings_hover.png';
controlsImage.src = 'img/menu/Menu_controls_hover.png';
controlsMenu.src = 'img/menu/controls.png';
controlsMenuHover.src = 'img/menu/controls_hover.png';
settingsMenu.src = 'img/menu/Settings.png';
settingsMenuReturn.src = 'img/menu/Settings_return_hover.png';
settingsMenuMusic.src = 'img/menu/Settings_music_hover.png';
settingsMenuSounds.src = 'img/menu/Settings_sounds_hover.png';
settingsMenuImprint.src = 'img/menu/Settings_imprint_hover.png';
settingsMenuPrivacy.src = 'img/menu/Settings_privacy_hover.png';

let currentMenu = 'main';


function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    showMenu();
}

function showMenu() {

    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleMenuClick);
}


function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentMenu === 'main') {
        // Main menu buttons Bereich
        if (x >= 320 && x <= 740 && y >= 310 && y <= 380) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(playImage, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 427 && y <= 497) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsImage, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 543 && y <= 613) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(controlsImage, 0, 0, canvas.width, canvas.height);

        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);

        }
    } else if (currentMenu === 'controls') {
        // Controls menu button Bereich
        if (x >= 770 && x <= 820 && y >= 635 && y <= 685) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(controlsMenuHover, 0, 0, canvas.width, canvas.height);

        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(controlsMenu, 0, 0, canvas.width, canvas.height);

        }

    } else if (currentMenu === 'settings') {
        // Settings menu button Bereich
        if (x >= 770 && x <= 820 && y >= 635 && y <= 685) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenuReturn, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 275 && y <= 345) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenuMusic, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 380 && y <= 450) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenuSounds, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 485 && y <= 555) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenuImprint, 0, 0, canvas.width, canvas.height);

        } else if (x >= 320 && x <= 740 && y >= 590 && y <= 660) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenuPrivacy, 0, 0, canvas.width, canvas.height);

        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenu, 0, 0, canvas.width, canvas.height);

        }
    }
}

function handleMouseLeave() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);

}

function handleMenuClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentMenu === 'main') {
        // Main menu buttons click Bereich
        if (x >= 320 && x <= 740 && y >= 310 && y <= 380) {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('click', handleMenuClick);
            startGame();
        } else if (x >= 320 && x <= 740 && y >= 427 && y <= 497) {
            // Handle Settings Button Click
            currentMenu = 'settings';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(settingsMenu, 0, 0, canvas.width, canvas.height);
        } else if (x >= 320 && x <= 740 && y >= 543 && y <= 613) {
            // Handle Controls Button Click
            currentMenu = 'controls';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(controlsMenu, 0, 0, canvas.width, canvas.height);
        }
    } else if (currentMenu === 'controls') {
        // Controls menu button click Bereich
        if (x >= 770 && x <= 820 && y >= 635 && y <= 685) {
            currentMenu = 'main';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
        }
    } else if (currentMenu === 'settings') {
        // Settings menu button Bereich
        if (x >= 770 && x <= 820 && y >= 635 && y <= 685) {
            currentMenu = 'main';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
        } else if (x >= 320 && x <= 740 && y >= 275 && y <= 345) {
            console.log('music');
    
        } else if (x >= 320 && x <= 740 && y >= 380 && y <= 450) {
            console.log('sounds');
    
        } else if (x >= 320 && x <= 740 && y >= 485 && y <= 555) {
            window.open('html/imprint.html', '_blank');
    
        } else if (x >= 320 && x <= 740 && y >= 590 && y <= 660) {
            window.open('html/privacy.html', '_blank');
        }
    }
}

function startGame() {
    gameStarted = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    world = new World(canvas, keyboard);
}


function fullscreen() {
    let fullscreen = document.getElementById('fullscreen');
    enterFullscreen(fullscreen);
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {  // iOS Safari
        element.webkitRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function togglePause() {
    if (gameStarted) {
        gamePaused = !gamePaused;
    }
}

// Event-Listener für Pausen-Taste (z.B. "P")
document.addEventListener('keydown', (event) => {
    if (event.key === 'P' || event.key === 'p') {
        togglePause();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 68) {
        keyboard.RIGHT = true;
    }

    if (event.keyCode == 65) {
        keyboard.LEFT = true;
    }

    if (event.keyCode == 87) {
        keyboard.UP = true;
    }

    if (event.keyCode == 83) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 13) {
        keyboard.ENTER = true;
    }

})

window.addEventListener("keyup", (event) => {
    if (event.keyCode == 68) {
        keyboard.RIGHT = false;
    }

    if (event.keyCode == 65) {
        keyboard.LEFT = false;
    }

    if (event.keyCode == 87) {
        keyboard.UP = false;
    }

    if (event.keyCode == 83) {
        keyboard.DOWN = false;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 13) {
        keyboard.ENTER = false;
    }

})

// Initialisieren Sie das Menü
window.addEventListener('load', init);