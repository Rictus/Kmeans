'use strict';
function KMeans(opts) {
    var defaultsOptions = {
        /**
         * Every element should be an instance of Coordinate and  have same position notations as centerPositions
         */
        data: [],
        /**
         * Every element should be an instance of Coordinate and have same position notations as data
         *///TODO : Give the ability to start with random centers based on collected min/max
        centerPositions: [],
        /**
         * Keys to get coordinates in a Coordinate object
         */
        coordinateNames: ["x", "y", "z"],
        /**
         * Kmean algorithm stop when centers completely stop to move.
         * Specify if you want to algorithm to be more flexible. If at least one center
         * should move for more than this value, the kmean algorithm continue.
         */
        centerThresholdMovement: 0,
        /**
         * The maximum number of iterations. 0 for infinity until threshold movement is reached.
         */
        maxIteration: 0,
        /**
         * Return a number describing the distance between the two given points
         * @param pointA instanceof Coordinate
         * @param pointB instanceof Coordinate
         */
        distanceFunction: function (pointA, pointB) {
            var xPow = Math.pow(pointA.x - pointB.x, 2);
            var yPow = Math.pow(pointA.y - pointB.y, 2);
            var zPow = Math.pow(pointA.z - pointB.z, 2);
            return Math.sqrt(xPow + yPow + zPow);
        },
        /**
         * Function called before starting a new step
         */
        onStepStart: function (currentDataState, stepNth) {
            console.groupCollapsed("Step number " + stepNth + " started.");
            console.log(currentDataState);
            console.groupEnd();
        },
        /**
         * Called when a step is completed. Call the callback function to start the next step
         */
        onStepDone: function (currentDataState, stepNth, cb) {
            console.groupCollapsed("Step number " + stepNth + " done.");
            console.log(currentDataState);
            console.groupEnd();
            cb();
        },
        /**
         * Function called before the first step
         */
        onStart: function () {
            console.group("Kmean start");
        },
        /**
         * Function called when kmean is entirely completed
         */
        onDone: function (currentDataState, stepNth) {
            console.groupEnd();
        }
    };
    var options = mergeObjects(defaultsOptions, opts);
    var points = [];
    var nbPoints = 0;
    var stepNth = 0;
    var limits = {};
    var centers = [];
    var maxCenterMovementDistance = -1;

    var findPointCenters = function () {
        // For each point, find which center it belongs to.
        for (var i = 0; i < nbPoints; i++) {
            var curPoint = points[i];
            var idxClosestCenter = findClosestCenterIdxForPoint(curPoint);
            centers[idxClosestCenter].membership.push(curPoint);
        }
    };

    var computeCentersMovements = function () {
        // For each center, calculate the movement needed to match the membership barycenter
        for (var c = 0; c < centers.length; c++) {
            var curCenter = centers[c];
            // Iterating through possible coordinates (x,y,z,...)
            for (var cn = 0; cn < options.coordinateNames.length; cn++) {
                var sum = 0;
                var coordName = options.coordinateNames[cn];
                // Iterating through points
                for (var p = 0; p < curCenter.membership.length; p++) {
                    var pointOwnedByCenter = curCenter.membership[p];
                    sum += pointOwnedByCenter[coordName]
                }
                centers[c].nextPosition[coordName] = sum / centers[c].membership.length;
            }
            // Calculate movement and save biggest one
            centers[c].movementDistance = options.distanceFunction(centers[c], centers[c].nextPosition);
            if (maxCenterMovementDistance < centers[c].movementDistance) {
                maxCenterMovementDistance = centers[c].movementDistance;
            }
        }
    };

    var makeCentersMovements = function () {
        for (var c = 0; c < centers.length; c++) {
            for (var cn = 0; cn < options.coordinateNames.length; cn++) {
                var coordName = options.coordinateNames[cn];
                centers[c][coordName] = centers[c].nextPosition[coordName];
            }
        }
    };

    var loop = function () {
        options.onStepStart(points, stepNth);
        findPointCenters();

        computeCentersMovements();

        if (maxCenterMovementDistance > options.centerThresholdMovement) {
            makeCentersMovements();
            flushStep();
            options.onStepDone(points, stepNth, function () {
                stepNth++;
                if (options.maxIteration < 0 || stepNth > options.maxIteration) {
                    // Algorithm is done.
                    options.onDone(points, stepNth);
                } else {
                    loop();
                }
            });
        } else {
            // Algorithm is done.
            options.onDone(points, stepNth);
        }
    };

    var flushStep = function () {
        for (var c = 0; c < centers.length; c++) {
            centers[c].nextPosition = {};
            centers[c].membership = [];
            centers[c].movementDistance = -1;
        }
        maxCenterMovementDistance = -1;
    };

    var findClosestCenterIdxForPoint = function (point) {
        var minDist = Number.MAX_VALUE;
        var bestIdx = -1;
        var distance = -1;
        for (var c = 0; c < centers.length; c++) {
            distance = options.distanceFunction(centers[c], point);
            if (distance < minDist) {
                bestIdx = c;
                minDist = distance;
            }
        }
        if (indexClosestProto === -1) {
            console.group("Problem when trying to find closest center for this point : ");
            console.log(point);
            console.groupEnd();
        } else {
            return bestIdx;
        }
    };

    var registerPoint = function (coordinate) {
        options.coordinateNames.forEach(function (el, idx, array) {
            points.push(coordinate);
            limits[el].min = coordinate[el] < limits[el].min ? coordinate[el] : limits[el].min;
            limits[el].max = coordinate[el] < limits[el].max ? coordinate[el] : limits[el].max;
        });
    };

    var check = function () {
        if (options.centerPositions instanceof Array) {
            centers = options.centerPositions;
            centers.forEach(function (el, idx, array) {
                centers[idx].membership = [];
            });
        } else {
            console.error("Wrong argument type : centerPositions is not an array");
        }
        if (options.coordinateNames instanceof Array) {
            options.coordinateNames.forEach(function (el, idx, array) {
                limits[el] = {min: -1, max: 1};
            });
        } else {
            console.error("Wrong argument type : coordinateNames is not an array");
        }
        if (options.data instanceof Array) {
            nbPoints = options.data.length;
            options.data.forEach(function (el, idx) {
                if (el instanceof Coordinate) {
                    registerPoint(el);
                } else {
                    console.error("Wrong argument type : Element of data at index " + idx + " is not an instance of Coordinate");
                }
            });
        } else {
            console.error("Wrong argument type : data is not an array");
        }
        return true;
    };

    if (check() === true) {
        options.onStart();
        loop();
    }
}