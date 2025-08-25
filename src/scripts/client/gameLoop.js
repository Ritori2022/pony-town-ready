"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameLoop = undefined;
function startGameLoop(game, onError) {
    if (onError === void 0) { onError = function (e) { return console.error(e); }; }
    var handle;
    var backup;
    var cancelled = false;
    var last = Math.round(performance.now());
    var lastFps = last;
    var frames = 0;
    var fps = 0;
    function step(now, draw) {
        if (draw) {
            handle = requestAnimationFrame(onFrame);
        }
        frames++;
        if ((now - lastFps) > 1000) {
            fps = frames * 1000 / (now - lastFps);
            frames = 0;
            lastFps = now;
        }
        try {
            game.fps = fps;
            game.update((now - last) / 1000, now, last);
            if (draw) {
                game.draw();
            }
        }
        catch (e) {
            onError(e);
        }
        last = now;
    }
    function onTimer() {
        step(Math.round(performance.now()), false);
        backup = setTimeout(onTimer, 1000 / 10);
    }
    function onFrame() {
        clearTimeout(backup);
        step(Math.round(performance.now()), true);
        backup = setTimeout(onTimer, 1000 / 10);
    }
    function cancel() {
        cancelAnimationFrame(handle);
        clearTimeout(backup);
        cancelled = true;
    }
    if (gameLoop) {
        gameLoop.cancel();
    }
    var started = Promise.resolve()
        .then(function () { return game.load(); })
        .then(function () {
        if (cancelled) {
            throw new Error('Cancelled (loop)');
        }
        else {
            game.init();
            handle = requestAnimationFrame(onFrame);
            backup = setTimeout(onTimer, 1000 / 10);
        }
    });
    gameLoop = { started: started, cancel: cancel };
    return gameLoop;
}
exports.startGameLoop = startGameLoop;
