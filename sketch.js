var audio = new maximJs.maxiAudio();

var delay = new maximJs.maxiDelayline();
var isDelay = true;

var dryMix = 0.5;
var time = 1.5;
var regen = 0.5;

var myFilter = new maximEx.filter();

var midiNote = 0;
var conv = new maximJs.convert();

var midiKeyboard, noiseGen, oscilloscope;
var controls, dial, circleDial;

var sine, square, saw, triangle;
var onePoles;

var isPreset1, isPreset2, isPreset3, isPreset4;

var notesC3 = [];
var notesC4 = [];
var notesC5 = [];
var octaveLevel = 1;
var octaveValue = 1;

var attack = 100;
var decay = 20;
var sustain = 0.5;
var release = 5000;

var trigs = [];
var keyboardLength = 13;

var stereoOutput = maximJs.maxiTools.getArrayAsVectorDbl([0,0]);
var panner = new maximJs.maxiMix();
var panLevel = 0.5;
var panValue = 0.5;

var sequencer;
var timer = new maximJs.maxiOsc(); 

var canvas;

function preload() {
    myFont = loadFont('assets/digital-7.ttf');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.parent('sketch-div');
    canvas.style('z-index', '-1');
    
    audio.play = audioLoop;
    audio.outputIsArray(true, 2); //we are working stereo now !
    audio.init();
    
    var margin = height / 20;
    
    //midiKeyboard = new Keyboard(margin, margin);
    
    oscilloscope = new Oscilloscope();
    //oscilloscope = new Oscilloscope(width - width / 3, height / 6);
    //oscilloscope = new Oscilloscope();
    
    noiseGen = new Generator(margin, height / 2 + margin);
    
    sequencer = new Sequencer(width / 2 - margin, height / 2 + height / 15);
    //sequencer = new Sequencer(width / 2 - margin, height * 3 / 5);
    
    dial = new Dial(width / 2 + margin, height / 5 + margin, height / 12);
    //console.log(dial.centreX, dial.centreY);
    //console.log(dial.centreX - dial.radius, dial.centreY - dial.radius * 1.25); 
    //console.log(windowWidth);
    //console.log(windowHeight);
    
    controls = new Controls();
    
    sine = new Sine();
    square = new Square();
    saw = new Saw();
    triangle = new Triangle();
    
    isPreset1 = isPreset2 = isPreset3 = isPreset4 = false;
    
    onePoles = new Poles();
    
    for (var i = 0; i < keyboardLength; i++) {
        notesC3.push(new Note(48 + i));
        notesC4.push(new Note(60 + i));
        notesC5.push(new Note(72 + i));
        
        trigs.push(0);
    }
    
    midiKeyboard = new Keyboard(margin, margin);
}

function draw() {   
    background(135);
        
    // these trigger the one poles that trigger colours so should be in the draw loop
    controls.keyTyped();
    
    //this displays the colours triggered by the one poles 
    onePoles.display();    
    
    
    midiKeyboard.pressedFirst();
    midiKeyboard.pressed();
    
    controls.arrowKeys();
    
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
    
    //midiKeyboard.pressed();
    //midiKeyboard.amplitude();
    
    noiseGen.amplitude();
    noiseGen.slider.pressed();
    noiseGen.dial.noiseColours();
    
    var sig1 = sine.waves.reduce(add, 0);
    var sig2 = saw.waves.reduce(add, 0);
    var sig3 = square.waves.reduce(add, 0);
    var sig4 = triangle.waves.reduce(add, 0);
    
    //this determines whether sig 5 is white, pink or brown noise according to the position of the dial
    if (noiseGen.dial.white) {
        var sig5 = noiseGen.white();
    } else if (noiseGen.dial.pink) {
        var sig5 = noiseGen.pink();
    } else if (noiseGen.dial.brown) {
        var sig5 = noiseGen.brown();
    }
    
    // need to adjust levels separately so naturally louder waveforms start at the same level as naturally quieter waveforms
    var synthOutput = sig1 + sig2 + sig3 + sig4 * 0.5;
    var noiseOutput = sig5 * 0.25;

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

function add(a, b) {
    return a + b;
}

function mousePressed() {
    for (b in midiKeyboard.presetButtons) {
        if (midiKeyboard.presetButtons[b].isInside(mouseX, mouseY)) {
            midiKeyboard.presetButtons[b].press();
            break;
        }
    }
    
    dial.pressed();
    sequencer.pressed();    
    //midiKeyboard.isPressed();
    noiseGen.dial.pressed();
}

function mouseReleased() {
    noiseGen.dial.released();
    
    // having this extra released function definitely helps!  Maybe something you could incorporate into the onePoles soloution?
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
    //controls.keyTyped();
}

//maybe if it's just the dipslay that takes the size arguments for drawing?
//BUT THE DISPLAY IS INFLUENCING EVERYTHING THAT IS HAPPENING
function windowResized() {
    margin = height / 20;
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.parent('sketch-div');
    canvas.style('z-index', '-1');
    
    oscilloscope = new Oscilloscope();
    
    noiseGen.div.remove();
    noiseGen = new Generator(margin, height / 2 + margin);
    
    sequencer = new Sequencer(width / 2 - margin, height / 2 + height / 15);
    
    dial.div.remove();
    dial = new Dial(width / 2 + margin, height / 5 + margin, height / 12);
    
}

function button0CB() {
    if (midiKeyboard.presetButtons[0].isActive) {
        isPreset1 = true;
        resized = true;
        //presetButtons[1].isActive = false;
        //!button1CB();
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

function fader0CB() {
    ampSines = midiKeyboard.faders[0].value;
    //console.log(faders[0].value);
}

function fader1CB() {
    ampSquares = midiKeyboard.faders[1].value;
    //console.log(faders[1].value);
}

function fader2CB() {
    ampSaws = midiKeyboard.faders[2].value;
    //console.log(faders[2].value);
}

function fader3CB() {
    ampTriangles = midiKeyboard.faders[3].value;
    //console.log(faders[3].value);
}