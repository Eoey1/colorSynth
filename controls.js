function Controls() {
    this.keys = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75];
    this.letters = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k'];
    
    this.midiKeys = function() {
        for (var i = 0; i < this.keys.length; i++) {
            if (keyIsDown(this.keys[i])) {
                trigs[i] = 1;    
            } else {
                trigs[i] = 0;    
            }
        }
    }
    
    this.keyTyped = function() {
        for (var i = 0; i < this.letters.length; i++)
        {
            if (keyIsPressed === true && key === this.letters[i]) {
                onePoles.envelopes[i].trigger();  
            
                for (var j = 0; j < sequencer.cycleLength; j++) { // this loop lets you adjust the sequencer values from the keyboard
                    if (sequencer.isSelected[j] == true) {
                            sequencer.values[j] = i + 1; 
                    }
                }    
            }
        }
    } 
    
    this.keyReleased = function() {
        for (var i = 0; i < this.keys.length; i++) {
            if(keyCode === this.keys[i]) {
                onePoles.envelopes[i].release();
            }
        }
    }
    
    this.keyPressed = function() {
        if (key === '1') {
            midiKeyboard.presetButtons[0].press();  //sines
        }
        if (key === '2') {
            midiKeyboard.presetButtons[1].press(); //squares
        }
        if (key === '3') {
            midiKeyboard.presetButtons[2].press(); //saws
        }
        if (key === '4') {
            midiKeyboard.presetButtons[3].press(); //triangles
        }
        
        if (key === '5') {
            transient();
        }
        
        // turns the delay on or off
        if (key === ' ') {
            isDelay = !isDelay;
            if (!isDelay) {
                dryMix = 1;
            } else if (isDelay) {
                dryMix = 0.5;
            } 
        }

        // metronome
        if (keyCode === 77) {
            sequencer.isClick = !sequencer.isClick 
        }
        
        // octave shift
        if (keyCode === UP_ARROW) { 
            if (sequencer.isSelected[0] == false && 
                sequencer.isSelected[1] == false && 
                sequencer.isSelected[2] == false && 
                sequencer.isSelected[3] == false && 
                sequencer.isSelected[4] == false && 
                sequencer.isSelected[5] == false && 
                sequencer.isSelected[6] == false && 
                sequencer.isSelected[7] == false) {

                if (octaveLevel < 2) {
                    octaveLevel += 1;
                    console.log(octaveLevel);
                }
            }
        } else if (keyCode === DOWN_ARROW) {
            if (sequencer.isSelected[0] == false && 
                sequencer.isSelected[1] == false && 
                sequencer.isSelected[2] == false && 
                sequencer.isSelected[3] == false && 
                sequencer.isSelected[4] == false && 
                sequencer.isSelected[5] == false && 
                sequencer.isSelected[6] == false && 
                sequencer.isSelected[7] == false) {
                
                if (octaveLevel > 0) {
                    octaveLevel -= 1;
                    console.log(octaveLevel);
                }
            }
        }
        
        octaveValue = constrain(octaveLevel, 0, 2);
        
        if (keyCode === ENTER) {
            fullscreen(true);
        }
        
        
        // edits the currently selected sequencer step by increasing or decreasing the value by 1
        if (keyIsDown(UP_ARROW)) {   
            for (var i = 0; i < sequencer.letters.length; i++) {
                if (sequencer.isSelected[i] == true) {
                    if (sequencer.values[i] < sequencer.letters.length - 1) {
                        sequencer.values[i] += 1; 
                    }
                }
            }
        
        } else if (keyIsDown(DOWN_ARROW)) {
            for (var i = 0; i < sequencer.letters.length; i++) {
                if (sequencer.isSelected[i] == true) {
                    if (sequencer.values[i] > 0) {
                        sequencer.values[i] -= 1;
                    }
                }
            }
        }
        
        // code to shift which sequencer step is being edited
        if (keyIsDown(LEFT_ARROW)) {
            for (var i = 0; i < sequencer.cycleLength; i++) {
                if (sequencer.isSelected[i] == true && i > 0) {  // if one of the 8 boxes is selected and the left key is pressed the box one to the left is now selected
                    sequencer.isSelected[i - 1] = true;    
                    sequencer.isActive[i] = true; // the box selected when the left arrow is pressed is still active
                    sequencer.isSelected[i] = false;  // but no longer selected 
                }
            }
        } else if (keyIsDown(RIGHT_ARROW)) {
            for (var i = sequencer.cycleLength - 1; i >= 0; i--) { 
                if (sequencer.isSelected[i] == true && i < sequencer.cycleLength - 1) {
                    sequencer.isSelected[i + 1] = sequencer.isSelected[i];
                    sequencer.isActive[i + 1] = true; // have to add this + 1 here?  Why???
                    sequencer.isSelected[i] = false;
                } 
            }
        }
    }
    
    
    // the panning is the only value smaller enough when incrementing / decrementing to take advantage of keyIsDown and place in the draw loop!
    this.arrowKeys = function() {
        if (keyIsDown(LEFT_ARROW)) {
            if (sequencer.isSelected[0] == false && 
                sequencer.isSelected[1] == false && 
                sequencer.isSelected[2] == false && 
                sequencer.isSelected[3] == false && 
                sequencer.isSelected[4] == false && 
                sequencer.isSelected[5] == false && 
                sequencer.isSelected[6] == false && 
                sequencer.isSelected[7] == false) {
            
                if (panLevel >= 0) {
                    panLevel -= 0.005;
                    console.log(panLevel);
                }
            }    
        } 
        
        
        if (keyIsDown(RIGHT_ARROW)) {
            if (sequencer.isSelected[0] == false && 
                sequencer.isSelected[1] == false && 
                sequencer.isSelected[2] == false && 
                sequencer.isSelected[3] == false && 
                sequencer.isSelected[4] == false && 
                sequencer.isSelected[5] == false && 
                sequencer.isSelected[6] == false && 
                sequencer.isSelected[7] == false) {     
        
                if (panLevel <= 1) {
                    panLevel += 0.005;    
                    console.log(panLevel);
                }
            }
        }
        
        panValue = constrain(panLevel, 0, 1);  
    }
}