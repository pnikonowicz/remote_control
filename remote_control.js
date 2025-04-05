async function captureYouTubeAudio() {
    // Request screen capture with audio
    console.log('requesting stream');
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });
    console.log('got stream: ' + stream);
}

function remoteControlMain() {
    const button = document.createElement("button");
    button.textContent = "Remote Control";

    button.addEventListener('click', function() {
        console.log('Button was clicked!');
    });

    const logo = document.getElementById('logo')
    logo.parentNode.insertBefore(button, logo.nextSibling);
}

console.log("Remote Control Start Loading: " + document.getElementById('logo-icon'));

remoteControlMain();
