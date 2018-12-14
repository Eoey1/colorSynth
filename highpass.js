function Dial(x, y, size) {
    this.quadrants = [];
    this.isSelected = false;
    this.isActive = false;

    this.centreX = x;
    this.centreY = y;
    this.radius = size;

    this.x = -180;
    this.y = -180;
    
    this.angle = 0;
    this.level = 0;
    this.lc = 0;
    this.l = 0;

    for (var i = 0; i < 4; i++) {
        this.quadrants.push(false);
    }
    
    this.div = createDiv("High-pass");
    
    this.onePole = new maximEx.onePole();
    this.onePole.setTime(0.05, 60); //0.1 works nicely but might not even need to be that long!

    this.draw = function() {
        push();
        colorMode(HSB);
        
        //nice dark turquoise / teal
        fill(195, 75, 45);
        
        //light gray green
        //fill(195, 50, 50);
        
        //dark gray
        //fill(190, 15, 35);
        
        noStroke();
        //fill(210, 75, 45);
        rect(this.centreX - this.radius * 1.45, this.centreY - this.radius * 1.85, this.radius * 2.9, this.radius * 4.5);
        pop();
        
        if (mouseY > this.centreY - this.radius && mouseY < this.centreY + this.radius && mouseX > this.centreX - this.radius && mouseX < this.centreX + this.radius) {
            if (this.isSelected == true) {
                this.isActive = true;
            }
        } else {
            this.isActive = false;
        }
        
        fill(40);
        noStroke();
        ellipse(this.centreX, this.centreY, this.radius * 2, this.radius * 2);

        //this makes the dial start at 225 degrees
        this.angle = atan(this.y / this.x) + PI;
        this.calculatePosition();
        this.calculateQuadrant();
        this.calculateAngle();
        this.setRange();
        this.drawPointer();
        this.drawArc();

        //convert the CONSTRAINED angle to degrees
        this.a = degrees(this.c) % 360;

        //map the angle to the desired high pass level
        this.level = map(this.a, 225, -45, 10, 3000);
        
        //constrain it so it is unaffected by angle values that are lower than -45 or higher than 225
        this.lc = constrain(this.level, 0, 3000);
        
        //map this level to the level you want to use for the display
        this.l = map(this.lc, 0 , 3000, 0, 100);
        
        this.titleCSS();
        this.display();
    }

    this.pressed = function() {
        if (mouseX > this.centreX - this.radius && mouseX < this.centreX + this.radius && mouseY > this.centreY - this.radius && mouseY < this.centreY + this.radius) {
            this.isSelected = true;
            //console.log(this.isSelected);
        } else {
            this.isSelected = false;
            //console.log(this.isSelected);
        }
    }
    
    this.calculatePosition = function() {
        if (mouseIsPressed && this.isActive) {
            //if mouseX is greater than the center of the dial x will be a positive values
            this.x = -this.centreX + mouseX;
            
            //if mouse Y is greater than the center of the dial y will be a negative value
            this.y = this.centreY - mouseY;
        }
    }
    
    this.calculateQuadrant = function() {
        if (mouseIsPressed && this.isActive) {
            if (mouseX >= this.centreX && mouseX <= this.centreX + this.radius) {
                if (mouseY >= this.centreY - this.radius && mouseY <= this.centreY) {
                    this.quadrants[0] = true;
                }
            } else {
                this.quadrants[0] = false;
            }

            if (mouseX >= this.centreX - this.radius && mouseX < this.centreX) {
                if (mouseY >= this.centreY - this.radius && mouseY < this.centreY) {
                    this.quadrants[1] = true;
                }
            } else {
                this.quadrants[1] = false;
            }

            // Does deleting equals signs make it not jump? -- Not noticably...
            if (mouseX >= this.centreX - this.radius && mouseX < this.centreX) {
                if (mouseY > this.centreY && mouseY <= this.centreY + this.radius) {
                    this.quadrants[2] = true;
                }
            } else {
                this.quadrants[2] = false;
            }
            
            //uses less than or equal to
            //if (mouseX >= this.centreX - this.radius && mouseX <= this.centreX) {
            //    if (mouseY >= this.centreY && mouseY <= this.centreY + this.radius) {
            //        this.quadrants[2] = true;
            //    }
            //} else {
            //    this.quadrants[2] = false;
            //}

            if (mouseX >= this.centreX && mouseX <= this.centreX + this.radius) {
                if (mouseY >= this.centreY && mouseY <= this.centreY + this.radius) {
                    this.quadrants[3] = true;
                }
            } else {
                this.quadrants[3] = false;
            }
        }   
    }
    
    this.calculateAngle = function() {
        if (this.quadrants[0] == true) {
            this.angle = atan(this.y / this.x); 
        }
        if (this.quadrants[1] == true) {
            this.angle = atan(this.y / this.x) + PI;
        }  
        if (this.quadrants[2] == true) {
            this.angle = atan(this.y / this.x) + PI;    
        }
        if (this.quadrants[3] == true) {
            this.angle = atan(this.y / this.x);       
        }
    }
    
    this.setRange = function() {
        //sets the minminum and maximum for the dial
        this.v1 = atan(-180 / 180); //this returns -45 in degrees
        this.v2 = atan(-180 / - 180) + PI; //this returns 225 in degrees
        this.c = constrain(this.angle, this.v1, this.v2);    
        this.c = this.onePole.process(this.c);
    }
    
    this.drawPointer = function() {
        // code for the dial arrow's end point
        this.circleX = this.centreX + (this.radius - this.radius / 15) * cos(this.c);
        this.circleY = this.centreY - (this.radius - this.radius / 15) * sin(this.c); 

        //code for dial arrow's start point, i.e. point closest to circle center
        this.cX = this.centreX + (this.radius - this.radius / 4) * cos(this.c);
        this.cY = this.centreY - (this.radius - this.radius / 4) * sin(this.c);    
        
        //code for a sligthly longer arrow
        //this.cX = this.centreX + (this.radius - this.radius / 2) * cos(this.angle);
        //this.cY = this.centreY - (this.radius - this.radius / 2) * sin(this.angle);    
        
        //code for full length needle
        //this.cX = this.centreX + cos(this.angle);
        //this.cY = this.centreY + sin(this.angle);    

        push();
        stroke(240);
        strokeWeight(size / 10);
        strokeCap(ROUND);
        beginShape();
        //choose this if you want the dial hand to start at the center of the circle
        //vertex(this.centreX, this.centreY);
        vertex(this.cX, this.cY);
        vertex(this.circleX, this.circleY);
        endShape();
        pop();
    }
    
    this.drawArc = function() {
        push();
        colorMode(HSL);
        noFill();
        strokeWeight(this.radius / 15);

        //faint stroke that gets filled in as the dial level increases
        //stroke(200, 25, 75);
        //this arc illustrates the maximum and minimum points of the dial
        //arc(this.centreX, this.centreY, this.radius * 2.1, this.radius * 2.1, 3 * PI / 4, PI * 2 + PI / 4);
        
        strokeCap(ROUND);
        stroke(200, 100, 75);
        //stroke(200, 100, 100);
        arc(this.centreX, this.centreY, this.radius * 2.1, this.radius * 2.1, 3 * PI / 4 - 0.0000001, - this.c);
        pop();
    }
    
    this.display = function() {
        push();
            rectMode(CENTER);

            stroke(60);
            strokeWeight(3);

            //fill is full black since this is a display
            fill(0);
            this.displayWidth = this.radius * 3 / 2 * 0.85;
            this.displayHeight = this.radius * 1.25 * 0.85;

            //easier to make adjustments in CORNER MODE
            //rect(this.centreX, this.centreY + this.radius * 1.75, this.displayWidth, this.displayHeight);
        
            push();
                rectMode(CORNER);
                rect(this.centreX - this.displayWidth / 2, this.centreY + this.radius * 1.75 - this.displayHeight / 2 + this.displayHeight / 6, this.displayWidth, this.displayHeight - this.displayHeight / 4);
            pop();

            //fill is full white since this is a display
            fill(255);
            noStroke();
            textFont(myFont);
            textSize(this.displayHeight * 4 / 5);
        
            //have to subtract half the height of the box since it is in rectMode(CENTER)

            this.offset = this.displayWidth / 25;

            if (this.l.toFixed(0) < 10) {
                text(this.l.toFixed(0), this.centreX + this.displayWidth / 10 - this.offset, this.centreY + this.radius * 1.75 - this.displayHeight / 2  + this.displayHeight * 4 / 5);    
            } else if (this.l.toFixed(0) >= 10 && this.l.toFixed(0) < 20) {
                text(this.l.toFixed(0), this.centreX - this.displayWidth / 100 - this.offset, this.centreY + this.radius * 1.75 - this.displayHeight / 2  + this.displayHeight * 4 / 5);    
            } else if (this.l.toFixed(0) >= 20 && this.l.toFixed(0) < 100) {
                text(this.l.toFixed(0), this.centreX - this.displayWidth / 5 - this.displayWidth / 75 - this.offset, this.centreY + this.radius * 1.75 - this.displayHeight / 2  + this.displayHeight * 4 / 5);
            } else if (this.l.toFixed(0) >= 100) {
                text(this.l.toFixed(0), this.centreX - this.displayWidth / 3 + this.displayWidth / 75 - this.offset, this.centreY + this.radius * 1.75 - this.displayHeight / 2  + this.displayHeight * 4 / 5);
            }
        pop(); 
    }
    
    this.title = function() {
        noStroke();
        strokeWeight(2);
        //stroke("#74777c");
        fill("#cdd0d7");
        fill(245);
        //textFont('Fjalla One');
        textSize(this.radius * 2 / 5);
        textFont('Josefin Sans');
        //text("HIGH-PASS", this.centreX - this.radius * 1.25, this.centreY - this.radius - 40);
        //text("High-pass", this.centreX - this.radius, this.centreY - this.radius * 1.25);   
    }
    
    this.titleCSS = function() {
        var sizeOfText = this.radius * 2 / 5;
        
        this.div.style("font-size: " + str(sizeOfText));
        this.div.style("color: #f5f5f5");
        this.div.style("font-family: 'Comfortaa'");
        //this.div.style("font-family: 'Josefin Sans'");
        //this.div.style("font-weight: lighter");
        //this.div.style("letter-spacing: 2.25px");
        this.div.position(this.centreX - this.radius * 1.05, this.centreY - this.radius * 1.65);    
    }
    
    this.resize = function() {
        var margin = height / 20;
        
        this.centreX = width / 2 + margin;
        this.centreY = height / 5 + margin;
        this.radius = height / 12;   
    }
}    