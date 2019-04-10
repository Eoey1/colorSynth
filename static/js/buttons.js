function Button(center_x, center_y, diam) {
    this.width = diam;
    this.height = diam;
    this.topLeft = createVector(center_x - this.width / 2, center_y - this.height / 2);
    this.bottomRight = createVector(center_x + this.width / 2, center_y + this.height / 2);
    this.isActive = false;
    this.onPressed = undefined;

    this.draw = function () {
        stroke(255);

        if (this.isActive) 
        {
            fill(255, 0, 0);
        }
        else if(!this.isActive)
        {
            //fill(171, 0, 52);
            fill(100, 0, 0);
        }

        rect(this.topLeft.x, this.topLeft.y, this.width, this.height)
    }

    this.isInside = function (x, y) {
        if (x > this.topLeft.x && x < this.bottomRight.x) {
            if (y > this.topLeft.y && y < this.bottomRight.y) {
                return true;
            }
        }

        return false;
    }

    this.press = function () {
        this.isActive = !this.isActive;
        if (this.onPressed != undefined) {
            this.onPressed();
        }
    }

    this.resize = function(center_x, center_y, diam){
        this.width = diam;
        this.height = diam;
        this.topLeft = createVector(center_x - this.width / 2, center_y - this.height / 2);
        this.bottomRight = createVector(center_x + this.width / 2, center_y + this.height / 2);
    }
}