window.onload = function () {
    var firstColor = "rgba(52, 152, 219,.5)";
    var secondColor = "#c0392b";
    var container = document.getElementById('colorContainer');
    var leftDom = (container.getElementsByClassName('left')[0]);
    leftDom.style.backgroundColor = firstColor;
    var rightDom = (container.getElementsByClassName('right')[0]);
    rightDom.style.backgroundColor = secondColor;

    var fColorObject = new Color(firstColor);

    rightDom.style.backgroundColor = fColorObject.RGBA.getString();
};

function Color(colorString) {
    var that = this;
    this.RGBA = {
        red: 0,
        green: 0,
        blue: 0,
        opacity: 1,
        getString: function () {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.opacity + ")";
        }
    };
    this.Hexa = "";

    var regex = {
        spaceFinder: /[\s]/gi
    };

    var convert = {
        /**
         * Convert the current color to hexadecimal,
         * assuming it's a rgba description.
         */
        RGBA_Hexa: function () {
            var firstTwoChars = that.Hexa.substr(1, 2);
            var secondTwoChars = that.Hexa.substr(3, 2);
            var thirdTwoChars = that.Hexa.substr(5, 2);
            that.RGBA.red = parseInt(firstTwoChars, 16);
            that.RGBA.green = parseInt(secondTwoChars, 16);
            that.RGBA.blue = parseInt(thirdTwoChars, 16);
            console.log(firstTwoChars + " " + parseInt(firstTwoChars, 16));
            that.RGBA.opacity = 1;
        }
    };


    var convertionRoutine_FunctionCalls = [convert.RGBA_Hexa];
    var test = {
        is_hexa: function (color) {//Ex: #e74c3c
            var hexaColorRegex = /^#[0-9a-fA-F]{6}$/;
            return hexaColorRegex.test(color);
        },
        is_rgb: function (color) {//Ex: rgb(153,240,140)
            color = color.replace(regex.spaceFinder, '');
            var rgbColorRegex = /^rgb\([0-9]+,[0-9]+,[0-9]+\)$/;
            var it_is = rgbColorRegex.test(color);
            if (it_is) {
                var rgbPart = color.substr(4, color.length - 2); //Removing "rgb(" and ")"
                var innerParts = rgbPart.split(',');
                var i = 0;
                var curNumber = 0;
                do {
                    curNumber = parseInt(innerParts[i], 10);
                    if (!(isInt(curNumber) && curNumber <= 255))
                        it_is = false;
                    i++;
                } while (it_is && i < innerParts.length);

                return it_is;
            } else {
                return false;
            }
        },
        is_rgba: function (color) {//Ex: rgba(153,240,140, .5) as rgba(153,240,140, 1) as rgba(153,240,140, 0.5)
            color = color.replace(regex.spaceFinder, '');
            var rgbColorRegex = /^rgba\([0-9]+,[0-9]+,[0-9]*\.?[0-9]+\)$/; //TODO HERE : Why is this regex not working ?
            var it_is = rgbColorRegex.test(color);
            if (it_is) {
                var rgbPart = color.substr(4, color.length - 2);
                var innerParts = rgbPart.split(',');
                var i = 0;
                var curNumber = 0;
                do {
                    curNumber = parseInt(innerParts[i], 10);
                    if (isInt(curNumber) && curNumber < 255)
                        it_is = false;
                    i++;
                } while (it_is && i < innerParts.length - 1); //-1 : alpha part shouldn't be read here

                if (it_is) {
                    var opacityNumber = parseFloat(innerParts[innerParts.length - 1]);
                    if (!(isFloat(opacityNumber) && opacityNumber <= 1)) {
                        it_is = false;
                    }
                }

                return it_is;
            } else {
                return false;
            }
        }
    };

    /**
     * Convert the current color to all known color description
     */
    var convertionRoutine = function () {
        for (var i = 0; i < convertionRoutine_FunctionCalls.length; i++) {
            convertionRoutine_FunctionCalls[i]();
        }
    };

    if (test.is_hexa(colorString)) {
        console.log(colorString + " is hexa");
        this.Hexa = colorString;
        //TODO : And remove all conversion from XXX To Hexa, from the array
    }
    if (test.is_rgb(colorString)) {
        console.log(colorString + " is rgb");
        //Assuming no opacity
        that.Hexa = 1;
        //TODO : And remove all conversion from XXX To rgb, from the array
    }
    if (test.is_rgba(colorString)) {
        console.log(colorString + " is rgba");
        //TODO : And remove all conversion from XXX To rgba, from the array
    }
    //convertionRoutine();
}