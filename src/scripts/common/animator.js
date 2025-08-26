"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function animatorState(name, animation, variants) {
    if (variants === void 0) { variants = {}; }
    return { name: name, animation: animation, variants: variants, from: [] };
}
exports.animatorState = animatorState;
function animatorTransition(from, to, options) {
    if (options === void 0) { options = {}; }
    to.from.push(__assign({ state: from }, options));
}
exports.animatorTransition = animatorTransition;
exports.anyState = animatorState('any', { fps: 1, loop: false, frames: [] });
function createAnimator() {
    return {
        time: 0,
        variant: '',
        state: undefined,
        target: undefined,
        next: undefined,
    };
}
exports.createAnimator = createAnimator;
function getAnimation(animator) {
    return animator.state && getAnimationForState(animator.state, animator.variant);
}
exports.getAnimation = getAnimation;
function getAnimationFrame(animator) {
    var animation = getAnimation(animator);
    return animation ? Math.floor(animator.time * animation.fps) % animation.frames.length : 0;
}
exports.getAnimationFrame = getAnimationFrame;
function resetAnimatorState(animator) {
    animator.state = undefined;
    animator.target = undefined;
    animator.next = undefined;
}
exports.resetAnimatorState = resetAnimatorState;
function setAnimatorState(animator, state) {
    if (animator.target !== state) {
        if (animator.state !== state) {
            if (animator.state === undefined) {
                animator.state = state;
            }
            else {
                animator.target = state;
            }
        }
        else {
            animator.target = undefined;
        }
        animator.next = undefined;
    }
}
exports.setAnimatorState = setAnimatorState;
function updateAnimator(animator, delta) {
    var time = animator.time;
    animator.time += delta;
    if (animator.target !== undefined && animator.state !== undefined && animator.state !== animator.target) {
        var animation = getAnimationForState(animator.state, animator.variant);
        var animationLength = animation.frames.length / animation.fps;
        var frameBefore = Math.floor(time / animationLength);
        var frameAfter = Math.floor(animator.time / animationLength);
        var frameTimeAfter = (animator.time % animationLength) / animationLength;
        var animationEnded = frameBefore !== frameAfter;
        var switched = false;
        do {
            switched = false;
            var transition = animator.next = animator.next || findTransition(animator.state, animator.target);
            if (transition !== undefined) {
                var exitAfter = transition.exitAfter === undefined ? 1 : transition.exitAfter;
                if (frameTimeAfter >= exitAfter || animationEnded) {
                    if (!transition.keepTime) {
                        animator.time = transition.enterTime || 0;
                    }
                    else {
                        animator.time = animator.time % animationLength;
                    }
                    setCurrentState(animator, transition.state);
                    switched = true;
                    animationEnded = false;
                }
            }
        } while (switched && animator.target);
    }
}
exports.updateAnimator = updateAnimator;
function setCurrentState(animator, state) {
    animator.next = undefined;
    animator.state = state;
    if (state === animator.target) {
        animator.target = undefined;
    }
}
function getAnimationForState(state, variant) {
    return state.variants[variant] || state.animation;
}
function findTransition(current, target) {
    return findTransMinMax(current, target, 0, 1)
        || findTrans(exports.anyState, target, target, 0, 0, [])
        || findTransMinMax(current, target, 2, 10);
}
function findTransMinMax(current, target, min, max) {
    for (var i = min; i <= max; i++) {
        var trans = findTrans(current, target, target, 0, i, [current]);
        if (trans !== undefined) {
            return trans;
        }
    }
    return undefined;
}
function findTrans(current, target, finalTarget, depth, maxDepth, done) {
    if (done.indexOf(target) === -1) {
        done.push(target);
        for (var _i = 0, _a = target.from; _i < _a.length; _i++) {
            var from = _a[_i];
            if (from.state === current && (from.onlyDirectTo === undefined || from.onlyDirectTo === finalTarget)) {
                return __assign({}, from, { state: target });
            }
        }
        if (depth < maxDepth) {
            for (var _b = 0, _c = target.from; _b < _c.length; _b++) {
                var from = _c[_b];
                var trans = findTrans(current, from.state, finalTarget, depth + 1, maxDepth, done);
                if (trans !== undefined) {
                    return trans;
                }
            }
        }
    }
    return undefined;
}
