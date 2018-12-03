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

var notes = [];

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
var sequencerPoles = [];
var timer = new maximJs.maxiOsc(); 

var canvas;
var isShuffled = false;

var myFont, sequencerFont, noiseGenFont, highPassFont;

function preload() {
    myFont = loadFont('assets/digital-7.ttf');
//    sequencerFont = loadFont('assets/Orbitron-Regular.ttf');
//    noiseGenFont = loadFont('assets/Condiment-Regular.ttf');
//    highPassFont = loadFont('assets/')
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
    
    //why is keyboard setup last?
    //midiKeyboard = new Keyboard(margin, margin);
    
    oscilloscope = new Oscilloscope();
    //oscilloscope = new Oscilloscope(width - width / 3, height / 6);
    
    noiseGen = new Generator(margin, height / 2 + margin);
    
    sequencer = new Sequencer(width / 2 - margin, height / 2 + height / 15);
    //sequencer = new Sequencer(width / 2 - margin, height * 3 / 5);
    
    dial = new Dial(width / 2 + margin, height / 5 + margin, height / 12);
    
    controls = new Controls();
    
    sine = new Sine();
    square = new Square();
    saw = new Saw();
    triangle = new Triangle();
    
    isPreset1 = isPreset2 = isPreset3 = isPreset4 = false;
    
    onePoles = new Poles();
    sequencerPoles;
    
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
    
    midiKeyboard = new Keyboard(margin, margin);
}

function draw() {   
    background(135);
        
    // these trigger the one poles that trigger colours so should be in the draw loop
    controls.keyTyped();
    
    //this displays the colours triggered by the one poles 
    onePoles.display();   
    
    //black notes
    midiKeyboard.pressedFirst();
    
    //white notes
    midiKeyboard.pressed();
    
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
    
    var shuffled = shuffle([1, 2, 3, 4, 5]);
    if (!isShuffled) {
        console.log(shuffled);
        isShuffled = true;
    }
    
    
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
    }
}

function add(a, b) {
    return a + b;
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
    //controls.keyTyped();
}

//maybe if it's just the dipslay that takes the size arguments for drawing?
//but the position of certain objects on the screen, such as the dial's pointer, influence certain aspects of the program
function windowResized() {
    margin = height / 20;
    
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.parent('sketch-div');
    canvas.style('z-index', '-1');
    
    oscilloscope = new Oscilloscope();
    
    //noiseGen.div.remove();
    //noiseGen = new Generator(margin, height / 2 + margin);
    
    //resize noiseGen position
    noiseGen.xPos = margin;
    noiseGen.yPos = height / 2 + margin;
    
    //noiseGen dimensions
    noiseGen.width = width * 5 / 12;
    noiseGen.height = noiseGen.width / 2;
    
    //resize noiseGen slider
    noiseGen.slider.h = noiseGen.height * 2 / 13; 
    noiseGen.slider.w = noiseGen.slider.h / 2; 
    noiseGen.slider.x = noiseGen.xPos + noiseGen.width / 10;
    noiseGen.slider.y = noiseGen.yPos + noiseGen.height * 19 / 48;
    noiseGen.slider.lineWidth = noiseGen.width * 7 / 24;
    noiseGen.slider.sliderX = noiseGen.slider.x - noiseGen.slider.w / 2;
    noiseGen.slider.sliderY = noiseGen.slider.y - noiseGen.slider.h / 2;
    noiseGen.slider.sX = noiseGen.slider.x - noiseGen.slider.w / 2;
    noiseGen.smoothedX = this.x - this.w / 2; 
    
    //resize noiseGen dial
    noiseGen.dial.centreX = noiseGen.xPos + noiseGen.width * 79 / 320;
    noiseGen.dial.centreY = noiseGen.yPos + noiseGen.height - noiseGen.height / 4;
    noiseGen.dial.radius = noiseGen.height / 7;
        
    //sequencer = new Sequencer(width / 2 - margin, height / 2 + height / 15);
    sequencer.xPos = width / 2 - margin;
    sequencer.yPos = height / 2 + height / 15;
    
//    dial.div.remove();
//    dial = new Dial(width / 2 + margin, height / 5 + margin, height / 12);
    dial.centreX = width / 2 + margin;
    dial.centreY = height / 5 + margin;
    dial.radius = height / 12;
    
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