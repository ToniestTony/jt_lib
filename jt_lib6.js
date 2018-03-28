function JT(canvas_id,w,h,fps,setupName,updateName,objName){
    //constructor
    //initialize the canvas
    this.init=function(canvas_id,w,h,fps,names){
        //add attributes to the canvas object of JT
        this.canvas.id=canvas_id;
        this.canvas.src = this.html.id(canvas_id);
        this.canvas.ctx = this.canvas.src.getContext("2d");

        //resize the canvas
        this.canvas.resize(w,h);
        
        if(objName!=undefined){this.loop.obj=objName}
        if(updateName!=undefined){this.loop.updateName=updateName;this.loop.setupName=setupName}
        else if(setupName!=undefined){this.loop.updateName=setupName}
        
        if(fps==undefined){
            fps=60;
        }

        this.loop.preload(this,fps);

        this.createEventListeners(this);

    }
    
    //canvas
    this.canvas={
        src:null,
        id:null,
        ctx:null,
        w:undefined,
        h:undefined,
        //Resize the canvas
        resize:function(w,h){
            if(w==undefined){
                w=800;
                h=600;
            }
            //Resize the actual HTML canvas
            this.src.width=w;
            this.src.height=h;

            //Keep the width and height in attributes
            this.w=w;
            this.h=h;
        },
        smoothing:function(bool){
            this.ctx.imageSmoothingEnabled=bool;
        }
    },
    
    
    this.loop={
        setupName:"setup",
        updateName:"update",
        obj:undefined,

        frames:0,
        fps:60,
        sec:0,
        interval:undefined,

        pause:false,
        stop:false,

        loaded:false,
        setupDone:false,
        loadCounter:0,
        loadCounterMax:0,

        shakeObj:undefined,
        normalX:undefined,
        normalY:undefined,

        context:undefined,

        alarms:{},

        //Calls the preload function
        preload: function(context,fps){
            this.context=context;
            this.fps=fps;
            this.startLoop();
        },
        //Calls the setup function
        setup: function(){
            //add ctx to draw
            this.context.canvas.ctx.textBaseline="hanging";
            
            this.context.draw.canvas=this.context.canvas;
            this.context.draw.ctx=this.context.canvas.ctx;
            this.context.draw.cam.w=this.context.canvas.w;
            this.context.draw.cam.h=this.context.canvas.h;
            
            this.context.assets.loop=this;
            this.context.assets.col=this.context.collision;
            
            this.context.canvas.smoothing(false)
            if(this.obj!=undefined){
                window[this.obj][this.setupName]();
            }else{
                window[this.setupName]();
            }
            this.setupDone=true;

        },
        //start the main loop
        startLoop: function(){
            context=this;
            this.interval=self.setInterval(function(){context.mainLoop()},1000/this.fps,context)
        },
        mainLoop:function(){
            
            //if jt.stop==true, remove the setInterval
            if(this.stop){
                window.clearInterval(this.interval);
                this.stop=false;
            }
            //main loop
            //if jt.pause==true, pause the function calling

            if(this.loaded==false){

                this.loadCounter=0;
                this.loadCounterMax=0;
                var load=true;
                    for(var soun in this.context.assets.sounds){
                        this.loadCounterMax++;

                        if(this.context.assets.sounds.hasOwnProperty(soun)){
                            var sound=this.context.assets.sounds[soun]

                            if(sound!=undefined){
                                if(sound.duration==0){
                                    load=false;

                                }else{
                                    this.loadCounter++;
                                }
                            }
                        }
                    }

              for (var im in this.context.assets.images) {
                  this.loadCounterMax++;

                        if (this.context.assets.images.hasOwnProperty(im)) {
                            var img=this.context.assets.images[im].img;

                            if(img!=undefined){
                                if(img.width==0){
                                    load=false;

                                }else{
                                    this.loadCounter++;
                                }
                            }

                        }
                    }

                for (var ani in this.context.assets.anims) {
                  this.loadCounterMax++;

                        if (this.context.assets.anims.hasOwnProperty(ani)) {
                            var anim=this.context.assets.anims[ani].img;

                            if(anim!=undefined){
                                if(anim.width==0){
                                    load=false;

                                }else{
                                    this.context.assets.anims[ani].frameW=anim.width/this.context.assets.anims[ani].frames
                                    this.loadCounter++;
                                }
                            }

                        }
                    }

                console.log("loop.mainLoop","Load progress: "+this.loadCounter+" / "+this.loadCounterMax)
                if(load){this.loaded=true;}

            }else
            if(!this.pause){

                if(!this.setupDone){
                    this.setup();
                }
                
                if(this.obj!=undefined){
                  window[this.obj][this.updateName]();
                }else{
                  window[this.updateName]();
                }
                
                //remove key presses
                for(var keyCount=0;keyCount<this.context.keyboard.keysdown.length;keyCount++){
                    if(this.context.keyboard.keysdown[keyCount].press==true){
                        this.context.keyboard.keysdown[keyCount].press=false;
                    }
                }

                this.updateAnims();
                this.updateAlarms();
                
                //cam
                if(this.context.draw.cam.w<=0.01){
                    this.context.draw.cam.w=0.01;
                }
                
                if(this.context.draw.cam.h<=0.01){
                    this.context.draw.cam.h=0.01;
                }

                //shake
                if(this.shakeObj!=undefined){
                    this.shaking();

                }


                //frames++
                if(this.frames<this.fps-1){
                    this.frames++;
                }else{
                    this.frames=0;
                    this.sec++;
                }
            }
        },
        updateAnims:function(){
             for(var ani in this.context.assets.anims) {
                 var anim=this.context.assets.anims[ani];

                 if(!anim.pause){
                     anim.distance+=anim.speed;

                    anim.frame=Math.floor(anim.distance);

                    if(anim.frame>=anim.frames){
                        anim.frame=0;
                        anim.distance=0;
                    }
                }
            } 
        },
        updateAlarms:function(){
            for(var ala in this.alarms){
                var alarm=this.alarms[ala];
                if(alarm!=undefined && !alarm.pause){
                    alarm.time--;
                    if(alarm.time<=0){
                        alarm.pause=true;
                    }
                }
            }
        },
        addAlarm:function(name,time){
            if(this.alarms[name]!=undefined){
                this.alarms[name]=undefined;
            }
            this.alarms[name]={};
            this.alarms[name].time=time;
            this.alarms[name].pause=false;
        },
        checkAlarm:function(name){
            if(this.alarms[name]!=undefined && this.alarms[name].time<=0){
                this.alarms[name]=undefined;
                return true;
            }else{
                return false;
            }
        },
        shake:function(force,duration,reduce){
            if(this.normalX==undefined){
                this.normalX=this.context.draw.cam.x;
                this.normalY=this.context.draw.cam.y;
            }
            if(this.shakeObj==undefined){
                this.shakeObj={};
                this.shakeObj.force=force;
                this.shakeObj.duration=duration;
                this.shakeObj.reduce=reduce;

            }else{
                this.shakeObj.force+=force;
                this.shakeObj.duration+=duration;
                this.shakeObj.reduce=reduce;
            }
            this.shakeObj.lastX=0;
            this.shakeObj.lastY=0;
        },

        shaking:function(){
            if(this.shakeObj.lastX==0){
                this.context.draw.cam.x+=this.context.math.random(-this.shakeObj.force,this.shakeObj.force)
            }else if(Math.sign(this.shakeObj.lastX)==1){
                this.context.draw.cam.x+=this.context.math.random(-this.shakeObj.force,0)
            }else if(Math.sign(this.shakeObj.lastX)==-1){
                this.context.draw.cam.x+=this.context.math.random(0,this.shakeObj.force)
            }
            this.shakeObj.lastX=this.context.draw.cam.x;


            if(this.shakeObj.lastY==0){
                this.context.draw.cam.y+=this.context.math.random(-this.shakeObj.force,this.shakeObj.force)
            }else if(Math.sign(this.shakeObj.lastY)==1){
                this.context.draw.cam.y+=this.context.math.random(-this.shakeObj.force,0)
            }else if(Math.sign(this.shakeObj.lastY)==-1){
                this.context.draw.cam.y+=this.context.math.random(0,this.shakeObj.force)
            }
            this.shakeObj.lastY=this.context.draw.cam.y;

            if(this.shakeObj.duration>0){
                this.shakeObj.duration--;
                if(this.shakeObj.reduce!=undefined && this.shakeObj.reduce>0){
                    if(this.shakeObj.force>0){
                        this.shakeObj.force-=this.shakeObj.reduce;
                    }
                }
            }else{
                this.context.draw.cam.x=this.normalX;
                this.context.draw.cam.y=this.normalY;
                this.normalX=undefined;
                this.normalY=undefined;
                this.shakeObj=undefined;
            }
        }
    }
    
    
    
    this.assets={
        //images:
        images:{},
        //anims
        anims:{},
        //sounds
        sounds:{},
        
        //loop
        loop:undefined,
        
        col:undefined,


        //image constructor
        image:function(src,name,x,y,visible){
            this.loop.loaded=false;
            if(name==undefined){
                name=src;
            }
            this.images[name]={};
            this.images[name].img=new Image();
            this.images[name].img.src=src;
            this.images[name].x=0;
            this.images[name].y=0;

            if(x!=undefined){this.images[name].x=x}
            if(y!=undefined){this.images[name].y=y}

            if(visible!=undefined){
                this.images[name].visible=visible;
            }
            return this.images[name];
        },
        //create a sound
        sound:function(src,name,repeat){
            this.loop.loaded=false;
            if(name==undefined){
                name=src;
            }
            this.sounds[name]=new Audio();
            this.sounds[name].src=src;
            if(repeat!=undefined){
                if(repeat==true){
                    this.sounds[name].addEventListener('ended', function() {
                        this.currentTime = 0;
                        this.play();
                    }, false);
                }
            }
            return this.sounds[name];
        },
        //anim constructor
        anim:function(src,name,frames,speed,x,y,visible){
            this.loop.loaded=false;
            if(name==undefined){
                name=src;
            }
            this.anims[name]={};
            this.anims[name].img=new Image();
            this.anims[name].img.src=src;
            this.anims[name].x=0;
            this.anims[name].y=0;

            if(x!=undefined){this.anims[name].x=x}
            if(y!=undefined){this.anims[name].y=y}

            if(visible!=undefined){
                this.anims[name].visible=visible;
            }

            this.anims[name].frame=0;
            this.anims[name].distance=0;
            this.anims[name].frames=0;
            this.anims[name].frameW=0;
            this.anims[name].speed=0;
            this.anims[name].pause=false;

            if(frames!=undefined){this.anims[name].frames=frames}
            if(speed!=undefined){this.anims[name].speed=speed/this.loop.fps}


            return this.anims[name];
        },
        //play a sound
        play:function(name){
            this.sounds[name].play();  
        },
        //pause a sound
        pause:function(name){
            this.sounds[name].pause();  
        },
        //stop a sound (reset it to 0)
        stop:function(name){
            this.sounds[name].pause();
            this.sounds[name].currentTime=0;
        },
        //collision
        collision:function(name1,name2){
            var obj1=undefined;
            //getting obj1 asset
            if(this.images[name1]!=undefined || this.anims[name1]!=undefined){
                obj1={};
                var asset=undefined;
                if(this.anims[name1]==undefined){
                    asset=this.images[name1];
                    obj1.w=asset.img.width;
                    obj1.h=asset.img.height;
                }else{
                    asset=this.anims[name1];
                    obj1.w=asset.w;
                    obj1.h=asset.h;
                }
                obj1.x=asset.x;
                obj1.y=asset.y
            }

            var obj2=undefined;
            //getting obj2 asset
            if(this.images[name2]!=undefined || this.anims[name2]!=undefined){
                obj2={};
                var asset=undefined;
                if(this.anims[name2]==undefined){
                    asset=this.images[name2];
                    obj2.w=asset.img.width;
                    obj2.h=asset.img.height;
                }else{
                    asset=this.anims[name2];
                    obj2.w=asset.w;
                    obj2.h=asset.h;
                }
                obj2.x=asset.x;
                obj2.y=asset.y
            }

            var col=false;

            if(obj1!=undefined && obj2!=undefined){
                col=this.col.rect(obj1,obj2);
            }

            return col;
        }
    }
    this.assets.loop=this.loop;
    this.assets.col=this.collision;
    
    
    //***** DRAW *****//
    this.draw={
        //virtual camera
        cam:{
            x:0,
            y:0,
            w:undefined,
            h:undefined
        },

        //gradients
        gradients:{},

        //font
        fontName:"Arial",
        fontSize:18,
        
        //ctx
        canvas:undefined,
        ctx:undefined,
        
        assets:undefined,

        //public functions

        //Drawing a background
        bg: function(color) {
            this.ctx.fillStyle = this.color(color);
            this.ctx.fillRect(0,0,this.canvas.w,this.canvas.h);
        },

        //Drawing rectangle
        rect: function(x,y,w,h,color,rotation) {
            this.ctx.fillStyle = this.color(color);
            this.fill("rect",x,y,w,h,rotation);
        },

        //Drawing circle
        circle: function(x,y,radius,color) {
            this.ctx.beginPath();
            this.fill("arc",x,y,radius);
            this.ctx.fillStyle = this.color(color);
            this.ctx.fill();
        },

        //Drawing line
        line: function(x1,y1,x2,y2,width,color,rotation) {
            this.ctx.strokeStyle = this.color(color);
            this.ctx.lineWidth=1;
            if(width!=undefined){
                this.ctx.lineWidth=width;
            }
            this.ctx.beginPath();
            this.fill("line",x1,y1,x2,y2,rotation)
            this.ctx.stroke();
        },

        //Drawing text
        text:function(string,x,y,color,textAlign,fontSize,rotation){
            if(textAlign!=undefined){
                this.ctx.textAlign=textAlign
            }
            if(fontSize!=undefined){
                this.fontSize=fontSize
            }
            this.ctx.fillStyle= this.color(color);
            this.ctx.font=this.fontSize+"px "+this.fontName;
            this.fill("text",x,y,this.ctx.measureText(string).width,this.fontSize,rotation,string)
        },

        //Setting the font
        font:function(fontName,size){
            this.fontName=fontName;
            this.fontSize=size;
            this.ctx.font=this.fontSize+"px "+this.fontName;
        },

        //Draw an image
        image:function(name,newX,newY,w,h,sX,sY,sW,sH,rotate){

            var image=this.assets.images[name];

            if(this.assets.images[name]!=undefined){
                if(image.visible==false){
                    //invisible   
                }else{
                    //visible


                    if(newX!=undefined){
                        image.x=newX;
                    }
                    if(newY!=undefined){
                        image.y=newY;
                    }

                    if(w!=undefined && h!=undefined){
                        image.img.width=w;
                        image.img.height=h;
                    }

                    var tempW=image.img.width;
                    var tempH=image.img.height;

                    var camW=Math.abs(this.canvas.src.width/this.cam.w)
                    var camH=Math.abs(this.canvas.src.height/this.cam.h)
                    var camX=this.cam.x;
                    var camY=this.cam.y;

                    var x=image.x;
                    var y=image.y;

                    this.ctx.save();
                    //(x*camW)-(camX*camW),(y*camH)-(camY*camH)

                    if(rotate!=undefined){
                        this.ctx.translate(((tempW/2)*camW-camX*camW)+x*camW,((tempH/2)*camH-camY*camH)+y*camH);
                        this.ctx.rotate(rotate*Math.PI/180);
                        this.ctx.translate(((-tempW/2)*camW+camX*camW)-x*camW,((-tempH/2)*camH+camY*camH)-y*camH);
                    }

                    if(sX!=undefined){
                        //this.ctx.drawImage(image.img,sX,sY,sW,sH,camW-camX,camH-camY,tempW*camW,tempH*camH);
                        this.ctx.drawImage(image.img,sX,sY,sW,sH,(x*camW)-(camX*camW),(y*camH)-(camY*camH),tempW*camW,tempH*camH);
                    }else{
                        //this.ctx.drawImage(image.img,camW-camX,camH-camY,tempW*camW,tempH*camH);
                        this.ctx.drawImage(image.img,(x*camW)-(camX*camW),(y*camH)-(camY*camH),tempW*camW,tempH*camH);
                    }
                    this.ctx.restore();
                }
            }
          },

        //Draw an animation
        anim:function(name,newX,newY,w,h,rotate){

            var anim=this.assets.anims[name];

            if(this.assets.anims[name]!=undefined){
                if(anim.visible==false){
                    //invisible   
                }else{
                    //visible
                    if(newX!=undefined){
                        anim.x=newX;
                    }
                    if(newY!=undefined){
                        anim.y=newY;
                    }

                    anim.w=anim.frameW;
                    anim.h=anim.img.height;

                    if(w!=undefined && h!=undefined){
                        anim.w=w;
                        anim.h=h;
                    }

                    var tempW=anim.w;
                    var tempH=anim.h;

                    //vcam
                    var camW=this.canvas.src.width/this.cam.w
                    var camH=this.canvas.src.height/this.cam.h
                    var camX=this.cam.x;
                    var camY=this.cam.y;

                    var x=anim.x;
                    var y=anim.y;

                    this.ctx.save();

                    if(rotate!=undefined){
                        this.ctx.translate(((tempW/2)*camW-camX*camW)+x*camW,((tempH/2)*camH-camY*camH)+y*camH);
                        this.ctx.rotate(rotate*Math.PI/180);
                        this.ctx.translate(((-tempW/2)*camW+camX*camW)-x*camW,((-tempH/2)*camH+camY*camH)-y*camH);
                    }

                    this.ctx.drawImage(anim.img,anim.frame*anim.frameW,0,anim.frameW,anim.img.height,(x*camW)-(camX*camW),(y*camH)-(camY*camH),tempW*camW,tempH*camH);

                    this.ctx.restore();
                }
            }else{
                console.log("No animation found")
            }


          },

        //Gradients

        //linear gradient
        linear:function(name,x1,y1,x2,y2,stops){
            this.gradients[name]=this.ctx.createLinearGradient(x1,y1,x2,y2)

            for(var i=0;i<stops.length;i++){
                this.gradients[name].addColorStop(i/(stops.length-1),stops[i]);
            }

            return this.gradients[name];
        },

        //radial gradient
        radial:function(name,x1,y1,r1,x2,y2,r2,stops){
            this.gradients[name]=this.ctx.createRadialGradient(x1,y1,r1,x2,y2,r2)

            for(var i=0;i<stops.length;i++){
                this.gradients[name].addColorStop(i/(stops.length-1),stops[i]);
            }

            return this.gradients[name];
        },


        //private functions

        //Changes the color
        color: function(col) {
            var converted=col;
            if(col!=undefined){
                if(col.gradient!=undefined){
                    var gradient=undefined
                    if(col.gradient=="linear"){
                        gradient=this.ctx.createLinearGradient(col.x,col.y,col.w,col.h);
                    }else if(col.gradient=="radiant"){
                        console.log('rr')
                        gradient=this.ctx.createRadialGradient(col.x,col.y,col.w,col.h);
                    }
                }else
                if(Array.isArray(col)){
                    //rgb
                    if(col.length==3){
                        converted="rgb("+col[0]+","+col[1]+","+col[2]+")";
                    }else if(col.length==4){
                        converted="rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")";
                    }
                }
            }
            return converted;
        },

        //Drawing
        fill:function(type,x,y,w,h,rotation,string){
            var camW=Math.abs(this.canvas.src.width/this.cam.w)
            var camH=Math.abs(this.canvas.src.height/this.cam.h)
            var camX=this.cam.x;
            var camY=this.cam.y;
            this.ctx.save();
            if(rotation!=undefined){
                this.ctx.translate(((w/2)*camW-camX*camW)+x*camW,((h/2)*camH-camY*camH)+y*camH);
                this.ctx.rotate(rotation*Math.PI/180);
                this.ctx.translate(((-w/2)*camW+camX*camW)-x*camW,((-h/2)*camH+camY*camH)-y*camH);
            }
            switch(type){
                case "rect":
                    this.ctx.fillRect((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*camW,h*camH);
                    break;
                case "arc":
                    this.ctx.arc((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*camW,0,2*Math.PI);
                    break;
                case "text":
                    this.ctx.fillText(string,(x*camW)-(camX*camW),(y*camH)-(camY*camH))
                    break;
                case "line":
                    this.ctx.moveTo((x*camW)-(camX*camW),(y*camH)-(camY*camH));
                    this.ctx.lineTo((w*camW)-(camX*camW),(h*camH)-(camY*camH));
                    break;
            }
            this.ctx.restore();

        }
    }
    
    this.draw.assets=this.assets;
    
    
    
    
    
    
    
    
    this.html={
        id:function(id){
            return document.getElementById(id);
        },
        class:function(className){
            return document.getElementsByClassName(className);
        }
    }


    this.math= {
        random: function(min,max) {return Math.floor(Math.random()*(max-min+1)+min);},
        between: function(num,min,max) {return num>=min && num<=max;},
        stay: function(num,min,max) {if(num<min){num=min}if(num>max){num=max}return num},
        wrap: function(num,min,max) {if(num<min){num=max}if(num>max){num=min}return num},
        choose: function(min,max) {
            var ran=jt.math.random(0,1);
            if(ran==0){
                return min;
            }else{
                return max;
            }
        },

        dist: function(obj1,obj2) {return Math.sqrt(Math.pow(obj1.x-obj2.x,2) + Math.pow(obj1.y-obj2.y,2))},
        dist_point: function(x1,y1,x2,y2) {return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))},

        //Get an angle from 2 points, 0 degrees is at right and goes clockwise
        anglePoint:function(x1,y1,x2,y2){
            var deltaX=x2-x1;
            var deltaY=y1-y2;
            var theta=(Math.atan2(deltaY,deltaX))*180/Math.PI
            if(theta<0){
                theta=360+theta;
            }
            return theta;
        },

        //Get the horizontal ratio of an angle
        cos:function(angle){
            return Math.cos(angle*Math.PI/180)
        },

        //Get the vertical ratio of an angle
        sin:function(angle){
            return Math.sin(angle*Math.PI/180)
        },

        //Get the angle from a direction
        angleDir:function(x,y){
            var angle=Math.atan2(x,y)
            var degrees=180*angle/Math.PI
            return degrees;
        },

        matrix: function(w,h,value){
            var mat=new Array(h);
            for(var i=0;i<mat.length;i++){
                mat[i]=new Array(w);
                for(var j=0;j<mat[i].length;j++){
                    mat[i][j]=value;
                }
            }
            return mat;
        },


    },

    this.collision={
         //between 2 objects with their x,y,width and height
        rect: function(rect1,rect2) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            if (rect1.x < rect2.x + rect2.w &&
                rect1.x + rect1.w > rect2.x &&
                rect1.y < rect2.y + rect2.h &&
                rect1.h + rect1.y > rect2.y) {
                return true;
            }
        },
    }
    
    
    
    //***** KEYBOARD *****//
    this.keyboard={
        keysdown:[],
        check: function(keyCode) {
            var found = false;
            for(var i=0; i<this.keysdown.length; i++) {
                if(this.keysdown[i].key == keyCode) {
                    found=true;
                }
            }
            return found;
        },
        
        press: function(keyCode) {
            var found = false;
            for(var i=0; i<this.keysdown.length; i++) {
                if(this.keysdown[i].key == keyCode && this.keysdown[i].press==true) {
                    found=true;
                }
            }
            return found;
        },

        release: function(keyCode) {
            var found = undefined;
            for(var i=0; i<this.keysdown.length; i++) {
                if(this.keysdown[i].key == keyCode) {found=i;}
            }
            if(found!=undefined){
                this.keysdown.splice(found,1);
            }
        }
    }

    //***** MOUSE *****//
    this.mouse={
        x:0,
        y:0,
        down:false,
        //check if mouse is pressing inside these coordinates
        check:function(x,y,w,h){
            if(this.down==true && this.x>=x && this.x<= x+w && this.y>=y && this.y<=y+h){
                return true;
            }else{
                return false;
            }
        }
    }
    

    this.createEventListeners=function(context) {
        context.canvas.src.addEventListener("mousemove", function(evt) {
            var rect = context.canvas.src.getBoundingClientRect();
            context.mouse.x = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*context.canvas.src.width/(context.canvas.src.width/context.draw.cam.w));
            context.mouse.y = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*context.canvas.src.height/(context.canvas.src.height/context.draw.cam.h));
        });

        context.canvas.src.addEventListener("mousedown", function(evt) {
            context.mouse.down=true;
        });

        context.canvas.src.addEventListener("mouseup", function(evt) {
            context.mouse.down=false;
        });

        document.addEventListener("keydown", function(){
            var keys = context.keyboard.keysdown;
            var found = false;
            for(var i=0; i<keys.length; i++) {
                if(keys[i].key==event.keyCode) {
                    found = true;
                }
            }
            if(found==false) {
                context.keyboard.keysdown.push({key:event.keyCode,press:true});
            }
        });
        
        

        document.addEventListener("keyup", function(){
            var keys = context.keyboard.keysdown;
            for(var i=0; i<keys.length; i++) {
                if(keys[i].key==event.keyCode) {context.keyboard.keysdown.splice(i,1);}
            }
        });
    }
    
    
    //start
    this.init(canvas_id,w,h,fps,setupName,updateName,objName)
}



/*
JTv6:
-changed the jt object to a jt constructor
-added mouse checks
-added music repetition
-added changing fontSize from jt.draw.text
-added key presses
-added centered text rotation
-fixed a lot of bugs

JT library guide

1-Initialize
1.1-Getting started
1.2-Different names and methods

2-Ressources
2.1-Preloading ressources
2.2-Drawing/playing ressources
2.3-Virtual Camera
2.4-Accessing ressources
2.5-Drawing shapes

3-Input
3.1-Keyboard
3.2-Mouse

4-Others
4.1-Alarms
4.2-Random
4.3-Collisions
4.4-Math

5.1-Oject Template





//1-Initialize

1.1:First off, you'll need to create an HTML file that links this library and that has a canvas like so:

<html>
    <head>
        <title>App</title>
        <style>
            canvas{
                border: 1px solid black;
            }
        </style>
    </head>
    <body>
        <canvas id="can"></canvas>
    </body>
    <script src="jt_lib6.js"></script>
    <script>
        var app={
            setup:function(){
                
            },
            update:function(){
                
            }
        }
        
        var jt=undefined;
        
        window.onload = function(){
            jt=new JT("can",150,100,60,'setup','update','app');
        }
    </script>
</html>

The three functions are used to preload ressources, setup the app and then update with a loop

The method jt.canvas.init should be called at the end of the script


1.2:You can also change the function names, although you have to specify it to the init like so:

function setup2(){}
function update2(){}

jt=new JT("can",150,100,60,'setup2','update2');

You can also put the functions as methods inside an object like so:

var object={
    setup:function(){},
    update:function(){}
}

jt=new JT("can",150,100,60,'setup2','update2','object');

The first four parameters of the init method are the canvas HTML id, the width, the height and the FPS rate





//2-Ressources

2.1:Preloading ressources is easy in the JT library, just load them inside the preload function

function preload(){
    jt.assets.image("imageSrc","imageName");//loading an image
    jt.assets.sound("soundSrc","soundName")//loading a sound jt.assets.anim("animSrc","animName","numberOfFrames","animationSpeed")//loading an animation
}

the animationSpeed is equal to the FPS rate of the canvas, so 1 = the FPS in the canvas, to make it twice as slow, it should be 0.5


2.2:Drawing/playing ressources

function update(){
    jt.draw.image("imageName");
    jt.draw.anim("animName");
    jt.assets.play("soundName");
}


2.3:Virtual Camera
The virtual camera lets you move the view inside the canvas, you can change it's x,y,width and height like so:

jt.draw.cam.x++;

You can also create a camera shake effect like so:

jt.loop.shake(force,duration,reduce);


2.4:Accessing ressources

You can access your assets like so:
jt.assets.images["imageName"]


2.5:Drawing shapes

Drawing a rectangle:
jt.draw.rect(x,y,w,h,color,rotation)

Drawing a circle:
jt.draw.circle(x,y,radius,color)

Drawing a line:
jt.draw.line(x1,y1,x2,y2,width,color,rotation)

Changing the font:
jt.draw.font(fontName,size)

Drawing text:
jt.draw.text(string,x,y,color,textAlign,rotation)





//3:Inputs are separated into keyboard and mouse

3.1:Keyboard inputs can be checked using the check method:

jt.keyboard.check(keyCode)//will return true or false

You can also deactivate a key with the jt.keyboard.release(keyCode)

Keycodes can be found here : http://keycode.info/

For example, 37 to 40 are the arrow keys, starting from left and going clockwise


3.2:Mouse can be directly checked with jt.mouse.x/jt.mouse.y/jt.mouse.down (if the mouse button is down)





//4:Others are other functions in JT

4.1:Alarms are objects with a time attribute that goes down constantly
They can used to delay actions, you can create one like so:
jt.loop.addAlarm(name,time);

And you can check if the alarm is done with:
jt.loop.checkAlarm(name) which will return a true or false, and it will also destroy the alarm if its time is <=0


4.2:Random

The random method will already round up the numbers
jt.math.random(minimum,maximum)


4.3:collision
To verify collision between 2 rectangles (objects who have a x,y,w and h attributes)

jt.collision.rect(object1,object2)


4.4:Math

Various math method can be found in the jt_lib, check them out at around the 775th line of this html file!





//5-Object template:

<html>
    <head>
        <title>App</title>
        <style>
            canvas{
                border: 1px solid black;
            }
        </style>
    </head>
    <body>
        <canvas id="can"></canvas>
    </body>
    <script src="jt_lib6.js"></script>
    <script>
        var app={
            setup:function(){
                
            },
            update:function(){
                
            }
        }
        
        var jt=undefined;
        
        window.onload = function(){
            jt=new JT("can",150,100,60,'setup','update','app');
        }
    </script>
</html>

*/
