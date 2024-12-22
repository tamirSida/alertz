// Store selected language
let currentLanguage = "en"; // Default language is English
let emergencyTimerValue = 60; // Default timer value

// Translations for page-specific content
const translations = {
    en: {
        timeLeft: "Time left",
        distanceToShelter: "Directions to shelter",
        areYouSafe: "Are you okay? If you don't reply within 60 seconds, emergency services will be dispatched to your location.",
        imSafe: "I'm Safe",
        dispatchEmergency: "Dispatch Emergency Services",
        timeLeftToRespond: "Time left to respond",
    },
    he: {
        timeLeft: "נותר זמן",
        distanceToShelter: "הוראות הגעה למקלט",
        areYouSafe: "האם אתה בטוח? אם לא תענה תוך 60 שניות, שירותי החירום יישלחו למיקומך.",
        imSafe: "אני בטוח",
        dispatchEmergency: "שלח שירותי חירום",
        timeLeftToRespond: "נותר זמן לתגובה",
    },
    ru: {
        timeLeft: "Осталось времени",
        distanceToShelter: "Расстояние до укрытия",
        areYouSafe: "Вы в порядке? Если вы не ответите в течение 60 секунд, к вашему местоположению будут отправлены аварийные службы.",
        imSafe: "Я в порядке",
        dispatchEmergency: "Вызвать аварийные службы",
        timeLeftToRespond: "Осталось времени для ответа",
    },
};

// Toggle Light Mode and Dark Mode
function toggleLightDarkMode() {
    const container = document.querySelector(".container");
    container.classList.toggle("light-mode");

    // Update button styles for light mode
    const buttons = document.querySelectorAll(".container button");
    buttons.forEach((button) => {
        button.classList.toggle("light-mode");
    });
}

// Toggle Font Size
function toggleFontSize() {
    const container = document.querySelector(".container");
    const currentSize = window.getComputedStyle(container).fontSize;
    container.style.fontSize = currentSize === "16px" ? "22px" : "16px";
}

// Add Translation Selector
function addTranslationSelector(container) {
    const translationHtml = `
        <div class="language-selector" style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
            <img src="/static/icons/english_flag.png" alt="English" id="lang-en" style="width: 30px; cursor: pointer; border: 2px solid transparent; border-radius: 5px;">
            <img src="/static/icons/hebrew_flag.png" alt="Hebrew" id="lang-he" style="width: 30px; cursor: pointer; border: 2px solid transparent; border-radius: 5px;">
            <img src="/static/icons/russian_flag.png" alt="Russian" id="lang-ru" style="width: 30px; cursor: pointer; border: 2px solid transparent; border-radius: 5px;">
        </div>
    `;
    container.insertAdjacentHTML("beforeend", translationHtml);

    // Highlight the selected flag
    function highlightSelectedFlag() {
        document.querySelectorAll(".language-selector img").forEach((img) => {
            img.style.border = img.id.split("-")[1] === currentLanguage ? "2px solid green" : "2px solid transparent";
        });
    }

    // Add event listeners to language selector
    document.querySelectorAll(".language-selector img").forEach((img) => {
        img.addEventListener("click", () => {
            currentLanguage = img.id.split("-")[1];
            updatePageContent();
            highlightSelectedFlag();
        });
    });

    highlightSelectedFlag(); // Initial call to highlight the default flag
}

// Update Page Content Based on Current Language
function updatePageContent() {
    const timerElement = document.getElementById("timer-text");
    const distanceElement = document.getElementById("distance-text");
    const safePromptElement = document.getElementById("safe-prompt");
    const imSafeButton = document.getElementById("im-safe");
    const emergencyButton = document.getElementById("dispatch-emergency");
    const emergencyTimerText = document.getElementById("emergency-timer-text");

    if (timerElement) timerElement.textContent = `${translations[currentLanguage].timeLeft}:`;
    if (distanceElement) distanceElement.textContent = `${translations[currentLanguage].distanceToShelter}:`;
    if (safePromptElement) safePromptElement.textContent = translations[currentLanguage].areYouSafe;
    if (imSafeButton) imSafeButton.textContent = translations[currentLanguage].imSafe;
    if (emergencyButton) emergencyButton.textContent = translations[currentLanguage].dispatchEmergency;
    if (emergencyTimerText) emergencyTimerText.textContent = `${translations[currentLanguage].timeLeftToRespond}:`;
}

// Get Started Button
document.getElementById("get-started").addEventListener("click", () => {
    fetch("/simulate_attack", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
            const container = document.querySelector(".container");

            // Replace content with map, timer, and controls
            container.innerHTML = `
                <div id="timer" style="text-align: center; padding: 10px; font-size: 1.2em;">
                    <span id="timer-text">${translations[currentLanguage].timeLeft}:</span>
                    <span id="countdown-timer">20</span> seconds
                    <br>
                    <span id="distance-text">${translations[currentLanguage].distanceToShelter}:</span>
                    <span id="distance-to-shelter"></span>
                </div>
                <div id="map" style="height: 70%; width: 100%;"></div>
                <div style="display: flex; justify-content: center; gap: 10px; margin: 10px;">
                    <button id="dark-mode-toggle" style="padding: 5px;">Toggle Light/Dark Mode</button>
                    <button id="font-size-toggle" style="padding: 5px;">Toggle Font Size</button>
                </div>
            `;

            addTranslationSelector(container); // Add language selector
            updatePageContent(); // Apply translations to the new content

            document.getElementById("dark-mode-toggle").addEventListener("click", toggleLightDarkMode);
            document.getElementById("font-size-toggle").addEventListener("click", toggleFontSize);

            // Initialize Mapbox map
            mapboxgl.accessToken = 'pk.eyJ1IjoidGFtaXJzaWRhIiwiYSI6ImNseGdzcWZkazE0bmwya3F0dTkwbTVuYjUifQ.hc0EV66hxiy602HJHOljQA';
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [data.shelter.lng, data.shelter.lat],
                zoom: 14,
            });

            new mapboxgl.Marker()
                .setLngLat([data.shelter.lng, data.shelter.lat])
                .addTo(map);

            const directions = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'metric',
                profile: 'mapbox/walking',
                interactive: false,
            });

            map.addControl(directions, 'top-left');
            const userCoords = [34.7825, 32.0853];
            directions.setOrigin(userCoords);
            directions.setDestination([data.shelter.lng, data.shelter.lat]);

            let countdown = 20;
            const countdownTimer = document.getElementById("countdown-timer");
            const interval = setInterval(() => {
                countdown--;
                countdownTimer.textContent = countdown;

                if (countdown <= 0) {
                    clearInterval(interval);

                    container.innerHTML = `
                        <p id="safe-prompt" style="text-align: center; font-size: 1.2em; margin: 20px;">
                            ${translations[currentLanguage].areYouSafe}
                        </p>
                        <div style="text-align: center; margin: 10px;">
                            <span id="emergency-timer-text">${translations[currentLanguage].timeLeftToRespond}:</span>
                            <span id="emergency-timer">${emergencyTimerValue}</span> seconds
                        </div>
                        <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                            <button id="im-safe" style="padding: 10px; border: none; border-radius: 5px; background-color: #28a745; color: white; cursor: pointer;">
                                ${translations[currentLanguage].imSafe}
                            </button>
                            <button id="dispatch-emergency" style="padding: 10px; border: none; border-radius: 5px; background-color: #dc3545; color: white; cursor: pointer;">
                                ${translations[currentLanguage].dispatchEmergency}
                            </button>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                            <button id="dark-mode-toggle" style="padding: 5px;">Toggle Light/Dark Mode</button>
                            <button id="font-size-toggle" style="padding: 5px;">Toggle Font Size</button>
                        </div>
                    `;

                    addTranslationSelector(container);
                    updatePageContent();

                    document.getElementById("dark-mode-toggle").addEventListener("click", toggleLightDarkMode);
                    document.getElementById("font-size-toggle").addEventListener("click", toggleFontSize);

                    let emergencyCountdown = emergencyTimerValue;
                    const emergencyTimer = document.getElementById("emergency-timer");
                    const emergencyInterval = setInterval(() => {
                        emergencyCountdown--;
                        emergencyTimer.textContent = emergencyCountdown;

                        if (emergencyCountdown <= 0) {
                            clearInterval(emergencyInterval);
                            alert("Emergency services have been dispatched to your location!");
                            window.location.reload();
                        }
                    }, 1000);

                    document.getElementById("im-safe").addEventListener("click", () => {
                        alert("Glad to hear you are safe!");
                        window.location.reload();
                    });

                    document.getElementById("dispatch-emergency").addEventListener("click", () => {
                        alert("Emergency services have been dispatched to your location!");
                        window.location.reload();
                    });
                }
            }, 1000);
        });
});

// Help Button
document.getElementById("help").addEventListener("click", () => {
    alert("This app shows you the location of the nearest shelter during an attack and prompts you if you are okay. If not, it dispatches emergency services.");
});

// Set Timer Button
document.getElementById("set-timer").addEventListener("click", () => {
    const timerInput = document.getElementById("timer-input").value;
    if (timerInput == -1) {
        emergencyTimerValue = Infinity;
        alert("Timer set to never dispatch emergency services.");
    } else if (timerInput && !isNaN(timerInput) && timerInput > 0) {
        emergencyTimerValue = parseInt(timerInput);
        alert(`Timer set to ${emergencyTimerValue} seconds.`);
    } else {
        alert("Please enter a valid number greater than 0 or -1.");
    }
});