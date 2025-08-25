"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var emoji_1 = require("./emoji");
var fonts_1 = require("./fonts");
var spriteFont_1 = require("../graphics/spriteFont");
function createHtmlNodes(value, scale) {
    return value ? emoji_1.splitEmojis(value).map(function (x) {
        var sprite = emoji_1.hasEmojis(x) && fonts_1.font && spriteFont_1.getCharacterSprite(x, fonts_1.font);
        if (sprite) {
            var emote = emoji_1.findEmoji(x);
            var img_1 = document.createElement('img');
            img_1.className = 'pixelart';
            img_1.style.display = 'inline-block';
            img_1.style.visibility = 'hidden';
            img_1.style.width = (sprite.w + sprite.ox) * scale + "px";
            img_1.style.height = 10 * scale + "px";
            if (emote) {
                img_1.setAttribute('aria-label', emote.names[0]);
            }
            emoji_1.getEmojiImageAsync(sprite, function (src) {
                img_1.alt = x;
                img_1.src = src;
                img_1.style.visibility = 'visible';
            });
            return img_1;
        }
        else {
            return document.createTextNode(x);
        }
    }) : [];
}
exports.createHtmlNodes = createHtmlNodes;
function textNode(text) {
    return document.createTextNode(text);
}
exports.textNode = textNode;
function element(tag, className, nodes, attrs, events) {
    var element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (nodes !== undefined) {
        appendAllNodes(element, nodes);
    }
    if (attrs !== undefined) {
        Object.keys(attrs).forEach(function (key) { return element.setAttribute(key, attrs[key]); });
    }
    if (events !== undefined) {
        Object.keys(events).forEach(function (key) { return element.addEventListener(key, events[key]); });
    }
    return element;
}
exports.element = element;
function appendAllNodes(element, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node !== undefined) {
            element.appendChild(node);
        }
    }
}
exports.appendAllNodes = appendAllNodes;
function removeAllNodes(element) {
    var child;
    while (child = element.lastChild) {
        element.removeChild(child);
    }
}
exports.removeAllNodes = removeAllNodes;
function removeFirstChild(element) {
    var child;
    if (child = element.firstChild) {
        element.removeChild(child);
    }
}
exports.removeFirstChild = removeFirstChild;
function removeElement(element) {
    element.parentElement && element.parentElement.removeChild(element);
}
exports.removeElement = removeElement;
function replaceNodes(element, text) {
    while (element.lastChild && element.lastChild !== element.firstChild) {
        element.removeChild(element.lastChild);
    }
    var firstChild = element.firstChild;
    if (!firstChild) {
        element.appendChild(firstChild = textNode(''));
    }
    if (emoji_1.hasEmojis(text)) {
        firstChild.nodeValue = '';
        appendAllNodes(element, createHtmlNodes(text, 2));
    }
    else {
        firstChild.nodeValue = text;
    }
}
exports.replaceNodes = replaceNodes;
function findParentElement(element, selector) {
    var elements = Array.from(document.querySelectorAll(selector));
    var current = element.parentElement;
    while (current && elements.indexOf(current) === -1) {
        current = current.parentElement;
    }
    return current;
}
exports.findParentElement = findParentElement;
function findFocusableElements(root) {
    var elements = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return Array.from(elements);
}
exports.findFocusableElements = findFocusableElements;
function focusFirstElement(root) {
    var elements = findFocusableElements(root);
    if (elements.length) {
        elements[0].focus();
        return elements[0];
    }
    return undefined;
}
exports.focusFirstElement = focusFirstElement;
function focusElement(root, selector) {
    var target = root.querySelector(selector);
    if (target) {
        target.focus();
    }
}
exports.focusElement = focusElement;
function focusElementAfterTimeout(root, selector) {
    setTimeout(function () { return focusElement(root, selector); }, 10);
}
exports.focusElementAfterTimeout = focusElementAfterTimeout;
function isParentOf(parent, child) {
    for (var current = child.parentElement; current; current = current.parentElement) {
        if (current === parent) {
            return true;
        }
    }
    return false;
}
exports.isParentOf = isParentOf;
function showTextInNewTab(text) {
    var wnd = window.open();
    var pre = wnd.document.createElement('pre');
    pre.innerText = text;
    wnd.document.body.appendChild(pre);
}
exports.showTextInNewTab = showTextInNewTab;
function addStyle(style) {
    var styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    document.head.appendChild(styleElement);
    return styleElement;
}
exports.addStyle = addStyle;
