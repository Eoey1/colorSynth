function Keyboard(x, y) {  
    //colours in HSL
    this.hsl = [[0, 100, 50], [274, 100, 50], [60, 100, 50], [323, 45, 50], [193, 100, 88], [342, 100, 34], [234, 97, 75], [30, 100, 50], [271, 96, 72], [120, 60, 50], [341, 28, 53], [209, 100, 78], [0, 100, 50]];
    
    this.h = [];
    this.s = [];
    this.l = [];
    
    for (var i = 0; i < this.hsl.length; i++) {
        this.h.push(this.hsl[i][0]);
        this.s.push(this.hsl[i][1]);
        this.l.push(this.hsl[i][2]);
    }
    
    this.colours = new Array(3);
    
    this.colours[0] = this.h.slice();
    this.colours[1] = this.s.slice();
    this.colours[2] = this.l.slice();
    
    for (var j = 0; j < 3; j++) {
        this.colours[j].splice(1, 1);
        this.colours[j].splice(2, 1);
        this.colours[j].splice(4, 1);
        this.colours[j].splice(5, 1);
        this.colours[j].splice(6, 1);
    }
    
    this.accidentals = new Array(3);
    
    this.accidentals[0] = this.h.slice();
    this.accidentals[1] = this.s.slice();
    this.accidentals[2] = this.l.slice();
    
    for (var i = 0; i < 3; i++) {
        this.accidentals[i].splice(0, 1);
        this.accidentals[i].splice(1, 1);
        this.accidentals[i].splice(2, 1);
        this.accidentals[i].splice(2, 1);
        this.accidentals[i].splice(3, 1);
        this.accidentals[i].splice(4, 1);
        this.accidentals[i].splice(6, 1);
    }

    this.goldenRatio = 1.61803398875;
    
    this.xPos = x;
    this.yPos = y;
    this.width = width - (width / this.goldenRatio);
    this.height = this.width / 2;
    
    this.presetButtons = [];

    this.diam = this.width / 18;
    this.buttonX = this.xPos + this.width / 12;
    this.buttonY = this.yPos + this.height / 9;
    this.spacing = this.width / 6;
    
    this.sh = [];
    
    this.isTriggered = [];
    
    // this wasn't working before since I was initialising the keyboard before the number of one poles was specified
    for (var i = 0; i < onePoles.envelopes.length; i++) {
        this.isTriggered.push(false);            
    }
    
    for (var i = 0; i < 4; i++) {
        this.sh.push(new Sh(this.xPos + this.width * 0.777 + i * this.width * 0.060185, 
                            this.yPos + this.height * 0.7962963,
                            this.height * 0.537));
    }
    
    for (var i = 0; i < 4; i++) {
        this.presetButtons.push(new Button(this.buttonX + i * this.spacing, this.buttonY, this.diam));
    }
    
    this.presetButtons[0].onPressed = button0CB;
    this.presetButtons[1].onPressed = button1CB;
    this.presetButtons[2].onPressed = button2CB;
    this.presetButtons[3].onPressed = button3CB;
    
    this.display = function() {
        push();
        this.chassis();
        pop();
        
        push();
        for (b in this.presetButtons) {
            this.presetButtons[b].draw();
        }
        pop();
        
        push();
        for (var i = 0; i < this.sh.length; i++) {
            this.sh[i].draw();
        }
        pop();
    
        this.whiteKeys();
        this.colourKeys();
        this.blackKeys();
        this.colourAccidentals();

        push();
        translate(this.xPos, this.yPos);
        
        push();
        strokeCap(PROJECT);
        this.waveformGraphicsButtons();
        pop();
        
        this.waveformGraphicsFaders();
        
        pop();
    }
    
    //amplitude mapping for the faders
    this.amplitude = function() {
        for (var i = 0; i < this.sh.length; i++) {
            this.sh[i].mapping();
        }
        
        //this output sums to 0.735
        sine.amps = this.sh[0].faderValue * 0.25;
        square.amps = this.sh[1].faderValue * 0.035;
        saw.amps = this.sh[2].faderValue * 0.05;
        triangle.amps = this.sh[3].faderValue * 0.4;

        // Set the faders to default to this?
    }

    this.resize = function() {
        this.width = width - (width / this.goldenRatio);
        this.height = this.width / 2;

        for (var i = 0; i < this.sh.length; i++) {
            this.sh[i].resize(this.xPos + this.width * 0.777 + i * this.width * 0.060185,
                              this.yPos + this.height * 0.7962963,
                              this.height * 0.537);
        }

        this.diam = this.width / 18;
        this.buttonX = this.xPos + this.width / 12;
        this.buttonY = this.yPos + this.height / 9;
        this.spacing = this.width / 6;

        for (var i = 0; i < 4; i++) {
            this.presetButtons[i].resize(this.buttonX + i * this.spacing, this.buttonY, this.diam);
        }
    }
    
    this.chassis = function() {
        strokeWeight(3);
        stroke(75);
        fill(0);
        rect(this.xPos, this.yPos, this.width, this.height);

        //keybed dimensions: width = 363, height = 183
        rect(this.xPos + this.width * 0.0518, this.yPos + this.height * 0.2037, this.width * 0.67222, this.height * 0.677); 
        
//        this.x = this.xPos + this.width - this.width / 6 - 17;
//        this.y = this.yPos + 12;
//        this.w = this.width / 7;
//        this.h = this.height / 8;
        this.x = this.xPos + this.width - this.width / 5 - 17;
        this.y = this.yPos + 15;
        this.w = this.width / 5;
        this.h = this.height / 9;
        
        
        this.r = 4;
        
        //this is the code for the border that encases the plus / minus buttons
        
//        noStroke();
//        fill(80, 200);
//        beginShape()
//        vertex(this.x, this.y + this.r);
//        quadraticVertex(this.x, this.y, this.x + this.r, this.y);
//        vertex(this.x + this.w - this.r, this.y);
//        quadraticVertex(this.x + this.w, this.y, this.x + this.w, this.y + this.r);
//        vertex(this.x + this.w, this.y + this.h - this.r);
//        quadraticVertex(this.x + this.w, this.y + this.h, this.x + this.w - this.r, this.y + this.h);
//        vertex(this.x + this.r, this.y + this.h);
//        quadraticVertex(this.x, this.y + this.h, this.x, this.y + this.h - this.r);
//        endShape(CLOSE);
        
        noStroke();
        fill(245);
        textSize(this.width / 18);
        textFont('Orbitron');
        text("-      +", this.xPos + this.width - this.width / 5, this.yPos + this.height / 7);
        //text("-  +", this.xPos + this.width - this.width / 6 - 5, this.yPos + this.height / 7);
        //text("-  +", this.xPos + this.width - this.width / 9, this.yPos + this.height / 7);
    }
    
    this.whiteKeys = function() {   
        //strokeWeight(1);
        strokeWeight(1.25);
        //strokeWeight(2);
        //strokeCap(ROUND);
        strokeCap(PROJECT);
        fill(240);
        stroke(0);
        
        this.x = this.xPos + this.width / 18;
        this.y = this.yPos + this.height / 4.7368;

        this.w = this.width / 12;
        this.h = this.height * 2 / 3;
        
        this.spacing = this.w;
        this.r = 2;
        
        for (var i = 0; i < 8; i++) {            
            beginShape();
            vertex(this.x + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
            quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
            vertex(this.x + this.r + i * this.spacing, this.y + this.h);
            quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
            endShape(CLOSE);
        } 
    }
    
    this.blackKeys = function() {
        fill(0);
        stroke(30);
        
        this.x = this.xPos + this.width / 9;
        this.y = this.yPos + this.height / 4.7368;
        this.w = (this.width / 12 * this.goldenRatio) - this.width / 12;
        this.h = (this.height * 2 / 3 * this.goldenRatio) - this.height * 2 / 3;
        
        this.spacing = this.width * 0.0916;
        this.r = 1;

        for (var i = 0; i < 2; i++) {
            beginShape();
            vertex(this.x + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
            quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
            vertex(this.x + this.r + i * this.spacing, this.y + this.h);
            quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
            endShape(CLOSE);
        }
        
        this.x = this.xPos + this.width * 0.36111;
        
        for (var i = 0; i < 3; i++) {
            beginShape();
            vertex(this.x + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y);
            vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
            quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
            vertex(this.x + this.r + i * this.spacing, this.y + this.h);
            quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
            endShape(CLOSE);
        }
    }
    
    this.colourKeys = function() {
        push();
            colorMode(HSL, 360, 100, 100, 255);

            this.offset = 0.25;

            this.x = this.xPos + this.width / 18 + this.offset;
            this.y = this.yPos + this.height / 4.7368 + this.offset;
            this.w = this.width / 12 - this.offset * 2;
            this.h = this.height * 2 / 3 - this.offset * 2;

            this.spacing = this.width / 12;
            this.r = 2;
        
            this.alphavalues = onePoles.alphavalues.slice();

            this.alphavalues.splice(1, 1);
            this.alphavalues.splice(2, 1);
            this.alphavalues.splice(4, 1);
            this.alphavalues.splice(5, 1);
            this.alphavalues.splice(6, 1);
        
        push();
        
            for (var i = 0; i < 8; i++) {
                //maps the position of the high pass filter from 0 to the maximum lightness value of each color
                this.level = map(dial.a, 225, -45, 0, (100 - this.colours[2][i]));
                
                //this is then added to each color so that the highest value of the dial will produce 100 on the lightness scale
                fill(this.colours[0][i], this.colours[1][i], this.colours[2][i] + this.level, this.alphavalues[i]);
                noStroke();
                
                beginShape();
                vertex(this.x + i * this.spacing, this.y);
                vertex(this.x + this.w + i * this.spacing, this.y);
                vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
                quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
                vertex(this.x + this.r + i * this.spacing, this.y + this.h);
                quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
                endShape(CLOSE);
            }

            pop();
        pop();
    }

    this.colourAccidentals = function() {
        push();
            colorMode(HSL, 360, 100, 100, 255);

            this.offset = 0.5;

            this.x = this.xPos + this.width / 9 + this.offset;
            this.y = this.yPos + this.height / 4.7368 + this.offset;
            this.w = (this.width / 12 * this.goldenRatio) - this.width / 12 - this.offset * 2;
            this.h = (this.height * 2 / 3 * this.goldenRatio) - this.height * 2 / 3 - this.offset * 2;

            this.spacing = this.width * 0.0916;

            this.r = 1;

            this.alphavalues = onePoles.alphavalues.slice();

            this.alphavalues.splice(0, 1);
            this.alphavalues.splice(1, 1);
            this.alphavalues.splice(2, 1);
            this.alphavalues.splice(2, 1);
            this.alphavalues.splice(3, 1);
            this.alphavalues.splice(4, 1);
            this.alphavalues.splice(6, 1);
        
            push();
                for (var i = 0; i < 2; i++) {
                    this.level = map(dial.a, 225, -45, 0, this.accidentals[2][i]);

                    fill(this.accidentals[0][i], this.accidentals[1][i], this.accidentals[2][i] - this.level, this.alphavalues[i]);
                    noStroke();

                    beginShape();
                    vertex(this.x + i * this.spacing, this.y);
                    vertex(this.x + this.w + i * this.spacing, this.y);
                    vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
                    quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
                    vertex(this.x + this.r + i * this.spacing, this.y + this.h);
                    quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
                    endShape(CLOSE);
                }


                this.x = this.xPos + this.width * 0.36111 + this.offset;

                for (var i = 0; i < 3; i++) {
                    this.level = map(dial.a, 225, -45, 0, this.accidentals[2][i + 2]);
                    fill(this.accidentals[0][i + 2], this.accidentals[1][i + 2], this.accidentals[2][i + 2] - this.level, this.alphavalues[i + 2]);

                    beginShape();
                    vertex(this.x + i * this.spacing, this.y);
                    vertex(this.x + this.w + i * this.spacing, this.y);
                    vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
                    quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
                    vertex(this.x + this.r + i * this.spacing, this.y + this.h);
                    quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
                    endShape(CLOSE);
                }
            pop();
        pop();
    }
    
    this.pressedFirst = function() {
        // Call keyPressed for the black keys first
        this.values = [1, 3, 6, 8, 10];

        this.x = this.xPos + this.width / 9;
        this.y = this.yPos + this.height / 4.7368;
        this.w = (this.width / 12 * this.goldenRatio) - this.width / 12;
        this.h = (this.height * 2 / 3 * this.goldenRatio) - this.height * 2 / 3;
        
        this.spacing = this.width * 0.0916;
        this.r = 1;
        
        for (var i = 0; i < 2; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        onePoles.envelopes[this.values[i]].trigger();
                        this.isTriggered[this.values[i]] = true;
                        
                        for (var j = 0; j < sequencer.cycleLength; j++) { // this loop lets you adjust the sequencer values from the keyboard
                            if (sequencer.isSelected[j] == true) {
                                sequencer.values[j] = this.values[i] + 1; 
                            }
                        }  
                    }
                } else {
                    if (this.isTriggered[this.values[i]] == true) {
                        onePoles.envelopes[this.values[i]].release();
                        this.isTriggered[this.values[i]] = false;
                    }
                }
            } else if (!mouseIsPressed) {
                if (this.isTriggered[this.values[i]] == true) {
                    onePoles.envelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }
            }
        }
        
        this.x = this.xPos + this.width * 0.36111;
        
        for (var i = 0; i < 3; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        onePoles.envelopes[this.values[i + 2]].trigger();
                        this.isTriggered[this.values[i + 2]] = true;
                        
                        for (var j = 0; j < sequencer.cycleLength; j++) { // this loop lets you adjust the sequencer values from the keyboard
                            if (sequencer.isSelected[j] == true) {
                                sequencer.values[j] = this.values[i + 2] + 1; 
                            }
                        }  
                    }
                } else {
                    if (this.isTriggered[this.values[i + 2]] == true) {
                        onePoles.envelopes[this.values[i + 2]].release();
                        this.isTriggered[this.values[i + 2]] = false;
                    }
                }
            }  else if (!mouseIsPressed) {
                if (this.isTriggered[this.values[i + 2]] == true) {
                    onePoles.envelopes[this.values[i + 2]].release();
                    this.isTriggered[this.values[i + 2]] = false;
                }
            }
        }
    }
    
    this.releasedFirst = function() {
        this.values = [1, 3, 6, 8, 10];
        
        this.x = this.xPos + this.width / 9;
        this.y = this.yPos + this.height / 4.7368;
        this.w = (this.width / 12 * this.goldenRatio) - this.width / 12;
        this.h = (this.height * 2 / 3 * this.goldenRatio) - this.height * 2 / 3;

        this.spacing = this.width * 0.0916;
        this.r = 1;

        for (var i = 0; i < 2; i++) {  
            if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                if (mouseY >= this.y && mouseY < this.y + this.h) {
                    onePoles.envelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }
            }
        }
        
        this.x = this.xPos + this.width * 0.36111;
        
        for (var i = 0; i < 3; i++) {  
            if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                if (mouseY >= this.y && mouseY < this.y + this.h) {
                    onePoles.envelopes[this.values[i + 2]].release();
                    this.isTriggered[this.values[i + 2]] = false;
                }
            }
        }
    }
    
    this.pressed = function() {
        this.values = [0, 2, 4, 5, 7, 9, 11, 12];

        this.x = this.xPos + this.width / 18;
        this.y = this.yPos + this.height / 4.7368;

        this.w = this.width / 12;
        this.h = this.height * 2 / 3;
        
        this.spacing = this.w;

        //Need to use some logic so they release only if they have been triggered first
        for (var i = 0; i < 8; i++) {  
            if (mouseIsPressed && !this.isTriggered[1] && !this.isTriggered[3] && !this.isTriggered[6] && !this.isTriggered[8] && !this.isTriggered[10]) {
                //this works because the spacing and width are equal
                if (mouseX >= this.x + (i * this.w) && mouseX < this.x + ((i + 1) * this.w)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        onePoles.envelopes[this.values[i]].trigger();
                        
                        //change sequencer value if note is pressed
                        for (var j = 0; j < sequencer.cycleLength; j++) { // this loop lets you adjust the sequencer values from the keyboard
                            if (sequencer.isSelected[j] == true) {
                                sequencer.values[j] = this.values[i] + 1; 
                            }
                        }    
                        
                        this.isTriggered[this.values[i]] = true;
                    } 
                } else {
                    if (this.isTriggered[this.values[i]] == true) {
                        onePoles.envelopes[this.values[i]].release();
                        this.isTriggered[this.values[i]] = false;
                    }
                }   
            } else if (this.isTriggered[1] | this.isTriggered[3] | this.isTriggered[6] | this.isTriggered[8] | this.isTriggered[10]) {
                if (this.isTriggered[this.values[i]] == true) {
                    onePoles.envelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }    
            }
        }
    }
    
    //we need two different calls to the pole envelopes being released since one takes care of the sliding through the notes
    this.released = function() {
        this.values = [0, 2, 4, 5, 7, 9, 11, 12];

        this.x = this.xPos + this.width / 18;
        this.y = this.yPos + this.height / 4.7368;

        this.w = this.width / 12;
        this.h = this.height * 2 / 3;
        
        this.spacing = this.w;

        for (var i = 0; i < 8; i++) {  
            if (mouseX >= this.x + (i * this.w) && mouseX < this.x + ((i + 1) * this.w)) {
                onePoles.envelopes[this.values[i]].release();
            }   
        }
    }
    
    this.midiPressedFirst = function() {
        this.values = [1, 3, 6, 8, 10];

        this.x = this.xPos + this.width / 9;
        this.y = this.yPos + this.height / 4.7368;
        this.w = (this.width / 12 * this.goldenRatio) - this.width / 12;
        this.h = (this.height * 2 / 3 * this.goldenRatio) - this.height * 2 / 3;
        
        this.spacing = this.width * 0.0916;
        this.r = 1;
        
        for (var i = 0; i < 2; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        trigs[this.values[i]] = 1;
                        this.isTriggered[this.values[i]] = true;
                    }
                } else {
                    //trigs[this.values[i]] = 0;
                }
            }
        }
        
        this.x = this.xPos + this.width * 0.36111;
        
        for (var i = 0; i < 3; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        trigs[this.values[i + 2]] = 1;
                    }
                } else {
                    //trigs[this.values[i + 2]] = 0;
                }
            }
        }
    }
    
    //this triggers the envelopes for midi notes, trigs = 0 has to be commented out!  Otherwise you can't trigger them by other means!!
    this.midiPressed = function() {
        this.values = [0, 2, 4, 5, 7, 9, 11, 12];

        this.x = this.xPos + this.width / 18;
        this.y = this.yPos + this.height / 4.7368;

        this.w = this.width / 12;
        this.h = this.height * 2 / 3;
        
        this.spacing = this.w;

        for (var i = 0; i < 8; i++) {  
            if (mouseIsPressed && !this.isTriggered[1] && !this.isTriggered[3] && !this.isTriggered[6] && !this.isTriggered[8] && !this.isTriggered[10]) {
                if (mouseX >= this.x + (i * this.w) && mouseX < this.x + ((i + 1) * this.w)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        trigs[this.values[i]] = 1;
                    }
                }
            } else {
                //trigs[this.values[i]] = 0;
            }   
        }
    }
    
    this.waveformGraphicsButtons = function()
    {
        var thickness = 0.00555 * this.width;

        this.sine(this.width * 7 / 54, this.width / 24, thickness, this.width / 67.5);
        this.square(this.width * 8 / 27, this.width / 24, thickness, this.width / 30);
        this.saw(this.width * 25 / 54, this.width / 24, thickness, this.width / 30);
        this.triangle(this.width * 17 / 27, this.width / 24, thickness, this.width / 30);
    }

    this.waveformGraphicsFaders = function()
    {
        var thickness = this.width * 0.0037;

        this.sine(this.width * 41 / 54, 49 / 108 * this.width, thickness, this.width * 0.00648);
        this.square(this.width * 111 / 135, this.width * 49 / 108 , thickness, this.width * 0.0148);
        this.saw(this.width * 119 / 135, this.width * 49 / 108 , thickness, this.width * 0.0148);
        this.triangle(this.width * 127 / 135, this.width * 49 / 108 , thickness, this.width * 0.0148);
    }

    this.sine = function(x, y, thickness, size)
    {   
        push();
        
        this.a = 0.0;
        this.inc = TWO_PI / 25.0;

        stroke(255);
        strokeWeight(thickness);
    
        beginShape();
        noFill();
        for (var i = 0; i < 25; i++) 
        {
            vertex(x + i * size / 5, y + size + sin(this.a) * size * 1.5);
            this.a = this.a + this.inc;
        }
        endShape();

        pop();
    }
    
    this.square = function(x, y, thickness, size)
    {
        push();

        stroke(255);
        strokeWeight(thickness);

        line(x, y, x, y + size);
        line(x, y, x + size, y);
        line(x + size, y, x + size, y + size);
        line(x + size, y + size, x + size * 2, y + size);
        line(x + size * 2, y + size, x + size * 2, y);

        pop();
    }
    
    this.saw = function(x, y, thickness, size)
    {
        push();

        stroke(255);
        strokeWeight(thickness);
        
        line(x, y + size, x + size * 2, y);
        line(x + size * 2, y, x + size * 2, y + size);

        pop();
    }

    this.triangle = function(x, y, thickness, size)
    {
        push();

        stroke(255);
        strokeWeight(thickness);
      
        line(x, y + size, x + size, y);
        line(x + size, y, x + size * 2, y + size);

        pop();
    }
}