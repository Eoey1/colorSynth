function Triangle(attack, decay, sustain, release) {
    this.waves = [];
    this.envelopes = [];
    this.amps = 0.4;
    
    this.attack = attack;
    this.decay = decay;
    this.sustain = sustain;
    this.release = release;
    
    for (var i = 0; i < 13; i++) {
        this.waves.push(0);
        this.envelopes.push(new maximJs.maxiEnv());
        this.envelopes[i].setAttack(this.attack);
        this.envelopes[i].setDecay(this.decay);
        this.envelopes[i].setSustain(this.sustain);
        this.envelopes[i].setRelease(this.release);
    }
    
    this.output = function() {
        if (octaveValue < 1) {
            for (var i = 0; i < notes[0].length; i++) {
                this.waves[i] = notes[0][i].waveform4() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue == 1) {
            for (var i = 0; i < notes[1].length; i++) {
                this.waves[i] = notes[1][i].waveform4() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        } else if (octaveValue > 1) {
            for (var i = 0; i < notes[2].length; i++) {
                this.waves[i] = notes[2][i].waveform4() * this.envelopes[i].adsr(this.amps, trigs[i]);    
            }
        }
    }
}