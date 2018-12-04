function Slider(x, y, length, height) {
    this.x = x;
    this.y = y;
    
    this.h = height;
    this.w = this.h / 2;
    
    this.sliderX = this.x - this.w / 2;
    this.sliderY = this.y - this.h / 2;
    
    this.sX = this.x - this.w / 2;
    this.smoothedX = this.x - this.w / 2;
    
    this.r = this.h / 4;
    this.lineWidth = length;
    
    this.faderValue = 0;
    
    this.onePole = new maximEx.onePole();
    this.onePole.setTime(150.0, 60);
    
    this.draw = function() {
        strokeWeight(this.h / 15);
        stroke(25);
        //line(this.x, this.y, this.x + this.lineWidth, this.y);
        line(this.x, this.y, this.x + this.lineWidth + this.lineWidth / 10, this.y);

        stroke(100);
        
        push();
        for (var i = 1; i < 16; i++) {
            stroke(255);
            if (i % 4 == 0) {
                strokeWeight(this.h / 20);
            } else {
                strokeWeight(this.h / 80);
//                strokeWeight(1);
            }
            
            line(this.x + i * this.lineWidth / 16, this.y - this.lineWidth / 20, this.x + i * this.lineWidth / 16, this.y - this.w);
            line(this.x + i * this.lineWidth / 16, this.y + this.lineWidth / 20, this.x + i * this.lineWidth / 16, this.y + this.w);
        }
        pop(); 
        
        push();
        for (var i = 0; i < 3; i++) {
            stroke(255);
            strokeCap(PROJECT);
            line(this.x + i * this.lineWidth / 2, this.y - this.lineWidth / 20, this.x + i * this.lineWidth / 2, this.y - this.h * 7 / 12);
            line(this.x + i * this.lineWidth / 2, this.y + this.lineWidth / 20, this.x + i * this.lineWidth / 2, this.y + this.h * 7 / 12);
        } 
        pop();
        
//        push();
//        for (var i = 0; i < 3; i++) {
//            stroke(255);
//            strokeCap(PROJECT);
//            line(this.x + i * this.lineWidth / 2, this.y - this.lineWidth / 20, this.x + i * this.lineWidth / 2, this.y - this.h / 2);
//            line(this.x + i * this.lineWidth / 2, this.y + this.lineWidth / 20, this.x + i * this.lineWidth / 2, this.y + this.h / 2);
//        } 
//        pop();

        noStroke();
        fill(25);
        beginShape()
        vertex(this.smoothedX, this.sliderY + this.r);
        quadraticVertex(this.smoothedX, this.sliderY, this.smoothedX + this.r, this.sliderY);
        vertex(this.smoothedX + this.w - this.r, this.sliderY);
        quadraticVertex(this.smoothedX + this.w, this.sliderY, this.smoothedX + this.w, this.sliderY + this.r);
        vertex(this.smoothedX + this.w, this.sliderY + this.h - this.r);
        quadraticVertex(this.smoothedX + this.w, this.sliderY + this.h, this.smoothedX + this.w - this.r, this.sliderY + this.h);
        vertex(this.smoothedX + this.r, this.sliderY + this.h);
        quadraticVertex(this.smoothedX, this.sliderY + this.h, this.smoothedX, this.sliderY + this.h - this.r);
        endShape(CLOSE);

        push();
        strokeCap(SQUARE);
        //strokeWeight(this.h / 20);
        stroke(255);
//        line(this.sliderX, this.y, this.sliderX + this.w, this.y);
        line(this.smoothedX + this.w / 2, this.y - this.h / 2, this.smoothedX + this.w / 2, this.y + this.h / 2);
        pop();
    }
    
    this.pressed = function() {
        if (mouseIsPressed) {
            if (mouseX <= this.x + this.lineWidth + this.lineWidth / 10) {
                if (mouseY >= this.sliderY && mouseY <= this.sliderY + this.h) {
                    this.sX = mouseX - this.w / 2;
                    this.sliderX = constrain(this.sX, this.x - this.w / 2, this.x + this.lineWidth - this.w / 2);
                    this.smoothed = this.onePole.process(this.sliderX); // need to constrain the onePole to stop it jumping backwards
                    this.smoothedX = constrain(this.smoothed, this.x - this.w / 2, this.x + this.lineWidth - this.w / 2); 
                }   
            }
        }
        
//        this.sliderX = constrain(this.sX, this.x - this.w / 2, this.x + this.lineWidth - this.w / 2);
//        
//        this.smoothedX = sliderPole.process(this.sliderX);
    }
    
    this.mapping = function() {
        this.value = map(this.smoothedX + this.w / 2, this.x, this.x + this.lineWidth, 0, 1);    
    }
}