class AudioBooster {
    constructor(videoElement) {
        this.video = videoElement;
        this.audioContext = null;
        this.source = null;
        this.gainNode = null;
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

        // Create gain node and set boost level
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 2.0; // Adjustable gain value

        // Reconnect audio through gain node
        this.source.disconnect();
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
    }

    // Unboost audio by removing gain
    unboost() {
        if (this.source && this.gainNode) {
            // Disconnect gain node and restore default connection
            this.source.disconnect();
            this.gainNode.disconnect();
            this.source.connect(this.audioContext.destination);

            this.gainNode = null;
        }
    }
}

class BoostButton {
    constructor(button, enabledName, disabledName) {
        this.button = button
        this.enabledName = enabledName
        this.disabledName = disabledName

        this.initializeStyles();
        this.off();
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

    on() {
        this.button.textContent = this.enabledName;
        this.button.style.backgroundColor = "#16a34a"; // Green when boosted
    }

    off() {
        this.button.textContent = this.disabledName;
        this.button.style.backgroundColor = "#6b7280"; // Gray when unboosted
    }
}

function addRemoteControlButton() {
    const boostButtonElement = document.createElement("button");
    const speedUpButtonElement = document.createElement("button");
    const video = document.querySelector('video');
    const audioBooster = new AudioBooster(video);
    const boostButton = new BoostButton(boostButtonElement, "UnBoost", "Boost");
    const speedUpButton = new BoostButton(speedUpButtonElement, "Slower", "Faster");
    
    const logo = document.getElementById('logo')
    logo.parentNode.insertBefore(speedUpButtonElement, logo.nextSibling);
    logo.parentNode.insertBefore(boostButtonElement, logo.nextSibling);

    var isBoosted = false;
    var isFaster = false;

    speedUpButtonElement.addEventListener('click', function() {
        console.log('Speedup Button was clicked!');
        if(isFaster) {
            speedUpButton.off();

            isFaster = false;
        } else {
            speedUpButton.on();

            isFaster = true;
        }
    });

    boostButtonElement.addEventListener('click', function() {
        console.log('Boost Button was clicked!');
        if(isBoosted) {
            audioBooster.unboost();
            boostButton.off();

            isBoosted = false;
        } else {
            audioBooster.boost();
            boostButton.on();

            isBoosted = true;
        }
    });
}

console.log("Remote Control Start Loading: " + document.getElementById('logo-icon'));

addRemoteControlButton();