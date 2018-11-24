function Generator(x, y) {
    //dimensions
    this.xPos = x;
    this.yPos = y;
    
    // halfway between width / 3 and width /4 => width * 7 / 24
    
    //this.width = width * 7 / 24;
    //this.width = width * 1 / 3;
    this.width = width * 5 / 12;
    //this.width = width / 2;
    
    // height is roughly half the width
    //this.height = 360;
    this.height = this.width / 2;
    
    this.r = 5; // border radius level
    
//    this.sliderX = this.xPos + this.width / 8;
//    this.sliderX = this.xPos + this.width / 9;
    
    //this.sliderY = this.yPos + this.height * 19 / 48;
    
    //this.sliderLength = this.width / 4;
    
//    this.sliderHeight = this.height / 6;
//    this.sliderHeight = this.height / 8;
//    this.sliderHeight = this.height * 7 / 52;
    
    this.sliderX = this.xPos + this.width / 10;
    this.sliderY = this.yPos + this.height * 19 / 48;
    this.sliderLength = this.width * 7 / 24;
    this.sliderHeight = this.height * 2 / 13;    
    this.slider = new Slider(this.sliderX, this.sliderY, this.sliderLength, this.sliderHeight); 
    
    // noise variables
    this.amp = 0;
    this.b0 = this.b1 = this.b2 = this.b3 = this.b4 = this.b5 = this.b6 = 0.0;
    this.brownSig = 0;
    this.delta = 0.1;
    
    this.sigBufs = new Array(512);
    
    //this.dial = new CircleDial(this.width / 3, this.height - this.height / 6, 50);
    //this.dial = new CircleDial(this.xPos + this.width / 5, this.yPos + this.height - this.height / 4, this.height / 7);
    
    
    this.dial = new CircleDial(this.xPos + this.width * 79 / 320, this.yPos + this.height - this.height / 4, this.height / 7);
    
    
    //this.dial = new CircleDial(this.xPos + this.width / 4, this.yPos + this.height - this.height * 9 / 40, this.height / 7);
    //this.dial = new CircleDial(this.xPos + this.width * 5 / 24, this.yPos + this.height - this.height * 9 / 40, this.height / 7);
    
    this.div = createDiv('Noise Gen');
    //this.div.size();
    
    
    this.display = function() {
        //dimensions
//        this.xPos = height / 20;
//        this.yPos = height / 2 + height / 20;
//        this.width = width * 5 / 12;
//        this.height = this.width / 2;
        
        push();
        this.chassis();
        pop();
        
        push();
        this.slider.draw();
        pop();
        
        push();
        this.dial.draw();
        pop();
        
        push();
        this.screen();
        this.waves();
        pop();
    }
    
    this.screen = function() {
        //dimensions for the screen
        this.screenWidth = this.width * 11 / 24;
        this.screenHeight = this.height * 2 / 3;
        this.screenX = this.xPos + this.width / 2;
        this.screenY = this.yPos + this.height / 4;
        this.r = 4; // border radius level
        
        noStroke();
        fill(0);
        
        beginShape()
        vertex(this.screenX, this.screenY + this.r);
        quadraticVertex(this.screenX, this.screenY, this.screenX + this.r, this.screenY);
        vertex(this.screenX + this.screenWidth - this.r, this.screenY);
        quadraticVertex(this.screenX + this.screenWidth, this.screenY, this.screenX + this.screenWidth, this.screenY + this.r);
        vertex(this.screenX + this.screenWidth, this.screenY + this.screenHeight - this.r);
        quadraticVertex(this.screenX + this.screenWidth, this.screenY + this.screenHeight, this.screenX + this.screenWidth - this.r, this.screenY + this.screenHeight);
        vertex(this.screenX + this.r, this.screenY + this.screenHeight);
        quadraticVertex(this.screenX, this.screenY + this.screenHeight, this.screenX, this.screenY + this.screenHeight - this.r);
        endShape(CLOSE);
    }
    
    this.chassis = function() {
        this.r = 5; // reset border radius level
        
        noStroke();
        fill('#5f5f5f');
        //fill('#2d2d2d');
        
        beginShape()
        vertex(this.xPos, this.yPos + this.r);
        quadraticVertex(this.xPos, this.yPos, this.xPos + this.r, this.yPos);
        vertex(this.xPos + this.width - this.r, this.yPos);
        quadraticVertex(this.xPos + this.width, this.yPos, this.xPos + this.width, this.yPos + this.r);
        vertex(this.xPos + this.width, this.yPos + this.height - this.r);
        quadraticVertex(this.xPos + this.width, this.yPos + this.height, this.xPos + this.width - this.r, this.yPos + this.height);
        vertex(this.xPos + this.r, this.yPos + this.height);
        quadraticVertex(this.xPos, this.yPos + this.height, this.xPos, this.yPos + this.height - this.r);
        endShape(CLOSE);

        noStroke();
        fill(245);
        
        textSize(this.width * 0.075);
        textFont("Condiment");
        //text("Noise Gen", this.xPos + 40, this.yPos + 55);
        //text("Noise Gen", this.xPos + this.width - 200, this.yPos + 55);
        //text("Noise Gen", this.xPos + this.width / 8, this.yPos + this.height / 6);
    
        /* This was the measurement used before the div */
        //text("Noise Gen", this.xPos + this.width / 10, this.yPos + this.height / 5);
        
        var sizeOfText = this.width * 0.075;
        
        this.div.id('noisegen');
        //this.div.class('font-effect-emboss');
        this.div.style("font-size: " + str(sizeOfText));
        this.div.style("font-family: 'Condiment'");
        //this.div.style('color: white');
        this.div.style('letter-spacing: 0.0px');
        
        //inset shadow effect
        //this.div.style('color: #202020');
        //this.div.style('background-color: #2d2d2d');
        //this.div.style('text-shadow: -1px -1px 1px #111, 2px 2px 1px #363636');
        
        this.div.style('color: #505050');
        this.div.style('background-color: #5f5f5f');
        this.div.style('text-shadow: -1px -1px 1px #111, 2px 2px 1px #696969');
        
        //this.div.style('position: absolute');
        //this.div.style(font-family: 'Comfortaa');
        
        //this.div.size(this.width * 0.075, 50);
        this.div.position(this.xPos + this.width / 10, this.yPos + this.height / 15);
        //this.div.hide();
    }
    
    this.waves = function() {
        this.waveHeight = this.height;
        
        strokeCap(SQUARE);
        strokeWeight(this.height / 100);
        stroke(255);
        
        if (this.dial.white) {
            stroke(255);
        } else if (this.dial.pink > 0) {
            stroke(255, 153, 255, 255);
        } else if (this.dial.brown > 0) {
            stroke(63, 37, 11);
        } 
        
        noFill();   
        beginShape();
        for(var i = 0; i < 512; i++) {
            vertex(this.screenX + 1 / 2 + i * this.screenWidth / 512, this.screenY + this.screenHeight / 2 + this.sigBufs[i] * this.waveHeight);
            // slight offset by a half
        }
        endShape();
    }
    
    this.amplitude = function() {
        this.slider.mapping();
        this.amp = this.slider.value;
    }
    
    /////////////// NOISE FUNCTIONS ////////////////////
    
    this.white = function() {
        return random(-this.amp, this.amp);
    }

    this.brown = function() {
        this.brownSig += random(-this.delta, this.delta);
        this.brownSig = min(this.amp, this.brownSig);
        this.brownSig = max(-this.amp, this.brownSig);

        return this.brownSig;
    }

    this.pink = function() {
        var white = random(-this.amp, this.amp);
        this.b0 = 0.99886 * this.b0 + white * 0.0555179;
        this.b1 = 0.99332 * this.b1 + white * 0.0750759;
        this.b2 = 0.96900 * this.b2 + white * 0.1538520;
        this.b3 = 0.86650 * this.b3 + white * 0.3104856;
        this.b4 = 0.55000 * this.b4 + white * 0.5329522;
        this.b5 = -0.7616 * this.b5 - white * 0.0168980;
        this.b6 = white * 0.115926;
        output = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362;
        output *= 0.11;

        return output;
    }
}