function Note(midiNote) {   
    this.waveforms = [];
    var conv = new maximJs.convert();
    
    this.freq = conv.mtof(midiNote);
    
    for (var i = 0; i < 4; i++) {
        this.waveforms.push(new maximJs.maxiOsc());
    }
    
    this.waveform1 = function() {
        this.output = this.waveforms[0].sinewave(this.freq);
        return this.output;
    }
    this.waveform2 = function() {
        this.output = this.waveforms[1].square(this.freq);
        return this.output;
    }
    this.waveform3 = function() {
        this.output = this.waveforms[2].saw(this.freq);
        return this.output;
    }
    this.waveform4 = function() {
        this.output = this.waveforms[3].triangle(this.freq);
        return this.output;
    }
}