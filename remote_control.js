const mediaSeekTimeDelta = 10 // seconds

async function captureYouTubeAudio() {
    // Request screen capture with audio
    console.log('requesting stream');
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });
    console.log('got stream: ' + stream);
}

function addRemoteControlButton() {
    const button = document.createElement("button");
    button.textContent = "Remote Control";

    button.addEventListener('click', function() {
        console.log('Button was clicked!');
    });

    const logo = document.getElementById('logo')
    logo.parentNode.insertBefore(button, logo.nextSibling);
}

function attachForwardAndBackControls() {
    const movePlaybackCurrentTime = (timeDelta) =>  {
        const video = document.querySelector('video');
        if(video.seeking) {
            console.log('skipping event: seeking')
            return;
        }
        video.fastSeek(video.currentTime + timeDelta)
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            movePlaybackCurrentTime(-mediaSeekTimeDelta)
        } else if (event.key === 'ArrowRight') {
            movePlaybackCurrentTime(mediaSeekTimeDelta)
        }
      });
}

console.log("Remote Control Start Loading: " + document.getElementById('logo-icon'));

addRemoteControlButton();
attachForwardAndBackControls();