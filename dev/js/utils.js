
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

/**
 * Apply a style transformation to an element.
 * Use it like :  div.style.transformPolyfill("scale(1.2)");
 * @param transformation        The transformation you want to apply
 */
Object.prototype.transformPolyfill = function (transformation) {
    this.WebkitTransform = transformation; //Chrome, Safari, Opera
    this.msTransform = transformation;     //IE9
    this.transform = transformation;      //Standard
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