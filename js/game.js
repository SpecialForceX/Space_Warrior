let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gamePaused = false;
let music = true;
let sounds = true;

const menuImage = new Image();
const settingsImage = new Image();
const controlsImage = new Image();
const soundMenuImage = new Image();

menuImage.src = 'img/menu/Menu.png';
settingsImage.src = 'img/menu/Settings.png';
controlsImage.src = 'img/menu/controls.png';
soundMenuImage.src = 'img/menu/sound_menu.png';


let currentMenu = 'main';

const clickSound = new Audio('audio/sounds/menu_click.ogg');

/**
 * Initializes the game by setting up the canvas and showing the main menu.
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    showMenu();
}

/**
 * Displays the main menu on the canvas.
 */
function showMenu() {
    currentMenu = 'main';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

function showSettings() {
    currentMenu = 'settings';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(settingsImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

function showControls() {
    currentMenu = 'controls';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(controlsImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

function showSoundMenu() {
    currentMenu = 'soundMenu';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(soundMenuImage, 0, 0, canvas.width, canvas.height);
    showRightButtons();
}

function showRightButtons() {
    const buttons = ['playButton', 'settingsButton', 'controlsButton', 'soundsButton', 'imprintButton', 'privacyButton', 'backButton', 'soundEffectsButton', 'musicButton', 'soundEffectsHaken', 'musicHaken'];
    buttons.forEach(button => document.getElementById(button).classList.add('display-none'));

    if (currentMenu === 'main') {
        ['playButton', 'settingsButton', 'controlsButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'settings') {
        ['soundsButton', 'imprintButton', 'privacyButton', 'backButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'controls'){
        ['backButton'].forEach(button => document.getElementById(button).classList.remove('display-none'));
    } else if (currentMenu === 'soundMenu') {
        ['soundEffectsButton', 'musicButton', 'backButton', 'soundEffectsHaken', 'musicHaken'].forEach(button => document.getElementById(button).classList.remove('display-none'));
        updateSoundButtons();
    }
}

function showMobileButton() {
    if (window.innerHeight < 768 && gameStarted) {
        document.getElementById('moveLeftButton').classList.remove('display-none');
        document.getElementById('moveRightButton').classList.remove('display-none');
        document.getElementById('jumpButton').classList.remove('display-none');
        document.getElementById('shootButton').classList.remove('display-none');
    } else {
        document.getElementById('moveLeftButton').classList.add('display-none');
        document.getElementById('moveRightButton').classList.add('display-none');
        document.getElementById('jumpButton').classList.add('display-none');
        document.getElementById('shootButton').classList.add('display-none');
    }
}

// Überprüft alle 500 Millisekunden
setInterval(showMobileButton, 500);

function startGame() {
    gameStarted = true;
    document.getElementById('playButton').classList.add('display-none');
    document.getElementById('settingsButton').classList.add('display-none');
    document.getElementById('controlsButton').classList.add('display-none');
    setupTouchControls();
    showMobileButton();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (world) world = null;
    world = new World(canvas, keyboard);
    gamePaused = false;
}

function openImprintPage() {
    window.open('html/imprint.html', '_blank');
}

function openPrivacyPage() {
    window.open('html/privacy.html', '_blank');
}

function toggleSoundEffects() {
    sounds = !sounds;
    updateSoundButtons();
}

function toggleMusic() {
    music = !music;
    updateSoundButtons();
}

function updateSoundButtons() {
    document.getElementById('soundEffectsHaken').src = sounds ? 'img/menu/haken_selected.png' : 'img/menu/haken_unselected.png';
    document.getElementById('musicHaken').src = music ? 'img/menu/haken_selected.png' : 'img/menu/haken_unselected.png';
}

function setupTouchControls() {
    const moveLeftButton = document.getElementById('moveLeftButton');
    const moveRightButton = document.getElementById('moveRightButton');
    const jumpButton = document.getElementById('jumpButton');
    const shootButton = document.getElementById('shootButton');

    moveLeftButton.addEventListener('touchstart', () => {
        keyboard.LEFT = true;
    });

    moveLeftButton.addEventListener('touchend', () => {
        keyboard.LEFT = false;
    });

    moveRightButton.addEventListener('touchstart', () => {
        keyboard.RIGHT = true;
    });

    moveRightButton.addEventListener('touchend', () => {
        keyboard.RIGHT = false;
    });

    jumpButton.addEventListener('touchstart', () => {
        keyboard.SPACE = true;
    });

    jumpButton.addEventListener('touchend', () => {
        keyboard.SPACE = false;
    });

    shootButton.addEventListener('touchstart', () => {
        keyboard.ENTER = true;
    });

    shootButton.addEventListener('touchend', () => {
        keyboard.ENTER = false;
    });
}




/**
 * Toggles the game pause state.
 */
function togglePause() {
    if (gameStarted) {
        gamePaused = !gamePaused;
        if (!gamePaused) resumeEnemyAnimation();
    }
}

/**
 * Resumes animation for all alive enemies.
 */
function resumeEnemyAnimation() {
    world.level.enemies.forEach(enemy => {
        if (enemy instanceof Alien2 && enemy.isAlive) enemy.animate();
    });
}

/**
 * Handles keyboard keydown events.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyDown(event) {
    if (event.keyCode == 68) keyboard.RIGHT = true;
    if (event.keyCode == 65) keyboard.LEFT = true;
    if (event.keyCode == 87) keyboard.UP = true;
    if (event.keyCode == 83) keyboard.DOWN = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 13) keyboard.ENTER = true;
}

/**
 * Handles keyboard keyup events.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyUp(event) {
    if (event.keyCode == 68) keyboard.RIGHT = false;
    if (event.keyCode == 65) keyboard.LEFT = false;
    if (event.keyCode == 87) keyboard.UP = false;
    if (event.keyCode == 83) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 13) keyboard.ENTER = false;
}

// function startFullscreen() {
//     let fullscreenDiv = document.getElementById('fullscreen');
//     fullscreen(fullscreenDiv);
// }

// /**
//  * Toggles fullscreen mode for the specified element.
//  * @param {HTMLElement} element - The element to toggle fullscreen.
//  */
// function fullscreen(element) {
//     if (element.requestFullscreen) element.requestFullscreen();
//     else if (element.msRequestFullscreen) element.msRequestFullscreen();
//     else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
// }

// /**
//  * Exits fullscreen mode.
//  */
// function exitFullscreen() {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
// }

// Event-Listener für Pausen-Taste (z.B. "P")
document.addEventListener('keydown', (event) => {
    if (event.key === 'P' || event.key === 'p') togglePause();
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

// Initialisieren Sie das Menü
window.addEventListener('load', init);

// /**
//  * Handles mouse movement events on the canvas.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleMouseMove(event) {
//     const { x, y } = getMousePos(event);
//     if (currentMenu === 'main') handleMainMenuMouseMove(x, y);
//     else if (currentMenu === 'controls') handleControlsMenuMouseMove(x, y);
//     else if (currentMenu === 'settings') handleSettingsMenuMouseMove(x, y);
// }

// /**
//  * Handles mouse movement events in the main menu.
//  * @param {number} x - The x-coordinate of the mouse.
//  * @param {number} y - The y-coordinate of the mouse.
//  */
// function handleMainMenuMouseMove(x, y) {
//     if (isWithinBounds(x, y, 320, 740, 310, 380)) drawImage(playImage);
//     else if (isWithinBounds(x, y, 320, 740, 427, 497)) drawImage(settingsImage);
//     else if (isWithinBounds(x, y, 320, 740, 543, 613)) drawImage(controlsImage);
//     else drawImage(menuImage);
// }

// /**
//  * Handles mouse movement events in the controls menu.
//  * @param {number} x - The x-coordinate of the mouse.
//  * @param {number} y - The y-coordinate of the mouse.
//  */
// function handleControlsMenuMouseMove(x, y) {
//     if (isWithinBounds(x, y, 770, 820, 635, 685)) drawImage(controlsMenuHover);
//     else drawImage(controlsMenu);
// }

// /**
//  * Handles mouse movement events in the settings menu.
//  * @param {number} x - The x-coordinate of the mouse.
//  * @param {number} y - The y-coordinate of the mouse.
//  */
// function handleSettingsMenuMouseMove(x, y) {
//     if (isWithinBounds(x, y, 770, 820, 635, 685)) drawImage(settingsMenuReturn);
//     else if (isWithinBounds(x, y, 320, 740, 310, 380)) drawImage(settingsMenuSounds);
//     else if (isWithinBounds(x, y, 320, 740, 427, 497)) drawImage(settingsMenuImprint);
//     else if (isWithinBounds(x, y, 320, 740, 543, 613)) drawImage(settingsMenuPrivacy);
//     else drawImage(settingsMenu);
// }

// /**
//  * Checks if a point is within a specified rectangular bounds.
//  * @param {number} x - The x-coordinate of the point.
//  * @param {number} y - The y-coordinate of the point.
//  * @param {number} x1 - The x-coordinate of the top-left corner of the rectangle.
//  * @param {number} x2 - The x-coordinate of the bottom-right corner of the rectangle.
//  * @param {number} y1 - The y-coordinate of the top-left corner of the rectangle.
//  * @param {number} y2 - The y-coordinate of the bottom-right corner of the rectangle.
//  * @returns {boolean} True if the point is within the bounds, false otherwise.
//  */
// function isWithinBounds(x, y, x1, x2, y1, y2) {
//     return x >= x1 && x <= x2 && y >= y1 && y <= y2;
// }

// /**
//  * Draws an image on the canvas.
//  * @param {HTMLImageElement} image - The image to draw.
//  */
// function drawImage(image) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
// }

// /**
//  * Handles click events on the canvas for menu interactions.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleMenuClick(event) {
//     const { x, y } = getMousePos(event);
//     if (currentMenu === 'main') handleMainMenuClick(x, y);
//     else if (currentMenu === 'controls') handleControlsMenuClick(x, y);
//     else if (currentMenu === 'settings') handleSettingsMenuClick(x, y);
// }

// /**
//  * Handles click events in the main menu.
//  * @param {number} x - The x-coordinate of the click.
//  * @param {number} y - The y-coordinate of the click.
//  */
// function handleMainMenuClick(x, y) {
//     if (isWithinBounds(x, y, 320, 740, 310, 380)) {
//         removeMenuEventListeners();
//         clickSound.play();
//         startGame();
//     } else if (isWithinBounds(x, y, 320, 740, 427, 497)) {
//         currentMenu = 'settings';
//         drawImage(settingsMenu);
//         clickSound.play();
//     } else if (isWithinBounds(x, y, 320, 740, 543, 613)) {
//         currentMenu = 'controls';
//         drawImage(controlsMenu);
//         clickSound.play();
//     }
// }

// /**
//  * Handles click events in the controls menu.
//  * @param {number} x - The x-coordinate of the click.
//  * @param {number} y - The y-coordinate of the click.
//  */
// function handleControlsMenuClick(x, y) {
//     if (isWithinBounds(x, y, 770, 820, 635, 685)) {
//         currentMenu = 'main';
//         drawImage(menuImage);
//         clickSound.play();
//     }
// }

// /**
//  * Handles click events in the settings menu.
//  * @param {number} x - The x-coordinate of the click.
//  * @param {number} y - The y-coordinate of the click.
//  */
// function handleSettingsMenuClick(x, y) {
//     if (isWithinBounds(x, y, 770, 820, 635, 685)) {
//         currentMenu = 'main';
//         drawImage(menuImage);
//         clickSound.play();
//     } else if (isWithinBounds(x, y, 320, 740, 310, 380)) {
//         clickSound.play();
//         showSoundMenu(); // Initialisiere und zeige das Sound-Menü
//     } else if (isWithinBounds(x, y, 320, 740, 427, 497)) {
//         window.open('html/imprint.html', '_blank');
//         clickSound.play();
//     } else if (isWithinBounds(x, y, 320, 740, 543, 613)) {
//         window.open('html/privacy.html', '_blank');
//         clickSound.play();
//     }
// }

// /**
//  * Gets the mouse position relative to the canvas.
//  * @param {MouseEvent} event - The mouse event.
//  * @returns {Object} The mouse position {x, y}.
//  */
// function getMousePos(event) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }

// /**
//  * Removes menu event listeners from the canvas.
//  */
// function removeMenuEventListeners() {
//     canvas.removeEventListener('mousemove', handleMouseMove);
//     canvas.removeEventListener('click', handleMenuClick);
// }

// /**
//  * Adds menu event listeners to the canvas.
//  */
// function addMenuEventListeners() {
//     canvas.addEventListener('mousemove', handleMouseMove);
//     canvas.addEventListener('click', handleMenuClick);
// }



// /**
//  * Displays the sound menu on the canvas based on the current settings.
//  */
// function showSoundMenu() {
//     currentMenu = 'sound';
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     if (music && sounds) {
//         ctx.drawImage(soundMenuMusicOnSoundsOn, 0, 0, canvas.width, canvas.height);
//     } else if (music && !sounds) {
//         ctx.drawImage(soundMenuMusicOnSoundsOff, 0, 0, canvas.width, canvas.height);
//     } else if (!music && sounds) {
//         ctx.drawImage(soundMenuMusicOffSoundsOn, 0, 0, canvas.width, canvas.height);
//     } else {
//         ctx.drawImage(soundMenuMusicOffSoundsOff, 0, 0, canvas.width, canvas.height);
//     }
//     addSoundMenuEventListeners();
// }

// /**
//  * Adds event listeners for the sound menu.
//  */
// function addSoundMenuEventListeners() {
//     canvas.addEventListener('mousemove', handleSoundMenuMouseMove);
//     canvas.addEventListener('click', handleSoundMenuClick);
// }

// /**
//  * Removes event listeners for the sound menu.
//  */
// function removeSoundMenuEventListeners() {
//     canvas.removeEventListener('mousemove', handleSoundMenuMouseMove);
//     canvas.removeEventListener('click', handleSoundMenuClick);
// }

// /**
//  * Handles mouse movement events in the sound menu.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleSoundMenuMouseMove(event) {
//     const { x, y } = getMousePos(event);
//     if (isWithinBounds(x, y, 320, 740, 310, 380)) {
//         // Update coordinates as needed
//     } else if (isWithinBounds(x, y, 320, 740, 427, 497)) {
//         // Update coordinates as needed
//     } else if (isWithinBounds(x, y, 320, 740, 543, 613)) {
//         // Update coordinates as needed
//     }
// }

// /**
//  * Handles click events in the sound menu.
//  * @param {MouseEvent} event - The mouse event.
//  */
// function handleSoundMenuClick(event) {
//     const { x, y } = getMousePos(event);
//     if (isWithinBounds(x, y, 320, 740, 310, 380)) {
//         sounds = !sounds;
//         clickSound.play();
//         showSoundMenu();
//     } else if (isWithinBounds(x, y, 320, 740, 427, 497)) {
//         music = !music;
//         clickSound.play();
//         showSoundMenu();
//     } else if (isWithinBounds(x, y, 770, 820, 635, 685)) {
//         clickSound.play();
//         removeSoundMenuEventListeners();
//         currentMenu = 'settings';
//         drawImage(settingsMenu);
//     };
// }
