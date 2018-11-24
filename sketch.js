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
var colours;

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
    
//    pixelDensity(3.0);
    
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
//    sequencer = new Sequencer(width / 2 - margin, height * 3 / 5);
    
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
    
    colours = new Colours();
    
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
    colours.display();    
    
    
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
    
    //updateLabels(dial.t.toFixed(0));
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
    midiKeyboard.midiPressed();
    midiKeyboard.midiPressedFirst();
    
    sequencer.timer();
    //sequencer.sequence1();
    
    //midiKeyboard.pressed();
    //midiKeyboard.amplitude();
    
    noiseGen.amplitude();
    noiseGen.slider.pressed();
    noiseGen.dial.noiseColours();
        
    //dryMix = 0.5;
    
    var sig1 = sine.waves.reduce(add, 0);
    var sig2 = saw.waves.reduce(add, 0);
    var sig3 = square.waves.reduce(add, 0);
    var sig4 = triangle.waves.reduce(add, 0);
    
    if (noiseGen.dial.white) {
        var sig5 = noiseGen.white();
    } else if (noiseGen.dial.pink) {
        var sig5 = noiseGen.pink();
    } else if (noiseGen.dial.brown) {
        var sig5 = noiseGen.brown();
    }
    
    // need to adjust levels separately so naturally louder waveforms start at the same level as naturally quieter waveforms
    var synthOutput = sig1 + sig2 + sig3 + sig4 * 0.5;
//    var synthOutput = sig1 + sig2 * 0.5 + (sig3 * 0.000005) + sig4 * 0.8;
    //var noiseOutput = sig5 * 0.1 + sig6 * 0.1 + sig7 * 0.1;
    var noiseOutput = sig5 * 0.25;
//    var noiseOutput = sig5 * 0.1;
    var fx = delay.dl(synthOutput, 44100 * time, regen);
    var mix = (fx * (1.0 - dryMix) + (synthOutput * dryMix));
    var filteredOutput = myFilter.highpass(mix, dial.lc);
    var modularOut = filteredOutput + noiseOutput * 0.5 + sequencer.metronome * 0.2;
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

function updateLabels(x) {
    var xLabel = document.getElementById('x-label');
    xLabel.innerHTML = x;

//    var yLabel = document.getElementById('y-label');
//    yLabel.innerHTML = 'Y: ' + y;
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

function mouseDragged() {
//    for (f in midiKeyboard.faders) {
//        if (midiKeyboard.faders[f].isInside(mouseX, mouseY)) {
//            midiKeyboard.faders[f].slide(mouseY);
//            break;
//        }
//    }
    
//    for (var i = 0; i < 4; i++) {
//        if(midiKeyboard.faders[i].isInside(mouseX - midiKeyboard.faderX / 2 - i * midiKeyboard.space / 2, mouseY - midiKeyboard.faderY / 2)) {
//            midiKeyboard.faders[i].slide(mouseY - midiKeyboard.faderY / 2);
//        }
//        
//    }  
    
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