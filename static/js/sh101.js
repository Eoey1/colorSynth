function Sh(x, y, length) {
    this.w = length * 0.1379;
    this.h = this.w;
    this.x = x;
    this.y = y;
    this.sliderX = this.x - this.w / 2;
    this.sliderY = this.y - this.h / 2;
    
    this.r = 2;
    this.lineLength = length;
    
    this.lineY = y;
    this.lineM = y;
    
    this.faderValue = 0;
    
    this.draw = function() {
       
        noStroke();
        fill(100);
        //rect(this.x - 15, this.y - (this.lineLength + this.h), this.w + 10, this.lineLength + this.h * 2);
        
//        strokeCap(SQUARE);
//        stroke(100);
//        strokeWeight(6.5);
//        line(this.x, this.lineY, this.x, this.lineY - this.lineLength);

        //stroke(150);
        //stroke(100);
        stroke(70);
//        strokeWeight(10);
        strokeWeight(length * 0.03793);
        strokeCap(SQUARE);
//        strokeCap(ROUND);
        line(this.x, this.lineY, this.x, this.lineY - this.lineLength);
        
        
        stroke(70);
        line(this.x, this.lineY, this.x, this.lineM);
        
        noStroke();
        fill(75);
        //fill(125);
        beginShape()
        vertex(this.sliderX, this.sliderY + this.r);
        quadraticVertex(this.sliderX, this.sliderY, this.sliderX + this.r, this.sliderY);
        vertex(this.sliderX + this.w - this.r, this.sliderY);
        quadraticVertex(this.sliderX + this.w, this.sliderY, this.sliderX + this.w, this.sliderY + this.r);
        vertex(this.sliderX + this.w, this.sliderY + this.h - this.r);
        quadraticVertex(this.sliderX + this.w, this.sliderY + this.h, this.sliderX + this.w - this.r, this.sliderY + this.h);
        vertex(this.sliderX + this.r, this.sliderY + this.h);
        quadraticVertex(this.sliderX, this.sliderY + this.h, this.sliderX, this.sliderY + this.h - this.r);
        endShape(CLOSE);
        
        var o = 2;
        stroke(100);
        strokeWeight(length * 0.013793);
        noFill();
        beginShape()
        vertex(this.sliderX + o, this.sliderY + o + this.r);
        quadraticVertex(this.sliderX + o, this.sliderY + o, this.sliderX + o + this.r, this.sliderY + o);
        vertex(this.sliderX + o + this.w - o * 2 - this.r, this.sliderY + o);
        quadraticVertex(this.sliderX + o + this.w - o * 2, this.sliderY + o, this.sliderX + o + this.w - o * 2, this.sliderY + o + this.r);
        vertex(this.sliderX + o + this.w - o * 2, this.sliderY + o + this.h - o * 2 - this.r);
        quadraticVertex(this.sliderX + o + this.w - o * 2, this.sliderY + o + this.h - o * 2, this.sliderX + o + this.w - o * 2 - this.r, this.sliderY + o + this.h - o * 2);
        vertex(this.sliderX + o + this.r, this.sliderY + o + this.h - o * 2);
        quadraticVertex(this.sliderX + o, this.sliderY + o + this.h - o * 2, this.sliderX + o, this.sliderY + o + this.h - o * 2 - this.r);
        endShape(CLOSE);

        push();
        strokeCap(SQUARE);
        strokeWeight(length * 0.01724);
        stroke(200);
        line(this.sliderX + this.w / 5, this.sliderY + this.h / 2, this.sliderX + this.w * 4 / 5, this.sliderY + this.h / 2);
        pop();
    }
    
    this.pressed = function() {
        if (mouseIsPressed) {
            if (mouseY <= this.y && mouseY >= this.y - this.lineLength) {
                if (mouseX >= this.sliderX && mouseX <= this.sliderX + this.w) {
                    this.sliderY = mouseY - this.h / 2 + 1;
                    this.lineM = mouseY;  
                }   
            }
        }
    }
    
    this.mapping = function() {
        this.faderValue = map(this.sliderY + this.h / 2, this.lineY, this.lineY - this.lineLength, 0, 1);    
    }
}