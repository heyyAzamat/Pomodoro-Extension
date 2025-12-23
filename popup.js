const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

let totalTime = 25 * 60;
let timeLeft = totalTime;
let timerInterval = null;
let isRunning = false;
let startTimestamp = null;

// Update timer display
function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Start timer
function startTimer() {
    if (timerInterval) return;

    isRunning = true;
    startTimestamp = Date.now();

    chrome.storage.local.set({
        timeLeft,
        isRunning,
        startTimestamp
    });

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        timeLeft = Math.max(totalTime - elapsed, 0);
        updateDisplay(timeLeft);

        chrome.storage.local.set({ timeLeft });

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            chrome.storage.local.set({ isRunning: false, startTimestamp: null });
            alert("Pomodoro finished! Take a break 🧃");
        }
    }, 1000);
}

// Load saved state when popup opens
chrome.storage.local.get(["timeLeft", "isRunning", "startTimestamp"], (data) => {
    timeLeft = data.timeLeft ?? totalTime;
    isRunning = data.isRunning ?? false;
    startTimestamp = data.startTimestamp ?? null;

    if (isRunning && startTimestamp) {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        timeLeft = Math.max(timeLeft - elapsed, 0);

        if (timeLeft <= 0) {
            isRunning = false;
            timeLeft = totalTime;
            startTimestamp = null;
        }
    }

    updateDisplay(timeLeft);
});

// Start button
startBtn.addEventListener("click", () => {
    if (!isRunning) startTimer();
});

// Reset button
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = totalTime;
    isRunning = false;
    startTimestamp = null;
    updateDisplay(timeLeft);

    chrome.storage.local.set({
        timeLeft,
        isRunning,
        startTimestamp
    });
});
