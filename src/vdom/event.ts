const EVENTOBJ = {
    // Clipboard Events
    "copy": "onCopy", "cut": "onCut", "paste": "onPaste",
    // Composition Events
    "compositionend": "onCompositionEnd", "compositionstart": "onCompositionStart", "compositionupdate": "onCompositionUpdate",
    // Keyboard Events
    "keydown": "onKeyDown", "keypress": "onKeyPress", "keyup": "onKeyUp",
    // Focus Events
    "focus": "onFocus", "blur": "onBlur",
    // Form Events
    "change": "onChange", "input": "onChange", "submit": "onSubmit",
    // Mouse Events
    "click": "onClick", "contextmenu": "onContextMenu", "dbclick": "onDoubleClick", "drag": "onDrag", "dragend": "onDragEnd", "dragenter": "onDragEnter", "dragexit": "onDragExit",
    "dragleave": "onDragLeave", "dragover": "onDragOver", "dragstart": "onDragStart", "drop": "onDrop", "mousedown": "onMouseDown", "mouseenter": "onMouseEnter", "mouseleave": "onMouseLeave",
    "mousemove": "onMouseMove", "mouseout": "onMouseOut", "mouseover": "onMouseOver", "mouseup": "onMouseUp",
    // Selection Events
    "select": "onSelect",
    // Touch Events
    "touchcancel": "onTouchCancel", "touchend": "onTouchEnd", "touchmove": "onTouchMove", "touchstart": "onTouchStart",
    // UI Events
    "scroll": "onScroll",
    // Wheel Events
    "wheel": "onWheel",
    // Media Events
    "abort": "onAbort", "canplay": "onCanPlay", "canplaythrough": "onCanPlayThrough", "durationchange": "onDurationChange", "emptied": "onEmptied", "encrypted": "onEncrypted",
    "ended": "onEnded", "error": "onError", "loadeddata": "onLoadedData", "loadedmetadata": "onLoadedMetadata", "loadstart": "onLoadStart", "pause": "onPause", "play": "onPlay",
    "playing": "onPlaying", "progress": "onProgress", "ratechange": "onRateChange", "seeked": "onSeeked", "seeking": "onSeeking", "stalled": "onStalled", "suspend": "onSuspend",
    "timeupdate": "onTimeUpdate", "volumechange": "onVolumeChange", "waiting": "onWaiting",
    // Image Events
    "load": "onLoad",// "error": "onError",
    // Animation Events
    "animationstart": "onAnimationStart", "animationend": "onAnimationEnd", "animationiteration": "onAnimationIteration",
    // Transition Events
    "transitionend": "onTransitionEnd",
    // Other Events
    "toggle": "onToggle"
}

function eventFormat(e) {
    e.persist = Object;
    e.nativeEvent = e;
    return e;
}


for (let x in EVENTOBJ) {
    document.addEventListener(x, function (e) {
        // console.dir(EVENTOBJ[x])
        // console.dir(e.target)
        const type = EVENTOBJ[e.type];
        let node: any = e.target;
        while (node) {
            node.__listeners__ && node.__listeners__[type] && node.__listeners__[type](eventFormat(e) || e);
            node = node.parentNode;
        }
    }, true)
}
