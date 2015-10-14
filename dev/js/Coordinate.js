"use strict";
function Coordinate(mainParentElement) {
    this.HTMLElement = mainParentElement;
    var that = this;
    this.MIN_X = Options.MIN_X;
    this.MAX_X = Options.MAX_X;
    this.MIN_Y = Options.MIN_Y;
    this.MAX_Y = Options.MAX_Y;
    this.MIN_Z = Options.ACTIVE_3D ? Options.MIN_Z : 0;
    this.MAX_Z = Options.ACTIVE_3D ? Options.MAX_Z : 0;
    this.NB_POINTS = typeof nbPoints !== "undefined" && typeof parseInt(nbPoints) === "number" ? parseInt(nbPoints) : Options.NB_POINTS;
    this.NB_PROTOS = typeof nbProtos !== "undefined" && typeof parseInt(nbProtos) === "number" ? parseInt(nbProtos) : Options.NB_PROTOS;
    //Static values
    this.points = [];
    this.protos = [];

    this.getRandomCoords = function (minCoord, maxCoord) {
        var checkTypeAndValue = function (variable, defaultValue) {
            return typeof variable === "number" ? variable : defaultValue;
        };
        var max = {x: 0, y: 0, z: 0};
        var min = {x: 0, y: 0, z: 0};
        minCoord = typeof minCoord === "object" ? minCoord : {};
        maxCoord = typeof maxCoord === "object" ? maxCoord : {};
        min.x = checkTypeAndValue(minCoord.x, that.MIN_X);
        min.x = checkTypeAndValue(minCoord.x, that.MIN_X);
        max.x = checkTypeAndValue(maxCoord.x, that.MAX_X);
        min.y = checkTypeAndValue(minCoord.y, that.MIN_Y);
        max.y = checkTypeAndValue(maxCoord.y, that.MAX_Y);
        min.z = checkTypeAndValue(minCoord.z, that.MIN_Z);
        max.z = checkTypeAndValue(maxCoord.z, that.MAX_Z);
        return {
            x: Math.round(Math.random() * (max.x - min.x) + min.x),
            y: Math.round(Math.random() * (max.y - min.y) + min.y),
            z: Math.round(Math.random() * (max.z - min.z) + min.z)
        };
    };

    this.init = function () {
        //that.HTMLElement.innerHTML = "";
        that.points = [];
        that.protos = [];
        var givenRandomCoord;
        var newPoint;
        var newProto;
        //Creating randomly positionned points, adding to array and to HTML
        for (var i = 0; i < that.NB_POINTS; i++) {
            givenRandomCoord = that.getRandomCoords();

            newPoint = new Point(givenRandomCoord);
            that.points.push(newPoint);
            that.HTMLElement.appendChild(newPoint.HTMLElement);
            newPoint.updatePosition();
        }
        //Creating randomly positionned protos, adding to array and to HTML,
        for (var j = 0; j < that.NB_PROTOS; j++) {
            givenRandomCoord = that.getRandomCoords();
            newProto = new Proto(givenRandomCoord, Color.genRandomColor());
            that.protos.push(newProto);
            that.HTMLElement.appendChild(newProto.HTMLElement);
            newProto.updatePosition();
        }
    };
    this.init();
}
