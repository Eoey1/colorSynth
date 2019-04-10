function Oscilloscope(x, y) {    
    //dimensions 
    this.x = x;
    this.y = y;
    this.screenWidth = width / 4;
    this.screenHeight = width / 5;
    
    //this.screenWidth = width / 5;
    //this.screenHeight = width / 6;
    
    //this.screenWidth = width * 9 / 40;
    //this.screenHeight = width * 7 / 40;
    
    this.waveHeight = this.screenHeight * 2;
    this.sigBufs = new Array(512);
    
    this.display = function() {
        this.screen();
        this.waveform();
        //this.chassis();
    }
    
    this.chassis = function() {
        push();
            rectMode(CENTER);
            this.outline = createVector(this.x + this.screenWidth / 2, this.y + this.screenHeight / 2);

            //fill(25);
            //rect(this.outline.x, this.outline.y, this.screenWidth * 1.2, this.screenHeight * 1.5);
            fill(125);
            noStroke();
            rect(this.outline.x, this.outline.y, this.screenWidth * 1.025, this.screenHeight * 1.025);
        pop();
        
        noStroke();
        //fill(225);
        fill(50);
        rect(this.x - this.screenWidth / 10, this.y - this.screenWidth / 10, this.screenWidth + this.screenWidth / 5 , this.screenHeight + this.screenHeight * 5 / 12);    
    }
    
    this.screen = function() {
        //draws a border which is easier to control than using stroke
        push();
            rectMode(CENTER);
            this.outline = createVector(this.x + this.screenWidth / 2, this.y + this.screenHeight / 2);
            //fill(25);
            //rect(this.outline.x, this.outline.y, this.screenWidth * 1.2, this.screenHeight * 1.5);
            fill(115);
            noStroke();
            rect(this.outline.x, this.outline.y, this.screenWidth * 1.025, this.screenHeight * 1.025);
        pop();
        
        noStroke();
        fill(0, 153, 153);
        rect(this.x, this.y, this.screenWidth, this.screenHeight);
        
        //grid
        strokeWeight(0.3);
        stroke(0, 51, 102);
        
        for (var i = 0; i < 9; i++) {
            line(this.x + this.screenWidth / 10 + i * this.screenWidth / 10, this.y, this.x + this.screenWidth / 10 + i * this.screenWidth / 10, this.y + this.screenHeight);
        }
        
        for (var j = 0; j < 7; j++) {
            line(this.x, this.y + this.screenHeight / 8 + j * this.screenHeight / 8, this.x + this.screenWidth, this.y + this.screenHeight / 8 + j * this.screenHeight / 8);
        } 
        
        //ruler lines
        strokeWeight(0.5);
        for (var i = 0; i < 49; i++) {
            line(this.x + this.screenWidth / 50 + i * this.screenWidth / 50, this.y + this.screenHeight / 2 - this.screenHeight / 80, this.x + this.screenWidth / 50 + i * this.screenWidth / 50, this.y + this.screenHeight / 2 + this.screenHeight / 80);
        }
        for (var j = 0; j < 39; j++) {
            line(this.x + this.screenWidth / 2 - this.screenWidth / 100, this.y + this.screenHeight / 40 + j * this.screenHeight / 40, this.x + this.screenWidth / 2 + this.screenWidth / 100, this.y + this.screenHeight / 40 + j * this.screenHeight / 40);
        }
    }
    
    this.waveform = function() {
        strokeWeight(this.screenHeight * 0.0075);
        strokeCap(SQUARE);
        stroke(179, 255, 179);
        //noFill();
        beginShape();
        for(var i = 0; i < 512; i++) {
            vertex(this.x + i * this.screenWidth / 512, this.y + this.screenHeight / 2 + this.sigBufs[i] * this.waveHeight);
        }
        endShape();  
    }
    
    this.resize = function() {
        this.x = width - width / 3;
        this.y = height / 10;
        this.screenWidth = width / 4;
        this.screenHeight = width / 5;
        this.waveHeight = this.screenHeight / 2;
    }
}