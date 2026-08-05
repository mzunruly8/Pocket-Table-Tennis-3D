let playerScore = 0;
let opponentScore = 0;
let paused = false;
let gameOver = false;

const ui = {
    playerScore: document.getElementById("playerScore"),
    opponentScore: document.getElementById("opponentScore"),
    spinIndicator: document.getElementById("spinIndicator"),
    speedIndicator: document.getElementById("speedIndicator"),
    statusText: document.getElementById("statusText"),
    pauseBtn: document.getElementById("pauseBtn"),
    pauseMenu: document.getElementById("pauseMenu"),
    resumeBtn: document.getElementById("resumeBtn"),
    pauseRestartBtn: document.getElementById("pauseRestartBtn"),
    endScreen: document.getElementById("endScreen"),
    endMessage: document.getElementById("endMessage"),
    finalScore: document.getElementById("finalScore"),
    restartBtn: document.getElementById("restartBtn")
};

function setStatus(message) {
    ui.statusText.textContent = message;
}

function updateScoreUI() {
    ui.playerScore.textContent = playerScore;
    ui.opponentScore.textContent = opponentScore;
}

function updateSpinUI(spinValue) {
    ui.spinIndicator.textContent = `Spin ${spinValue.toFixed(1)}`;
}

function updateSpeedUI(speedValue) {
    ui.speedIndicator.textContent = `Speed ${speedValue.toFixed(1)}`;
}

function setPaused(value) {
    paused = value;
    ui.pauseMenu.classList.toggle("hidden", !paused);
    ui.pauseBtn.setAttribute("aria-label", paused ? "Resume game" : "Pause game");
}

function addPointToPlayer() {
    playerScore += 1;
    finishPoint("player");
}

function addPointToOpponent() {
    opponentScore += 1;
    finishPoint("opponent");
}

function finishPoint(winner) {
    updateScoreUI();
    if ((playerScore >= 11 || opponentScore >= 11) && Math.abs(playerScore - opponentScore) >= 2) {
        gameOver = true;
        setPaused(true);
        ui.pauseMenu.classList.add("hidden");
        ui.endMessage.textContent = winner === "player" ? "You win!" : "You lose";
        ui.finalScore.textContent = `${playerScore} — ${opponentScore}`;
        ui.endScreen.classList.remove("hidden");
        return;
    }
    setStatus(winner === "player" ? "Point to you" : "Point to CPU");
    window.setTimeout(() => {
        if (!gameOver) {
            setPaused(false);
            setStatus(winner === "player" ? "Your serve" : "CPU serve");
            serveBall(ball, winner === "player" ? "player" : "opponent");
        }
    }, 650);
}

function resetMatch() {
    playerScore = 0;
    opponentScore = 0;
    paused = false;
    gameOver = false;
    ui.endScreen.classList.add("hidden");
    ui.pauseMenu.classList.add("hidden");
    updateScoreUI();
    setStatus("Your serve");
    serveBall(ball, "player");
}

ui.pauseBtn.onclick = () => setPaused(!paused);
ui.resumeBtn.onclick = () => setPaused(false);
ui.pauseRestartBtn.onclick = resetMatch;
ui.restartBtn.onclick = resetMatch;

window.UI = {
    addPointToPlayer,
    addPointToOpponent,
    updateSpinUI,
    updateSpeedUI,
    setStatus,
    paused: () => paused,
    gameOver: () => gameOver
};
