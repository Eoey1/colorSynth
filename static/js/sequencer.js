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
    
    //audio.loadSample("../sounds/808-clave.wav", this.click);
    
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
    this.displayPos = createVector(this.xPos + this.width / 25, this.yPos + this.height * 13 / 24);
    
    // specifies how many steps the sequencer has
    this.cycleLength = 8;
    this.values = [];
    
    // boolean logic for various states of the sequencer and user interaction with the sequencer
    this.isSelected = []
    this.isActive = [];
    this.isPressed = [];
    this.keyboardIsPressed = false;
    
    this.tempo = 4;

    for (var i = 0; i <  this.cycleLength; i++) {
        this.isSelected.push(false);
        this.isActive.push(false);
        this.isPressed.push(false);
        this.values.push(0);
    }
    
    //this.dflat = [1, 2, 4, 6, 7, 9, 11, 13];
    
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
    
    this.slider = new Neutron(this.xPos + this.width * 3 / 18, this.yPos + this.height * 5 / 6, this.width * 2 / 3, this.height / 10);
    
    this.draw = function() {
        this.chassis();
        this.display();
        this.slider.draw();
    }
    
     this.chassis = function() {
        //strokeWeight(2);
        //stroke(70);
        noStroke();
        fill(25);
        rect(this.xPos, this.yPos, this.width, this.height);
    } 
     
    this.amplitude = function() {
        this.slider.mapping();
        this.tempo = this.slider.value;
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
            //textFont(sequencerFont);
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
        //checks whether a key has been pressed or not
        if (mouseX >= midiKeyboard.xPos + 28 && mouseX <= midiKeyboard.xPos + 391 && mouseY >= midiKeyboard.yPos + 55 && mouseY <= midiKeyboard.yPos + 238) {
            this.keyboardIsPressed = true;
        } else {
            this.keyboardIsPressed = false;
        }
        
        for (var i = 0; i < this.cycleLength; i++) {
            if (mouseX >= this.displayPos.x + i * this.spacing && 
                mouseX <= this.displayPos.x + i * this.spacing + this.displayWidth && 
                mouseY >= this.displayPos.y && 
                mouseY <= this.displayPos.y + this.displayHeight) {
                //checks whether a step of the sequencer has been clicked
                this.isPressed[i] = true; 
            } else {
                if (this.keyboardIsPressed == false) {
                    this.isSelected[i] = false;
                }
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

            this.currentCount = timer.phasor(this.tempo);

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
                //this.progression();
                this.sequence();
            } 
            
            else if (this.currentCount > 0.5) {
                this.isTriggered = false; //reset the trigger ready for the next beat
            }
            
            if (this.isClick && this.click.isReady()) {
                this.metronome = this.click.playOnce();
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
                
                this.isLit[1] = false;
                this.isLit[2] = false;
                this.isLit[3] = false;
                this.isLit[4] = false;

                this.reset[1] = true;
                this.reset[2] = true;
                this.reset[3] = true;
                this.reset[4] = true;
                
                this.values = [1, 6, 8, 9, 2, 13, 8, 0];
                this.slider.smoothedX = this.slider.x + this.slider.lineWidth / 2;

                midiKeyboard.presetButtons[0].isActive = true;
                //midiKeyboard.presetButtons[0].press();
                button0CB();

                for (var i = 0; i < this.values.length; i++) {
                    if (this.values[i] > 0) {
                        this.isActive[i] = true;
                    } 
                }
                
                //set fader level
                midiKeyboard.sh[0].sliderY = midiKeyboard.sh[0].y - midiKeyboard.sh[0].lineLength * 3 / 5;
                
                //set envelope type
                transient1();
                
                //set delay
                delayOnOff(true);

                this.set[0] = true;
            }  
        }

        else if (!this.isLit[0]) {
            this.set[0] = false;
            //midiKeyboard.presetButtons[0].isActive = false;

            if (this.reset[0] == false) {
                //this.values = [0, 0, 0, 0, 0, 0, 0, 0];
                this.slider.smoothedX = this.slider.x;
                
                // reset each step of the sequence to 0
                for (var i = 0; i < this.values.length; i++) {
                    this.values[i] = 0;    
                }
                
                // release all onepole envelopes
                for (var i = 0; i <  onePoles.envelopes.length; i++) {
                    onePoles.envelopes[i].release();
                }

                midiKeyboard.presetButtons[0].isActive = false;
                button0CB();
                
                //reset fader level
                midiKeyboard.sh[0].sliderY = midiKeyboard.sh[0].y - midiKeyboard.sh[0].h / 2;

                this.reset[0] = true;    
            }      
        }
                
        if (this.isLit[1]) {
            this.reset[1] = false;
            
            /* since you don't actually need the set / reset logic to enable editing here 
               as it's not really possible to edit when the values change every time you complete the cycle, 
               you can move the playhead code out of the conditional */
            
            if (this.playhead % 16 < 8) {
                this.values = [1, 6, 8, 9, 1, 6, 8, 9];
            } else if (this.playhead % 16 >= 8) {
                this.values = [2, 6, 8, 9, 4, 11, 9, 8];
            } else if (this.playhead % 16 == 0) {
                onePoles.envelopes[7].release();
            }

            if (this.set[1] == false) {
                this.isLit[0] = false;
                this.isLit[2] = false;
                this.isLit[3] = false;
                this.isLit[4] = false;

                this.reset[0] = true;
                this.reset[2] = true;
                this.reset[3] = true;
                this.reset[4] = true;
                
                midiKeyboard.presetButtons[2].isActive = true;
                button2CB();

                for (var i = 0; i < this.values.length; i++) {
                    if (this.values[i] > 0) {
                        this.isActive[i] = true;
                    } 
                }

                this.set[1] = true;   
                
                //set fader level
                midiKeyboard.sh[2].sliderY = midiKeyboard.sh[0].y - midiKeyboard.sh[0].lineLength * 2 / 5;
            }  
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
                
                midiKeyboard.presetButtons[2].isActive = false;
                button2CB();

                this.reset[1] = true;    
            }      
        }
        
        if (this.isLit[2]) {
            this.reset[2] = false;

            if (this.set[2] == false) {
                this.isLit[0] = false;
                this.isLit[1] = false;
                this.isLit[3] = false;
                this.isLit[4] = false;

                this.reset[0] = true;
                this.reset[1] = true;
                this.reset[3] = true;
                this.reset[4] = true;
                
                //set up an array of notes corresponding to a mode
                this.dflat = [1, 2, 4, 6, 7, 9, 11, 0];
                
                //shuffle these in to an order where no note is repeated
                this.values = shuffle(this.dflat);
                this.slider.smoothedX = this.slider.x + this.slider.lineWidth * 2 / 3;

                //midiKeyboard.presetButtons[0].isActive = true;
                //button0CB();

                for (var i = 0; i < this.values.length; i++) {
                    if (this.values[i] > 0) {
                        this.isActive[i] = true;
                    } 
                }

                this.set[2] = true;
            }  
        } else if (!this.isLit[2]) {
            this.set[2] = false;
            //midiKeyboard.presetButtons[0].isActive = false;

            if (this.reset[2] == false) {
                //this.values = [0, 0, 0, 0, 0, 0, 0, 0];
                this.slider.smoothedX = this.slider.x;
                
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

                this.reset[2] = true;    
            }      
        }
                
        // random sequence
        if (this.isLit[3]) {
            this.reset[3] = false;

            if (this.set[3] == false) {
                
                this.isLit[0] = false;
                this.isLit[1] = false;
                this.isLit[2] = false;
                this.isLit[4] = false;

                this.reset[0] = true;
                this.reset[1] = true;
                this.reset[2] = true;
                this.reset[4] = true;
                
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
                this.isLit[0] = false;
                this.isLit[1] = false;
                this.isLit[2] = false;
                this.isLit[3] = false;

                this.reset[0] = true;
                this.reset[1] = true;
                this.reset[2] = true;
                this.reset[3] = true;
                
                this.values = [9, 4, 9, 11, 2, 6, 4, 13];
                this.slider.smoothedX = this.slider.x + this.slider.lineWidth * 4 / 5;
                
                transient();
                
                midiKeyboard.presetButtons[0].isActive = true;
                button0CB();
                
                for (var i = 0; i < this.values.length; i++) {
                    if (this.values[i] > 0) {
                        this.isActive[i] = true;
                    } 
                }
                
                delayOnOff(false);
                
                midiKeyboard.sh[0].sliderY = midiKeyboard.sh[0].y - midiKeyboard.sh[0].lineLength * 3 / 4;
            
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
                
                //set the tempo back to 0
                this.slider.smoothedX = this.slider.x;
                
                midiKeyboard.presetButtons[0].isActive = false;
                button0CB();
                
                midiKeyboard.sh[0].sliderY = midiKeyboard.sh[0].y - midiKeyboard.sh[0].h / 2

                this.reset[4] = true;    
            }      
        }
    }
    
    // triggers audio envelopes
    this.cycle = function() {
        for (var i = 0; i < this.cycleLength; i++) {
            if (this.isActive[i] && this.values[i] > 0) {
                if (this.playhead % this.cycleLength == i) {
                    trigs[this.values[i] - 1] = 1;
                }
            }
        }
    }
    
    // triggers onePoles, does this small discrepancy arise since we are using something that is running at audio rate speed in the draw loop?
    this.progression = function() {
        for (var i = 0; i < this.cycleLength; i++) {
            if (this.isActive[i] && this.values[i] > 0) {
                if (this.playhead % this.cycleLength == i) {
                    onePoles.envelopes[this.values[i] - 1].trigger();
                } else {
                    onePoles.envelopes[this.values[i] - 1].release();
                }
            }
        }
    }
    
    this.sequence = function() {
        switch (this.playhead % 8) {
            case 0:
                if (this.values[7] > 0) {
                    onePoles.envelopes[this.values[7] - 1].release(); //release the previous envelope
                }
                if (this.isActive[0] && this.values[0] > 0) {
                    onePoles.envelopes[this.values[0] - 1].trigger(); //trigger the next one
                }
                break;
            case 1:
                if (this.values[0] > 0) {
                    onePoles.envelopes[this.values[0] - 1].release(); //release the previous envelope
                }
                if (this.isActive[1] && this.values[1] > 0) {
                    onePoles.envelopes[this.values[1] - 1].trigger(); //trigger the next one
                }
                break;
            case 2:
                if (this.values[1] > 0) {
                    onePoles.envelopes[this.values[1] - 1].release(); //release the previous envelope
                }
                if (this.isActive[2] && this.values[2] > 0) {
                    onePoles.envelopes[this.values[2] - 1].trigger(); //trigger the next one
                }
                break;
            case 3:
                if (this.values[2] > 0) {
                    onePoles.envelopes[this.values[2] - 1].release(); //release the previous envelope
                }
                if (this.isActive[3] && this.values[3] > 0) {
                    onePoles.envelopes[this.values[3] - 1].trigger(); //trigger the next one
                }
                break;
            case 4:
                if (this.values[3] > 0) {
                    onePoles.envelopes[this.values[3] - 1].release(); //release the previous envelope
                }
                if (this.isActive[4] && this.values[4] > 0) {
                    onePoles.envelopes[this.values[4] - 1].trigger(); //trigger the next one
                }
                break;
            case 5:
                if (this.values[4] > 0) {
                    onePoles.envelopes[this.values[4] - 1].release(); //release the previous envelope
                }
                if (this.isActive[5] && this.values[5] > 0) {
                    onePoles.envelopes[this.values[5] - 1].trigger(); //trigger the next one
                }  
                break;
            case 6:
                if (this.values[5] > 0) {
                    onePoles.envelopes[this.values[5] - 1].release(); //release the previous envelope
                }
                if (this.isActive[6] && this.values[6] > 0) {
                    onePoles.envelopes[this.values[6] - 1].trigger(); //trigger the next one
                }
                break;
            case 7:
                if (this.values[6] > 0) {
                    onePoles.envelopes[this.values[6] - 1].release(); //release the previous envelope
                }
                if (this.isActive[7] && this.values[7] > 0) {
                    onePoles.envelopes[this.values[7] - 1].trigger(); //trigger the next one
                }  
                break;
        }
    }
    
    this.resize = function() {
        var margin = height / 20;
        
        //shift position
        this.xPos = width / 2 - margin;
        this.yPos = height / 2 + height / 15;
        
        // Screen dimensions: 1280, 726
        // height / 3 = 242
        // Think it looks nicer when resizing relative to width...

        //resize dimensions
        this.width = width / 2;
        this.width = width / 2;
        //this.height = height / 3;
        this.height = width / 5.289;
        this.spacing = this.width * 2 / 17;
        this.displayWidth = this.spacing * 3 / 4; 
        this.displayHeight = this.displayWidth * 2 / 3;
        this.displayPos = createVector(this.xPos + this.width / 25, this.yPos + this.height * 13 / 24);
        
        //resize slider dimensions
        this.slider.x = this.xPos + this.width * 3 / 18;
        this.slider.y = this.yPos + this.height * 5 / 6;
        this.slider.h = this.height / 10;
        this.slider.lineWidth = this.width * 2 / 3;
        this.slider.sliderX = this.slider.x;
        this.slider.sliderY = this.slider.y;
        this.slider.sX = this.slider.x;
        //this.slider.smoothedX = this.slider.x;
        this.slider.smoothed = this.slider.onePole.process(this.slider.sliderX); 
        this.slider.smoothedX = constrain(this.slider.smoothed, this.slider.x, this.slider.x + this.slider.lineWidth); 
    }
}  
