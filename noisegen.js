function Generator(x, y) {
    /* refer to previous versions for a list of alternative dimensions */
    
    //positon
    this.xPos = x;
    this.yPos = y;
    
    //dimensions
    this.width = width * 5 / 12;
    this.height = this.width / 2;
    
    //border radius level
    this.r = 5;
    
    //slider dimensions
    this.sliderX = this.xPos + this.width / 10;
    this.sliderY = this.yPos + this.height * 19 / 48;
    this.sliderLength = this.width * 7 / 24;
    this.sliderHeight = this.height * 2 / 13;
    
    //instantiate slider
    this.slider = new Slider(this.sliderX, this.sliderY, this.sliderLength, this.sliderHeight); 
    
    //dial dimensions
    
    //instantiate dial
    this.dial = new CircleDial(this.xPos + this.width * 79 / 320, this.yPos + this.height - this.height / 4, this.height / 7);
    
    //noise variables
    this.amp = 0;
    this.b0 = this.b1 = this.b2 = this.b3 = this.b4 = this.b5 = this.b6 = 0.0;
    this.brownSig = 0;
    this.delta = 0.1;
    
    this.sigBufs = new Array(512);

    //text for CSS styling
    this.div = createDiv('Noise Gen');
    
    this.display = function() {        
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
        
        //border radius level
        this.r = 4; 
        
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
        //reset border radius level
        this.r = 5; 
        
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

        //this.title();
        this.titleCSS();
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
            //slight offset by a half
            vertex(this.screenX + 1 / 2 + i * this.screenWidth / 512, this.screenY + this.screenHeight / 2 + this.sigBufs[i] * this.waveHeight);
        }
        endShape();
    }
    
    this.amplitude = function() {
        this.slider.mapping();
        this.amp = this.slider.value;
    }
    
    this.resize = function() {
        var margin = height / 20;
        
        //shift position
        this.xPos = margin;
        this.yPos = height / 2 + margin;

        //resize dimensions
        this.width = width * 5 / 12;
        this.height = this.width / 2;

        //resize slider
        this.slider.h = this.height * 2 / 13; 
        this.slider.w = this.slider.h / 2; 
        this.slider.x = this.xPos + this.width / 10;
        this.slider.y = this.yPos + this.height * 19 / 48;
        this.slider.lineWidth = this.width * 7 / 24;
        this.slider.sliderX = this.slider.x - this.slider.w / 2;
        this.slider.sliderY = this.slider.y - this.slider.h / 2;
        this.slider.sX = this.slider.x - this.slider.w / 2;
        this.slider.smoothedX = this.slider.x - this.slider.w / 2; 

        //resize dial
        this.dial.centreX = this.xPos + this.width * 79 / 320;
        this.dial.centreY = this.yPos + this.height - this.height / 4;
        this.dial.radius = this.height / 7;
    }
    
    this.title = function() {
        textSize(this.width * 0.075);
        textFont(noiseGenFont);
        textFont("Condiment");
        
        noStroke();
        fill(245);
        
        /* This was the measurement used before the div */
        text("Noise Gen", this.xPos + this.width / 10, this.yPos + this.height / 5);    
    }
    
    this.titleCSS = function() {
        var sizeOfText = this.width * 0.075;
        
        this.div.id('noisegen');
        this.div.style("font-size: " + str(sizeOfText));
        this.div.style("font-family: 'Condiment'");
        this.div.style('letter-spacing: 1.0px');
        
        //inset shadow effect
        this.div.style('color: #505050');
        this.div.style('background-color: #5f5f5f');
        this.div.style('text-shadow: -1px -1px 1px #111, 2px 2px 1px #696969');
        
        //dark inset shadow effect 
        //this.div.style('color: #202020');
        //this.div.style('background-color: #2d2d2d');
        //this.div.style('text-shadow: -1px -1px 1px #111, 2px 2px 1px #363636');
        
        //off white
        //this.div.style('color: #ebebeb');
        
        this.div.position(this.xPos + this.width / 10, this.yPos + this.height / 15);
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