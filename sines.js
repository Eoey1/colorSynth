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
            for (var i = 0; i < notes[0].length; i++) {
                this.waves[i] = notes[0][i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue == 1) {
            for (var i = 0; i < notes[1].length; i++) {
                this.waves[i] = notes[1][i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue > 1) {
            for (var i = 0; i < notes[2].length; i++) {
                this.waves[i] = notes[2][i].waveform1() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        }
    }
}