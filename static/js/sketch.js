var audio = new maximJs.maxiAudio();

var delay = new maximJs.maxiDelayline();
var isDelay = true;

var dryMix = 0.5;
var time = 1.5;
var regen = 0.5;

var myFilter = new maximEx.filter();

var midiKeyboard, noiseGen, oscilloscope;
var controls, dial, circleDial;

var isPreset1, isPreset2, isPreset3, isPreset4;

var sine, square, saw, triangle;
var onePoles;

var octaveLevel = 1;
var octaveValue = 1;

var notes = [];
var trigs = [];

var stereoOutput = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
var panner = new maximJs.maxiMix();
var panLevel = 0.5;
var panValue = 0.5;

var sequencer;
var timer = new maximJs.maxiOsc(); 

var canvas;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    //canvas = createCanvas(displayWidth, displayHeight);
    canvas.position(0, 0);
    canvas.parent('sketch-div');
    canvas.style('z-index', '-1');
    
    audio.play = audioLoop;
    audio.outputIsArray(true, 2); //we are working stereo now !
    audio.init();
    
    var margin = height / 20;
    
    //why is keyboard setup last?
    //midiKeyboard = new Keyboard(margin, margin);
    
    oscilloscope = new Oscilloscope(width - width / 3, height / 10);
    
    noiseGen = new Generator(margin, height / 2 + margin);
    
    sequencer = new Sequencer(width / 2 - margin, height / 2 + height / 15);
    
    dial = new Dial(width / 2 + margin, height / 5 + margin, height / 12);
    
    controls = new Controls();
    
    var attack = 100;
    var decay = 20;
    var sustain = 0.5;
    var release = 5000;
    
    sine = new Sine(attack, decay, sustain, release);
    square = new Square(attack, decay, sustain, release);
    saw = new Saw(attack, decay, sustain, release);
    triangle = new Triangle(attack, decay, sustain, release);
    
    isPreset1 = isPreset2 = isPreset3 = isPreset4 = false;
    
    onePoles = new Poles();
    
    for (var i = 0; i < 4; i++) {
        notes.push(new Array(12));
    }
        
    for (var i = 0; i < 13; i++) {
        //initialise midi notes
        for (var j = 0; j < 4; j++) {
            notes[j][i] = new Note(48 + (j * 12) + i);
        }
        
        trigs.push(0);
    }
    
    midiKeyboard = new Keyboard(margin, margin * 1.5);

    //var goldenRatio = width - (width / 1.61803398875);
    //midiKeyboard = new Keyboard(margin * 4, margin * 4, width * 0.15, width * 0.075);
}

function draw() {   
    background(135);
        
    // these trigger the one poles that trigger colours so should be in the draw loop
    //controls.keyTyped();
    
    //this displays the colours triggered by the one poles 
    onePoles.display();  
    
    //black notes
    midiKeyboard.pressedFirst();
    
    //white notes
    midiKeyboard.pressed();
    
    //placed here so you can increment rapidly through the values for panning
    controls.arrowKeys();
    
    /* this idea is putting the sequence for the onepoles in a separate timer that runs at the speed of the draw loop
       to potentially avoid some of the envelopes not releasing */
    
    //sequencer.succession();
    
    push();
    midiKeyboard.display();
    pop(); 
    
    //highpass
    push();
    dial.draw();
    pop();
    
    push();
    oscilloscope.display();
    pop();

    push();
    noiseGen.display();
    pop();
    
    push();
    sequencer.draw();
    pop();    
}

function audioLoop() {   
    if(isPreset1) { 
        sine.output();
    }
    if(isPreset2) { 
        square.output();
    } 
    if(isPreset3) { 
        saw.output();    
    }
    if(isPreset4) { 
        triangle.output();
    }
    
    controls.midiKeys();
    //controls.arrowKeys();
    
    /* since you are using the logic for triggering the onepole filters with the midiPressed functions
       the pressedFirst() function has to be in the audio loop otherwise there will be a lag */
    
    midiKeyboard.pressedFirst();
    midiKeyboard.midiPressed();
    midiKeyboard.midiPressedFirst();
    
    sequencer.timer();
    
    //the faders were causing glitching because the pressed function was being used in the display function of the keyboard which was being called in the draw loop
    //which was running too slowly
    midiKeyboard.amplitude();
    
    for (var i = 0; i < midiKeyboard.sh.length; i++) {
        midiKeyboard.sh[i].pressed();
    }
    
    noiseGen.amplitude();
    noiseGen.slider.pressed();
    noiseGen.dial.noiseColours();
    
    sequencer.amplitude();
    sequencer.slider.pressed();
    
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    
    var sig1 = sine.waves.reduce(reducer);
    var sig2 = saw.waves.reduce(reducer);
    var sig3 = square.waves.reduce(reducer);
    var sig4 = triangle.waves.reduce(reducer);
    
    //this determines whether sig 5 is white, pink or brown noise according to the position of the dial
    if (noiseGen.dial.white) {
        var sig5 = noiseGen.white();
    } else if (noiseGen.dial.pink) {
        var sig5 = noiseGen.pink();
    } else if (noiseGen.dial.brown) {
        var sig5 = noiseGen.brown();
    }
    
    // need to adjust levels separately so naturally louder waveforms start at the same level as naturally quieter waveforms
    var synthOutput = sig1 + sig2 + sig3 + sig4; //these sum to 0.735
    var noiseOutput = sig5 * 0.25; //kind of works perfectly since adding the soundwaves to the noise gives you just shy of 1

    //delay
    var fx = delay.dl(synthOutput, 44100 * time, regen);
    var mix = (fx * (1.0 - dryMix) + (synthOutput * dryMix));
    
    //applying the filter only to keyboard output and fx
    var filteredOutput = myFilter.highpass(mix, dial.lc);
    var modularOut = filteredOutput + noiseOutput * 0.5 + sequencer.metronome * 0.2;
    
    //this applies the filter to the whole output including the noise generator
    //var filteredOutput = myFilter.highpass(modularOut, dial.lc);
    
    panner.stereo(modularOut, stereoOutput, panValue);
    this.output[0] = stereoOutput.get(0);
    this.output[1] = stereoOutput.get(1);
    
    oscilloscope.sigBufs.shift();
    oscilloscope.sigBufs.push(mix);
        
    noiseGen.sigBufs.shift();
    noiseGen.sigBufs.push(noiseOutput);
}

////////////////////////////////////////////////////// AUDIO ////////////////////////////////////////////////////////

function transient() {
    for (var i = 0; i < 13; i++) {
        sine.envelopes[i].setAttack(10);
        sine.envelopes[i].setDecay(10);
        sine.envelopes[i].setSustain(0.75);
        sine.envelopes[i].setRelease(1000);
        
        square.envelopes[i].setAttack(10);
        square.envelopes[i].setDecay(10);
        square.envelopes[i].setSustain(0.75);
        square.envelopes[i].setRelease(1000);
        
        saw.envelopes[i].setAttack(10);
        saw.envelopes[i].setDecay(10);
        saw.envelopes[i].setSustain(0.75);
        saw.envelopes[i].setRelease(1000);
        
        triangle.envelopes[i].setAttack(10);
        triangle.envelopes[i].setDecay(10);
        triangle.envelopes[i].setSustain(0.75);
        triangle.envelopes[i].setRelease(1000);
        
        onePoles.attacks[i] = 0.01;
        onePoles.releases[i] = 0.1;
    }
}

function transient1() {
    var attack = 100;
    var decay = 20;
    var sustain = 0.5;
    var release = 5000;
    
    for (var i = 0; i < 13; i++) {
        sine.envelopes[i].setAttack(attack);
        sine.envelopes[i].setDecay(decay);
        sine.envelopes[i].setSustain(sustain);
        sine.envelopes[i].setRelease(release);
        
        square.envelopes[i].setAttack(attack);
        square.envelopes[i].setDecay(decay);
        square.envelopes[i].setSustain(sustain);
        square.envelopes[i].setRelease(release);
        
        saw.envelopes[i].setAttack(attack);
        saw.envelopes[i].setDecay(decay);
        saw.envelopes[i].setSustain(sustain);
        saw.envelopes[i].setRelease(release);
        
        triangle.envelopes[i].setAttack(attack);
        triangle.envelopes[i].setDecay(decay);
        triangle.envelopes[i].setSustain(sustain);
        triangle.envelopes[i].setRelease(release);
        
        onePoles.attacks[i] = 0.01;
        onePoles.releases[i] = 0.4;
    }
}

function delayOnOff(isDelay) {
    if (!isDelay) {
        dryMix = 1;
    } else if (isDelay) {
        dryMix = 0.5;
    } 
}
                                
function add(a, b) {
    return a + b;
}

function onePoleFilter(current, previous) {
    var a = 0.9;
    var output = previous + a * (current - previous);
    return output;
}

function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}

////////////////////////// EVENTS ///////////////////////

function mousePressed() {
    for (b in midiKeyboard.presetButtons) {
        if (midiKeyboard.presetButtons[b].isInside(mouseX, mouseY)) {
            midiKeyboard.presetButtons[b].press();
            break;
        }
    }
    
    dial.pressed();
    sequencer.pressed();  
    noiseGen.dial.pressed();
}

function mouseReleased() {
    noiseGen.dial.released();
    
    //having this extra released function definitely helps!  Maybe something you could incorporate into the onePoles soloution?
    //midiKeyboard.releasedFirst();
    midiKeyboard.released();
}

function keyPressed() {
    controls.keyPressed();
}

function keyReleased() {
    controls.keyReleased();
}

function keyTyped() {
    //seems you can only register 6 key presses at once?
    //if this is placed in the draw loop you can build up to more than 6 but only trigger two onepoles simultaneously
    controls.keyTyped();
}

//maybe if it's just the dipslay that takes the size arguments for drawing?
//but the position of certain objects on the screen, such as the dial's pointer, influence certain aspects of the program
function windowResized() {
    margin = height / 20;
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.parent('sketch-div');
    canvas.style('z-index', '-1');
    
    oscilloscope.resize();
    noiseGen.resize();
    sequencer.resize();
    dial.resize();
    midiKeyboard.resize();
}

function button0CB() {
    if (midiKeyboard.presetButtons[0].isActive) {
        isPreset1 = true;
    } else {
        isPreset1 = false;
    }
}

function button1CB() {
    if (midiKeyboard.presetButtons[1].isActive) {
        isPreset2 = true;
    } else {
        isPreset2 = false;
    }
}

function button2CB() {
    if (midiKeyboard.presetButtons[2].isActive) {
        isPreset3 = true;
    } else {
        isPreset3 = false;
    }
}

function button3CB() {
    if (midiKeyboard.presetButtons[3].isActive) {
        isPreset4 = true;
    } else {
        isPreset4 = false;
    }
}
