// ===============================
// UI STATE
// ===============================
let playerScore = 0;
let opponentScore = 0;
let paused = false;

// Cached DOM elements
const ui = {
    playerScore: document.getElementById("playerScore"),
    opponentScore: document.getElementById("opponentScore"),
    spinIndicator: document.getElementById("spinIndicator"),
    speedIndicator: document.getElementById("speedIndicator"),
    pauseBtn: document.getElementById("pauseBtn"),
    pauseMenu: document.getElementById("pauseMenu"),
    resumeBtn: document.getElementById("resumeBtn"),
    endScreen: document.getElementById("endScreen"),
    endMessage: document.getElementById("endMessage"),
    restartBtn: document.getElementById("restartBtn")
};

// ===============================
// SCORE SYSTEM
// ===============================
function addPointToPlayer() {
    playerScore++;
    updateScoreUI();
    checkWinCondition();
}

function addPointToOpponent() {
    opponentScore++;
    updateScoreUI();
    checkWinCondition();
}

function updateScoreUI() {
    ui.playerScore.textContent = playerScore;
    ui.opponentScore.textContent = opponentScore;
}

// ===============================
// SPIN + SPEED INDICATORS
// ===============================
function updateSpinUI(spinValue) {
    ui.spinIndicator.textContent = "Spin: " + spinValue.toFixed(2);
}

function updateSpeedUI(speedValue) {
    ui.speedIndicator.textContent = "Speed: " + speedValue.toFixed(2);
}

// ===============================
// PAUSE SYSTEM
// ===============================
ui.pauseBtn.onclick = () => {
    paused = true;
    ui.pauseMenu.classList.remove("hidden");
};

ui.resumeBtn.onclick = () => {
    paused = false;
    ui.pauseMenu.classList.add("hidden");
};

// ===============================
// END SCREEN
// ===============================
function showEndScreen(message) {
    ui.endMessage.textContent = message;
    ui.endScreen.classList.remove("hidden");
    paused = true;
}

ui.restartBtn.onclick = () => {
    location.reload();
};

// ===============================
// WIN / LOSE LOGIC
// ===============================
function checkWinCondition() {
    if (playerScore >= 11 && playerScore - opponentScore >= 2) {
        showEndScreen("You Win!");
    }

    if (opponentScore >= 11 && opponentScore - playerScore >= 2) {
        showEndScreen("You Lose!");
    }
}

// ===============================
// EXPORTS (if needed)
// ===============================
window.UI = {
    addPointToPlayer,
    addPointToOpponent,
    updateSpinUI,
    updateSpeedUI,
    paused: () => paused
};// UI can be added later (score, spin meter, etc.)
