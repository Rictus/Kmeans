'use strict';
function createCompleteElement(elemName, classNames, ids, attributes, textNode) {//Create element
    var el = document.createElement((elemName) ? elemName : 'div');
    //adding classname(s)
    if (classNames) {
        if ((typeof classNames) == 'string') {
            el.classList.add(classNames);
        }
        else if (classNames.length >= 1) {
            for (var i = 0; i < classNames.length; i++) {
                el.classList.add(classNames[i]);
            }
        }
    }
    //adding id(s)
    if (ids) {
        if ((typeof ids) == 'string') {
            el.id = ids;
        }
        else if (ids.length >= 1) {
            var str = "";
            for (var i = 0; i < ids.length; i++) {
                str += ids[i] + " ";
            }
            el.id = str;
        }
    }
    //adding attributes
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            el.setAttribute(attributes[i][0], attributes[i][1]);
        }
    }
    //adding text inside of it
    if (textNode)
        el.appendChild(document.createTextNode(textNode));
    return el;
}


/**
 * Get the offset of a given element
 */
function offset(elt) {
    if (elt) {
        var rect = elt.getBoundingClientRect(), bodyElt = document.body;
        return {
            top: rect.top + bodyElt.scrollTop,
            left: rect.left + bodyElt.scrollLeft,
            bottom: (rect.top + bodyElt.scrollTop) + rect.height,
            right: (rect.left + bodyElt.scrollLeft) + rect.width
        }
    }
}


function transformPolyfill(element, transformation) {
    element.style.WebkitTransform = transformation; //Chrome, Safari, Opera
    element.style.msTransform = transformation;     //IE9
    element.style.transform = transformation;      //Standard
}

/**
 * Get the computed transfomation of a given element
 * as a homogenous transformation matrice.
 * Each element is accessible with these simple keys :
 * xTranslate
 * xRotate
 *
 * @param element
 * @returns {Array}
 */
var getTransformationMatrix = function (element) {
    var computedStyle = getComputedStyle(element);
    //var computedTransform = computedStyle.transform;
    var computedTransform = computedStyle.getPropertyValue("-webkit-transform") ||
        computedStyle.getPropertyValue("-moz-transform") ||
        computedStyle.getPropertyValue("-ms-transform") ||
        computedStyle.getPropertyValue("-o-transform") ||
        computedStyle.getPropertyValue("transform");
    var matrixValues = computedTransform.substring(9, computedTransform.length - 1).split(", ");
    for (var i = 0; i < matrixValues.length; i++) {
        matrixValues[i] = parseInt(matrixValues[i], 10);
    }
    var out = {
        matrix: matrixValues,
        translate: {
            x: matrixValues[12],
            y: matrixValues[13],
            z: matrixValues[14]
        },
        rotate: {
            x: matrixValues[4],
            y: matrixValues[5],
            z: matrixValues[6]
        },
        skew: {}
    };
    return matrixValues;
};

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function () {
        var context = scope || this;

        var now = Date.now(),
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return n === Number(n) && n % 1 !== 0;
}

//From devdocs @see Math.ceil
/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

function isHTMLElement(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    }
    catch (e) {
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have. (works on IE7)
        return (typeof obj === "object") &&
            (obj.nodeType === 1) && (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
}

function mergeObjects() {
    var that = this;
    var destination = {},
        sources = [].slice.call(arguments, 0);
    sources.forEach(function (source) {
        var prop;
        for (prop in source) {
            if (prop in destination && Array.isArray(destination[prop])) {
                // Concat Arrays
                destination[prop] = destination[prop].concat(source[prop]);

            } else if (prop in destination && typeof destination[prop] === "object") {
                // Merge Objects
                destination[prop] = that.mergeObjects(destination[prop], source[prop]);

            } else {
                // Set new values
                destination[prop] = source[prop];

            }
        }
    });
    return destination;
}