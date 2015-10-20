window.onload = function () {
    var firstColor = "rgba(46, 204, 113,1.0)";
    var secondColor = "#c0392b";
    var container = document.getElementById('colorContainer');
    var leftDom = (container.getElementsByClassName('left')[0]);
    leftDom.style.backgroundColor = firstColor;
    var rightDom = (container.getElementsByClassName('right')[0]);
    rightDom.style.backgroundColor = secondColor;

    var fColorObject = new Color(firstColor);

    rightDom.style.backgroundColor = fColorObject.RGBA.getStringRgba();
    console.log(fColorObject.RGBA.getStringRgba());
};

function Color(colorString) {
    var that = this;
    this.RGBA = {
        red: 0,
        green: 0,
        blue: 0,
        opacity: 1,
        getStringRgba: function () {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.opacity + ")";
        },
        getStringRgb: function () {
            return "rgba(" + this.red + "," + this.green + "," + this.blue + ")";
        }
    };
    this.Hexa = "";

    var regex = {
        spaceFinder: /[\s]/gi,
        hexaColor: /^#[0-9a-fA-F]{6}$/, //match for #c0392b
        rgbaColor: /^rgba\([0-9]+,[0-9]+,[0-9]+,[0-9]*?\.?[0-9]+\)$/i, //match for rgba(255,255,255,.5) as well as rgba(255,255,255,1) as well as rgba(255,255,255,5.5)
        rgbColor: /^rgb\([0-9]+,[0-9]+,[0-9]+\)$/ //math for rgb(255,255,255)
    };

    var convert = {
        /**
         * Convert the current color to hexadecimal,
         * assuming it's a rgba description.
         */
        RGBA_to_Hexa: function () {
            var redStringPart = that.RGBA.red + "";
            var greenStringPart = that.RGBA.green + "";
            var blueStringPart = that.RGBA.blue + "";
            that.Hexa = "#" + redStringPart.toString(16) + greenStringPart.toString(16) + blueStringPart.toString(16);
        },
        Hexa_to_RGBA: function () {
            var firstTwoChars = that.Hexa.substr(1, 2);
            var secondTwoChars = that.Hexa.substr(3, 2);
            var thirdTwoChars = that.Hexa.substr(5, 2);
            that.RGBA.red = parseInt(firstTwoChars, 16);
            that.RGBA.green = parseInt(secondTwoChars, 16);
            that.RGBA.blue = parseInt(thirdTwoChars, 16);
            that.RGBA.opacity = 1;
        }
    };


    var convertionRoutine = {
        array: [convert.RGBA_to_Hexa, convert.Hexa_to_RGBA],
        removeFromRoutine : function (funcCall) {
            var indexOfFunc = this.array.indexOf(funcCall);
            if (indexOfFunc >= 0) {
                this.array.splice(indexOfFunc, 1);
            }
        },
        launchRoutine: function () {
            for (var i = 0; i < this.array.length; i++) {
                this.array[i]();
            }
        }
    };

    /**
     * Some funcs to test if for a given string representation of a color it match the regex
     * and init the values
     * E.G : If you launch is_hexa test and it succeed, this.Hexa will be set to the value
     */
    var testAndSet = {
        is_hexa: function (color) {//Ex: #e74c3c
            var it_is = regex.hexaColor.test(color);
            if (it_is)
                that.Hexa = color;
            return it_is;
        },
        is_rgb: function (color) {//Ex: rgb(153,240,140)
            color = color.replace(regex.spaceFinder, '');
            var it_is = regex.rgbColor.test(color);
            if (it_is) {
                var rgbPart = color.substr(4, color.length - 5); //Removing "rgb(" and ")"
                var innerParts = rgbPart.split(',');
                var i = 0;
                do {
                    innerParts[i] = parseInt(innerParts[i], 10);
                    if (!(isInt(innerParts[i]) && innerParts[i] <= 255))
                        it_is = false;
                    i++;
                } while (it_is && i < innerParts.length);
                if (it_is) {
                    that.RGBA.red = innerParts[0];
                    that.RGBA.green = innerParts[1];
                    that.RGBA.blue = innerParts[2];
                    that.RGBA.opacity = 1;
                }
                return it_is;
            } else {
                return false;
            }
        },
        is_rgba: function (color) {//Ex: rgba(153,240,140, .5) as rgba(153,240,140, 1) as rgba(153,240,140, 0.5)
            color = color.replace(regex.spaceFinder, '');
            var it_is = regex.rgbaColor.test(color);
            if (it_is) {
                var rgbPart = color.substr(5, color.length - 6);
                var innerParts = rgbPart.split(',');
                var i = 0;
                do {
                    innerParts[i] = parseInt(innerParts[i], 10);
                    if (!(isInt(innerParts[i]) && innerParts[i] <= 255))
                        it_is = false;
                    i++;
                } while (it_is && i < innerParts.length - 1); //-1 : alpha part shouldn't be read here
                if (it_is) {
                    var opacityNumber = parseFloat(innerParts[innerParts.length - 1]);
                    if (!( (isFloat(opacityNumber) ||isInt(opacityNumber)) && opacityNumber <= 1.0)) {
                        it_is = false;
                    } else {
                        that.RGBA.red = innerParts[0];
                        that.RGBA.green = innerParts[1];
                        that.RGBA.blue = innerParts[2];
                        that.RGBA.opacity = opacityNumber;
                    }
                }

                return it_is;
            } else {
                return false;
            }
        }
    };


    if (testAndSet.is_hexa(colorString)) {
        console.log(colorString + " is hexa");
        this.Hexa = colorString;
        convertionRoutine.removeFromRoutine(convert.RGBA_to_Hexa);
    }
    if (testAndSet.is_rgba(colorString) || testAndSet.is_rgb(colorString)) {
        console.log(colorString + " is rgb/rgba");
        convertionRoutine.removeFromRoutine(convert.Hexa_to_RGBA);
    }

}