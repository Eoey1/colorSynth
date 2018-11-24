function Colours() {
    this.onePoles = [];
    this.poleEnvelopes = [];
    this.poleAttacks = [];
    this.poleReleases = [];
    this.alphaValues = [];  
    
    for (var i = 0; i < keyboardLength; i++) {
        this.poleEnvelopes.push(new maximEx.env());
        this.onePoles.push(0);
        this.poleAttacks.push(0.01);
        this.poleReleases.push(0.4);
        this.alphaValues.push(0);
        this.poleEnvelopes[i].sampleRate = 60;  // Are we working in the draw loop??
    }
    
    this.display = function() {
        for (var i = 0; i < keyboardLength; i++) {
            this.onePoles[i] = this.poleEnvelopes[i].damp(this.poleAttacks[i], this.poleReleases[i]);
            this.alphaValues[i] = 255;
            this.alphaValues[i] *= this.onePoles[i]; 
        }
    }
}