'use strict';
function KmeansUI(element, options) {

    var rand = function (min, max) {
        return (Math.random() * (max - min) + min);
    };
    var d = [];

    for (var i = 0; i < 100; i++) {
        var x = rand(0, 1000);
        var y = rand(0, 1000);
        d.push(new Coordinate({"x": x, "y": y}))
    }

    var a = new KMeans_core({
        data: d,
        centerPositions: [new Coordinate({x: rand(0, 1000), y: rand(0, 1000)})],
        coordinateNames: ["x", "y"],
        centerThresholdMovement: 0,
        maxIteration: 0,
        distanceFunction: function (pointA, pointB) {
            var xPow = Math.pow(pointA.x - pointB.x, 2);
            var yPow = Math.pow(pointA.y - pointB.y, 2);
            var zPow = Math.pow(pointA.z - pointB.z, 2);
            return Math.sqrt(xPow + yPow + zPow);
        },
        onStepDone: function (currentDataState, stepNth, cb) {
            console.groupCollapsed("Step number " + stepNth + " done.");
            console.log(currentDataState);
            console.groupEnd();
            setTimeout(cb, 1000);
        }
    });

    var opts = {
        /**
         * Data given to Kmeans_core.js
         */
        data: [],
        /**
         * Keys to get coordinates in a Coordinate object
         */
        coordinateNames: ["x", "y"],
        /**
         * Define timers to throttle events
         */
        time: {
            beforeFirstStep: 1000,
            betweenStep: 1000
        }
    };


    var initUI = function (container) {
        var d = d3.select(container);

    };

    var check = function () {
        if (typeof d3 !== "object") {
            console.error("d3 library is not loaded.");
        } else {
            initUI(); //TODO ADD CONTAINER
        }
    };
}