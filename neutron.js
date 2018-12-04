function Neutron(x, y, length, height) {
    this.h = height;

    this.x = x;
    this.y = y;
    this.sliderX = this.x;
    this.sliderY = this.y;
    this.sX = this.x;
    
    this.smoothedX = this.x;
    
    this.lineWidth = length;
    
    this.faderValue = 0;
    
    this.onePole = new maximEx.onePole();
    this.onePole.setTime(10.0, 60);
    
    this.draw = function() {
        strokeWeight(this.h / 20);
        stroke(225);
        line(this.x, this.y, this.x + this.lineWidth, this.y);

        stroke(225);
        noFill();
        ellipse(this.smoothedX, this.sliderY, this.h);
        fill(225);
        ellipse(this.smoothedX, this.sliderY, this.h / 3);
    }
    
    this.pressed = function() {
        if (mouseIsPressed) {
            if (mouseX <= this.x + this.lineWidth && mouseX >= this.x) {
                if (mouseY >= this.sliderY - this.h / 2 && mouseY <= this.sliderY + this.h / 2) {
                    this.sX = mouseX;
                    this.sliderX = constrain(this.sX, this.x, this.x + this.lineWidth);
                    
                    //this won't work in mousedragged because of the onePole!
                    this.smoothed = this.onePole.process(this.sliderX); // need to constrain the onePole to stop it jumping backwards
                    this.smoothedX = constrain(this.smoothed, this.x, this.x + this.lineWidth); 
                
                }   
            }
        }
    }
    
    this.mapping = function() {
        this.value = map(this.smoothedX, this.x, this.x + this.lineWidth, 1, 8);    
    }
}