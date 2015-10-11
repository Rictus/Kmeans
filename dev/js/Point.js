/**
 * OK Heritage de Point dans Proto : ok.
 * Mtn : refactorer le code de Proto pour le diminuer
 * @param positionObject
 * @constructor
 */

function Point(positionObject) {
    var that = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.HTMLElement = null;

    var buildPoint = function (x, y, z) {
        //If no coords given : default
        x = typeof x !== "number" ? that.x : x;
        y = typeof y !== "number" ? that.y : y;
        z = typeof z !== "number" ? that.z : z;

        that.HTMLElement = createCompleteElement('div', ['point'], [], [['x', x], ['y', y], ['z', z]]);
        that.HTMLElement.style.left = x + "px";
        that.HTMLElement.style.bottom = y + "px";
        //TODO how to do for z coord ? Solution : Get the current transformation value, add Z translation
    };
    this.changeColor = function (newColor) {
        that.HTMLElement.style.backgroundColor = newColor;
    };

    this.x = positionObject.x;
    this.y = positionObject.y;
    this.z = positionObject.z;
    buildPoint();
}

Point.distanceTwoPoints = function (coordObjectFirstPoint, coordObjectSecondPoint) { //Hey parmas in this function has changed so beware of erors
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
    var membership = [];
    var protoPositionMean = {
        x: 0, y: 0, z: 0
    };
    this.membershipColor = typeof groupColor === "undefined" ? "rgba(255,0,0,1)" : groupColor;
    that.HTMLElement;


    var buildProto = function (x, y, z) {
        //If no coords given : default
        x = typeof x === "number" ? x : that.x;
        y = typeof y === "number" ? y : that.y;
        z = typeof z === "number" ? z : that.z;

        that.HTMLElement = createCompleteElement('div', ['proto'], [], [['x', x], ['y', y], ['z', z]]);
        that.updateHTMLPosition();
        that.HTMLElement.style.backgroundColor = that.membershipColor;
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
            moveDistance = Point.distanceTwoPoints(that.x, that.y, protoPositionMean.x, protoPositionMean.y);
            that.x = protoPositionMean.x;
            that.y = protoPositionMean.y;
            that.z = protoPositionMean.z;
        }
        return moveDistance;
    };
    this.updateHTMLPosition = function () {
        that.HTMLElement.style.bottom = that.y + "px";
        that.HTMLElement.style.left = that.x + "px";
        //TODO how to do for z coord ?
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
