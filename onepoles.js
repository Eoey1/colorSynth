function Poles() {
    this.onePoles = [];
    this.envelopes = [];
    this.attacks = [];
    this.releases = [];
    this.alphavalues = [];  
    
    for (var i = 0; i < keyboardLength; i++) {
        this.envelopes.push(new maximEx.env());
        this.onePoles.push(0);
        this.attacks.push(0.01);
        this.releases.push(0.4);
        this.alphavalues.push(0);
        this.envelopes[i].sampleRate = 60;  //we are working in the draw loop
    }
    
    this.display = function() {
        for (var i = 0; i < keyboardLength; i++) {
            this.onePoles[i] = this.envelopes[i].damp(this.attacks[i], this.releases[i]);
            this.alphavalues[i] = 255;
            this.alphavalues[i] *= this.onePoles[i]; 
        }
    }
}