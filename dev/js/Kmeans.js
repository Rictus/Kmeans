'use strict';
function KMeans(mainParentElement, userOptions, onDone) {
    var loops = function () {
        var cummulatedMoveDistance = 0;
        //Finding closest protos for each points
        for (var i = 0; i < coordinate.points.length; i++) {
            var curPoint = coordinate.points[i];
            var indexClosestProto = Point.findClosestPoint(curPoint, coordinate.protos);
            if (indexClosestProto === -1) {
                console.group("Problem when trying to find a proto for this point ");
                console.log(curPoint);
                console.groupEnd();
            } else {
                coordinate.protos[indexClosestProto].addToMembership(curPoint);
                curPoint.updateColor(coordinate.protos[indexClosestProto].membershipColor);
            }
        }

        //Calculating all sums
        for (i = 0; i < coordinate.protos.length; i++) {
            var curProto = coordinate.protos[i];
            cummulatedMoveDistance += curProto.calculMeanMembership();
            curProto.updatePosition();
            curProto.emptyMembership();
        }

        if (cummulatedMoveDistance == 0) {
            if (typeof onDone === "function") {
                onDone();
            }
        } else if (Options.ACTIVE_ANIMATION) {
            setTimeout(loops, Options.TIME_BETWEEN_ITERATIONS);
        } else {
            loops();
        }
    };

    var readOptions = function () {
        if (typeof userOptions === "object") {
            for (var key in userOptions) {
                if (Options.hasOwnProperty(key) && userOptions.hasOwnProperty(key)) {
                    Options[key] = userOptions[key];
                } else {
                    //console.warn("Unknown property from given option object : " + key);
                }
            }
        } else {
            console.warn("No option given, using default");
        }
    };

    //mainParentElement.innerHTML = "";
    readOptions();
    var coordinate = new CoordinateTable(mainParentElement);
    setTimeout(loops, Options.TIME_BEFORE_CALCUL);
}