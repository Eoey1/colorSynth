function Keyboard(x, y) {  
    // colours in HSL
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

    this.xPos = x;
    this.yPos = y;
    this.width = 540;
    this.height = 270;
    
    this.presetButtons = [];

    this.diam = 30;
    this.buttonX = this.xPos + 45;
    this.buttonY = this.yPos + 30;
    this.spacing = 90;
    
    this.sh = [];
    
    this.isTriggered = [];
    
    // this wasn't working before since I was initialising the keyboard before the number of one poles was specified
    for (var i = 0; i < colours.poleEnvelopes.length; i++) {
        this.isTriggered.push(false);            
    }
    
    for (var i = 0; i < 4; i++) {
        this.sh.push(new Sh(this.xPos + 420 + i * 32.5, this.yPos + 215, 145));
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
            this.sh[i].pressed();
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
        this.waveformGraphics();
        pop();
        
        translate(375, 240);
        scale(0.6);
        this.waveformGraphics2();
        pop();
        
        pop();
    }
    
    //amplitude mapping for the faders, commented out for now since they are causing glitching
    this.amplitude = function() {
        for (var i = 0; i < this.sh.length; i++) {
            this.sh[i].mapping();
        }
        
        ampSines = this.sh[0].faderValue;
        ampSquares = this.sh[1].faderValue;
        ampSaws = this.sh[2].faderValue;
        ampTriangles = this.sh[3].faderValue;
    }
    
    this.chassis = function() {
        strokeWeight(3);
        stroke(75);
        fill(0);
        rect(this.xPos, this.yPos, this.width, this.height);
        rect(this.xPos + 28, this.yPos + 55, 363, 183); 
        
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
        textSize(30);
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
        
        this.x = this.xPos + 30;
        this.y = this.yPos + 57;
        this.w = 45;
        this.h = 180;
        
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
        
        this.x = this.xPos + 60;
        this.y = this.yPos + 57;
        this.w = 22.5;
        this.h = 120;
        
        this.spacing = 49.5;
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
        
        this.x = this.xPos + 195;
        
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

            this.x = this.xPos + 30 + this.offset;
            this.y = this.yPos + 57 + this.offset;
            this.w = 45 - this.offset * 2;
            this.h = 180 - this.offset * 2;

            this.spacing = 45;
            this.r = 2;

            push();

            noStroke();

            this.a = colours.alphaValues.slice();

            this.a.splice(1, 1);
            this.a.splice(2, 1);
            this.a.splice(4, 1);
            this.a.splice(5, 1);
            this.a.splice(6, 1);
        
            for (var i = 0; i < 8; i++) {
                //maps the position of the high pass filter from 0 to the maximum lightness value of each color
                this.level = map(dial.a, 225, -45, 0, (100 - this.colours[2][i]));
                
                //this is then added to each color so that the highest value of the dial will produce 100 on the lightness scale
                fill(this.colours[0][i], this.colours[1][i], this.colours[2][i] + this.level, this.a[i]);

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
        this.values = [1, 3, 6, 8, 10];

        this.x = this.xPos + 60;
        this.y = this.yPos + 57;
        this.w = 22.5;
        this.h = 120;

        this.spacing = 49.5;
        this.r = 1;
        
        for (var i = 0; i < 2; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        colours.poleEnvelopes[this.values[i]].trigger();
                        this.isTriggered[this.values[i]] = true;
                    }
                } else {
                    if (this.isTriggered[this.values[i]] == true) {
                        colours.poleEnvelopes[this.values[i]].release();
                        this.isTriggered[this.values[i]] = false;
                    }
                }
            } else if (!mouseIsPressed) {
                if (this.isTriggered[this.values[i]] == true) {
                    colours.poleEnvelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }
            }
        }
        
        this.x = this.xPos + 195 + this.offset;
        
        for (var i = 0; i < 3; i++) {  
            if (mouseIsPressed) {
                if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                    if (mouseY >= this.y && mouseY < this.y + this.h) {
                        colours.poleEnvelopes[this.values[i + 2]].trigger();
                        this.isTriggered[this.values[i + 2]] = true;
                    }
                } else {
                    if (this.isTriggered[this.values[i + 2]] == true) {
                        colours.poleEnvelopes[this.values[i + 2]].release();
                        this.isTriggered[this.values[i + 2]] = false;
                    }
                }
            }  else if (!mouseIsPressed) {
                if (this.isTriggered[this.values[i + 2]] == true) {
                    colours.poleEnvelopes[this.values[i + 2]].release();
                    this.isTriggered[this.values[i + 2]] = false;
                }
            }
        }
    }
    
    this.releasedFirst = function() {
        this.values = [1, 3, 6, 8, 10];
        
        this.x = this.xPos + 60;
        this.y = this.yPos + 57;
        this.w = 22.5;
        this.h = 120;

        this.spacing = 49.5;
        this.r = 1;

        for (var i = 0; i < 2; i++) {  
            if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                if (mouseY >= this.y && mouseY < this.y + this.h) {
                    colours.poleEnvelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }
            }
        }
        
        this.x = this.xPos + 195 + this.offset;
        
        for (var i = 0; i < 3; i++) {  
            if (mouseX >= this.x + (i * this.spacing) && mouseX < (this.x + this.w) + (i * this.spacing)) {
                if (mouseY >= this.y && mouseY < this.y + this.h) {
                    colours.poleEnvelopes[this.values[i + 2]].release();
                    this.isTriggered[this.values[i + 2]] = false;
                }
            }
        }
    }
    
    this.pressed = function() {
        this.values = [0, 2, 4, 5, 7, 9, 11, 12];

        //Need to use some logic so they release only if they have been triggered first
        for (var i = 0; i < 8; i++) {  
            if (mouseIsPressed && !this.isTriggered[1] && !this.isTriggered[3] && !this.isTriggered[6] && !this.isTriggered[8] && !this.isTriggered[10]) {
                //this works because the spacing and width are equal
                if (mouseX >= (this.xPos + 30) + (i * 45) && mouseX < (this.xPos + 30) + ((i + 1) * 45)) {
                    if (mouseY >= this.yPos + 57 && mouseY < this.yPos + 57 + 180) {
                        colours.poleEnvelopes[this.values[i]].trigger();
                        this.isTriggered[this.values[i]] = true;
                    } 
                } else {
                    if (this.isTriggered[this.values[i]] == true) {
                        colours.poleEnvelopes[this.values[i]].release();
                        this.isTriggered[this.values[i]] = false;
                    }
                }   
            } else if (this.isTriggered[1] | this.isTriggered[3] | this.isTriggered[6] | this.isTriggered[8] | this.isTriggered[10]) {
                if (this.isTriggered[this.values[i]] == true) {
                    colours.poleEnvelopes[this.values[i]].release();
                    this.isTriggered[this.values[i]] = false;
                }    
            }
        }
    }
    
    //we need two different calls to the pole envelopes being released since one takes care of the sliding through the notes
    this.released = function() {
        this.values = [0, 2, 4, 5, 7, 9, 11, 12];

        for (var i = 0; i < 8; i++) {  
            if (mouseX >= (this.xPos + 30) + (i * 45) && mouseX < (this.xPos + 30) + ((i + 1) * 45)) {
                colours.poleEnvelopes[this.values[i]].release();
            }   
        }

//        for (var i = 0; i < 8; i++) {  
//            if (mouseX >= (this.xPos + 30) + (i * 45) && mouseX < (this.xPos + 30) + ((i + 1) * 45)) {
//                if(!this.isTriggered[1] && !this.isTriggered[3] && !this.isTriggered[6] && !this.isTriggered[8] && !this.isTriggered[10]) {
//                    colours.poleEnvelopes[this.values[i]].release();
//                }   
//            }
//        }
    }
    
    this.midiPressedFirst = function() {
        this.values = [1, 3, 6, 8, 10];

        this.x = this.xPos + 60;
        this.y = this.yPos + 57;
        this.w = 22.5;
        this.h = 120;

        this.spacing = 49.5;
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
        
        this.x = this.xPos + 195 + this.offset;
        
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

        for (var i = 0; i < 8; i++) {  
            if (mouseIsPressed && !this.isTriggered[1] && !this.isTriggered[3] && !this.isTriggered[6] && !this.isTriggered[8] && !this.isTriggered[10]) {
                if (mouseX >= (this.xPos + 30) + (i * 45) && mouseX < (this.xPos + 30) + ((i + 1) * 45)) {
                    if (mouseY >= this.yPos + 57 && mouseY < this.yPos + 57 + 180) {
                        trigs[this.values[i]] = 1;
                    }
                }
            } else {
                //trigs[this.values[i]] = 0;
            }   
        }
    }
        
    this.colourAccidentals = function() {
        push();
            colorMode(HSL, 360, 100, 100, 255);

            this.offset = 0.5;

            this.x = this.xPos + 60 + this.offset;
            this.y = this.yPos + 57 + this.offset;
            this.w = 22.5 - this.offset * 2;
            this.h = 120 - this.offset * 2;

            this.spacing = 49.5;

            this.r = 1;

            push();

            noStroke();
            this.a = colours.alphaValues.slice();

            this.a.splice(0, 1);
            this.a.splice(1, 1);
            this.a.splice(2, 1);
            this.a.splice(2, 1);
            this.a.splice(3, 1);
            this.a.splice(4, 1);
            this.a.splice(6, 1);

            for (var i = 0; i < 2; i++) {
                this.level = map(dial.a, 225, -45, 0, this.accidentals[2][i]);
                fill(this.accidentals[0][i], this.accidentals[1][i], this.accidentals[2][i] - this.level, this.a[i]);

                beginShape();
                vertex(this.x + i * this.spacing, this.y);
                vertex(this.x + this.w + i * this.spacing, this.y);
                vertex(this.x + this.w + i * this.spacing, this.y + this.h - this.r);
                quadraticVertex(this.x + this.w + i * this.spacing, this.y + this.h, this.x + this.w - this.r + i * this.spacing, this.y + this.h);
                vertex(this.x + this.r + i * this.spacing, this.y + this.h);
                quadraticVertex(this.x + i * this.spacing, this.y + this.h, this.x + i * this.spacing, this.y + this.h - this.r);
                endShape(CLOSE);
            }


            this.x = this.xPos + 195 + this.offset;

            for (var i = 0; i < 3; i++) {
                this.level = map(dial.a, 225, -45, 0, this.accidentals[2][i + 2]);
                fill(this.accidentals[0][i + 2], this.accidentals[1][i + 2], this.accidentals[2][i + 2] - this.level, this.a[i + 2]);

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
    
    this.waveformGraphics = function()
    {
        push();
        scale(1.425);
//        scale(0.95);
        push();
        translate(2, 2);
        this.sine();
        pop();
        push();
        translate(5, 2);
        this.square();
        pop();
        push();
        translate(8, 2);
        this.saw();
        pop();
        push();
        translate(11, 2);
        this.triangle();
        pop();
        pop();
    }
    
    this.waveformGraphics2 = function()
    {
        push();
        translate(12, -4);
        this.sine2();
        pop();
        push();
        translate(4, -4);
        this.square2();
        pop();
        push();
        translate(-6, -4);
        this.saw2();
        pop();
        push();
        translate(-16, -4);
        this.triangle2();
        pop();
    }

    
    this.sine = function()
    {   
        push();
        scale(0.6);
        translate(80, 20);
        stroke(255);
        strokeWeight(3);
        this.a = 0.0;
        this.inc = TWO_PI / 25.0;
    
        beginShape();
        noFill();
        for (var i = 0; i < 25; i++) 
        {
            vertex(i * 2, 10 + sin(this.a) * 15.0);
            this.a = this.a + this.inc;
        }
        endShape();
        pop();
    }
    
    this.sine2 = function()
    {   
        push();
        scale(0.6);
        translate(80, 20);
        stroke(255);
        strokeWeight(5);
        this.a = 0.0;
        this.inc = TWO_PI / 25.0;
    
        beginShape();
        noFill();
        for (var i = 0; i < 25; i++) 
        {
            vertex(i * 2, 10 + sin(this.a) * 15.0);
            this.a = this.a + this.inc;
        }
        endShape();
        pop();
    }
    
    this.square = function()
    {
        push();
        stroke(255);
        strokeWeight(3);
        translate(110, 12);
        scale(0.6);
        line(0, 0, 0, 20);
        line(0, 0, 20, 0);
        line(20, 0, 20, 20);
        line(20, 20, 40, 20);
        line(40, 20, 40, 0);
        pop();
    }
    this.square2 = function()
    {
        push();
        stroke(255);
        strokeWeight(5);
        translate(110, 12);
        scale(0.6);
        line(0, 0, 0, 20);
        line(0, 0, 20, 0);
        line(20, 0, 20, 20);
        line(20, 20, 40, 20);
        line(40, 20, 40, 0);
        pop();
    }
    
    this.saw = function()
    {
        push();
        stroke(255);
        strokeWeight(3);
        scale(0.6);
        translate(285, 20);
        line(0, 20, 40, 0);
        line(40, 0, 40, 20);
        pop();
    }
    
    this.saw2 = function()
    {
        push();
        stroke(255);
        strokeWeight(5);
        scale(0.6);
        translate(285, 20);
        line(0, 20, 40, 0);
        line(40, 0, 40, 20);
        pop();
    }
    
    this.triangle = function()
    {
        push();
        stroke(255);
        strokeWeight(3);
        translate(232, 12);
        scale(0.6);
        line(0, 20, 20, 0);
        line(20, 0, 40, 20);
        pop();
    }
    
    this.triangle2 = function()
    {
        push();
        stroke(255);
        strokeWeight(5);
        translate(232, 12);
        scale(0.6);
        line(0, 20, 20, 0);
        line(20, 0, 40, 20);
        pop();
    }
}