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
        },
        genRandomRgba: function () {
            var red = Math.round(Math.random() * (255));
            var green = Math.round(Math.random() * (255));
            var blue = Math.round(Math.random() * (255));
            var opacity = 1;
            return "rgba(" + red + "," + green + "," + blue + "," + opacity + ")";
        }
    };
    this.HSL = {
        hue: 0,
        saturation: 0,
        lightness: 0,
        getString: function () {
            return "hsl(" + this.hue + "," + this.saturation + "," + this.lightness + ")";
        },
        getCSSString: function () {
            var cssHue = this.hue * 360;
            var cssSat = this.saturation * 100;
            var cssLig = this.lightness * 100;
            return "hsl(" + cssHue + "," + cssSat + "%," + cssLig + "%)";
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
            var redStringPart = that.RGBA.red;
            var greenStringPart = that.RGBA.green;
            var blueStringPart = that.RGBA.blue;

            that.Hexa = "#" + redStringPart.toString(16) + greenStringPart.toString(16) + blueStringPart.toString(16);
            log.colorConvertionReport("Converting from RGBA to HEXA", that.RGBA.getStringRgba(), that.Hexa)
        },
        Hexa_to_RGBA: function () {
            var firstTwoChars = that.Hexa.substr(1, 2);
            var secondTwoChars = that.Hexa.substr(3, 2);
            var thirdTwoChars = that.Hexa.substr(5, 2);
            that.RGBA.red = parseInt(firstTwoChars, 16);
            that.RGBA.green = parseInt(secondTwoChars, 16);
            that.RGBA.blue = parseInt(thirdTwoChars, 16);
            that.RGBA.opacity = 1;
            log.colorConvertionReport("Converting from HEXA to RGBA", that.Hexa, that.RGBA.getStringRgba())
        },
        RGBA_to_HSL: function () {
            //From http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
            var r = that.RGBA.red / 255;
            var g = that.RGBA.green / 255;
            var b = that.RGBA.blue / 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }

            that.HSL.hue = h;
            that.HSL.saturation = s;
            that.HSL.lightness = l;
            log.colorConvertionReport("Convert RGBA to HSL", that.RGBA.getStringRgba(), that.HSL.getString());
        },
        HSL_to_RGBA: function () {
            var r, g, b;
            var h = that.HSL.hue;
            var s = that.HSL.saturation;
            var l = that.HSL.lightness;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            that.RGBA.red = Math.round(r * 255);
            that.RGBA.green = Math.round(g * 255);
            that.RGBA.blue = Math.round(b * 255);
            that.RGBA.opacity = 1;
            log.colorConvertionReport("Convert HSL to RGBA", that.HSL.getString(), that.RGBA.getStringRgba());
        }
    };

    var log = {
        colorConvertionReport: function (whichConversion, sourceColor, destColor) {
            console.group(whichConversion);
            console.log(sourceColor);
            console.log(destColor);
            console.groupEnd();
        }
    };

    var convertionRoutine = {
        arrayFuncCalls: [convert.RGBA_to_Hexa, convert.Hexa_to_RGBA, convert.RGBA_to_HSL, convert.HSL_to_RGBA],
        removeFromRoutine: function (funcCall) {
            var indexOfFunc = this.arrayFuncCalls.indexOf(funcCall);
            if (indexOfFunc >= 0) {
                this.arrayFuncCalls.splice(indexOfFunc, 1);
            }
        },
        launchRoutine: function () {
            for (var i = 0; i < this.arrayFuncCalls.length; i++) {
                this.arrayFuncCalls[i]();
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
                    if (!( (isFloat(opacityNumber) || isInt(opacityNumber)) && opacityNumber <= 1.0)) {
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
        },
        is_hsl: function (color) {

        }
    };

    if (colorString) {
        if (testAndSet.is_hexa(colorString)) {
            console.log(colorString + " is hexa");
            this.Hexa = colorString;
            convertionRoutine.removeFromRoutine(convert.RGBA_to_Hexa);
        }
        if (testAndSet.is_rgba(colorString) || testAndSet.is_rgb(colorString)) {
            console.log(colorString + " is rgb/rgba");
            convertionRoutine.removeFromRoutine(convert.Hexa_to_RGBA);
            convertionRoutine.removeFromRoutine(convert.HSL_to_RGBA);
        }
        if (testAndSet.is_hsl(colorString)) {
            console.log(colorString + " is hsl");
            convertionRoutine.removeFromRoutine(convert.RGBA_to_HSL);
        }
        convertionRoutine.launchRoutine();
    }


//WIP :  RGB > XYZ
//WIP : XYZ > CIE LAB
//WIP : From Cie Lab : calcul Delta E


}


window.onload = function () {
    var applyColor = function (element, colorString) {
        element.style.backgroundColor = colorString;
        var innnerText = element.querySelector('.innerText');
        innnerText.innerHTML = colorString;
    };

    var container = document.getElementById('colorContainer');
    var appendingHTML = "";
    var nbAppend = 100;
    for (var i = 0; i < nbAppend; i++) {
        appendingHTML += '<div class="colorCouple">' +
            '<div class="rail left" id="left">' +
            '<div class="railInnerCont">' +
            '<div class="innerText">No color</div>' +
            '</div>' +
            '</div>' +
            '<div class="rail right" id="right">' +
            '<div class="railInnerCont">' +
            '<div class="innerText">No color</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    container.innerHTML = appendingHTML;

    var coupleColors = document.getElementsByClassName('colorCouple');
    for (i = 0; i < coupleColors.length; i++) {
        var Nothing = new Color();
        var firstColor = Nothing.RGBA.genRandomRgba();
        var secondColor = "black";


        var leftDom = (coupleColors[i].getElementsByClassName('left')[0]);
        var rightDom = (coupleColors[i].getElementsByClassName('right')[0]);

        applyColor(leftDom, firstColor);
        applyColor(rightDom, secondColor);

        //Changing the left color representation : applying to right dom
        var fColorObject = new Color(firstColor);
        var changedColor = fColorObject.HSL.getCSSString();
        console.log(changedColor);
        applyColor(rightDom, changedColor);
    }
};
