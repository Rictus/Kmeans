/**
 *
 * @param position Object. Key=x, or posX or positionX, ... Value=Value of the position
 * @constructor
 */
function Coordinate(position) {
    var that = this;
    var isNumberRegex = /^\d+[,.]?\d*$/;

    var getStringPosition = function (position) {
        if (isNumberRegex.test(position)) {
            that.posX = parseFloat(position);
        } else {
            console.error("Unparsable number : " + position);
        }
        return position;
    };

    var parsePosition = function (p) {
        var pType = typeof p;
        var funCallFromType = {
            "string": getStringPosition,
            "number": function (p) {
                return p;
            }
        };
        if (funCallFromType.hasOwnProperty(pType)) {
            return funCallFromType[pType]();
        } else {
            console.error("Given position can't be parsed : Wrong type : " + p + " Type=" + pType);
            return false;
        }
    };

    if (typeof position === "object") {
        for (var key in position) {
            if (position.hasOwnProperty(key)) {
                var p = parsePosition(position[key]);
                p !== false ? that[key] = p : "";
            }
        }
    }
}