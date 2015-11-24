'use strict';
/**
 * @param positionObject
 * @constructor
 */


var update2DPosition = function (element, positionObject) {
    element.style.bottom = positionObject.y + "px";
    element.style.left = positionObject.x + "px";
};

var initPointPosition = function (element) {
    var transformationString = "translate3d(" + 0 + "px," + Options.MAX_Y + "px," + Options.MAX_Z / 2 + "px)";
    transformPolyfill(element, transformationString);
};

var update3DPosition = function (element, positionObject) {

    var appliedTransformValues = getTransformValues(element);
    appliedTransformValues.translate3d[0] = parseFloat(appliedTransformValues.translate3d[0], 10) + positionObject.x;
    appliedTransformValues.translate3d[1] = parseFloat(appliedTransformValues.translate3d[1], 10) - positionObject.y;
    appliedTransformValues.translate3d[2] = parseFloat(appliedTransformValues.translate3d[2], 10) - positionObject.z;
    var transformationString = "translate3d(" + appliedTransformValues.translate3d[0] + "px," + appliedTransformValues.translate3d[1] + "px," + appliedTransformValues.translate3d[2] + "px)";
    transformPolyfill(element, transformationString);
};

var getTransformValues = function (element) {
    var appliedTransform = element.style.WebkitTransform || element.style.msTransform || element.style.transform;
    var transformValues = {

        translate: "",
        rotate: "",
        scale: "",
        skew: "",
        translate3d: "",
        rotate3d: "",
        scale3d: "",
        translateX: "",
        translateY: "",
        translateZ: "",
        rotateX: "",
        rotateY: "",
        rotateZ: "",
        scaleX: "",
        scaleY: "",
        scaleZ: "",
        skewX: "",
        skewY: "",
        perspective: ""
    };
    var transformCapturesRegex = /((translate3d|rotate3d|scale3d|translateX|translateY|translateZ|rotateX|rotateY|rotateZ|scaleX|scaleY|scaleZ|skewX|skewY|translate|rotate|scale|skew|perspective)\(([-+]?([0-9]*\.[0-9]+|[0-9]+)(px|deg)?(, ?[-+]?([0-9]*\.[0-9]+|[0-9]+)(px|deg)?){0,3})\))/gmi; //TODO Regex can be improve by adding other units (em, cm, pt, vmin, ...)

    var capturedTransformation;
    while(capturedTransformation = transformCapturesRegex.exec(appliedTransform)) {
        transformValues[capturedTransformation[2]] = capturedTransformation[3].split(",");
    }

    //
    //var appliedTransformValues = appliedTransform.substr(12, appliedTransform.length - 13).split(", ");
    //for (var i = 0; i < appliedTransformValues.length; i++) {
    //    appliedTransformValues[i] = parseInt(appliedTransformValues[i], 10);
    //}
    //return appliedTransformValues;
    return transformValues;
};

function Point(positionObject) {
    var that = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.HTMLElement = null;

    var buildPoint = function () {
        that.HTMLElement = createCompleteElement('div', ['point'], [], [['x', that.x], ['y', that.y], ['z', that.z]]);
    };

    this.updatePosition = function () {
        if (Options.ACTIVE_3D) {
            initPointPosition(that.HTMLElement);
            update3DPosition(that.HTMLElement, that);
        }
        else
            update2DPosition(that.HTMLElement, that);
    };
    this.updateColor = function (newColor) {
        that.HTMLElement.style.backgroundColor = newColor;
    };

    this.x = positionObject.x;
    this.y = positionObject.y;
    this.z = positionObject.z;
    buildPoint();
}

Point.distanceTwoPoints = function (coordObjectFirstPoint, coordObjectSecondPoint) { //Hey params in this function has changed so beware of erors
    var xPow = Math.pow(coordObjectFirstPoint.x - coordObjectSecondPoint.x, 2);
    var yPow = Math.pow(coordObjectFirstPoint.y - coordObjectSecondPoint.y, 2);
    var zPow = Math.pow(coordObjectFirstPoint.z - coordObjectSecondPoint.z, 2);
    return Math.sqrt(xPow + yPow + zPow);
};

/**
 * Find the closest point for the given point between a list of points
 * @param positionObject An object to represent position (x,y,z) of the initial point
 * @param pointsList     An array of object to represent all candidate closest points. Each object is an object of position (x,y,z)
 * @returns {number}     The index (from the given array) of the closest point (-1 is no one founded)
 */
Point.findClosestPoint = function (positionObject, pointsList) {
    var minDistanceFound = Number.MAX_VALUE;
    var indexClosestPoint = -1;
    var curPoint;
    var curDistancePointToPoint;

    for (var i = 0; i < pointsList.length; i++) {
        curPoint = pointsList[i];
        curDistancePointToPoint = Point.distanceTwoPoints(curPoint, positionObject);
        if (curDistancePointToPoint < minDistanceFound) {
            minDistanceFound = curDistancePointToPoint;
            indexClosestPoint = pointsList.indexOf(curPoint);
        }
    }
    return indexClosestPoint;
};

var activeRotation = function (element) {
    var appliedTransformValues = getTransformValues(element);

};

var extendClass = function (child, parent) {
    var Surrogate = function () {
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate(); //Copying prototype
    for (var key in child) {
        child[key] = parent[key]; //Copying public methods/vars
    }
};
extendClass(Proto, Point);


function Proto(positionObject, groupColor) {
    var that = this;
    that.HTMLElement = null;
    var membership = [];
    var protoPositionMean = {
        x: 0, y: 0, z: 0
    };
    this.membershipColor = typeof groupColor === "undefined" ? "rgba(255,0,0,1)" : groupColor;


    var buildProto = function () {
        that.HTMLElement = createCompleteElement('div', ['proto'], [], [['x', that.x], ['y', that.y], ['z', that.z]]);
        that.updateColor(that.membershipColor);
    };
    this.updatePosition = function () {
        if (Options.ACTIVE_3D) {
            initPointPosition(that.HTMLElement);
            update3DPosition(that.HTMLElement, that);
        }
        else
            update2DPosition(that.HTMLElement, that);
    };

    this.calculMeanMembership = function () {
        var moveDistance = 0;
        protoPositionMean.x = 0;
        protoPositionMean.y = 0;
        protoPositionMean.z = 0;
        if (membership.length > 0) {
            for (var i = 0; i < membership.length; i++) {
                var point = membership[i];
                protoPositionMean.x += point.x;
                protoPositionMean.y += point.y;
                protoPositionMean.z += point.z;
            }
            protoPositionMean.x /= membership.length;
            protoPositionMean.y /= membership.length;
            protoPositionMean.z /= membership.length;
            moveDistance = Point.distanceTwoPoints(that, protoPositionMean);
            that.x = protoPositionMean.x;
            that.y = protoPositionMean.y;
            that.z = protoPositionMean.z;
            console.groupEnd();
        }
        return moveDistance;
    };
    this.updateColor = function (newColor) {
        that.HTMLElement.style.backgroundColor = newColor;
    };

    this.emptyMembership = function () {
        membership = [];
    };

    this.addToMembership = function (point) {
        membership.push(point);
    };


    this.x = positionObject.x;
    this.y = positionObject.y;
    this.z = positionObject.z;
    buildProto();
    that.updatePosition();
}


