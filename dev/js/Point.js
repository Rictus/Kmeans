/**
 * @param positionObject
 * @constructor
 */
"use strict";


var update2DPosition = function (element, positionObject) {
    element.style.bottom = positionObject.y + "px";
    element.style.left = positionObject.x + "px";
};

var update3DPosition = function (element, positionObject) {
    var xTranslationIndex = 12;
    var yTranslationIndex = 13;
    var zTranslationIndex = 14;
    var matrixValues = getTransformationMatrix(element);
    matrixValues[xTranslationIndex] = positionObject.x;
    matrixValues[yTranslationIndex] = positionObject.y;
    matrixValues[zTranslationIndex] = Options.MAX_Z / -2 + positionObject.z;
    element.style.transformPolyfill("matrix3d(" + matrixValues.join(", ") + ")");
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
        if (Options.ACTIVE_3D)
            update3DPosition(that.HTMLElement, that);
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
        that.updatePosition();
        that.updateColor(that.membershipColor);
    };
    this.updatePosition = function () {
        if (Options.ACTIVE_3D)
            update3DPosition(that.HTMLElement, that);
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
}
