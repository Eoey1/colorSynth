function Poles() {
    this.poles = [];
    this.envelopes = [];
    this.attacks = [];
    this.releases = [];
    this.alphavalues = [];  
    
    for (var i = 0; i < 13; i++) {
        this.envelopes.push(new maximEx.env());
        this.poles.push(0);
        this.attacks.push(0.01);
        this.releases.push(0.4);
        this.alphavalues.push(0);
        this.envelopes[i].sampleRate = 60;  //we are working in the draw loop
    }
    
    this.display = function() {
        for (var i = 0; i < 13; i++) {
            this.poles[i] = this.envelopes[i].damp(this.attacks[i], this.releases[i]);
            this.alphavalues[i] = 255;
            this.alphavalues[i] *= this.poles[i]; 
        }
    }
}