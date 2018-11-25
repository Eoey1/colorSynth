function Sequencer(x, y) {
    // timer
    this.currentCount = 0;
    this.playhead = 0; 
    this.isTriggered = false;
    
    //metronome sound
    this.metronome = 0;
    this.isClick = false;
    this.click = new maximJs.maxiSample();
    this.isPlaying = true;
    
    audio.loadSample("sounds/808-clave.wav", this.click);
    
    this.letters = [' _', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B', 'C'];  
    
    this.xPos = x;
    this.yPos = y;
    
    //check ratios used in previous sketches if necessary
    this.width = width / 2;
    this.height = height / 3;
    this.spacing = this.width * 2 / 17;
    
    // the width is three quarters the size of the spacing
    this.displayWidth = this.spacing * 3 / 4; 
    
    // height is two thirds the size of the width
    this.displayHeight = this.displayWidth * 2 / 3;
    
    // vector to help reduce code
    this.displayPos = createVector(this.xPos + this.width / 25, this.yPos + this.height - this.height / 3);
    
    // specifies how many steps the sequencer has
    this.cycleLength = 8;
    this.values = [];
    
    // boolean logic for various states of the sequencer and user interaction with the sequencer
    this.isSelected = []
    this.isActive = [];
    this.isPressed = [];

    for (var i = 0; i <  this.cycleLength; i++) {
        this.isSelected.push(false);
        this.isActive.push(false);
        this.isPressed.push(false);
        this.values.push(0);
    }
    
    this.dflat = [1, 2, 4, 6, 7, 9, 11, 13];
    
    // variables for the lights
    this.h = [193, 135, 60, 165, 310];
    this.s = [];
    this.l = 80;
    this.isLit = [];
    
    this.set = [];
    this.reset = [];
    
    for (var i = 0; i < 5; i++) {
        this.s.push(50);
        this.isLit.push(false);
        this.set.push(false);
        this.reset.push(false);
    }
    
    this.draw = function() {
        this.chassis();
        this.display();
    }
    
     this.chassis = function() {
        strokeWeight(2);
        stroke(70);
        fill(25);
        rect(this.xPos, this.yPos, this.width, this.height);
    } 
    
    this.display = function() {
        push();
        for (var i = 0; i < this.cycleLength; i++) {
            stroke(60);
            strokeWeight(3);
            fill(0);
            
            // using a vector to help reduce code
            // this draws a display screen for each step of the sequence
            rect(this.displayPos.x + i * this.spacing, this.displayPos.y, this.displayWidth, this.displayHeight);
            
            // these are the little numbers for each step of the sequence
            fill(245);
            noStroke();
            textSize(this.displayWidth / 6);
            text(i + 1, this.displayPos.x + this.displayWidth / 2 + i * this.spacing, this.displayPos.y - this.displayHeight / 4);
            
            for(var j = 0; j < this.cycleLength; j++) {
                if (this.isSelected[j] == false && this.isActive[j] == false) {
                    if (this.isPressed[j] == true) {
                        this.isSelected[j] = true;
                        this.isActive[j] = true;
                        this.isPressed[j] = false;    
                    }
                } else if (this.isSelected[j] == false && this.isActive[j] == true) {
                    if (this.isPressed[j] == true) {
                        this.isSelected[j] = true;
                        this.isActive[j] = true;  
                        this.isPressed[j] = false;    
                    }
                } else if (this.isSelected[j] == true && this.isActive[j] == true) {
                    if (this.isPressed[j] == true) {
                        this.isSelected[j] = false;
                        this.isActive[j] = false; 
                        this.isPressed[j] = false;
                    }
                }
            }
 
            // this draws the little box around the number over each step of the sequence
            push();
            for (var j = 0; j < this.cycleLength; j++) {
                if(this.isSelected[j] == true) {
                    noFill();
                    strokeWeight(1.5);
                    stroke(255);
                    rect(this.displayPos.x + j * this.spacing, this.displayPos.y - this.displayHeight / 2, this.displayWidth, this.displayHeight / 3);
                }   
            }
            pop();
            
            // this is the code that lights up the letters
            for(var j = 0; j < this.isSelected.length; j++) {
                if(this.isSelected[i]) {
                    fill(255);   
                }
                else if(this.isActive[i] == true && this.values[i] > 0) {
                    fill(255);
                } else {
                    fill(150);
                }
            }
            
            // this draws the currently selected note to each display screen
            noStroke();
            textFont('Orbitron');
            textSize(this.displayHeight - this.displayHeight / 5);
            text(this.letters[this.values[i]], this.displayPos.x + this.displayWidth / 10 + i * this.spacing, this.displayPos.y + this.displayHeight * 4 / 5);
        }
        pop();
        
        push();
        this.lights();
        pop();
        
    }
    
    this.lights = function() {
        //this.size = this.height / 4;
        this.size = this.width / 10;
        
        for (var i = 0; i < 5; i++) {
            if (this.isLit[i] == false) {
                this.s[i] = 50;
            } else if (this.isLit[i] == true) {
                this.s[i] = 100;
            }
        }  
        
        // this values adjusts the border radius
        this.r = this.size / 15;
        
        for (var i = 0; i < 5; i++) {
            this.lightPos = createVector(this.displayPos.x, this.yPos + this.height / 4 - this.size / 2);   
            
            noStroke();
            colorMode(HSL);
            fill(this.h[i], this.s[i], this.l);
            
            beginShape()
            vertex(this.lightPos.x + i * this.size * 2.025, this.lightPos.y + this.r);
            quadraticVertex(this.lightPos.x + i * this.size * 2.025, this.lightPos.y, this.lightPos.x + i * this.size * 2.025 + this.r, this.lightPos.y);
            vertex(this.lightPos.x + i * this.size * 2.025 + this.size - this.r, this.lightPos.y);
            quadraticVertex(this.lightPos.x + i * this.size * 2.025 + this.size, this.lightPos.y, this.lightPos.x + i * this.size * 2.025 + this.size, this.lightPos.y + this.r);
            vertex(this.lightPos.x + i * this.size * 2.025 + this.size, this.lightPos.y + this.size - this.r);
            quadraticVertex(this.lightPos.x + i * this.size * 2.025 + this.size, this.lightPos.y + this.size, this.lightPos.x + i * this.size * 2.025 + this.size - this.r, this.lightPos.y + this.size);
            vertex(this.lightPos.x + i * this.size * 2.025 + this.r, this.lightPos.y + this.size);
            quadraticVertex(this.lightPos.x + i * this.size * 2.025, this.lightPos.y + this.size, this.lightPos.x + i * this.size * 2.025, this.lightPos.y + this.size - this.r);
            endShape(CLOSE);   
            
            this.lightPos = createVector(this.displayPos.x + this.size / 2, this.yPos + this.height / 4);
    
            for (var j = 1; j < this.size; j++) {
                fill(this.h[i], this.s[i], this.l + j / (100 / (100 - this.l)));
                ellipse(this.lightPos.x + i * this.size * 2.025, this.lightPos.y, this.size - j);
            }
        }  
        
    }
    
    // this code works out whether the sequencer steps have been pressed or the presets triggered
    this.pressed = function() {        
        for (var i = 0; i < this.cycleLength; i++) {
            if (mouseX >= this.displayPos.x + i * this.spacing && mouseX <= this.displayPos.x + i * this.spacing + this.displayWidth && mouseY >= this.displayPos.y && mouseY <= this.displayPos.y + this.displayHeight) {
                this.isPressed[i] = true; 
            } else {
                this.isSelected[i] = false;
            }    
        }
        
        // need to create a condtion for if the x parameters are set and a condition for if the y parameters are set to help simplify things
    
        for (var i = 0; i < 5; i++) {
            if (mouseX >= this.lightPos.x - this.size / 2 + i * this.size * 2 && mouseX <= this.lightPos.x + this.size / 2  + i * this.size * 2) {
                if (mouseY >= this.lightPos.y - this.size / 2 && mouseY <= this.lightPos.y + this.size / 2) {
                    this.isLit[i] = !this.isLit[i];
                }
            }
        }
    }
    
    this.timer = function() {
        if (this.isPlaying) {

            this.currentCount = timer.phasor(4);

            if (this.currentCount < 0.5 && !this.isTriggered) {
                //this sets up a metronome that ticks 4 times a second
                //the output goes from 0 -> 1 and then drops immediately back to 0

                this.playhead = (this.playhead + 1) % 16;
                this.isTriggered = true; //set this so that playhead doesn't increment anymore for this beat

                //metronome, trigger every beat!
                if (this.playhead % 4 == 1) {
                    this.click.trigger();
                }
                
                // these are the ready made sequences that can be triggered by the coloured buttons on the sequencer
                this.patterns();
                
                //audio envelopes
                this.cycle();
                
                //one pole filters
                this.progression();
                
            } 
            
            else if (this.currentCount > 0.5) {
                this.isTriggered = false; //reset the trigger ready for the next beat
            }
            
            if (this.isClick && this.click.isReady()) {
                this.metronome += this.click.playOnce();
            } 
                else {
                this.metronome = 0;
            }
        } else {
            this.currentCount = 0;
            this.metronome = 0;
        }
    }
    
    this.patterns = function() {
        if (this.isLit[0]) {
            this.reset[0] = false;

            if (this.set[0] == false) {
                this.values = [1, 6, 8, 9, 2, 13, 8, 0];

                midiKeyboard.presetButtons[0].isActive = true;
                //midiKeyboard.presetButtons[0].press();
                button0CB();

                for (var i = 0; i < this.values.length; i++) {
                    if (this.values[i] > 0) {
                        this.isActive[i] = true;
                    } 
                }

                this.set[0] = true;
            }  
        }

        else if (!this.isLit[0]) {
            this.set[0] = false;
            //midiKeyboard.presetButtons[0].isActive = false;

            if (this.reset[0] == false) {
                //this.values = [0, 0, 0, 0, 0, 0, 0, 0];
                
                // reset each step of the sequence to 0
                for (var i = 0; i < this.values.length; i++) {
                    this.values[i] = 0;    
                }
                
                // release all onepole envelopes
                for (var i = 0; i <  onePoles.envelopes.length; i++) {
                    onePoles.envelopes[i].release();
                }

                midiKeyboard.presetButtons[0].isActive = false;
                //midiKeyboard.presetButtons[0].press();
                button0CB();

                this.reset[0] = true;    
            }      
        }
                
        if (this.isLit[1]) {
            this.sequence2();
        }
        
        else if (!this.isLit[1]) {
            this.set[1] = false;

            if (this.reset[1] == false) {
                for (var i = 0; i < this.values.length; i++) {
                    this.values[i] = 0;    
                }
                
                // release all onepole envelopes
                for (var i = 0; i <  onePoles.envelopes.length; i++) {
                    onePoles.envelopes[i].release();
                }

                this.reset[1] = true;    
            }      
        }
                
        // random sequence
        if (this.isLit[3]) {
            this.reset[3] = false;

            if (this.set[3] == false) {
                for (var i = 0; i < this.values.length; i++) {
                    //this.r1 = random(0, this.dflat.length - i);
                    this.r1 = random(0, this.values.length + 1 - i);
                    this.r1 = round(this.r1);
                    console.log(this.r1);
                    //console.log(this.values.length);
                    this.values[i] = this.dflat[this.r1];    
                    this.isActive[i] = true;
                    console.log(this.r1);
                    //this.dflat.splice(1, 1);
                    //this.dflat.splice(1, this.r1);
                }

                //var r2 = random(0, 3);
                //r2 = round(r2);

                midiKeyboard.presetButtons[1].isActive = true;
                button1CB();

                this.set[3] = true;
            }
        } else if (!this.isLit[3]) {
            this.set[3] = false;
            this.dflat = [1, 2, 4, 6, 7, 9, 11, 13];

            if (this.reset[3] == false) {
                for (var i = 0; i < this.values.length; i++) {
                    this.values[i] = 0;    
                }
                
                // release all onepole envelopes
                for (var i = 0; i <  onePoles.envelopes.length; i++) {
                    onePoles.envelopes[i].release();
                }

                midiKeyboard.presetButtons[1].isActive = false;
                this.reset[3] = true;    
            }      
        }

        // random sequence
        if (this.isLit[4]) {
            this.reset[4] = false;

            if (this.set[4] == false) {
                for (var i = 0; i < this.values.length; i++) {
                    //var bflat = [0, 1, 2, 4, 6, 7, 9, 11, 13];
                    var r1 = random(0, 13);
                    r1 = round(r1);
                    //var r1 = random(bflat);
                    this.values[i] = r1;    
                    this.isActive[i] = true;
                }

                var r2 = random(0, 3);
                r2 = round(r2);

                //midiKeyboard.presetButtons[0].isActive = true;
                //button0CB();
                //button1CB();
                //button2CB();
                //button3CB();

                this.set[4] = true;
            }
        } else if (!this.isLit[4]) {
            this.set[4] = false;

            if (this.reset[4] == false) {
                for (var i = 0; i < this.values.length; i++) {
                    this.values[i] = 0;    
                }
                
                // release all onepole envelopes
                for (var i = 0; i <  onePoles.envelopes.length; i++) {
                    onePoles.envelopes[i].release();
                }

                //midiKeyboard.presetButtons[0].isActive = false;
                
                // possible solution for randomising which waveform is selected
                
//                        midiKeyboard.presetButtons[1].isActive = false;
//                        midiKeyboard.presetButtons[2].isActive = false;
//                        midiKeyboard.presetButtons[3].isActive = false;
//                        button0CB();
//                        button1CB();
//                        button2CB();
//                        button3CB();

                this.reset[4] = true;    
            }      
        }
    }
    
    
    // This is a 16 step version of the sequencer which uses the progression function to trigger the one poles
    this.succession = function() {
        if (this.isPlaying) {
            this.currentCount = timer.phasor(4);

            if (this.currentCount < 0.5 && !this.isTriggered) {
                this.playhead = (this.playhead + 1) % 16; 
                this.isTriggered = true;
                this.progression();    
            } else if (this.currentCount > 0.5) {
                this.isTriggered = false; 
            }
        } else {
            this.currentCount = 0;
        }
    }
    
    
    // triggers audio envelopes
    this.cycle = function() {
        for (var i = 0; i < this.cycleLength; i++) {
            if (this.isActive[i] && this.values[i] > 0) {
                if (this.playhead % this.cycleLength == i) {
                    trigs[this.values[i] - 1] = 1;
                }
                
                // commenting out this stops the sequencer behaviour which doesn't allow retriggering
                
//                } else {
//                    trigs[this.values[i] - 1] = 0;
//                }
            }
        }
    }
    
    // triggers onePoles, does this small discrepancy arise since we are using something that is running at audio rate speed in the draw loop?
    this.progression = function() {
        for (var i = 0; i < this.cycleLength; i++) {
            if (this.isActive[i] && this.values[i] > 0) {
                if (this.playhead % this.cycleLength == i) {
                    onePoles.envelopes[this.values[i] - 1].trigger();
                } 
                
                else {
                    onePoles.envelopes[this.values[i] - 1].release();
                }
            }
        }
    }
    
    // these two sequences that use | in their conditionals solve the problem of certain notes not triggering their corresponding one pole
    this.sequence1 = function() {
        /* Works really well with the delay!*/

        // trigger  beat every 8 beats
        if (this.playhead % 8 == 1) {
            trigs[0] = 1;
            console.log("triggered!")
            onePoles.envelopes[0].trigger();
        } else {
            onePoles.envelopes[0].release();
        }

        if (this.playhead % 8 == 2 ) {
            trigs[5] = 1;
            onePoles.envelopes[5].trigger();
        } else {
            onePoles.envelopes[5].release();
        }

        if (this.playhead % 8 == 3 | this.playhead % 8 == 7 ) {
            trigs[7] = 1;
            onePoles.envelopes[7].trigger();
        } else {
            onePoles.envelopes[7].release();
        }

        if (this.playhead % 8 == 4 ) {
            trigs[8] = 1;
            onePoles.envelopes[8].trigger();
        } else {
            onePoles.envelopes[8].release();
        }

        if (this.playhead % 8 == 5 ) {
            trigs[1] = 1;
            onePoles.envelopes[1].trigger();
        } else {
            trigs[1] = 0;
            onePoles.envelopes[1].release();
        }

        if (this.playhead % 8 == 6 ) {
            trigs[12] = 1;
            onePoles.envelopes[12].trigger();
        } else {
            onePoles.envelopes[12].release();
        }
    }
    
    this.sequence2 = function() {
        if (this.playhead % 16 == 1 | this.playhead % 16 == 5 ) {
            trigs[0] = 1;
            onePoles.envelopes[0].trigger();
        } else {
            onePoles.envelopes[0].release();
        }

        if (this.playhead % 16 == 2 | this.playhead % 16 == 6 | this.playhead % 16 == 10) {
            trigs[5] = 1;
            onePoles.envelopes[5].trigger();
        } else {
            onePoles.envelopes[5].release();
        }

        if (this.playhead % 16 == 3 | this.playhead % 16 == 7 | this.playhead % 16 == 11 | this.playhead % 16 == 0) {
            trigs[7] = 1;
            onePoles.envelopes[7].trigger();
        } else {
            onePoles.envelopes[7].release();
        }

        if (this.playhead % 16 == 4 | this.playhead % 16 == 8 | this.playhead % 16 == 12 | this.playhead % 16 == 15) {
            trigs[8] = 1;
            onePoles.envelopes[8].trigger();
        }
        else {
            onePoles.envelopes[8].release();
        }

        if (this.playhead % 16 == 9) {
            trigs[1] = 1;
            onePoles.envelopes[1].trigger();
        } else {
            trigs[1] = 0;
            onePoles.envelopes[1].release();
        }

        if (this.playhead % 16 == 13 ) {
            trigs[3] = 1;
            onePoles.envelopes[3].trigger();
        } else {
            onePoles.envelopes[3].release();
        }

        if (this.playhead % 16 == 14 ) {
            trigs[10] = 1;
            onePoles.envelopes[10].trigger();
        } else {
            onePoles.envelopes[10].release();
        }
    }
}