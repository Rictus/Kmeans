var defaultsOptions = {
    /**
     * Every element should be an instance of Coordinate
     */
    data: [],
    /**
     * The number of group to search for
     */
    nbCluster: 0,
    /**
     * Function called before starting a new step
     */
    onStepStart: function (currentDataState, stepNth) {
        console.groupCollapsed("Step number " + stepNth + " started.");
        console.log(currentDataState);
        console.groupEnd();
    },
    /**
     * Called when a step is completed
     */
    onStepDone: function (currentDataState, stepNth) {
        console.groupCollapsed("Step number " + stepNth + " done.");
        console.log(currentDataState);
        console.groupEnd();
    },
    /**
     * Function called when kmean is entirely completed
     */
    onDone: function () {
        console.groupEnd();
    },
    /**
     * Function called before the first step
     */
    onStart: function () {
        console.group("Kmean start");
    }
};

'use strict';
function KMeans(opts) {

    var options = mergeObjects(defaultsOptions, opts);
    var points = [];
    var nbPoints = 0;
    var stepNth = 0;

    options.onStart();
    var l = function () {
        options.onStepStart(points, stepNth);
    };

    var check = function () {
        if (options.data instanceof Array) {
            nbPoints = options.data.length;
            options.data.forEach(function (el, idx) {
                if (el instanceof Coordinate) {
                    points.push(el);
                } else {
                    console.error("Wrong argument type : Element of data at index " + idx + " is not an instance of Coordinate");
                }
            });
        } else {
            console.error("Wrong argument type : data is not an array");
        }
    };
}