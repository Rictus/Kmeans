function Color() {
    var red = "";
    var green = "";
    var blue = "";
    var opacity = "";

    var getRGBA = function () {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.opacity + ")";
    };
    var getRGB = function () {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    };
    //TODO convert to XYZ and calculate similiarity distance
}
Color.genRandomColor = function () {
    red = Math.round(Math.random() * (255));
    green = Math.round(Math.random() * (255));
    blue = Math.round(Math.random() * (255));
    opacity = 1;
    return "rgba(" + red + "," + green + "," + blue + "," + opacity + ")";
};
