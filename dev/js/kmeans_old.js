/*
//Static values
var points = [
    {x: 285, y: 256},
    {x: 351, y: 370},
    {x: 349, y: 303},
    {x: 115, y: 191},
    {x: 80, y: 350},
    {x: 92, y: 148},
    {x: 269, y: 38},
    {x: 126, y: 200},
    {x: 251, y: 53},
    {x: 323, y: 232},
    {x: 82, y: 249},
    {x: 375, y: 85},
    {x: 370, y: 164},
    {x: 375, y: 209},
    {x: 350, y: 267}
];
var protos = [
    {x: 353, y: 228},
    {x: 55, y: 271},
    {x: 250, y: 80}
];
//HTML Elements
var domPoints = [];
var domProtos = [];
var domCoord = document.getElementsByClassName('coordinate')[0];
//Constants
var MAX_X = domCoord.clientWidth;
var MIN_X = 0;
var MAX_Y = domCoord.clientHeight;
var MIN_Y = 0;
var NB_POINTS = MAX_X * MAX_Y / 300;
var NB_PROTOS = 6;
var MAX_VALUE = MAX_X * MAX_Y;

//false to use static values of points and protos; true randomize everything
var playRandomly = true;

var protosMembership = []; //array of arrays of points. Points belongs to i-ème protos
var protosMeans = [];//means calculation
var protosColors = []; //colors of each points that belong to the i-ème proto
var KIterator =  0;
//How many times shall we run kmeans ?
var MaxKIterator = 50;

var distanceTwoPoints = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow( (x1 - x2), 2) + Math.pow( (y1 - y2), 2) );
};
var getRandomCoords = function(){
    var x = Math.round(Math.random()*(MAX_X - MIN_X) + MIN_X);
    var y = Math.round(Math.random()*(MAX_Y - MIN_Y) + MIN_Y);
    return {
        x: x,
        y: y
    };
};

var getRandomColor = function(){
    var R = Math.round(Math.random()*(255));
    var G = Math.round(Math.random()*(255));
    var B = Math.round(Math.random()*(255));
    var opacity = 1;
    return "rgba("+R+","+G+","+B+","+opacity+")";
};
var buildRandomPoint = function() {
    var c = getRandomCoords();
    return buildPoint(c.x, c.y);
};
var buildPoint = function(x, y) {
    var point = createCompleteElement('div', ['point'], [], [['x', x], ['y', y]]);
    insertTooltip(point, x, y);
    return setCoords(point, x, y);
};

var insertTooltip = function(elem, x, y) {
    var tooltip = createCompleteElement('div', ['tooltip'], [], [], "("+x+","+y+")");
    elem.appendChild(tooltip);
};
var setCoords = function(elem, x, y) {
    elem.style.left = x+"px";
    elem.style.bottom = y+"px";
    return elem;
};

var buildRandomProto = function(nth) {
    var x = Math.round(Math.random()*(MAX_X - MIN_X)+MIN_X);
    var y = Math.round(Math.random()*(MAX_Y - MIN_Y)+MIN_Y);
    var c = getRandomCoords();
    protos.push(c);
    return buildProto(c.x, c.y, nth);
};
var buildProto = function(x, y, nth) {
    nth = nth ? nth : "";
    var proto = createCompleteElement('div', ['proto'], [], [['x', x], ['y', y]], nth+"");
    insertTooltip(proto, x, y);
    return setCoords(proto, x, y);
};

var init = function(){
    if(playRandomly) {
        points = [];
        protos = [];
        for(var i = 0; i < NB_POINTS; i++) {
            points.push(getRandomCoords());
        }
        for(var j = 0; j < NB_PROTOS; j++) {
            protos.push(getRandomCoords());
            console.log(j);
        }
    }
    //Points positionning
    var p;
    for(i = 0; i < points.length; i++) {
        p = buildPoint(points[i].x, points[i].y);
        domPoints.push(p);
        domCoord.appendChild(p);
    }
    //Protos positionning, sumTab initialization, color initialisation
    for(var i = 0; i < protos.length; i++) {
        var p = buildProto(protos[i].x, protos[i].y);
        protosMembership[i] = [];
        protosMeans[i] = {
            x: 0,
            y: 0
        };
        domProtos.push(p);
        domCoord.appendChild(p);
        protosColors[i] = getRandomColor();
    }
};

/!**
 *  Find the closest proto of a given point.
 *  Return the index of the founded proto
 *!/
var findClosestProto = function(point) {
    var curMaxDist = MAX_VALUE;
    var curMaxIndex = -1;
    for(var j = 0; j < protos.length; j++) {
        var dist = distanceTwoPoints(protos[j].x, protos[j].y, point.x, point.y);
        if(dist<curMaxDist){
            curMaxDist = dist;
            curMaxIndex = j;
        }
    }
    return curMaxIndex;
};


var kMeans = function() {
    //Finding closest protos for each points
    for(var i = 0; i < points.length; i++) {
        var indexClosestProto = findClosestProto(points[i]);
        /!*	console.group("Closest proto");
         console.log(domPoints[i]);
         console.log("belongs to : ");
         console.log(domProtos[indexClosestProto]);
         console.groupEnd();//!*!/
        protosMembership[indexClosestProto].push(points[i]);
        domPoints[i].style.backgroundColor = protosColors[indexClosestProto];
    }

    //Calculating all sums
    for(var j = 0; j < protos.length; j++) {
        for(var k = 0; k < protosMembership[j].length; k++) {
            protosMeans[j].x = protosMeans[j].x + protosMembership[j][k].x;
            protosMeans[j].y = protosMeans[j].y + protosMembership[j][k].y;
        }
        //Calculating curent proto means
        protosMeans[j].x = protosMeans[j].x / protosMembership[j].length;
        protosMeans[j].y = protosMeans[j].y / protosMembership[j].length;
    }

    //Deleting old protos in array and in DOM
    while(domProtos.length>0){
        domCoord.removeChild(domProtos[0]);
        domProtos.splice(0,1);
    }

    //Positioning new protos (visual feedback and array storing)
    for(var j = 0; j < protos.length; j++){
        var newProtosX = protosMeans[j].x;
        var newProtosY = protosMeans[j].y;
        var newHTMLProto = buildProto(newProtosX, newProtosY);
        domProtos.push(newHTMLProto);
        domCoord.appendChild(newHTMLProto) ;
        //Re-init values for next iteration
        protos[j] = {x: newProtosX, y : newProtosY};
        protosMeans[j].x = 0 ;
        protosMeans[j].y = 0;
        protosMembership[j] = [];
    }
    KIterator++;
    if(KIterator > MaxKIterator) {
        return;
    } else {
        setTimeout(kMeans, 300);
    }
};
console.clear();console.log("Starting ...");

init();
setTimeout(kMeans, 1000);*/
