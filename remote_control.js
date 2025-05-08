class Rewind {
    constructor() {
        
    }

    rewind(videoElement) {
        videoElement.currentTime = Math.max(0, videoElement.currentTime - 15);
    }
}

class SpeedUp {
    constructor() {
        
    }

    faster(videoElement) {
        videoElement.playbackRate = 1.5;
    }

    slower(videoElement) {
        videoElement.playbackRate = 1;
    }
}


class AudioBooster {
    constructor() {
        this.audioContext = null;
        this.source = null;
        this.gainNode = null;
    }

    // Initialize AudioContext and source
    init(videoElement) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.audioContext.createMediaElementSource(videoElement);
        this.source.connect(this.audioContext.destination); // Default connection
    }

    // Boost audio by applying gain
    boost(videoElement) {
        if (!this.audioContext) {
            this.init(videoElement);
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
        this.button.style.padding = "5pt 10pt";
        this.button.style.margin = "2pt";
        this.button.style.fontSize = "16px";
        this.button.style.border = "none";
        this.button.style.borderRadius = "5px";
        this.button.style.cursor = "pointer";
        this.button.style.backgroundColor = "#6b7280"; // Gray when unboosted
        this.button.style.color = "#ffffff";
        this.button.style.transition = "background-color 0.3s ease";
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

function performIfVideoIsPresent(operation) {
    return function() {
        const video = document.querySelector('video');
        if(video != null) {
            operation(video);
        } else {
            console.log("no video. no operation performed");
        }
    }
}

function addRemoteControlButton() {
    const boostButtonElement = document.createElement("button");
    const speedUpButtonElement = document.createElement("button");
    const rewindButtonElement = document.createElement("button");
    const audioBooster = new AudioBooster();
    const speedUp = new SpeedUp();
    const rewind = new Rewind();
    const boostButton = new BoostButton(boostButtonElement, "Boost", "Boost");
    const speedUpButton = new BoostButton(speedUpButtonElement, "Faster", "Faster");
    const rewindButton = new BoostButton(rewindButtonElement, "Rewind", "Rewind")
    
    const logo = document.getElementById('logo')
    logo.parentNode.insertBefore(rewindButtonElement, logo.nextSibling);
    logo.parentNode.insertBefore(speedUpButtonElement, logo.nextSibling);
    logo.parentNode.insertBefore(boostButtonElement, logo.nextSibling);

    var isBoosted = false;
    var isFaster = false;

    rewindButtonElement.addEventListener('mousedown', performIfVideoIsPresent(function(videoElement) {
        rewindButton.on();
        rewind.rewind(videoElement);
    }));

    rewindButtonElement.addEventListener('mouseup', performIfVideoIsPresent(function(videoElement) {
        rewindButton.off();
    }));

    speedUpButtonElement.addEventListener('click', performIfVideoIsPresent(function(videoElement) {
        console.log('Speedup Button was clicked!');
        if(isFaster) {
            speedUpButton.off();
            speedUp.slower(videoElement);

            isFaster = false;
        } else {
            speedUpButton.on();
            speedUp.faster(videoElement);

            isFaster = true;
        }
    }));

    boostButtonElement.addEventListener('click', performIfVideoIsPresent(function(videoElement) {
        console.log('Boost Button was clicked!');
        if(isBoosted) {
            audioBooster.unboost(videoElement);
            boostButton.off();

            isBoosted = false;
        } else {
            audioBooster.boost(videoElement);
            boostButton.on();

            isBoosted = true;
        }
    }));
}

console.log("Remote Control Start Loading: " + document.getElementById('logo-icon'));

addRemoteControlButton();