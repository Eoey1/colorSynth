function CircleDial(x, y, size) {
    this.quadrants = [];
    this.isSelected = false;
    this.isActive = false;

    this.centreX = x;
    this.centreY = y;
    this.radius = size;

    this.x = 0;
    this.y = 180;
    this.angle = 0;
    this.level = 0;
    
    this.white = true;
    this.pink = false;
    this.brown = false;
    
    this.dialPos = [];
    
    for (var i = 0; i < 3; i++) {
        this.dialPos.push(false);
    }

    for (var i = 0; i < 4; i++) {
        this.quadrants.push(false);
    }

    this.draw = function() {    
        push();
        
        this.a1 = atan(180 / 0);
        this.a2 = PI / 8;
        this.a3 = atan(-180 / 180);
        
        this.as = [this.a1, this.a2, this.a3];
        
        this.x1 = this.centreX + (this.radius + this.radius / 20) * cos(this.a1);
        this.y1 = this.centreY - (this.radius + this.radius / 20) * sin(this.a1); 

        this.x2 = this.centreX + (this.radius + this.radius / 5) * cos(this.a1);
        this.y2 = this.centreY - (this.radius + this.radius / 5) * sin(this.a1);
        
        this.x3 = this.centreX + (this.radius + this.radius / 3) * cos(this.a1);
        this.y3 = this.centreY - (this.radius + this.radius / 3) * sin(this.a1);
        
        this.x4 = this.centreX + (this.radius + this.radius / 3) * cos(this.a2);
        this.y4 = this.centreY - (this.radius + this.radius / 3) * sin(this.a2);
        
        this.x5 = this.centreX + (this.radius + this.radius / 3) * cos(this.a3);
        this.y5 = this.centreY - (this.radius + this.radius / 3) * sin(this.a3);
        
        noStroke();
        fill(240);
        textSize(this.radius / 3);
        textFont('Comfortaa');
        //textFont('Fira Sans');
        //textFont('Raleway');
        text("white", this.x3 - this.radius / 3, this.y3);
        text("pink", this.x4, this.y4 + 5);
        text("brown", this.x5, this.y5 + 5);
        
        for (var i = 0; i < 3; i++) {
            this.x1 = this.centreX + (this.radius + this.radius / 15) * cos(this.as[i]);
            this.y1 = this.centreY - (this.radius + this.radius / 15) * sin(this.as[i]); 

            this.x2 = this.centreX + (this.radius + this.radius / 5) * cos(this.as[i]);
            this.y2 = this.centreY - (this.radius + this.radius / 5) * sin(this.as[i]); 
            
            noFill();
            stroke(255);
            strokeCap(SQUARE);
            //strokeCap(ROUND);
            strokeWeight(this.radius / 20);
            beginShape();
            vertex(this.x1, this.y1);
            vertex(this.x2, this.y2);
            endShape(CLOSE);
        }
        
        pop();
        
        if (mouseY > this.centreY - this.radius && mouseY < this.centreY + this.radius && mouseX > this.centreX - this.radius && mouseX < this.centreX + this.radius) {
            if (this.isSelected == true) {
                this.isActive = true;
            }
        } else {
            this.isActive = false;
        }
        
        fill(20);
        noStroke();
        ellipse(this.centreX, this.centreY, this.radius * 2, this.radius * 2);

        if (mouseIsPressed && this.isActive) {
            this.x = -this.centreX + mouseX;
            this.y = this.centreY - mouseY;
        }
        
        this.angle = atan(this.y / this.x);
        
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

            // Does deleting equals signs make it not jump?
            if (mouseX >= this.centreX - this.radius && mouseX < this.centreX) {
                if (mouseY > this.centreY && mouseY <= this.centreY + this.radius) {
                    this.quadrants[2] = true;
                }
            } else {
                this.quadrants[2] = false;
            }

            if (mouseX >= this.centreX && mouseX <= this.centreX + this.radius) {
                if (mouseY >= this.centreY && mouseY <= this.centreY + this.radius) {
                    this.quadrants[3] = true;
                }
            } else {
                this.quadrants[3] = false;
            }
        }
    
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
            //this.angle = atan(this.y / this.x) + PI * 2;    
        }
        
        // magnet code
        if (this.dialPos[0]) {
            this.angle = atan(180 / 0);    
        } else if(this.dialPos[1]) {
            this.angle = PI / 8;
        } else if(this.dialPos[2]) {
            this.angle = atan(-180 / 180);
        }    
        
        // code for pointer
        this.v1 = atan(-180 / 180);
        this.v2 = atan(180 / 0);
        this.c = constrain(this.angle, this.v1, this.v2);
        
        this.circleX = this.centreX + this.radius * cos(this.c);
        this.circleY = this.centreY - this.radius * sin(this.c); 

        this.cX = this.centreX + (this.radius - this.radius / 3) * cos(this.c);
        this.cY = this.centreY - (this.radius - this.radius / 3) * sin(this.c);    
        
        push();
        noStroke();
        fill(245);
        ellipse(this.cX, this.cY, this.radius / 3);
        pop();
    }

    this.pressed = function() {
        if (mouseX > this.centreX - this.radius && mouseX < this.centreX + this.radius && mouseY > this.centreY - this.radius && mouseY < this.centreY + this.radius) {            
            this.dialPos[0] = false;
            this.dialPos[1] = false;
            this.dialPos[2] = false;
            
            this.isSelected = true;
            //console.log(this.isSelected);
        } else {
            this.isSelected = false;
            //console.log(this.isSelected);
        }
    }
    
    this.released = function() {
        if (this.c > PI / 4) {
            this.dialPos[0] = true;
            this.dialPos[1] = false;
            this.dialPos[2] = false;   
        } else if (this.c <= PI / 4 && this.c > 0) {
            this.dialPos[0] = false;
            this.dialPos[1] = true;
            this.dialPos[2] = false;
        } else if (this.c <= 0) {
            this.dialPos[0] = false;
            this.dialPos[1] = false;
            this.dialPos[2] = true;
        }
    }
    
    this.noiseColours = function() {
        if (this.c > radians(80)) {
            this.white = true;
            this.pink = false;
            this.brown = false;
        }

        if (this.c < radians(27.5) && this.c > radians(17.5)) {
            this.white = false;
            this.pink = true;
            this.brown = false;    
        }

        if (this.c < radians(-40)) {
            this.white = false;
            this.pink = false;
            this.brown = true;    
        } 
    }
}