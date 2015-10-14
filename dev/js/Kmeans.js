function KMeans(mainParentElement, nbPoints, nbProtos, activeAnimation, active3d, onDone) {
    activeAnimation = typeof activeAnimation === "boolean" ? activeAnimation : true;
    active3d = typeof active3d === "boolean" ? active3d : false;
    var KIterator = 0;
    var MaxKIterator = 50;
    var coordinate = new Coordinate(mainParentElement, nbPoints, nbProtos, active3d);

    var loops = function () {
        var cummulatedMoveDistance = 0;
        //Finding closest protos for each points
        for (var i = 0; i < coordinate.points.length; i++) {
            var curPoint = coordinate.points[i];
            var indexClosestProto = Point.findClosestPoint(curPoint, coordinate.protos);
            if(indexClosestProto===-1) {
                console.group("Problem when trying to find a proto for a point");
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
            if (onDone) onDone();
        } else if(activeAnimation){
            setTimeout(loops, 300);
        } else {
            loops();
        }
    };

    setTimeout(loops, 1000);
}