function Sine() {
    this.waves = [];
    this.envelopes = [];
    this.amps = 0.25;
    
    for (var i = 0; i < keyboardLength; i++) {
        this.waves.push(0);
        this.envelopes.push(new maximJs.maxiEnv());
        this.envelopes[i].setAttack(attack);
        this.envelopes[i].setDecay(decay);
        this.envelopes[i].setSustain(sustain);
        this.envelopes[i].setRelease(release);
    }
    
    this.output = function() {
        if (octaveValue < 1) {
            for (var i = 0; i < notesC3.length; i++) {
                this.waves[i] = notesC3[i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue == 1) {
            for (var i = 0; i < notesC4.length; i++) {
                this.waves[i] = notesC4[i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue > 1) {
            for (var i = 0; i < notesC5.length; i++) {
                this.waves[i] = notesC5[i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        }
    }
}