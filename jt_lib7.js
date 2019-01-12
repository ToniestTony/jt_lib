function JT(id,w,h,fps,setupName,updateName,objName){
    //constructor
    //initialize the canvas
    this.init=function(id,w,h,fps,setupName,updateName,objName){
        //add attributes to the canvas object of JT
        this.version=7;
        var actualId=id;
        
        if(typeof(id)=="object"){
            if(id.id!=undefined){actualId=id.id;}
            if(id.w!=undefined){w=id.w;}
            if(id.h!=undefined){h=id.h;}
            if(id.fps!=undefined){fps=id.fps;}
            if(id.setupName!=undefined){setupName=id.setupName;}
            if(id.updateName!=undefined){updateName=id.updateName;}
            if(id.objName!=undefined){updateName=id.objName;}
        }
        
        if(actualId==undefined){
            var canvas=document.createElement("CANVAS");
            canvas.setAttribute("id","jtcanvas");
            document.body.appendChild(canvas);
            actualId="jtcanvas";
        }

        if(w==undefined){
            var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = win.innerWidth || e.clientWidth || g.clientWidth,
            y = win.innerHeight || e.clientHeight|| g.clientHeight;
            
            w=x;
            h=y;
        }
        
        this.canvas.context=this;
        this.canvas.setId(actualId);
        this.canvas.resize(w,h);
        
        
        if(setupName!=undefined){
            if(objName!=undefined){this.loop.obj=objName}
            if(updateName!=undefined){this.loop.updateName=updateName;this.loop.setupName=setupName}
            else if(setupName!=undefined){this.loop.updateName=setupName}
        }else{
            this.loop.obj="app";
            this.loop.updateName="update";
            this.loop.setupName="setup";
        }
        
        
        
        if(fps==undefined){
            fps=60;
        }
        
        //trademark
        console.log('(JT'+this.version+')Made with jt_lib'+this.version+'.js (https://github.com/ToniestTony/jt_lib6)')

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
        
        auto:false,
        autoX:undefined,
        autoY:undefined,
        
        bord:false,
        bordX:1,
        bordY:1,
        bordC:"black",
        
        cursorVisible:true,
        
        context:undefined,
        //Resize the canvas
        resize:function(w,h){
            if(w==undefined){
                if(this.autoX==undefined){
                    
                    var win = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    x = win.innerWidth || e.clientWidth || g.clientWidth,
                    y = win.innerHeight || e.clientHeight|| g.clientHeight;

                    w=x;
                    h=y;
                }else{
                    w=this.autoX;
                    h=this.autoX;
                }
            }
            //Resize the actual HTML canvas
            this.src.width=w;
            this.src.height=h;

            //Keep the width and height in attributes
            this.w=w;
            this.h=h;
            
            this.context.draw.cam.w=w;
            this.context.draw.cam.h=h;
            
            this.context.mouse.canvas.w=w;
            this.context.mouse.canvas.h=h;
        },
        setId(id){
            this.id=id;
            this.src = this.context.html.id(id);
            this.ctx = this.src.getContext("2d");
            this.context.draw.ctx=this.ctx;
            return this.id;
        },
        smoothing:function(bool){
            this.ctx.imageSmoothingEnabled=bool;
            return this.ctx.imageSmoothingEnabled;
        },
        border:function(bool,x,y,c){
            this.bord=bool;
            if(x==undefined){x=1;}
            if(y==undefined){y=1;}
            if(c==undefined){c="black";}
            this.bordX=x;
            this.bordY=y;
            this.bordC=c;
            return this.bord;
        },
        fullscreen:function(){
            var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = win.innerWidth || e.clientWidth || g.clientWidth,
            y = win.innerHeight || e.clientHeight|| g.clientHeight;
            this.resize(x,y);
            return [x,y];
        },
        autofullscreen:function(bool,x,y){
            this.auto=bool;
            this.autoX=x;
            this.autoY=y;
        },
        cursor:function(bool){
            if(bool==undefined){bool=true;}
            this.cursorVisible=bool;
            if(this.cursorVisible==true){
                this.src.style.cursor="auto";
            }else{
                this.src.style.cursor="none";
            }
            return this.cursorVisible;
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
        
        waveX:0,
        waveY:0,
        waveYPos:0,
        waveIterations:0,
        
        combos:[],
        comboTimer:0,
        comboTimerMax:30,
        comboCurrent:[
            [],[],[],[],[],[],[],[]
        ],
        comboMaxLength:8,

        context:undefined,

        alarms:{},

        //Calls the preload function
        preload: function(context,fps){
            this.context=context;
            this.fps=fps;
            this.waveIterations=Math.PI*2/this.fps;
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
            
            this.context.mouse.draw=this.context.draw;
            this.context.mouse.canvas.w=this.context.canvas.src.width;
            this.context.mouse.canvas.h=this.context.canvas.src.height;
            
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
                                    this.context.assets.images[im].w=img.width;
                                    this.context.assets.images[im].h=img.height;
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

                console.log("(JT"+this.context.version+")loop.mainLoop","Load progress: "+this.loadCounter+" / "+this.loadCounterMax)
                if(load){this.loaded=true;}

            }else
            if(!this.pause){

                if(!this.setupDone){
                    this.setup();
                }
                
                if(this.context.canvas.auto==true){
                    this.context.canvas.fullscreen();
                }
                
                //cam
                if(this.context.draw.cam.w<=0.01){
                    this.context.draw.cam.w=0.01;
                }
                
                if(this.context.draw.cam.h<=0.01){
                    this.context.draw.cam.h=0.01;
                }
                
                if(this.obj!=undefined){
                  window[this.obj][this.updateName]();
                }else{
                  window[this.updateName]();
                }
                
                
                //remove key presses
                var keyPresses=[];
                
                for(var keyCount=0;keyCount<this.context.keyboard.keysdown.length;keyCount++){
                    if(this.context.keyboard.keysdown[keyCount].press==true){
                        
                        keyPresses.push(this.context.keyboard.keysdown[keyCount].key);
                        this.context.keyboard.keysdown[keyCount].press=false;
                    }
                }
                
                //check combos
                if(this.comboTimer>0){
                    this.comboTimer--;
                    if(this.comboTimer<=0){
                        
                        this.comboCurrent=this.context.math.matrix(1,this.comboMaxLength);
                    }
                }
                
                if(keyPresses.length>0){
                    //check combo
                    this.comboTimer=this.comboTimerMax;
                    for(var i=0;i<this.comboCurrent.length;i++){
                        
                        for(var j=0;j<keyPresses.length;j++){
                            this.comboCurrent[i].push(keyPresses[j])
                        }
                        
                        
                        if(this.comboCurrent[i].length>=i+1){
                            if(this.comboCurrent[i].length>=i+2){
                                this.comboCurrent[i].splice(0,1);
                            }
                        }
                    }
                }
                
                //remove mouse press
                if(this.context.mouse.down==true && this.context.mouse.press==true){
                    this.context.mouse.press=false;
                }
                
                //wave
                this.waveX+=this.waveIterations;
                if(this.waveX>this.waveIterations*this.fps){
                    this.waveX=this.waveIterations;
                }
                this.waveY=Math.sin(this.waveX)
                this.waveYPos=(this.waveY+1)/2
                

                this.updateAnims();
                this.updateAlarms();

                //shake
                if(this.shakeObj!=undefined){
                    this.shaking();

                }
                
                //border
                if(this.context.canvas.bord==true){
                    //change so it calls a draw function
                    var w=this.context.canvas.w;
                    var h=this.context.canvas.h;
                    var bX=this.context.canvas.bordX;
                    var bY=this.context.canvas.bordY;
                    var c=this.context.canvas.bordC;
                    
                    this.context.draw.ctx.fillStyle =c;
                    
                    this.context.draw.ctx.fillRect(0,0,w,bY)
                    this.context.draw.ctx.fillRect(0,0,bX,h)
                    this.context.draw.ctx.fillRect(0,h-bY,w,bY)
                    this.context.draw.ctx.fillRect(w-bX,0,bX,h)
                }


                //frames++
                if(this.frames<this.fps-1){
                    this.frames++;
                }else{
                    this.frames=0;
                    this.sec++;
                }
                this.context.f=this.frames;
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
        alarm:function(name,time){
            if(time==undefined){
                return this.checkAlarm(name,false);
            }else{
               if(this.alarms[name]!=undefined){
                this.alarms[name]=undefined;
                }
                this.alarms[name]={};
                this.alarms[name].time=time;
                this.alarms[name].pause=false; 
            }
            
        },
        checkAlarm:function(name,del){
            var dele=false;
            if(del!=undefined){
                dele=del;
            }
            if(this.alarms[name]!=undefined && this.alarms[name].time<=0){
                if(dele==true){
                    this.alarms[name]=undefined;
                }
                return true;
            }else{
                return false;
            }
        },
        delAlarm:function(name){
             if(this.alarms[name]!=undefined && this.alarms[name].time<=0){
                 this.alarms[name]=undefined;
                 return true;
             }else{
                 this.alarms[name]=undefined;
                 return false;
             }
        },
        isAlarm:function(name){
             if(this.alarms[name]!=undefined){
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
            if(force==undefined){
                force=this.fps/2;
            }
            if(duration==undefined){
                duration=force
            }
            if(reduce==undefined){
                reduce=force/duration
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
            this.shakeObj.lastX=this.context.draw.cam.x-this.normalX;


            if(this.shakeObj.lastY==0){
                this.context.draw.cam.y+=this.context.math.random(-this.shakeObj.force,this.shakeObj.force)
            }else if(Math.sign(this.shakeObj.lastY)==1){
                this.context.draw.cam.y+=this.context.math.random(-this.shakeObj.force,0)
            }else if(Math.sign(this.shakeObj.lastY)==-1){
                this.context.draw.cam.y+=this.context.math.random(0,this.shakeObj.force)
            }
            this.shakeObj.lastY=this.context.draw.cam.y-this.normalY;

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
        },
        
        checkCombo:function(arrCombo,reset){
            //check
            if(reset==undefined){reset=true;}
            var check=false;
            if(arrCombo.length<=this.comboCurrent.length){
                var arrComboChanged=[];
                //change combo to keyCodes
                for(var i=0;i<arrCombo.length;i++){
                    if(typeof(arrCombo[i])=="string"){
                        arrComboChanged.push(this.context.keyboard.keys[arrCombo[i]]);
                    }else{
                        arrComboChanged.push(arrCombo[i])
                    }
                }
                
                if(arrComboChanged.toString()==this.comboCurrent[arrComboChanged.length-1].toString()){
                    check=true;
                    if(reset==true){
                        this.resetCombo();
                    }
                }
            }
            return check;
        },
        
        resetCombo:function(){
            this.comboCurrent=this.context.math.matrix(1,this.comboMaxLength);
            this.comboTimer=0;
        },
        
        changeComboTimer:function(val){
            if(val==undefined){val=this.comboTimerMax}
            this.comboTimerMax=val;
            return this.comboTimerMax;
        },
        
        changeComboLength:function(val){
            if(val==undefined){val=this.comboMaxLength}
            this.comboMaxLength=val;
            this.comboCurrent=this.context.math.matrix(1,this.comboMaxLength);
            return this.comboMaxLength;
        }
    }
    
    
    
    this.assets={
        //images:
        images:{},
        //anims
        anims:{},
        //sounds
        sounds:{},
        
        //controls
        vol:0.5,
        mut:false,
        
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
            var context=this;
            if(repeat!=undefined){
                if(repeat==true){
                    this.sounds[name].addEventListener('ended', this.stopPlay.bind(context,name), false);
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
        //change volume
        volume:function(vol){
            if(vol!=undefined){
                this.vol=vol;
                if(this.vol<0){this.vol=0;}
                if(this.vol>1){this.vol=1;}
            }else{
                return this.vol;
            }
              
        },
        //mute sounds
        mute:function(bool){
          if(bool!=undefined){
              this.mut=bool;
          }  else{
              return this.mut;
          }
        },
        //play a sound
        play:function(name){
            this.stop(name);
            this.sounds[name].volume=this.vol;
            if(this.mut==true){this.sounds[name].volume=0;}
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
        //stop then play
        stopPlay:function(name){
            this.stop(name);
            this.play(name);
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
            h:undefined,
            active:true,
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
        
        //change cam active
        camactive:function(bool){
            this.cam.active=bool;
            return this. cam.active;
        },

        //Drawing a background
        bg: function(color) {
            this.ctx.fillStyle = this.color(color);
            this.ctx.fillRect(0,0,this.canvas.w,this.canvas.h);
        },
        
        //Quick object draw
        shape:function(obj){
            var x=obj.x;
            var y=obj.y;
            var x1=obj.x1;
            var x2=obj.x2;
            var y1=obj.y1;
            var y2=obj.y2;
            var w=obj.w;
            var h=obj.h;
            var c=obj.c;
            var r=obj.r;
            var d=obj.d;
            var diameter=obj.diameter;
            var rotation=obj.rotation;
            var width=obj.width;
            var height=obj.height;
            var color=obj.color;
            
            if(c==undefined){
                if(color!=undefined){
                    c=color;
                }else{
                    c="black";
                }
            }
            
            if(w==undefined){
                if(width!=undefined){
                    w=width;
                }else{
                    w=1;
                }
            }
            
            if(h==undefined){
                if(height!=undefined){
                    h=height;
                }else{
                    h=1;
                }
            }
            
            if(r==undefined){
                if(rotation!=undefined){
                    r=rotation;
                }
            }
            
            if(d==undefined){
                if(diameter!=undefined){
                    d=diameter;
                }
            }
            
            if(x1!=undefined){
                //line
                this.line(x1,y1,x2,y2,w,c,r);
            }else if(d!=undefined){
                //circle
                this.circle(x,y,d,c);
            }else{
                //rect
                this.rect(x,y,w,h,c,r);
            }
            
        },

        //Drawing rectangle
        rect: function(x,y,w,h,color,rotation) {
            this.ctx.fillStyle = this.color(color);
            this.fill("rect",x,y,w,h,rotation);
        },
        
        //Drawing rectangle border
        rectB: function(x,y,w,h,color,rotation,lineW){
            this.ctx.strokeStyle = this.color(color);
            if(lineW<=0){lineW=1}
            this.ctx.lineWidth = lineW;
            this.fill("rectB",x,y,w,h,rotation);
        },

        //Drawing circle
        circle: function(x,y,d,color) {
            this.ctx.beginPath();
            this.fill("arc",x+d/2,y+d/2,d/2);
            this.ctx.fillStyle = this.color(color);
            this.ctx.fill();
        },
        
        //Drawing circle border
        circleB: function(x,y,d,color,lineW) {
            this.ctx.beginPath();
            this.fill("arcB",x+d,y+d,d);
            this.ctx.strokeStyle = this.color(color);
            if(lineW<=0){lineW=1}
            this.ctx.lineWidth=lineW;
            this.ctx.stroke();
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
        
        //Get text width
        textW:function(string){
            return this.ctx.measureText(string).width;
        },
        
        //Get text height (fontSize)
        textH:function(string){
            return this.fontSize;
        },
        
       //Drawing text border
        textB:function(string,x,y,color,textAlign,fontSize,rotation,lineW){
            if(textAlign!=undefined){
                this.ctx.textAlign=textAlign
            }
            if(fontSize!=undefined){
                this.fontSize=fontSize
            }
            this.ctx.strokeStyle= this.color(color);
            if(lineW<=0){lineW=1}
            this.ctx.lineWidth= lineW;
            this.ctx.font=this.fontSize+"px "+this.fontName;
            this.fill("textB",x,y,this.ctx.measureText(string).width,this.fontSize,rotation,string)
        },

        //Setting the font
        font:function(fontName,size){
            this.fontName=fontName;
            this.fontSize=size;
            this.ctx.font=this.fontSize+"px "+this.fontName;
        },

        //Draw an image
        image:function(name,newX,newY,w,h,sX,sY,sW,sH,rotation){

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
                        if(w=="w"){w=image.w}
                        if(h=="h"){h=image.h}
                        image.img.width=w;
                        image.img.height=h;
                    }

                    var tempW=image.img.width;
                    var tempH=image.img.height;

                    var camW=Math.abs(this.canvas.src.width/this.cam.w)
                    var camH=Math.abs(this.canvas.src.height/this.cam.h)
                    var camX=this.cam.x;
                    var camY=this.cam.y;
                    
                    if(this.cam.active==false){
                        camX=0;
                        camY=0;
                        camW=1;
                        camH=1;
                    }

                    var x=image.x;
                    var y=image.y;

                    this.ctx.save();
                    //(x*camW)-(camX*camW),(y*camH)-(camY*camH)

                    if(rotation!=undefined){
                        this.ctx.translate(((tempW/2)*camW-camX*camW)+x*camW,((tempH/2)*camH-camY*camH)+y*camH);
                        this.ctx.rotate(rotation*Math.PI/180);
                        this.ctx.translate(((-tempW/2)*camW+camX*camW)-x*camW,((-tempH/2)*camH+camY*camH)-y*camH);
                    }

                    if(sX!=undefined){
                        //this.ctx.drawImage(image.img,sX,sY,sW,sH,camW-camX,camH-camY,tempW*camW,tempH*camH);
                        
                        if(sW=="w"){sW=image.w}
                        if(sH=="h"){sH=image.h}
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
        anim:function(name,newX,newY,w,h,rotation){

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
                        if(w=="w"){w=anim.frameW};
                        if(h=="h"){h=anim.img.height};
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
                    
                    if(this.cam.active==false){
                        camX=0;
                        camY=0;
                        camW=1;
                        camH=1;
                    }

                    var x=anim.x;
                    var y=anim.y;

                    this.ctx.save();

                    if(rotation!=undefined){
                        this.ctx.translate(((tempW/2)*camW-camX*camW)+x*camW,((tempH/2)*camH-camY*camH)+y*camH);
                        this.ctx.rotate(rotation*Math.PI/180);
                        this.ctx.translate(((-tempW/2)*camW+camX*camW)-x*camW,((-tempH/2)*camH+camY*camH)-y*camH);
                    }

                    this.ctx.drawImage(anim.img,anim.frame*anim.frameW,0,anim.frameW,anim.img.height,(x*camW)-(camX*camW),(y*camH)-(camY*camH),tempW*camW,tempH*camH);

                    this.ctx.restore();
                }
            }
        },
		
		animFrame:function(name,frame){
			var anim=this.assets.anims[name];
			
			var f=frame;
			if(f!=undefined){
				f=0;
			}
			
			anim.frame=f;
			anim.distance=anim.speed*f;
		},

        //Gradients

        //linear gradient
        linear:function(name,x1,y1,x2,y2,stops){
            
            this.gradients[name]={};
            
            this.gradients[name].gradient="linear";
            
            this.gradients[name].x1=x1;
            this.gradients[name].y1=y1;
            this.gradients[name].x2=x2;
            this.gradients[name].y2=y2;
            this.gradients[name].stops=stops;
            
            return this.gradients[name];
        },

        //radial gradient
        radial:function(name,x1,y1,r1,x2,y2,r2,stops){
            
            this.gradients[name]={};
            
            this.gradients[name].gradient="radial";
            
            this.gradients[name].x1=x1;
            this.gradients[name].y1=y1;
            this.gradients[name].r1=r1;
            this.gradients[name].x2=x2;
            this.gradients[name].y2=y2;
            this.gradients[name].r2=r2;
            this.gradients[name].stops=stops;
            
            return this.gradients[name];
        },


        //private functions

        //Changes the color
        color: function(col) {
            var converted=col;
            if(col!=undefined){
                if(col.gradient!=undefined){
                    
                    if(col.gradient=="linear"){
                        
                        if(this.cam.active==true){
                        var camW=Math.abs(this.canvas.src.width/this.cam.w)
                        var camH=Math.abs(this.canvas.src.height/this.cam.h)
                        var camX=this.cam.x;
                        var camY=this.cam.y;
                        
                        var tempX=(col.x1*camW)-(camX*camW);
                        var tempY=(col.y1*camH)-(camY*camH);
                        
                        var tempW=(col.x2*camW)-(camX*camW);
                        var tempH=(col.y2*camH)-(camY*camH);
                        converted=this.ctx.createLinearGradient(tempX,tempY,tempW,tempH);
                        }else{
                           converted=this.ctx.createLinearGradient(col.x1,col.y1,col.x2,col.y2); 
                        }
                        
                    }else if(col.gradient=="radial"){
                        
                        if(this.cam.active==true){
                        var camW=Math.abs(this.canvas.src.width/this.cam.w)
                        var camH=Math.abs(this.canvas.src.height/this.cam.h)
                        var camX=this.cam.x;
                        var camY=this.cam.y;
                        
                        var tempX1=(col.x1*camW)-(camX*camW);
                        var tempY1=(col.y1*camH)-(camY*camH);
                        var tempX2=(col.x2*camW)-(camX*camW);
                        var tempY2=(col.y2*camH)-(camY*camH);
                        
                        var tempR1=col.r1*camW;
                        var tempR2=col.r2*camW;
                        converted=this.ctx.createRadialGradient(tempX1,tempY1,tempR1,tempX2,tempY2,tempR2);
                        }else{
                           converted=this.ctx.createRadialGradient(col.x1,col.y1,col.r1,col.x2,col.y2,col.r2); 
                        }
                    }
                    
                        for(var i=0;i<col.stops.length;i++){
                            converted.addColorStop(i/(col.stops.length-1),col.stops[i]);
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
            if(this.cam.active==false){
                camX=0;
                camY=0;
                camW=1;
                camH=1;
            }
            this.ctx.save();
            if(rotation!=undefined){
                if(type=="line"){
                    this.ctx.translate((((w-x)/2)*camW-camX*camW)+x*camW,(((h-y)/2)*camH-camY*camH)+y*camH);
                    this.ctx.rotate(rotation*Math.PI/180);
                    this.ctx.translate((((x-w)/2)*camW+camX*camW)-x*camW,(((y-h)/2)*camH+camY*camH)-y*camH);
                }else{
                   this.ctx.translate(((w/2)*camW-camX*camW)+x*camW,((h/2)*camH-camY*camH)+y*camH);
                    this.ctx.rotate(rotation*Math.PI/180);
                    this.ctx.translate(((-w/2)*camW+camX*camW)-x*camW,((-h/2)*camH+camY*camH)-y*camH); 
                }
                
            }
            switch(type){
                case "rect":
                    this.ctx.fillRect((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*camW,h*camH);
                    break;
                case "rectB":
                    this.ctx.strokeRect((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*camW,h*camH);
                    break;
                case "arc":
                    this.ctx.arc((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*((camW+camH)/2),0,2*Math.PI);
                    break;
                case "arcB":
                    this.ctx.arc((x*camW)-(camX*camW),(y*camH)-(camY*camH),w*((camW+camH)/2),0,2*Math.PI);
                    break;
                case "text":
                    this.ctx.fillText(string,(x*camW)-(camX*camW),(y*camH)-(camY*camH))
                    break;
                case "textB":
                    this.ctx.strokeText(string,(x*camW)-(camX*camW),(y*camH)-(camY*camH))
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
        random: function(min,max,variable) {
            if(min==undefined){
                //no params
                return Math.floor(Math.random()*(2));
            }else if(max==undefined){
                //only min
                if(min<0){
                    return Math.floor(Math.random()*(min-1)+1);
                }else{
                    return Math.floor(Math.random()*(min+1));  
                }
            }else if(variable==undefined){
                //only min and max
                return Math.floor(Math.random()*(max-min+1)+min);
            }else{
                //all 3
                return Math.floor(Math.random()*((max/variable)-(min/variable)+1)+(min/variable))*variable;
            }
            
        },
        between: function(num,min,max) {return num>=min && num<=max;},
        stay: function(num,min,max) {if(num<min){num=min}if(num>max){num=max}return num},
        wrap: function(num,min,max) {
            if(num<min){
                num=this.wrap(max-(min-num)+1,min,max)
            }if(num>max){
                num=this.wrap(min+(num-max)-1,min,max)
            }return num
        },
        choose: function(numbers) {
            var ran=this.random(0,numbers.length-1);
            return numbers[ran];
        },

        dist: function(obj1,obj2) {return Math.sqrt(Math.pow(obj1.x-obj2.x,2) + Math.pow(obj1.y-obj2.y,2))},
        distPoint: function(x1,y1,x2,y2) {return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2))},


        //Get the horizontal ratio of an angle
        angleX:function(angle){
            return Math.cos(angle*Math.PI/180)
        },

        //Get the vertical ratio of an angle
        angleY:function(angle){
            return Math.sin(angle*Math.PI/180)
        },

       //Get the angle from a direction or 2 points
        angle:function(x,y,x2,y2){
            var deltaX=-x;
            var deltaY=y;
            if(x2!=undefined){
                deltaX=(x2-x)*-1;
                deltaY=y2-y;
            }
            var angle=Math.atan2(deltaX,deltaY)*180/Math.PI;
            
            var degrees=this.wrap(angle-180,0,359)
            return degrees;
        },

        matrix: function(w,h,value){
            var mat=new Array(h);
            for(var i=0;i<mat.length;i++){
                mat[i]=new Array(w);
                if(value!=undefined){
                    for(var j=0;j<mat[i].length;j++){
                        mat[i][j]=value;
                    }
                }
            }
            return mat;
        },


    },

    this.collision={
        dist: function(obj1,obj2) {return Math.sqrt(Math.pow(obj2.x-obj1.x,2) + Math.pow(obj2.y-obj1.y,2))},
         //between 2 objects with their x,y,width and height
        rect: function(rect1,rect2) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            if (rect1.x < rect2.x + rect2.w &&
                rect1.x + rect1.w > rect2.x &&
                rect1.y < rect2.y + rect2.h &&
                rect1.h + rect1.y > rect2.y) {
                col=true;
            }
            return col;
        },
        circle: function(circle1,circle2) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            if(circle1.d==undefined){circle1.d=circle1.diameter}
            if(circle2.d==undefined){circle2.d=circle2.diameter}
            var temp1={x:circle1.x+circle1.d/2,y:circle1.y+circle1.d/2}
            var temp2={x:circle2.x+circle2.d/2,y:circle2.y+circle2.d/2}
            if(this.dist(temp1,temp2)<(circle1.d/2+circle2.d/2)){
               col=true; 
            }
            return col;
        },
        rectPoint:function(rect,point){
            var col=false;
            if (point.x < rect.x + rect.w &&
                point.x > rect.x &&
                point.y < rect.y + rect.h &&
                point.y > rect.y) {
                col=true;
            }
            return col;
        },
        circlePoint:function(circle,point){
            var col=false;
            if(circle.d==undefined){circle.d=circle.diameter}
            var temp={
                x:circle.x+circle.d/2,
                y:circle.y+circle.d/2
            }
            if (this.dist(temp,point)<circle.d/2) {
                col=true;
            }
            return col;
        },
        rectCircle: function(rect,circle) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            if(circle.d==undefined){circle.d=circle.diameter}
            
            var circleMiddle={x:circle.x+circle.d/2,y:circle.y+circle.d/2}
            
            var rectRadius=Math.floor(this.dist({x:rect.x,y:rect.y},{x:rect.x+rect.w/2,y:rect.y+rect.h/2}));
            
            var circleToRect={x:circle.x,y:circle.y,w:circle.d,h:circle.d};
            
            var rectToCircleMiddle={x:rect.x+rect.w/2,y:rect.y+rect.h/2}
            
            if(this.rect(rect,circleToRect) && this.dist(rectToCircleMiddle,circleMiddle)<=Math.floor((rectRadius+circle.d/2))){
                col=true;
            }
            return col;
        }
    }
    
    
    
    //***** KEYBOARD *****//
    this.keyboard={
        keys:{
            
            backspace:8,
            enter:13,
			shift:16,
			control:17,
			ctrl:17,
			controlL:17,
			ctrlL:17,
			alt:18,
            escape:27,
            space:32,
            left:37,
            up:38,
            right:39,
            down:40,
            insert:45,
            delete:46,
            0:48,
            1:49,
            2:50,
            3:51,
            4:52,
            5:53,
            6:54,
            7:55,
            8:56,
            9:57,
            a:65,
            b:66,
            c:67,
            d:68,
            e:69,
            f:70,
            g:71,
            h:72,
            i:73,
            j:74,
            k:75,
            l:76,
            m:77,
            n:78,
            o:79,
            p:80,
            q:81,
            r:82,
            s:83,
            t:84,
            u:85,
            v:86,
            w:87,
            x:88,
            y:89,
            z:90,
            num0:96,
            num1:97,
            num2:98,
            num3:99,
            num4:100,
            num5:101,
            num6:102,
            num7:103,
            num8:104,
            num9:105,
			controlR:223,
			ctrlR:223
        },
        keysdown:[],
        check: function(keyCode) {
            if(typeof(keyCode)=="object" && keyCode.length>0){
                var allFound=true;
                for(var i=0;i<keyCode.length;i++){
                    if(!this.check(keyCode[i])){
                        allFound=false;
                    }
                }
                if(allFound){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(this.keys[keyCode]!=undefined){
                keyCode=this.keys[keyCode];
                }
                var found = false;
                for(var i=0; i<this.keysdown.length; i++) {
                    if(this.keysdown[i].key == keyCode) {
                        found=true;
                    }
                }
                return found;
            }
            
        },
        
        press: function(keyCode) {
            if(this.keys[keyCode]!=undefined){
                keyCode=this.keys[keyCode];
            }
            var found = false;
            for(var i=0; i<this.keysdown.length; i++) {
                if(this.keysdown[i].key == keyCode && this.keysdown[i].press==true) {
                    found=true;
                }
            }
            return found;
        },

        release: function(keyCode) {
            if(keyCode==undefined){
                this.keysdown.splice(0,this.keysdown.length)
            }else{
                var found = undefined;
                for(var i=0; i<this.keysdown.length; i++) {
                    if(this.keysdown[i].key == keyCode) {found=i;}
                }
                if(found!=undefined){
                    this.keysdown.splice(found,1);
                }
            }
            
        }
    }

    //***** MOUSE *****//
    this.mouse={
        x:0,
        y:0,
        cX:0,
        cY:0,
        draw:undefined,
        press:false,
        down:false,
        canvas:{w:0,h:0},
        //check if mouse is pressing inside these coordinates, if type is true, check if mouse is pressed instead of down
        check:function(x,y,w,h,press,cam){
            if(x==undefined){x=0;}
            if(y==undefined){y=0;}
            if(w==undefined){w=this.canvas.w;}
            if(h==undefined){h=this.canvas.h;}
            var checking=this.down;
            var mX=this.cX;
            var mY=this.cY;
            if(press!=undefined){
                if(press==true){
                    checking=this.press;
                }
            }
            
            if(cam==undefined){
                cam=this.draw.cam.active;
            }
            
            if(cam==false){
                mX=this.x;
                mY=this.y;
            }
            
            
            if(checking==true && mX>=x && mX<= x+w && mY>=y && mY<=y+h){
                return true;
            }else{
                return false;
            }
        },
    }
    

    this.createEventListeners=function(context) {
        context.canvas.src.addEventListener("mousemove", function(evt) {
            var rect = context.canvas.src.getBoundingClientRect();
            
            var camW=Math.abs(context.canvas.src.width/context.draw.cam.w)
            var camH=Math.abs(context.canvas.src.height/context.draw.cam.h)
            var camX=context.draw.cam.x;
            var camY=context.draw.cam.y;
            
            var mX=Math.round(((evt.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width);
            var mY=Math.round(((evt.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height);
            
            context.mouse.x=mX;
            context.mouse.y=mY;
            
            context.mouse.cX = (mX/camW)+camX;
            context.mouse.cY = (mY/camH)+camY;
        });

        context.canvas.src.addEventListener("mousedown", function(evt) {
            context.mouse.down=true;
            context.mouse.press=true;
        });

        context.canvas.src.addEventListener("mouseup", function(evt) {
            context.mouse.down=false;
            context.mouse.press=false;
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
    this.init(id,w,h,fps,setupName,updateName,objName)
    
    //global variable
    
    //canvas
    
    this.width=function(w){
        if(w!=undefined){this.canvas.resize(w,this.canvas.h)}
        return this.canvas.w;
    }
    
    this.w=function(w){
        if(w!=undefined){this.canvas.resize(w,this.canvas.h)}
        return this.canvas.w;
    }
    
    this.height=function(h){
        if(h!=undefined){this.canvas.resize(this.canvas.w,h)}
        return this.canvas.h;
    }
    
    this.h=function(h){
        if(h!=undefined){this.canvas.resize(this.canvas.w,h)}
        return this.canvas.h;
    }
    
    this.resize=function(w,h){
        return this.canvas.resize(w,h);
    }
    
    this.setId=function(id){
        return this.canvas.setId(id);
    }
    
    this.smoothing=function(bool){
        return this.canvas.smoothing(bool);
    }
    
    this.border=function(bool,x,y,c){
        return this.canvas.border(bool,x,y,c);
    }
    
    this.fullscreen=function(){
        return this.canvas.fullscreen();
    }
    
    this.autoresize=function(bool,x,y){
        return this.canvas.autofullscreen(bool,x,y);
    }
    
    this.cursor=function(bool){
        return this.canvas.cursor(bool);
    }
    
    
    //loop
    
    this.alarm=function(name,time){
        return this.loop.alarm(name,time);
    }
    
    this.checkAlarm=function(name,del){
        return this.loop.checkAlarm(name,del);
    }
    
    this.delAlarm=function(name){
        return this.loop.delAlarm(name);
    }
    
    this.isAlarm=function(name){
        return this.loop.isAlarm(name);
    }
    
    this.shake=function(force,duration,reduce){
        return this.loop.shake(force,duration,reduce);
    }
    
    this.checkCombo=function(arr,reset){
        return this.loop.checkCombo(arr,reset);
    }
    
    this.combo=function(arr,reset){
        return this.loop.checkCombo(arr,reset);
    }
    
    this.resetCombo=function(){
        return this.loop.resetCombo();
    }
    
    this.comboTimer=function(val){
        return this.loop.changeComboTimer(val);
    }
    
    this.comboLength=function(val){
        return this.loop.changeComboLength(val);
    }
    
    this.fps=function(){
        return this.loop.fps;
    }
    
    this.frames=function(val){
        if(val==undefined){return this.loop.frames;}
        return this.loop.frames=val;
    }
    
    this.sec=function(val){
        if(val==undefined){return this.loop.sec;}
        return this.loop.sec=val;
    }
    
    this.pauseJt=function(val){
        if(val==undefined){return this.loop.pause;}
        return this.loop.pause=val;
    }
    
    this.stopJt=function(val){
        if(val==undefined){return this.loop.stop;}
        return this.loop.stop=val;
    }
    
    this.waveX=function(val){
        if(val==undefined){return this.loop.waveX;}
        return this.loop.waveX=val;
    }
    
    this.waveY=function(val){
        if(val==undefined){return this.loop.waveY;}
        return this.loop.waveY=val;
    }
    
    this.waveYPos=function(val){
        if(val==undefined){return this.loop.waveYPos;}
        return this.loop.waveYPos=val;
    }
    
    
    //assets
    
    this.newImage=function(src,name,x,y,visible){
        return this.assets.image(src,name,x,y,visible);
    }
    
    this.loadImage=function(src,name,x,y,visible){
        return this.assets.image(src,name,x,y,visible);
    }
    
    this.newSound=function(src,name,repeat){
        return this.assets.sound(src,name,repeat);
    }
    
    this.loadSound=function(src,name,repeat){
        return this.assets.sound(src,name,repeat);
    }
    
    this.newAnim=function(src,name,frames,speed,x,y,visible){
        return this.assets.anim(src,name,frames,speed,x,y,visible);
    }
    
    this.loadAnim=function(src,name,frames,speed,x,y,visible){
        return this.assets.anim(src,name,frames,speed,x,y,visible);
    }
    
    this.volume=function(volume){
        return this.assets.volume(volume);
    }
    
    this.mute=function(bool){
        return this.assets.mute(bool);
    }
    
    this.play=function(name){
        return this.assets.play(name);
    }
    
    this.sound=function(name){
        return this.assets.play(name);
    }
    
    this.pause=function(name){
        return this.assets.pause(name);
    }
    
    this.stop=function(name){
        return this.assets.stop(name);
    }
    
    this.stopPlay=function(name){
        return this.assets.stopPlay(name);
    }
    
    this.colAssets=function(name1,name2){
        return this.assets.collision(name1,name2);
    }
    
    this.images=function(){
        return this.assets.images;
    }
    
    this.anims=function(){
        return this.assets.anims;
    }
    
    this.sounds=function(){
        return this.assets.sounds;
    }
    
    
    //draw
    
    this.bg=function(color){
        return this.draw.bg(color);
    }
    
    this.shape=function(obj){
        return this.draw.shape(obj);
    }
    
    this.rect=function(x,y,w,h,color,rotation){
        return this.draw.rect(x,y,w,h,color,rotation);
    }
    
    this.rectB=function(x,y,w,h,color,rotation,lineW){
        return this.draw.rectB(x,y,w,h,color,rotation,lineW);
    }
    
    this.circle=function(x,y,radius,color){
        return this.draw.circle(x,y,radius,color);
    }
    
    this.circleB=function(x,y,radius,color,lineW){
        return this.draw.circleB(x,y,radius,color,lineW);
    }
    
    this.line=function(x1,y1,x2,y2,width,color,rotation){
        return this.draw.line(x1,y1,x2,y2,width,color,rotation);
    }
    
    this.text=function(string,x,y,color,textAlign,fontSize,rotation){
        return this.draw.text(string,x,y,color,textAlign,fontSize,rotation);
    }
    
    this.textB=function(string,x,y,color,textAlign,fontSize,rotation,lineW){
        return this.draw.textB(string,x,y,color,textAlign,fontSize,rotation,lineW);
    }
    
    this.textW=function(string){
        return this.draw.textW(string);
    }
    
    this.textH=function(string){
        return this.draw.textH(string);
    }
    
    this.font=function(fontName,fontSize){
        return this.draw.font(fontName,fontSize)
    }
    
    this.image=function(name,newX,newY,w,h,sX,sY,sW,sH,rotation){
        return this.draw.image(name,newX,newY,w,h,sX,sY,sW,sH,rotation)
    }
    
    this.anim=function(name,newX,newY,w,h,rotation){
        return this.draw.anim(name,newX,newY,w,h,rotation)
    }
	
	this.animFrame=function(name,frame){
        return this.draw.animFrame(name,frame)
    }
	
	this.animF=function(name,frame){
        return this.draw.animFrame(name,frame)
    }
    
    this.linear=function(name,x1,y1,x2,y2,stops){
        return this.draw.linear(name,x1,y1,x2,y2,stops)
    }
    
    this.radial=function(name,x1,y1,r1,x2,y2,r2,stops){
        return this.draw.radial(name,x1,y1,r1,x2,y2,r2,stops)
    }
    
    this.color=function(col){
        return this.draw.color(col)
    }
    
    this.cam=function(){
        return this.draw.cam;
    }
    
    this.fontName=function(){
        return this.draw.fontName;
    }
    
    this.fontSize=function(){
        return this.draw.fontSize;
    }
    
    
    //html
    
    this.id=function(id){
        return this.html.id(id);
    }
    
    this.class=function(className){
        return this.html.class(className);
    }
    
    
    //math
    
    this.random=function(min,max,variable){
        return this.math.random(min,max,variable);
    }
    
    this.between=function(num,min,max){
        return this.math.between(num,min,max);
    }
    
    this.stay=function(num,min,max){
        return this.math.stay(num,min,max);
    }
    
    this.wrap=function(num,min,max){
        return this.math.wrap(num,min,max);
    }
    
    this.choose=function(numbers){
        return this.math.choose(numbers);
    }
    
    this.dist=function(obj1,obj2){
        return this.math.dist(obj1,obj2);
    }
    
    this.distPoint=function(x1,y1,x2,y2){
        return this.math.distPoint(x1,y1,x2,y2);
    }
    
    this.angleX=function(angle){
        return this.math.angleX(angle);
    }
    
    this.angleY=function(angle){
        return this.math.angleY(angle);
    }
    
    this.angle=function(x,y,x2,y2){
        return this.math.angle(x,y,x2,y2);
    }
    
    this.matrix=function(w,h,val){
        return this.math.matrix(w,h,val);
    }
    
    
    //collision
    
    this.cRect=function(rect1,rect2){
        return this.collision.rect(rect1,rect2);
    }
    
    this.cCircle=function(circle1,circle2){
        return this.collision.circle(circle1,circle2);
    }
    
    this.cRectPoint=function(rect,point){
        return this.collision.rectPoint(rect,point);
    }
    
    this.cCirclePoint=function(circle,point){
        return this.collision.circlePoint(circle,point);
    }
    
    this.cRectCircle=function(rect,circle){
        return this.collision.rectCircle(rect,circle);
    }
    
    
    //keyboard
    
    this.keyCheck=function(keyCode){
        return this.keyboard.check(keyCode);
    }
    
    this.kCheck=function(keyCode){
        return this.keyboard.check(keyCode);
    }
    
    this.keyPress=function(keyCode){
        return this.keyboard.press(keyCode);
    }
    
    this.kPress=function(keyCode){
        return this.keyboard.press(keyCode);
    }
    
    this.keyRemove=function(keyCode){
        return this.keyboard.release(keyCode);
    }
    
    this.kRemove=function(keyCode){
        return this.keyboard.release(keyCode);
    }
    
    this.keys=function(){
        return this.keyboard.keys;
    }
    
    
    //mouse
    
    this.mouseCheck=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,false,cam);
    }
    
    this.mCheck=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,false,cam);
    }
    
    this.mC=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,false,cam);
    }
    
    this.mousePress=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,true,cam);
    }
    
    this.mPress=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,true,cam);
    }
    
    this.mP=function(x,y,w,h,cam){
        return this.mouse.check(x,y,w,h,true,cam);
    }
    
    this.mouseX=function(){
        return this.mouse.x;
    }
    
    this.mX=function(){
        return this.mouse.x;
    }
    
    this.mouseCamX=function(){
        return this.mouse.cX;
    }
    
    this.mCX=function(){
        return this.mouse.cX;
    }
    
    this.mouseY=function(){
        return this.mouse.y;
    }
    
    this.mY=function(){
        return this.mouse.y;
    }
    
    this.mouseCamY=function(){
        return this.mouse.cY;
    }
    
    this.mCY=function(){
        return this.mouse.cY;
    }
    
    this.mouseDown=function(){
        return this.mouse.down;
    }
    
    this.mDown=function(){
        return this.mouse.down;
    }
    
    
    //super macro
    
    this.r=function(min,max,val){
        return this.math.random(min,max,val);
    }
    
    this.c=function(keyCode){
        return this.keyboard.check(keyCode);
    }
    
    this.p=function(keyCode){
        return this.keyboard.press(keyCode);
    }
    
    this.m=function(x,y,w,h,press,cam){
        return this.mouse.check(x,y,w,h,press,cam);
    }
    
    this.i=function(name,newX,newY,w,h,sX,sY,sW,sH,rotate){
        return this.draw.image(name,newX,newY,w,h,sX,sY,sW,sH,rotate);
    }
    
    this.a=function(name,newX,newY,w,h,rotate){
        return this.draw.anim(name,newX,newY,w,h,rotate);
    }
    
    
}



/*
JTv6:
-changed the jt object to a jt constructor
-added mouse checks
-added mouse press
-added music repetition
-added changing fontSize from jt.draw.text
-added key presses
-added centered text rotation
-fixed a lot of bugs

TODO:
Jt lib 7
general
	!everything in camelCase
	!enlever les console.log
	!ajouter settings généraux fullscreen border
	!changer canvas id
	!changer fps
    !initialiser jt with obj
	!variables utiles accessibles global w,h,f,r,c,p
    !normaliser noms de méthodes
    !change methods from jt.loop.addAlarm to jt.addAlarm
    !remove methods to change attr like jt.draw.camactive
    !hide cursor in canvas
    !bugfix
	améliorer la documentation
	ajouter github
	ajouter github page
	ajouter copyright
!loop
    !shake will work even if cam is moved/zoomed
    !shake is more balanced by default
	!ajouter nombre qui fait vague sin (0 à 1 ease in-out)
	!native combo support
	!ajouter settings a changer pour combo
    !ajout de delAlarm et isAlarm
!draw
    !dynamic gradient
	!améliorer animation pour faciliter
	!améliorer sprites import
	!améliorer dessiner une partie d'un sprite
    !quickdraw
    !ligne tourne au milieu
    !cam active/inactive (for UI)
	!dessiner bordure rect/cercle/texte
	!calculer width/height texte (textBaseLine)
!assets
	!changer facillement si le son se répète
	!variable "volume" et "mute"
	!collision entre assets mieux
!math
	!random
		!1 param = -x,0 | 0,x
		!2 param = x,y
		!3 param = (x*z,y*z)/z (variations)
    !choose
	!améliorer stay/wrap
	!améliorer sin/cos/tan
	!rendre calcul rotate/dist facile
!collision
	!ajouter collision cercles
	!ajouter collision rect/cercle
	!ajouter collision rect/point
	!ajouter collision cercle/point
!init
	!pas de w/h = fenetre w/h
	!pas de canvas id = append canvas
!input
    !mouse real and cam coordinates
	!multiple keyboard check ex: keyboard.check("a","b")?
	!changer keyboard pour mot plus court, input?
	!ajouter array des noms de touches (ex: "a"=65)


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
    <script src="jt_lib7.js"></script>
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
