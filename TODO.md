create the firefox extension

see if we can manipulate the sound coming from a source

need to remove all competing events. this code will remove all events, need to find which event is competing with ours:
```
document.querySelectorAll('*').forEach(element => {
  ['keydown', 'keypress', 'keyup'].forEach(eventType => {
    element.addEventListener(eventType, (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, true);
  });
});
```

it's difficult to find where keyboard events are assigned. consider replacing the entire video with a different player