function JT(id,w,h,fps,setupName,updateName,objName,mobileAudioSize,fullScreenBtn){
    //constructor
    //initialize the canvas
    this.init=function(id,w,h,fps,setupName,updateName,objName,mobileAudioSize,fullScreenBtn){
        //add attributes to the canvas object of JT
        this.version=12;
        var actualId=id;
        
        if(typeof(id)=="object"){
            if(id.id!=undefined){actualId=id.id;}
            if(id.w!=undefined){w=id.w;}
            if(id.h!=undefined){h=id.h;}
            if(id.fps!=undefined){fps=id.fps;}
            if(id.setupName!=undefined){setupName=id.setupName;}
            if(id.updateName!=undefined){updateName=id.updateName;}
            if(id.objName!=undefined){updateName=id.objName;}
            if(id.fullScreenBtn!=undefined){fullScreenBtn=id.fullScreenBtn;}
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
            if(objName!=undefined){this.loop.obj=objName;}
            if(updateName!=undefined){this.loop.updateName=updateName;this.loop.setupName=setupName;}
            else if(setupName!=undefined){this.loop.updateName=setupName;}
        }else{
            this.loop.obj="app";
            this.loop.updateName="update";
            this.loop.setupName="setup";
        }
        
        if(fps==undefined){
            fps=60;
        }
        
        //trademark
        console.log('(JT'+this.version+')Made with jt_lib'+this.version+'.js (https://github.com/ToniestTony/jt_lib)');
		
		this.loop.fullScreenBtn=fullScreenBtn;
        this.loop.preload(this,fps);
        
        this.assets.musicBtn=undefined;
        this.assets.soundBtn=undefined;
        
        //check if mobile
        if(mobileAudioSize>0){
            if(this.mobile.isAny()){
                //Creating the mobile music button
                this.assets.musicBtn =document.createElement("INPUT");
                var musicBtnType=  document.createAttribute("type");
                musicBtnType.value="button";
                var musicBtnValue= document.createAttribute("value");
                musicBtnValue.value="Enable music !";
                var musicBtnClass= document.createAttribute("class");
                musicBtnClass.value="jtAudioBtnClass";
                this.assets.musicBtn.setAttributeNode(musicBtnType)
                this.assets.musicBtn.setAttributeNode(musicBtnValue)
                this.assets.musicBtn.setAttributeNode(musicBtnClass)
            this.assets.musicBtn.addEventListener("click",this.assets.musicEvent.bind(this));
                document.getElementById(actualId).parentNode.insertBefore(this.assets.musicBtn,document.getElementById(actualId));
                
                this.assets.musicBtn.style.position="absolute";
                this.assets.musicBtn.style.left=0;
                this.assets.musicBtn.style.top=0;
                this.assets.musicBtn.style.fontSize=mobileAudioSize;
                this.assets.musicBtn.style.opacity=0.5;
                this.assets.musicBtn.style.zIndex=1;

                //Creating the mobile sound button
            this.assets.soundBtn =document.createElement("INPUT");
                var soundBtnType=  document.createAttribute("type");
                soundBtnType.value="button";
                var soundBtnValue= document.createAttribute("value");
                soundBtnValue.value="Enable sound !";
                var soundBtnClass= document.createAttribute("class");
                soundBtnClass.value="jtAudioBtnClass";
                this.assets.soundBtn.setAttributeNode(soundBtnType)
                this.assets.soundBtn.setAttributeNode(soundBtnValue)
                this.assets.soundBtn.setAttributeNode(soundBtnClass)
                this.assets.soundBtn.addEventListener("click",this.assets.soundEvent.bind(this));
                document.getElementById(actualId).parentNode.insertBefore(this.assets.soundBtn,document.getElementById(actualId));
                
                this.assets.soundBtn.style.position="absolute";
                this.assets.soundBtn.style.left=0;
                this.assets.soundBtn.style.top=mobileAudioSize+(mobileAudioSize/2)+5;
                this.assets.soundBtn.style.fontSize=mobileAudioSize;
                this.assets.soundBtn.style.opacity=0.5;
                this.assets.soundBtn.style.zIndex=1;



            }
        }

        this.createEventListeners(this);
    };
    
    //canvas
    this.canvas={
        src:null,
        id:null,
        ctx:null,
        w:undefined,
        h:undefined,
		
		fullScreen:false,
        
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
                    h=this.autoY;
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
			
			this.context.touch.canvas.w=w;
            this.context.touch.canvas.h=h;
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
			var ratio = window.devicePixelRatio || 1;
            var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = win.innerWidth || e.clientWidth || g.clientWidth * ratio,
            y = win.innerHeight || e.clientHeight|| g.clientHeight * ratio;
            this.resize(x,y);
            return [x,y];
        },
        revFullscreen:function(){
            var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            y = win.innerWidth || e.clientWidth || g.clientWidth,
            x = win.innerHeight || e.clientHeight|| g.clientHeight;
            this.resize(x,y);
            return [x,y];
        },
        autoresize:function(bool,x,y){
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
		
		fullScreenBtn:undefined,
		focused:false,
		
		debug:false,
		debugs:[],

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
			
            this.context.touch.draw=this.context.draw;
			this.context.touch.canvas.w=this.context.canvas.src.width;
            this.context.touch.canvas.h=this.context.canvas.src.height
			
			this.context.particles.draw=this.context.draw;
            
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
                    this.context.canvas.resize();
                }
                
                //cam
                if(this.context.draw.cam.w<=0.01){
                    this.context.draw.cam.w=0.01;
                }
                
                if(this.context.draw.cam.h<=0.01){
                    this.context.draw.cam.h=0.01;
                }
                
                //add gamepads
                var gamepads=navigator.getGamepads();
                if(gamepads[0]==undefined && gamepads[1]==undefined && gamepads[2]==undefined && gamepads[3]==undefined){
                    //no gamepads
                }else{
                    for(var i=0;i<4;i++){ 
                        if(gamepads[i]!=undefined){
                            if(this.context.gamepad.gamepads[i]==undefined){
                                this.context.gamepad.gamepads[i]={
                                    axes:[{},{}],
                                    buttons:[]
                                };
                            }
                                
                            this.context.gamepad.gamepads[i].axes[0].x=gamepads[i].axes[0];
                            this.context.gamepad.gamepads[i].axes[0].y=gamepads[i].axes[1];
                            this.context.gamepad.gamepads[i].axes[1].x=gamepads[i].axes[2];
                            this.context.gamepad.gamepads[i].axes[1].y=gamepads[i].axes[3];

                            this.context.gamepad.gamepads[i].id=gamepads[i].id;
                            this.context.gamepad.gamepads[i].connected=gamepads[i].connected;

                            for(var j=0;j<gamepads[i].buttons.length;j++){
                                var pressed=0;
                               
                                if(this.context.gamepad.gamepads[i].buttons[j]!=undefined){
                                    
                                    if(this.context.gamepad.gamepads[i].buttons[j].value>0){
                                    pressed=1;
                                    }
                                    
                                    if(this.context.gamepad.gamepads[i].buttons[j].pressed==1 || this.context.gamepad.gamepads[i].buttons[j].pressed==2){
                                        pressed=2;
                                    }
                                    
                                    if(this.context.gamepad.gamepads[i].buttons[j].value<=0){
                                    pressed=0;
                                    }
                                    
                                
                                }
                                
                                this.context.gamepad.gamepads[i].buttons[j]={
                                    
                                    value:gamepads[i].buttons[j].value,
                                    pressed:pressed
                                }
                            }
                        }
                    }
                }
				
				 //fullScreenBtn update
				if(this.fullScreenBtn && this.context.isMobile()){
					if(this.focused){
						var w=50/8;
						
						//check if user pressed the button
						if(this.context.mouse.check(0,0,w*8,w*8,true,false) || this.context.touch.check(0,0,w*8,w*8,true,false)>0){
							this.context.touch.touches=[];
							this.context.canvas.fullScreen=!this.context.canvas.fullScreen;
							var el = document.getElementById("jeuConteneur");
							if(this.context.canvas.fullScreen){
								if (el.requestFullscreen) {
									el.requestFullscreen();
								} else if (el.mozRequestFullScreen) { // Firefox 
									el.mozRequestFullScreen();
								} else if (el.webkitRequestFullscreen) { // Chrome, Safari and Opera 
									el.webkitRequestFullscreen();
								} else if (el.msRequestFullscreen) { // IE/Edge 
									el.msRequestFullscreen();
								}
							}else{
								if (document.exitFullscreen) {
									document.exitFullscreen();
								} else if (document.mozCancelFullScreen) { // Firefox 
									document.mozCancelFullScreen();
								} else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera 
									document.webkitExitFullscreen();
								} else if (document.msExitFullscreen) { // IE/Edge 
									document.msExitFullscreen();
								}
							}
						}
					}else{
						if(this.context.mouse.check(0,0,this.context.canvas.w,this.context.canvas.h,true,false) || this.context.touch.check(0,0,this.context.canvas.w,this.context.canvas.h,true,false)>0){
							this.focused=true;
							this.context.touch.touches=[];
						}
					}
				}
				
                
                //update fonction by user
                if(this.obj!=undefined){
                  window[this.obj][this.updateName]();
                }else{
                  window[this.updateName]();
                }
				
				//update particles
				if(this.context.particles.parts.length>0){
					for(var i=0;i<this.context.particles.parts.length;i++){
						if(this.context.particles.updateParticle(i)){
							this.context.particles.parts.splice(i,1);
							i--;
						}
					}
				}
				
				
                
                //fullScreenBtn draw
				if(this.fullScreenBtn && this.context.isMobile()){
					if(this.focused){
						var w=50/8;
						
						this.context.draw.alpha(0.67);
						for(var y=0;y<8;y++){
							for(var x=0;x<8;x++){
								if(y==0 || y==7 || x==0 || x==7 || y==3 || y==4 || x==3 || x==4){
									this.context.draw.ctx.fillStyle="black";
								}else{
									this.context.draw.ctx.fillStyle="white";
								}
								if(this.context.canvas.fullScreen){
									if((x==1 && y==1) || (x==6 && y==6) || (x==1 && y==6) || (x==6 && y==1)){
										this.context.draw.ctx.fillStyle="black";
									}
								}else if(!this.context.canvas.fullScreen){
									if((x==2 && y==2) || (x==5 && y==5) || (x==2 && y==5) || (x==5 && y==2)){
										this.context.draw.ctx.fillStyle="black";
									}
								}
								
								this.context.draw.ctx.fillRect(x*w,y*w,w,w);
							}
						}
						this.context.draw.alpha(1);
					}else{
						
						this.context.draw.alpha(0.5);
						this.context.draw.ctx.fillStyle="black";
						this.context.draw.ctx.fillRect(0,0,this.context.canvas.w,this.context.canvas.h);
						//this.context.draw.ctx.fillStyle="white";
						this.context.draw.font("Consolas",20);
						this.context.draw.alpha(1);
						this.context.draw.text("Click anywhere to start!",this.context.canvas.w/2,this.context.canvas.h/2,"white","center");
					}
				}
				
				
				//debug
				if(this.debug){
					for(var i=0;i<this.debugs.length;i++){
						var d=this.debugs[i];
						if(d.type=="text"){
							this.context.draw.text(d.string,d.x,d.y,d.color,d.textAlign,d.fontSize,d.rotation,d.maxChars,d.newLineHeight);
						}else if(d.type=="shape"){
							this.context.draw.shape(d);
						}
						if(d.stay==false){
							this.debugs.splice(i,1)
							i--;
						}
					}
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
				
				//remove mouse scroll
                if(this.context.mouse.scroll!=0){
                    this.context.mouse.scroll=0;
                }
                
                //remove mouse press
				this.context.mouse.press=[false,false,false,false,false]
				
				//remove touch press
                if(this.context.touch.press==true){
                    this.context.touch.press=false;
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
        },
		
		getDebug:function(){
			return this.debugs;
		},
		
		debugging:function(bool){
			this.debug=bool;
		},
		
		addDebugText:function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight,stay){
			this.debugs.push({type:"text",string:string,x:x,y:y,color:color,textAlign:textAlign,fontSize:fontSize,rotation:rotation,maxChars:maxChars,newLineHeight:newLineHeight})
		},
		
		addDebugShape:function(obj){
			obj.type="shape";
			this.debugs.push(obj);
		},
		
		clearDebugs:function(){
			this.debugs=[];
		}
    }
    
    
    
    this.assets={
        //images:
        images:{},
        //anims
        anims:{},
        //sounds
        sounds:{},
		
		//audioSrc
		soundSrc:"",
		musicSrc:"",
        
        //audioBtn
        soundBtn:undefined,
        musicBtn:undefined,
        
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
            this.repeat=false;
            if(repeat!=undefined){
                if(repeat==true){
                    this.sounds[name].addEventListener('ended', this.stopPlay.bind(context,name), false);
                }
                this.repeat=repeat;
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
				for(var sound in this.sounds){
					if(this.sounds.hasOwnProperty(sound)){
						this.sounds[sound].volume=this.vol;
					}
				}
            }else{
                return this.vol;
            }
              
        },
        //mute sounds
        mute:function(bool){
          if(bool!=undefined){
              this.mut=bool;
			  for(var sound in this.sounds){
					if(this.sounds.hasOwnProperty(sound)){
						if(this.mut==true){this.sounds[sound].volume=0;}else{this.sounds[sound].volume=this.vol;}
					}
				}
          }  else{
              return this.mut;
          }
        },
        //sound event after button press
        soundEvent:function(){
            this.assets.soundBtn.style.display="none";
            var sound=new Audio();
            
            sound.src="";
            for(var s in this.sounds()){
                if(this.sounds().hasOwnProperty(s)){
                    this.sounds()[s].pause();
				    this.sounds()[s].currentTime=0;
                    if(s=="sound"){
                        sound.src=this.sounds()[s].src;
                    }
                }
            }
            
            sound.load();
            this.changeSoundSrc(sound);
        },
        //music event after button press
        musicEvent:function(){
            this.assets.musicBtn.style.display="none";
            var music=new Audio();
            
            music.src="";
            for(var s in this.sounds()){
                if(this.sounds().hasOwnProperty(s)){
                    this.sounds()[s].pause();
				    this.sounds()[s].currentTime=0;
                    if(s=="music"){
                        music.src=this.sounds()[s].src;
                    }
                }
            }
            music.load();
            this.changeMusicSrc(music);
        },
		//add the sound source for safari
		changeSoundSrc:function(soundSrc){
			this.soundSrc=soundSrc;
            
		},
        //change repeat sound src
        repeatSoundSrc:function(repeat){
            if(repeat==true && this.soundSrc!=""){
                this.soundSrc.setAttribute("loop","loop");
            }else if(this.soundSrc!=""){
                this.soundSrc.removeAttribute("loop");
            }
        },
		//add the music source for safari
		changeMusicSrc:function(musicSrc){
			this.musicSrc=musicSrc;
            
		},
        //change repeat music src
        repeatMusicSrc:function(repeat){
            if(repeat==true && this.musicSrc!=""){
                this.musicSrc.setAttribute("loop","loop");
            }else if(this.musicSrc!=""){
                this.musicSrc.removeAttribute("loop");
            }
        },
        //play a sound
        play:function(name,src){
			var source="";
			if(src=="sound"){source=this.soundSrc}else if(src=="music"){source=this.musicSrc}
			if(source!="" && ((src=="sound" && this.soundSrc!="") || (src=="music" && this.musicSrc!=""))){
                if(source.src==""){source.src=this.sounds[name].src;source.load();}
				else if(source.src!=this.sounds[name].src){source.src=this.sounds[name].src;}
				source.play();
			}else if(source==""){
				//this.stop(name);
				this.sounds[name].volume=this.vol;
				if(this.mut==true){this.sounds[name].volume=0;}else{this.sounds[name].volume=this.vol;}
				this.sounds[name].play();
			}
        },
        //pause a sound
        pause:function(name,src){
			var source="";
			if(src=="sound"){source=this.soundSrc}else if(src=="music"){source=this.musicSrc}
			if(source!="" && ((src=="sound" && this.soundSrc!="") || (src=="music" && this.musicSrc!=""))){
				if(source.src==""){source.src=this.sounds[name].src;source.load();}
				else if(source.src!=this.sounds[name].src){source.src=this.sounds[name].src;}
				source.pause();
			}else if(source==""){
				this.sounds[name].pause();
			}
        },
        //stop a sound (reset it to 0)
        stop:function(name,src){
			var source="";
			if(src=="sound"){source=this.soundSrc}else if(src=="music"){source=this.musicSrc}
			if(source!="" && ((src=="sound" && this.soundSrc!="") || (src=="music" && this.musicSrc!=""))){
				if(source.src==""){source.src=this.sounds[name].src;source.load();}
				else if(source.src!=this.sounds[name].src){source.src=this.sounds[name].src;}
				source.pause();
				source.currentTime=0;
			}else if(source==""){
				this.sounds[name].pause();
				this.sounds[name].currentTime=0;
			}
        },
        //stop then play
        stopPlay:function(name,src){
            this.stop(name,src);
            this.play(name,src);
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
            return this.cam.active;
        },
		
		//change alpha
		alpha:function(alpha){
			this.ctx.globalAlpha=alpha;
		},

        //Drawing a background
        bg: function(color) {
            this.ctx.fillStyle = this.color(color);
            this.ctx.fillRect(0,0,this.canvas.w,this.canvas.h);
        },
        
        //Check if horizontal value in percent
        percentX:function(val,start,end){
            var value=val;
            if(start==undefined){
                start=0;
            }
            if(end==undefined){
                end=this.canvas.w;
            }
            if(typeof val=="string"){
                value=((end-start)*(parseInt(val))/100)+start;
            }else if(typeof val=="number"){
                value=((end-start)*(val)/100)+start;
            }
            return value;
        },
        
        //Check if vertical value in percent
        percentY:function(val,start,end){
            var value=val;
            if(start==undefined){
                start=0;
            }
            if(end==undefined){
                end=this.canvas.h;
            }
            if(typeof val=="string"){
                value=((end-start)*(parseInt(val))/100)+start;
            }else if(typeof val=="number"){
                value=((end-start)*(val)/100)+start;
            }
            return value;
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
            this.fill("arcB",x+d/2,y+d/2,d/2);
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
        text:function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight){
            if(textAlign!=undefined){
                this.ctx.textAlign=textAlign
            }
            if(fontSize!=undefined){
                this.fontSize=fontSize
            }
            this.ctx.fillStyle= this.color(color);
            this.ctx.font=this.fontSize+"px "+this.fontName;
            if(maxChars!=undefined){
                if(newLineHeight==undefined){newLineHeight=this.fontSize}
                var lineHeight=newLineHeight;
                
                var strings=[];
                var lastChar=0;
                var nextChar=0;
                var nbrStrings=Math.ceil(string.length/maxChars);
                for(var i=0;i<20;i++){
                    nextChar=lastChar;
                    lastChar+=maxChars;
                    
                    var done=false;
                    if(lastChar>=string.length){
                        lastChar=string.length;
                        done=true;
                    }
                    if(string[lastChar-1]!=" " && !done){
                        for(var j=0;j<20;j++){
                            lastChar--;
                            if(string[lastChar-1]==" "){
                                break;
                            }
                        }
                    }
                    strings.push(string.substring(nextChar,lastChar));
                    if(done){
                        break;
                    }
                }
                
                for(var i=0;i<strings.length;i++){
                    var s=strings[i];
                    this.fill("text",x,y+(lineHeight*i),this.ctx.measureText(s).width,this.fontSize,rotation,s)
                }
                
            }else{
                this.fill("text",x,y,this.ctx.measureText(string).width,this.fontSize,rotation,string)
            }
            
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
        textB:function(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight){
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
            
            if(maxChars!=undefined){
                if(newLineHeight==undefined){newLineHeight=this.fontSize}
                var lineHeight=newLineHeight;
                
                 var strings=[];
                var lastChar=0;
                var nextChar=0;
                var nbrStrings=Math.ceil(string.length/maxChars);
                for(var i=0;i<20;i++){
                    nextChar=lastChar;
                    lastChar+=maxChars;
                    
                    var done=false;
                    if(lastChar>=string.length){
                        lastChar=string.length;
                        done=true;
                    }
                    if(string[lastChar-1]!=" " && !done){
                        for(var j=0;j<20;j++){
                            lastChar--;
                            if(string[lastChar-1]==" "){
                                break;
                            }
                        }
                    }
                    strings.push(string.substring(nextChar,lastChar));
                    if(done){
                        break;
                    }
                }
                
                for(var i=0;i<strings.length;i++){
                    var s=strings[i];
                    this.fill("text",x,y+(lineHeight*i),this.ctx.measureText(s).width,this.fontSize,rotation,s)
                }
                
            }else{
                this.fill("textB",x,y,this.ctx.measureText(string).width,this.fontSize,rotation,string)
            }
        },

        //Setting the font
        font:function(fontName,size,color){
            this.fontName=fontName;
            this.fontSize=size;
            this.ctx.font=this.fontSize+"px "+this.fontName;
            this.ctx.fillStyle= this.color(color);
        },
		
		//Setting the baseline
        baseline:function(baseline){
            this.ctx.textBaseline= baseline;
        },

        //Draw an image
        image:function(name,newX,newY,w,h,rotation,sX,sY,sW,sH){

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

        },
        
        rotate:function(rotation,x,y){
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
			var xx=this.canvas.src.width/2;
			var yy=this.canvas.src.height/2;
			if(x!=undefined){xx=x;}
			if(y!=undefined){yy=y;}
			
            this.ctx.translate(xx,yy);
            this.ctx.rotate(rotation*Math.PI/180);
            this.ctx.translate(-xx,-yy);
        }
    }
    
    this.draw.assets=this.assets;
    
    
    
    
    
    
    
    
    this.html={
        id:function(id){
            return document.getElementById(id);
        },
        class:function(className){
            return document.getElementsByClassName(className);
        },
        ratio:function(){
            return window.devicePixelRatio;
        }
    }


    this.math= {
        random: function(min,max,variable) {
            //smaller variable = more possibilites
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
			var done=false;
			var cpt=0;
			while(!done){
				if(cpt==100){
					break;
				}
				if(num<min){
					num=max-(min-num);
				}else if(num>max){
					num=min+(num-max)
				}else{
					done=true;
				}
				cpt++;
			}
            return num
        },
        choose: function(numbers,number2) {
			//retro compatibility
			if(number2!=undefined){numbers=[numbers,number2]};
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
		
		arr: function(w,val){
            var arr=new Array(w);
            for(var i=0;i<arr.length;i++){
				if(val!=undefined){
					arr[i]=val
				}
            }
            return arr;
        },

        matrix: function(w,h,val){
            var mat=new Array(h);
            for(var i=0;i<mat.length;i++){
                mat[i]=new Array(w);
                if(val!=undefined){
                    for(var j=0;j<mat[i].length;j++){
                        mat[i][j]=val;
                    }
                }
            }
            return mat;
        },
		
		copyArr: function(arr){
            var mat=[];
            for(var i=0;i<arr.length;i++){
                mat.push(arr[i]);
            }
            return mat;
        },
		
		lerp:function(min,max,percent){
			return min+(max-min)*percent;
		}


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
	
	
	//***** PARTICLES *****//
	this.particles={
		draw:undefined,
		parts:[],
		addParticle:function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id){
			var part={};
			part.x=x;
			if(x==undefined){part.x=this.draw.canvas.width/2}
			part.y=y;
			if(y==undefined){part.y=this.draw.canvas.height/2}
			part.w=w;
			if(w==undefined){part.w=this.draw.canvas.width/100}
			part.h=h;
			if(h==undefined){part.h=this.draw.canvas.height/100}
			
			part.frame=0;
			part.frames=frames;
			if(frames==undefined){part.frames=59}
			part.wRate=wRate;
			if(wRate==undefined){part.wRate=0}
			part.hRate=hRate;
			if(hRate==undefined){part.hRate=0}
			
			part.alpha=alpha;
			if(alpha==undefined){part.alpha=1}
			part.alphaRate=alphaRate;
			if(alphaRate==undefined){part.alphaRate=0}
			
			part.vX=vX;
			if(vX==undefined){part.vX=0}
			part.vY=vY;
			if(vY==undefined){part.vY=0}
			part.aX=aX;
			if(aX==undefined){part.aX=0}
			part.aY=aY;
			if(aY==undefined){part.aY=0}
			
			part.c=c;
			if(c==undefined){part.c=[0,0,0]}
			part.cRate=cRate;
			if(cRate==undefined){part.cRate=[0,0,0]}
			part.cMax=cMax;
			if(cMax==undefined){part.cMax=[0,0,0]}
			part.rotation=0;
			part.r=r;
			if(r==undefined){part.r=0}
			part.id=id;
			if(id==undefined){part.id=0}
			
			this.parts.push(part);
		},
		
		updateParticle:function(i){
			var p=this.parts[i];
			var dead=false;
			
			p.w+=p.wRate;
			p.h+=p.hRate;
			
			p.alpha+=p.alphaRate;
			
			p.vX+=p.aX;
			p.vY+=p.aY;
			p.x+=p.vX;
			p.y+=p.vY;
			
			p.c[0]+=p.cRate[0];
			if(p.cRate[0]>0){if(p.c[0]>p.cMax[0]){p.c[0]=p.cMax[0]}}else if(p.cRate[0]<0){if(p.c[0]<p.cMax[0]){p.c[0]=p.cMax[0]}}
			p.c[1]+=p.cRate[1];
			if(p.cRate[1]>0){if(p.c[1]>p.cMax[1]){p.c[1]=p.cMax[1]}}else if(p.cRate[1]<0){if(p.c[1]<p.cMax[1]){p.c[1]=p.cMax[1]}}
			p.c[2]+=p.cRate[2];
			if(p.cRate[2]>0){if(p.c[2]>p.cMax[2]){p.c[2]=p.cMax[2]}}else if(p.cRate[2]<0){if(p.c[2]<p.cMax[2]){p.c[2]=p.cMax[2]}}
			
			p.rotation+=p.r;
			
			if(p.frame>=p.frames || p.alpha<=0 || p.w<=0 || p.h<=0){dead=true;}
			p.frame++;
			return dead;
		},
		drawParticles:function(){
			for(var i=0;i<this.parts.length;i++){
				this.drawParticle(i);
			}
		},
		drawParticle:function(i){
			var p=this.parts[i];
			//x,y,w,h,color,rotation
			if(p.alpha!=1){
				this.draw.alpha(p.alpha);
			}
			this.draw.rect(p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.c,p.rotation);
			if(p.alpha!=1){
				this.draw.alpha(1);
			}
		},
		clear:function(){
			this.parts=[];
		}
	}
    
    
    
    //***** GAMEPAD *****//
    this.gamepad={
        buttons:{
            a:0,
            b:1,
			x:2,
			y:3,
			leftShoulder:4,
			rightShoulder:5,
			leftTrigger:6,
			rightTrigger:7,
            back:8,
            start:9,
            leftStick:10,
            rightStick:11,
            dpadUp:12,
            dpadDown:13,
            dpadLeft:14,
            dpadRight:15,
            home:16,
        },
        connected:[false,false,false,false],
        gamepads:[],
        checkConnected:function(controller){
            if(controller==undefined){
                controller=0;
            }
            return this.connected[controller];
        },
        buttonsdown:[],
        
        axes:function(axes,controller){
            if(axes==undefined){
                axes=0;
            }
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                var arr=[];
                arr[0]=this.gamepads[controller].axes[axes].x;
                arr[1]=this.gamepads[controller].axes[axes].y;
                return arr;
            }
        },
        
        check: function(button,controller) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(typeof(button)=="object" && button.length>0){
                    var allFound=true;
                    for(var i=0;i<button.length;i++){
                        if(!this.check(button[i],controller)){
                            allFound=false;
                        }
                    }
                    if(allFound){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(this.buttons[button]!=undefined){
                        button=this.buttons[button];
                    }
                    var found = false;
                    if(this.gamepads[controller].buttons[button].value>0){
                        found=true;
                    }
                    return found;
                }
            }
            
        },
        
        value: function(button,controller) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(typeof(button)=="object" && button.length>0){
                    var allFound=true;
                    for(var i=0;i<button.length;i++){
                        if(!this.value(button[i],controller)){
                            allFound=false;
                        }
                    }
                    if(allFound){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(this.buttons[button]!=undefined){
                        button=this.buttons[button];
                    }
                    var value = this.gamepads[controller].buttons[button].value;
                    return value;
                }
            }
            
        },
        
        press: function(button,controller) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(this.buttons[button]!=undefined){
                    button=this.buttons[button];
                }
                var found = this.gamepads[controller].buttons[button].pressed;
                if(found==1){
                    return true;
                }else{
                    return false;
                }
            }
        },

        release: function(button,controller) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(button==undefined){
                    for(var i=0;i<this.gamepads[controller].buttons.length;i++){
                        this.gamepads[controller].buttons.value=0;
                    }
                }else{
                    if(this.   buttons[button]!=undefined){
                        button=this.buttons[button];
                    }
                    this.gamepads[controller].buttons[button].value=0;
                }
            }
        }
    }
    
    //***** KEYBOARD *****//
    this.keyboard={
        keys:{
            
            backspace:8,
            tab:9,
            enter:13,
			shift:16,
			control:17,
			ctrl:17,
			controlL:17,
			ctrlL:17,
			alt:18,
			pause:19,
			capsLock:20,
            escape:27,
            space:32,
            pageUp:33,
            pageDown:34,
            left:37,
            up:38,
            right:39,
            down:40,
            insert:45,
            "delete":46,
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
			"meta":91,
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
            "num*":106,
            "num+":107,
            "num-":109,
            "num.":110,
            "num/":111,
            f1:112,
            f2:113,
            f3:114,
            f4:115,
            f5:116,
            f6:117,
            f7:118,
            f8:119,
            f9:120,
            f10:121,
            f11:122,
            f12:123,
            "numLock":144,
            "scrollLock":145,
			";":186,
			":":186,
			"=":187,
			",":188,
			"-":189,
			".":190,
			"é":191,
			"è":192,
			"^":219,
			"à":220,
			"ç":221,
			"/":222,
			controlR:223,
			ctrlR:223,
			"ù":226,
			"fn":255
			
			
        },
        keysdown:[],
		simulate:function(evt,keyCode){
			if(this.keys[keyCode]!=undefined){
                keyCode=this.keys[keyCode];
			}
			//keydown,keyup
			var evt = new KeyboardEvent(evt, {'keyCode':keyCode});
			document.dispatchEvent (evt);
		},
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
		preventRight:false,
        draw:undefined,
        press:[false,false,false,false,false],
        down:[false,false,false,false,false],
		scroll:0,
        canvas:{w:0,h:0},
        //check if mouse is pressing inside these coordinates, if type is true, check if mouse is pressed instead of down
        check:function(x,y,w,h,press,cam,btn){
            if(x==undefined){x=0;}
            if(y==undefined){y=0;}
            if(w==undefined){w=this.canvas.w;}
            if(h==undefined){h=this.canvas.h;}
			if(btn==undefined){btn=0;}
            var checking=this.down[btn];
            var mX=this.cX;
            var mY=this.cY;
            if(press!=undefined){
                if(press==true){
                    checking=this.press[btn];
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
	
	//***** TOUCH *****//
	this.touch={
		touches:undefined,
		down:false,
		press:false,
		force:0,
		draw:undefined,
		canvas:{w:0,h:0},
		//check if touch is pressing inside these coordinates, if type is true, check if touch is pressed instead of down
		check:function(x,y,w,h,press,cam){
            if(x==undefined){x=0;}
            if(y==undefined){y=0;}
            if(w==undefined){w=this.canvas.w;}
            if(h==undefined){h=this.canvas.h;}
            var checking=this.down;
            if(press!=undefined){
                if(press==true){
                    checking=this.press;
                }
            }
            
            if(cam==undefined){
                cam=this.draw.cam.active;
            }
			
			var force=0;
			if(checking){
				for(var i=0;i<this.touches.length;i++){
					var touch=this.touches[i];
					var tX=touch.cX;
					var tY=touch.cY;
					if(cam==false){
						tX=touch.x;
						tY=touch.y;
					}
					
					if(tX>=x && tX<= x+w && tY>=y && tY<=y+h){
						force++;
					}
				}
			}
			
			return force;
        },
	}
    
    //***** MOBILE *****//
    this.mobile={
        isAndroid: function() {
            return navigator.userAgent.match(/Android/i);
        },
        isBlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        isIOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        isOpera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        isWindows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        isAny: function() {
            return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isOpera() || this.isWindows());
        },
    }
    
    //***** CREATE EVENT LISTENERs *****//
    this.createEventListeners=function(context) {
        context.canvas.src.addEventListener("mousemove", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
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
			}
        });

        context.canvas.src.addEventListener("mousedown", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				
				
				context.mouse.down[evt.which-1]=true;
				context.mouse.press[evt.which-1]=true;
			}
        });

        context.canvas.src.addEventListener("mouseup", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				
				context.mouse.down[evt.which-1]=false;
				context.mouse.press[evt.which-1]=false;
			}
        });
		
		context.canvas.src.addEventListener("wheel", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				context.mouse.scroll=evt.deltaY;
			}
        });
		
		context.canvas.src.addEventListener("contextmenu", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				if(context.mouse.preventRight){evt.preventDefault();}
			}
        });
		
		
		context.canvas.src.addEventListener("touchstart", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				var rect = context.canvas.src.getBoundingClientRect();
				
				var camW=Math.abs(context.canvas.src.width/context.draw.cam.w)
				var camH=Math.abs(context.canvas.src.height/context.draw.cam.h)
				var camX=context.draw.cam.x;
				var camY=context.draw.cam.y;
				
				var touches=[];
				
				var force=0;
				
				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width);
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height);
					
					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;
					
					touches[i].cX = (tX/camW)+camX;
					touches[i].cY = (tY/camH)+camY;
				}
				context.touch.touches=touches;
				
				if(force>0){
					context.touch.down=true;
					context.touch.press=true;
				}else{
					context.touch.down=false;
					context.touch.press=false;
				}
				
				context.touch.force=force;
			}
        });
		
		context.canvas.src.addEventListener("touchmove", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				var rect = context.canvas.src.getBoundingClientRect();
				
				var camW=Math.abs(context.canvas.src.width/context.draw.cam.w)
				var camH=Math.abs(context.canvas.src.height/context.draw.cam.h)
				var camX=context.draw.cam.x;
				var camY=context.draw.cam.y;
				
				var touches=[];
				
				var force=0;
				
				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width);
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height);
					
					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;
					
					touches[i].cX = (tX/camW)+camX;
					touches[i].cY = (tY/camH)+camY;
				}
				
				context.touch.touches=touches;
				
				if(force>0){
					context.touch.down=true;
				}else{
					context.touch.down=false;
				}
				
				context.touch.force=force;
			}
        });
		
		context.canvas.src.addEventListener("touchend", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				var rect = context.canvas.src.getBoundingClientRect();
				
				var camW=Math.abs(context.canvas.src.width/context.draw.cam.w)
				var camH=Math.abs(context.canvas.src.height/context.draw.cam.h)
				var camX=context.draw.cam.x;
				var camY=context.draw.cam.y;
				
				var touches=[];
				
				var force=0;
				
				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width);
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height);
					
					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;
					
					touches[i].cX = (tX/camW)+camX;
					touches[i].cY = (tY/camH)+camY;
				}
				
				context.touch.touches=touches;
				
				if(force==0){
					context.touch.down=false;
					context.touch.press=false;
				}
				
				context.touch.force=force;
			}
        });
		
		context.canvas.src.addEventListener("touchcancel", function(evt) {
			if(document.activeElement.tagName!="INPUT"){
				evt.preventDefault();
				
				var rect = context.canvas.src.getBoundingClientRect();
				
				var camW=Math.abs(context.canvas.src.width/context.draw.cam.w)
				var camH=Math.abs(context.canvas.src.height/context.draw.cam.h)
				var camX=context.draw.cam.x;
				var camY=context.draw.cam.y;
				
				var touches=[];
				
				var force=0;
				
				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width);
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height);
					
					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;
					
					touches[i].cX = (tX/camW)+camX;
					touches[i].cY = (tY/camH)+camY;
				}
				
				context.touch.touches=touches;
				
				if(force==0){
					context.touch.down=false;
					context.touch.press=false;
				}
				
				context.touch.force=force;
			}
		});

        document.addEventListener("keydown", function(){
			if(document.activeElement.tagName!="INPUT"){
				event.preventDefault();
				
				
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
			}
        });
        
        document.addEventListener("keyup", function(){
			if(document.activeElement.tagName!="INPUT"){
				event.preventDefault();
				
				var keys = context.keyboard.keysdown;
				for(var i=0; i<keys.length; i++) {
					if(keys[i].key==event.keyCode) {context.keyboard.keysdown.splice(i,1);}
				}
			}
        });
        
        

        window.addEventListener("gamepadconnected", function(e){
			context.gamepad.connected[e.gamepad.index]=true;
        });
        
        window.addEventListener("gamepaddisconnected", function(e){
			context.gamepad.connected[e.gamepad.index]=false;
        });
    }
    
    
    //start
    this.init(id,w,h,fps,setupName,updateName,objName,mobileAudioSize,fullScreenBtn)
    
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
    
    this.revFullscreen=function(){
        return this.canvas.revFullscreen();
    }
    
    this.autoresize=function(bool,x,y){
        return this.canvas.autoresize(bool,x,y);
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
	
	this.debug=function(bool){
		return this.loop.debugging(bool);
	}
	
	this.debugging=function(bool){
		return this.loop.debugging(bool);
	}
	
	this.debugs=function(){
		return this.loop.debugs;
	}
	
	this.getDebugs=function(){
		return this.loop.debugs;
	}
	
	this.clearDebugs=function(){
		return this.loop.clearDebugs();
	}
	
	this.delDebugs=function(){
		return this.loop.clearDebugs();
	}
	
	this.addDebugStay=function(obj,par2,par3,par4,par5,par6,par7,par8,par9){
		if(typeof obj=="string"){
			return this.loop.addDebugText(obj,par2,par3,par4,par5,par6,par7,par8,par9,true);
		}else if(typeof obj=="number"){
			return this.loop.addDebugShape({x:obj,y:par2,w:par3,h:par4,c:par5,r:par6,stay:true});
		}else{
			if(obj.string!=undefined){
				return this.loop.addDebugText(obj.string,obj.x,obj.y,obj.color,obj.textAlign,obj.fontSize,obj.rotation,obj.maxChars,obj.newLineHeight,true);
			}else{
				obj.stay=true;
				return this.loop.addDebugShape(obj);
			}
		}
	}
	
	this.addDebug=function(obj,par2,par3,par4,par5,par6,par7,par8,par9){
		if(typeof obj=="string"){
			return this.loop.addDebugText(obj,par2,par3,par4,par5,par6,par7,par8,par9,false);
		}else if(typeof obj=="number"){
			return this.loop.addDebugShape({x:obj,y:par2,w:par3,h:par4,c:par5,r:par6,stay:false});
		}else{
			if(obj.string!=undefined){
				return this.loop.addDebugText(obj.string,obj.x,obj.y,obj.color,obj.textAlign,obj.fontSize,obj.rotation,obj.maxChars,obj.newLineHeight,false);
			}else{
				obj.stay=false;
				return this.loop.addDebugShape(obj);
			}
		}
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
	
	this.changeSoundSrc=function(soundSrc,repeat){
		return this.assets.changeSoundSrc(soundSrc,repeat)
	}
    
    this.repeatSoundSrc=function(repeat){
		return this.assets.repeatSoundSrc(repeat);
	}
    
    this.soundSrc=function(){
		return this.assets.soundSrc;
	}
	
	this.changeMusicSrc=function(musicSrc,repeat){
		return this.assets.changeMusicSrc(musicSrc,repeat)
	}
    
    this.repeatMusicSrc=function(repeat){
		return this.assets.repeatMusicSrc(repeat);
	}
    
    this.musicSrc=function(){
		return this.assets.musicSrc;
	}
    
    this.play=function(name,src){
        return this.assets.play(name,src);
    }
    
    this.sound=function(name){
        return this.assets.play(name);
    }
    
    this.pause=function(name,src){
        return this.assets.pause(name,src);
    }
    
    this.stop=function(name,src){
        return this.assets.stop(name,src);
    }
    
    this.stopPlay=function(name,src){
        return this.assets.stopPlay(name,src);
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
    
	this.alpha=function(alpha){
        return this.draw.alpha(alpha);
    }
	
	this.camactive=function(bool){
		return this.draw.camactive(bool);
	}
	
	this.camActive=function(bool){
		return this.draw.camactive(bool);
	}
	
    this.bg=function(color){
        return this.draw.bg(color);
    }
    
    this.percentX=function(val,start,end){
        return this.draw.percentX(val,start,end);
    }
    
    this.pX=function(val,start,end){
        return this.draw.percentX(val,start,end);
    }
    
    this.percentY=function(val,start,end){
        return this.draw.percentY(val,start,end);
    }
    
    this.pY=function(val,start,end){
        return this.draw.percentY(val,start,end);
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
    
    this.text=function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight){
        return this.draw.text(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight);
    }
    
    this.textB=function(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight){
        return this.draw.textB(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight);
    }
    
    this.textW=function(string){
        return this.draw.textW(string);
    }
    
    this.textH=function(string){
        return this.draw.textH(string);
    }
    
    this.font=function(fontName,fontSize,color){
        return this.draw.font(fontName,fontSize,color)
    }
	
	this.baseline=function(baseline){
        return this.draw.baseline(baseline)
    }
    
    this.image=function(name,newX,newY,w,h,rotation,sX,sY,sW,sH){
        return this.draw.image(name,newX,newY,w,h,rotation,sX,sY,sW,sH)
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
    
    this.rotate=function(rotation,x,y){
        return this.draw.rotate(rotation,x,y);
    }
    
    
    //html
    
    this.id=function(id){
        return this.html.id(id);
    }
    
    this.class=function(className){
        return this.html.class(className);
    }
    
    this.ratio=function(){
        return this.html.ratio();
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
    
    this.distP=function(x1,y1,x2,y2){
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
	
	this.arr=function(w,val){
        return this.math.arr(w,val);
    }
    
    this.matrix=function(w,h,val){
        return this.math.matrix(w,h,val);
    }
	
	this.copyArr=function(arr){
        return this.math.copyArr(arr);
    }
	
	this.lerp=function(min,max,val){
        return this.math.lerp(min,max,val);
    }
    
    
    //collision
    
    this.cRect=function(rect1,rect2){
        return this.collision.rect(rect1,rect2);
    }
    
    this.cCircle=function(circle1,circle2){
        return this.collision.circle(circle1,circle2);
    }
    
    this.cRectP=function(rect,point){
        return this.collision.rectPoint(rect,point);
    }
    
    this.cCircleP=function(circle,point){
        return this.collision.circlePoint(circle,point);
    }
    
    this.cRectC=function(rect,circle){
        return this.collision.rectCircle(rect,circle);
    }
	
	//particles
	
	this.particlesAdd=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id);
		}
	}
	
	this.addParticles=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id);
		}
	}
	
	this.partAdd=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id);
		}
	}
	
	this.addPart=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,id);
		}
	}
	
	this.particlesDraw=function(){
		return this.particles.drawParticles();
	}
	
	this.drawParticles=function(){
		return this.particles.drawParticles();
	}
	
	this.partDraw=function(){
		return this.particles.drawParticles();
	}
	
	this.drawPart=function(){
		return this.particles.drawParticles();
	}
	
	this.particlesClear=function(){
		return this.particles.clear();
	}
	
	this.clearParticles=function(){
		return this.particles.clear();
	}
	
	this.partClear=function(){
		return this.particles.clear();
	}
	
	this.clearPart=function(){
		return this.particles.clear();
	}
    
    //gamepad
    
    this.padCheck=function(button,controller){
        return this.gamepad.check(button,controller);
    }
    
    this.pCheck=function(button,controller){
        return this.gamepad.check(button,controller);
    }
    
    this.padPress=function(button,controller){
        return this.gamepad.press(button,controller);
    }
    
    this.pPress=function(button,controller){
        return this.gamepad.press(button,controller);
    }
    
    this.padValue=function(button,controller){
        return this.gamepad.value(button,controller);
    }
    
    this.pValue=function(button,controller){
        return this.gamepad.value(button,controller);
    }
    
    this.padRelease=function(button,controller){
        return this.gamepad.release(button,controller);
    }
    
    this.pRelease=function(button,controller){
        return this.gamepad.release(button,controller);
    }
    
    this.padAxes=function(axes,controller){
        return this.gamepad.axes(axes,controller);
    }
    
    this.pAxes=function(axes,controller){
        return this.gamepad.axes(axes,controller);
    }
    
    this.padConnected=function(controller){
        return this.gamepad.checkConnected(controller);
    }
    
    this.pConnected=function(controller){
        return this.gamepad.checkConnected(controller);
    }
    
    this.gamepads=function(){
        return this.gamepad.gamepads;
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
    
    this.keyRelease=function(keyCode){
        return this.keyboard.release(keyCode);
    }
    
    this.kRelease=function(keyCode){
        return this.keyboard.release(keyCode);
    }
    
    this.keys=function(){
        return this.keyboard.keys;
    }
	
	this.simKey=function(evt,keyCode){
		return this.keyboard.simulate(evt,keyCode);
	}
	
	this.sim=function(evt,keyCode){
		return this.keyboard.simulate(evt,keyCode);
	}
	
	this.simKeyDown=function(keyCode){
		return this.keyboard.simulate("keydown",keyCode);
	}
	
	this.simDown=function(keyCode){
		return this.keyboard.simulate("keydown",keyCode);
	}
	
	this.simKeyUp=function(keyCode){
		return this.keyboard.simulate("keyup",keyCode);
	}
	
	this.simUp=function(keyCode){
		return this.keyboard.simulate("keyup",keyCode);
	}
    
    
    //mouse
    
    this.mouseCheck=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,false,cam,btn);
    }
    
    this.mCheck=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,false,cam,btn);
    }
    
    this.mC=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,false,cam,btn);
    }
    
    this.mousePress=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,true,cam,btn);
    }
    
    this.mPress=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,true,cam,btn);
    }
    
    this.mP=function(x,y,w,h,cam,btn){
        return this.mouse.check(x,y,w,h,true,cam,btn);
    }
	
	this.mouseScroll=function(){
        return this.mouse.scroll;
    }
    
    this.mScroll=function(){
        return this.mouse.scroll;
    }
    
    this.mS=function(){
        return this.mouse.scroll;
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
    
    this.mouseDown=function(btn){
		if(btn==undefined){btn=0;}
        return this.mouse.down[btn];
    }
    
    this.mDown=function(btn){
		if(btn==undefined){btn=0;}
        return this.mouse.down[btn];
    }
	
	this.mousePrevent=function(bool){
		return this.mouse.preventRight=bool;
	}
	
	this.mPrevent=function(bool){
		return this.mouse.preventRight=bool;
	}
	
	//touch
	
	this.touches=function(){
		return this.touch.touches;
	}
    
	this.touchCheck=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,false,cam);
    }
	
	this.tCheck=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,false,cam);
    }
	
	this.tC=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,false,cam);
    }
	
	this.touchPress=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,true,cam);
    }
	
	this.tPress=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,true,cam);
    }
	
	this.tP=function(x,y,w,h,cam){
        return this.touch.check(x,y,w,h,true,cam);
    }
	
	this.touchDown=function(){
        return this.touch.down;
    }
    
    this.tDown=function(){
        return this.touch.down;
    }
    
    //mobile
    
    this.isMobile=function(){
        return this.mobile.isAny();
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
    
    this.s=function(name,src){
        return this.assets.stopPlay(name,src);
    }
	
	//retro compatibility
	
	this.addAlarm=function(name,time){
        return this.loop.alarm(name,time);
    }
	
	this.wrapVal=function(num,min,max){
        return this.math.wrap(num,min,max);
    }
    
    
}

/*
TEMPLATE:

<html>
    <head>
        <title>App</title>
        <style>
            *{
                padding: 0;
                margin: 0;
            }
            
            #can{
		position: absolute;
		margin-left:auto;
		margin-right:auto;
                top:0;
		left:0;
            }
	
		#can + span{
			display: none;	
		}

		#canContainer{
			position:relative;	
		}
        </style>
    </head>
    <body>
        <div id="canContainer">
        <canvas id="can"></canvas>
        <span>Made with <a href="https://github.com/ToniestTony/jt_lib">jt_lib12.js</a></span>
            </div>
    </body>
    <script src="jt_lib12.js"></script>
    
    <script>

	var app={
		w:600,
		h:400,
		//setup is called when the game has finished loading
		setup:function(){
			//jt.fullscreen(false);
		},
		//update is called every frame
		update:function(){
			//jt.bg("black");
		}
	}

	//define the jt object on a global scale
	var jt=undefined;
	
	//you can also use $(document).ready(function(){}); with jQuery
	window.onload = function(){
		//parameters of the JT object:
		//id of the canvas
		//width
		//height
		//frames per second
		//setup function name
		//update function name
		//object which has the function name
		//mobile audio button size (0 for none)
		//fullScreen button on mobile
		jt=new JT("can",app.w,app.h,60,'setup','update','app',0,false);
		
		//jt.loadImage("image.png","name")
		//jt.loadSound("sound.wav","name")
		//jt.loadAnim("src.png","name",number of frames,fps);
	}
	
	</script>
</html>

*/
