class AudioBooster {
    constructor(videoElement) {
        this.video = videoElement;
        this.audioContext = null;
        this.source = null;
        this.gainNode = null;
        this.isBoosted = false;
    }

    // Initialize AudioContext and source
    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.audioContext.createMediaElementSource(this.video);
        this.source.connect(this.audioContext.destination); // Default connection
    }

    // Boost audio by applying gain
    boost() {
        if (!this.audioContext) {
            this.init();
        }

        if (!this.isBoosted) {
            // Create gain node and set boost level
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 2.0; // Adjustable gain value

            // Reconnect audio through gain node
            this.source.disconnect();
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            this.isBoosted = true;
        }
    }

    // Unboost audio by removing gain
    unboost() {
        if (this.isBoosted && this.source && this.gainNode) {
            // Disconnect gain node and restore default connection
            this.source.disconnect();
            this.gainNode.disconnect();
            this.source.connect(this.audioContext.destination);

            this.gainNode = null;
            this.isBoosted = false;
        }
    }

    toggleBoost() {
        if (this.isBoosted) {
            this.unboost();
        } else {
            this.boost();
        }
    }
}

class BoostButton {
    constructor(button) {
        this.button = button
        this.initializeStyles();
        this.setToUnboostedState();
    }

    // Initialize button styles
    initializeStyles() {
        this.button.style.padding = "10px 20px";
        this.button.style.fontSize = "16px";
        this.button.style.border = "none";
        this.button.style.borderRadius = "5px";
        this.button.style.cursor = "pointer";
        this.button.style.backgroundColor = "#6b7280"; // Gray when unboosted
        this.button.style.color = "#ffffff";
        this.button.style.transition = "background-color 0.3s ease";
        this.button.style.minWidth = "150px";
        this.button.style.textAlign = "center";
    }

    setToBoostedState() {
        this.button.textContent = "UnBoost";
        this.button.style.backgroundColor = "#16a34a"; // Green when boosted
    }

    setToUnboostedState() {
        this.button.textContent = "Boost";
        this.button.style.backgroundColor = "#6b7280"; // Gray when unboosted
    }
}

function addRemoteControlButton() {
    const button = document.createElement("button");
    const video = document.querySelector('video');
    const audioBooster = new AudioBooster(video);
    const boostButton = new BoostButton(button);

    button.addEventListener('click', function() {
        console.log('Button was clicked!');
        if(audioBooster.isBoosted) {
            audioBooster.unboost();
            boostButton.setToUnboostedState();
        } else {
            audioBooster.boost();
            boostButton.setToBoostedState();
        }
    });

    const logo = document.getElementById('logo')
    logo.parentNode.insertBefore(button, logo.nextSibling);
}

console.log("Remote Control Start Loading: " + document.getElementById('logo-icon'));

addRemoteControlButton();