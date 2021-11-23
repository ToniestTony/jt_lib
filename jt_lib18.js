function JT(id,w,h,fps,setupName,updateName,objName,mobileAudioSize,fullScreenBtn){
    //constructor
    //initialize the canvas
    this.init=function(id,w,h,fps,setupName,updateName,objName,mobileAudioSize,fullScreenBtn){
        //add attributes to the canvas object of JT
        this.version=18;
		this.loop.version=this.version;
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
        }else{
			this.canvas.lastW=w;
			this.canvas.lastH=h;
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
        console.log('(JT'+this.version+') More info: https://github.com/ToniestTony/jt_lib)');

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

		pixelRate:1,

        auto:false,
        autoX:undefined,
        autoY:undefined,

        bord:false,
        bordX:1,
        bordY:1,
        bordC:"black",

		lastW:undefined,
		lastH:undefined,

        cursorVisible:true,

        context:undefined,
        //Resize the canvas
        resize:function(w,h,camsReset){
			//Resizing canvas resets a lot of ctx attributes, so we need to save/load them
			var alpha=this.context.drawing.alpha();
			var align=this.context.drawing.align();
			var baseLine=this.context.drawing.baseline();
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

            this.context.mouse.canvas.w=w;
            this.context.mouse.canvas.h=h;

			this.context.touch.canvas.w=w;
            this.context.touch.canvas.h=h;



			if(this.context.drawing.canvas!=undefined){
				this.context.drawing.canvas.w=w;
				this.context.drawing.canvas.h=h;


				if(camsReset=undefined){
					this.context.drawing.camsReset();
				}else{
					if(camsReset!=false){
						this.context.drawing.camsReset();
					}
				}
			}

			this.smoothing(false);

			//loading ctx attributes
			this.context.drawing.alpha(alpha);
			this.context.drawing.align(align);
			this.context.drawing.baseline(baseLine);
        },
		//Get ratio
		ratio:function(){
			return this.w/this.h;
		},
        setId(id){
            this.id=id;
            this.src = this.context.html.id(id);
            this.ctx = this.src.getContext("2d");
			this.ctx.textBaseline="hanging";
            this.context.drawing.ctx=this.ctx;

			this.src.tabIndex="1";
			this.src.style.outline="none";

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
        fullscreen:function(bool){
			if(bool!=undefined){
				var el=document.getElementById(this.context.canvas.src.id)
				if(bool){
					el.requestFullscreen();
					try{el.mozRequestFullScreen();}catch(error){}
					try{el.webkitRequestFullscreen();}catch(error){}
					try{el.msRequestFullscreen();}catch(error){}
				}else{
					document.exitFullscreen();
				}
			}
			if(document.fullscreenElement===null){
				return false;
			}else{
				return true;
			}
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
        cursor:function(style){
            if(style!=undefined){
                if(style==true){
                    this.src.style.cursor="auto";
                }else if(style==false){
                    this.src.style.cursor="none";
                }else{
                    this.src.style.cursor=style;
                }
            }
            if(this.src.style.cursor=="none"){
                return false;
            }else{
                return this.src.style.cursor;
            }
            
        },
    },


    this.loop={
        setupName:"setup",
        updateName:"update",
        obj:undefined,
		
		version:undefined,

        frames:0,
        fps:60,
        sec:0,
        interval:undefined,
		then:0,
		delay:0,

        pause:false,
        stop:false,

        loaded:false,
        setupDone:false,
        loadCounter:0,
        loadCounterMax:0,

		playAll:false,

		fullScreenBtn:undefined,
		focused:false,
		soundsPlayed:false,

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
            this.context.drawing.canvas=this.context.canvas;
            this.context.drawing.ctx=this.context.canvas.ctx;

			this.context.drawing.camsReset();
            this.context.drawing.loop=this;

			this.context.keyboard.keysName=this.context.math.arr(255,"undefined");
			for(var key in this.context.keyboard.keys){
				this.context.keyboard.keysName[this.context.keyboard.keys[key]]=key;
			}

            this.context.mouse.drawing=this.context.drawing;
            this.context.mouse.canvas.w=this.context.canvas.src.width;
            this.context.mouse.canvas.h=this.context.canvas.src.height;

            this.context.touch.drawing=this.context.drawing;
			this.context.touch.canvas.w=this.context.canvas.src.width;
            this.context.touch.canvas.h=this.context.canvas.src.height
			
            this.context.stats.loop=this.context.loop;
            this.context.stats.drawing=this.context.drawing;

			this.context.particles.drawing=this.context.drawing;

            this.context.assets.loop=this;
            this.context.assets.col=this.context.collision;

            this.context.canvas.smoothing(false)
			
			this.context.canvas.ctx.textBaseline="hanging";
			
            if(this.obj!=undefined){
                window[this.obj][this.setupName]();
            }else{
                window[this.setupName]();
            }

            this.setupDone=true;
        },
		//play all sounds
		playAllSounds: function(){
			//Fix sound delay
			this.context.assets.mute(true);
			for(var soun in this.context.assets.sounds){
				if(this.context.assets.sounds.hasOwnProperty(soun)){
					if(soun!="title"){
						this.context.assets.play(soun)
					}
				}
			}

			for(var soun in this.context.assets.sounds){
				if(this.context.assets.sounds.hasOwnProperty(soun)){
					if(soun!="title"){
						this.context.assets.stop(soun)
					}
				}
			}
			this.context.assets.mute(false);
			this.soundsPlayed=true;
		},
        //start the main loop
        startLoop: function(){
            var context=this;
			this.then=new Date().getTime();
			this.interval=setInterval(context.doLoop,1000/this.fps,context)
        },
		//do the loop
		doLoop:function(context){
			context.mainLoop();
		},
		//change the main loop
        changeLoop: function(){
            var context=this;
            clearInterval(this.interval)
			this.waveIterations=Math.PI*2/this.fps;
            this.interval=setInterval(context.doLoop,1000/this.fps,context)
        },
		//loading screen
		loadingScreen:function(){
			var ctx=this.context.canvas.ctx;
			ctx.fillStyle="white";
			ctx.fillRect(0,0,this.context.canvas.w,this.context.canvas.h)
			ctx.fillStyle="black";

			ctx.font="40px Consolas";
			ctx.textAlign="center";
			ctx.textBaseline="hanging";
			ctx.fillText("JT Library "+this.context.version,this.context.canvas.w/2,10)

			var percent=Math.floor(this.loadCounter/this.loadCounterMax*100);

			ctx.font="20px Consolas";
			ctx.fillText("Loading game: "+percent+"%",this.context.canvas.w/2,this.context.canvas.h/2-10)

		},
        mainLoop:function(){
			var now=new Date().getTime();
			this.delay=now-this.then;
			this.then=now;
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
                                if(sound.readyState<4){
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

                console.log("(JT"+this.context.version+") Loading: "+this.loadCounter+" / "+this.loadCounterMax)
				this.loadingScreen();
				if(load){this.loaded=true;}

            }else if(!this.pause){

                if(!this.setupDone){
                    this.setup();
                }

                if(this.context.canvas.auto==true){
                    this.context.canvas.resize();
                }

                //resize current cam if it is too small
				if(this.context.drawing.cam[this.context.drawing.currCam].active){
					if(this.context.drawing.cam[this.context.drawing.currCam].w<0.001){
						this.context.drawing.cam[this.context.drawing.currCam].w=0.001;
					}

					if(this.context.drawing.cam[this.context.drawing.currCam].h<0.001){
						this.context.drawing.cam[this.context.drawing.currCam].h=0.001;
					}
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
                                    buttons:[],
									thresholds:[[[0.5,0.5],[0.5,0.5]],[[0.5,0.5],[0.5,0.5]]],
									directions:[[0,0],[0,0]],
                                };
                            }

                            this.context.gamepad.gamepads[i].axes[0].x=gamepads[i].axes[0];
                            this.context.gamepad.gamepads[i].axes[0].y=gamepads[i].axes[1];
                            this.context.gamepad.gamepads[i].axes[1].x=gamepads[i].axes[2];
                            this.context.gamepad.gamepads[i].axes[1].y=gamepads[i].axes[3];

							//Directions and thresholds
							for(var j=0;j<4;j++){
								var x=j%2;
								var y=0;
								if(j>=2){y=1;}
								if(gamepads[i].axes[j]<=-this.context.gamepad.gamepads[i].thresholds[y][x][0] || gamepads[i].axes[j]>=this.context.gamepad.gamepads[i].thresholds[y][x][1]){
									if(gamepads[i].axes[j]<=-this.context.gamepad.gamepads[i].thresholds[y][x][0]){
										this.context.gamepad.gamepads[i].directions[y][x]--;
									}else if(gamepads[i].axes[j]>=this.context.gamepad.gamepads[i].thresholds[y][x][1]){
										this.context.gamepad.gamepads[i].directions[y][x]++;
									}
								}else{
									this.context.gamepad.gamepads[i].directions[y][x]=0;
								}
							}

                            this.context.gamepad.gamepads[i].id=gamepads[i].id;
                            this.context.gamepad.gamepads[i].connected=gamepads[i].connected;

                            for(var j=0;j<gamepads[i].buttons.length;j++){
                                var pressed=0;

                                if(this.context.gamepad.gamepads[i].buttons[j]!=undefined){
                                    if(gamepads[i].buttons[j].value>0){
										this.context.gamepad.gamepads[i].buttons[j].pressed++;
                                    }else{
										this.context.gamepad.gamepads[i].buttons[j].pressed=0;
									}
									this.context.gamepad.gamepads[i].buttons[j].value=gamepads[i].buttons[j].value;
								}else{
									this.context.gamepad.gamepads[i].buttons[j]={

										value:gamepads[i].buttons[j].value,
										pressed:pressed
									}
								}
                            }
                        }
                    }
                }

				 //fullScreenBtn update
				if(this.fullScreenBtn && !document.fullscreen){
					if(this.focused){
						var w=50/8;

						//check if user pressed the button
						if(this.context.mouse.check(0,0,w*8,w*8,true,false) || this.context.touch.check(0,0,w*8,w*8,true,false) || this.context.keyboard.press("f11")){
							this.context.touch.touches=[];

						/*	var el = document.createElement("DIV");
							el.setAttribute("id","jeuConteneur");
							document.body.append(el);*/
							var el=document.getElementById(this.context.canvas.src.id);
							/*if (el.requestFullscreen) {
								el.requestFullscreen();
							} else if (el.mozRequestFullScreen) { // Firefox
								el.mozRequestFullScreen();
							} else if (el.webkitRequestFullscreen) { // Chrome, Safari and Opera
								el.webkitRequestFullscreen();
							} else if (el.msRequestFullscreen) { // IE/Edge
								el.msRequestFullscreen();
							}*/
							el.requestFullscreen();
							el.mozRequestFullScreen();
							el.webkitRequestFullscreen();
							el.msRequestFullscreen();

							//setTimeout(this.context.canvas.fullscreen.bind(this.context.canvas),100);

						}
					}else{
						if(document.activeElement.id==this.context.canvas.id){
							this.focused=true;
						}
						if(this.context.mouse.check() || this.context.touch.check()){
							this.focused=true;

						}
						if(this.focused){
							if(!this.playAll){
								this.playAllSounds();
								this.playAll=true;
							}
							this.context.touch.release();
							this.context.mouse.release();
						}
					}
				}

				//fullscreenBtn remove inputs until clicked
				if(document.activeElement.id!=this.context.canvas.id){
					this.context.keyboard.release();
					this.context.gamepad.release();
				}

				this.context.drawing.saveCpt=0;

                //update fonction by user
                if(this.obj!=undefined){
                  window[this.obj][this.updateName]();
                }else{
                  window[this.updateName]();
                }

				if(this.context.drawing.saveCpt>0){
					for(var i=0;i<this.context.drawing.saveCpt;i++){
						this.context.drawing.ctx.restore();
						if(i>9){
							break;
						}
					}
				}
				
				this.context.drawing.calledI=0;
				this.context.drawing.calledA=0;
				this.context.drawing.calledT=0;
				this.context.drawing.calledS=0;
				this.context.drawing.clippedI=0;
				this.context.drawing.clippedA=0;
				this.context.drawing.clippedT=0;
				this.context.drawing.clippedS=0;

				//update mouse and touch coordinates relative to the camera
				if(this.context.drawing.cam[this.context.drawing.currCam].active){
					//mouse
					var mX=this.context.mouse.x;
					var mY=this.context.mouse.y;

					var camW=Math.abs(this.context.canvas.src.width/this.context.drawing.cam[this.context.drawing.currCam].w)
					var camH=Math.abs(this.context.canvas.src.height/this.context.drawing.cam[this.context.drawing.currCam].h)
					var camX=this.context.drawing.cam[this.context.drawing.currCam].x;
					var camY=this.context.drawing.cam[this.context.drawing.currCam].y;

					this.context.mouse.cX = (mX/camW)+camX;
					this.context.mouse.cY = (mY/camH)+camY;

					//touch
					for(var i=0;i<this.context.touch.touches.length;i++){
						this.context.touch.touches[i].cX=(this.context.touch.touches[i].x/camW)+camX;
						this.context.touch.touches[i].cY=(this.context.touch.touches[i].y/camH)+camY;
					}

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

				if(this.context.drawing.filtered){
					this.context.drawing.resetFilter();
				}

                //fullScreenBtn draw
				if((this.fullScreenBtn && !document.fullscreen)){
					if(this.focused){
						var w=50/8;
						var alpha=this.context.drawing.alpha();
						this.context.drawing.alpha(0.67);
						for(var y=0;y<8;y++){
							for(var x=0;x<8;x++){
								if(y==0 || y==7 || x==0 || x==7 || y==3 || y==4 || x==3 || x==4){
									this.context.drawing.ctx.fillStyle="black";
								}else{
									this.context.drawing.ctx.fillStyle="white";
								}
								if(this.context.canvas.fullScreen){
									if((x==1 && y==1) || (x==6 && y==6) || (x==1 && y==6) || (x==6 && y==1)){
										this.context.drawing.ctx.fillStyle="black";
									}
								}else if(!this.context.canvas.fullScreen){
									if((x==2 && y==2) || (x==5 && y==5) || (x==2 && y==5) || (x==5 && y==2)){
										this.context.drawing.ctx.fillStyle="black";
									}
								}
								this.context.drawing.camActive(false);
								this.context.drawing.ctx.fillRect(x*w,y*w,w,w);
								this.context.drawing.camActive(true);
							}
						}
						this.context.drawing.alpha(alpha);
					}
				}

				if(document.activeElement.id!=this.context.canvas.id){
					var alpha=this.context.drawing.alpha();
					var before=this.context.drawing.camActive();
					this.context.drawing.camActive(false);
					this.context.drawing.alpha(0.67);
					this.context.drawing.rect(0,0,this.context.canvas.w,this.context.canvas.h,"black");
					this.context.drawing.font("Consolas",20);
					var string="Click here to play!";
					//change font size
					for(var i=0;i<9;i++){
						if(this.context.drawing.ctx.measureText(string).width>this.context.canvas.w){
							this.context.drawing.font("Consolas",20-(i*2));
						}else{
							break;
						}
					}

					this.context.drawing.alpha(alpha);
					this.context.drawing.text(string,this.context.canvas.w/2,this.context.canvas.h/2-10,"white","center");
					this.context.drawing.camActive(before);
				}


				//debug
				if(this.debug){
					for(var i=0;i<this.debugs.length;i++){
						var d=this.debugs[i];
						var cam=this.context.drawing.cam[this.context.drawing.currCam].active;
						this.context.drawing.cam[this.context.drawing.currCam].active=false;
						if(d.type=="text"){
							this.context.drawing.text(d.string,d.x,d.y,d.color,d.textAlign,d.fontSize,d.rotation,d.maxChars,d.newLineHeight);
						}else if(d.type=="shape"){
							this.context.drawing.shape(d);
						}
						this.context.drawing.cam[this.context.drawing.currCam].active=cam;

						if(d.stay==false){
							this.debugs.splice(i,1)
							i--;
						}
					}
				}


                //remove key presses
                var keyPresses=[];

                for(var keyCount=0;keyCount<this.context.keyboard.keysDown.length;keyCount++){
                    if(this.context.keyboard.keysDown[keyCount].press==true){

                        keyPresses.push(this.context.keyboard.keysDown[keyCount].key);
                        this.context.keyboard.keysDown[keyCount].press=false;
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

                    this.context.drawing.ctx.fillStyle =c;

                    this.context.drawing.ctx.fillRect(0,0,w,bY)
                    this.context.drawing.ctx.fillRect(0,0,bX,h)
                    this.context.drawing.ctx.fillRect(0,h-bY,w,bY)
                    this.context.drawing.ctx.fillRect(w-bX,0,bX,h)
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
                this.normalX=this.context.drawing.cam[this.context.drawing.currCam].x;
                this.normalY=this.context.drawing.cam[this.context.drawing.currCam].y;
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
				this.shakeObj.lastX=0;
				this.shakeObj.lastY=0;

            }else{
                this.shakeObj.force+=force;
                this.shakeObj.duration+=duration;
                this.shakeObj.reduce=reduce;
            }

        },

        shaking:function(){
			this.context.drawing.cam[this.context.drawing.currCam].x-=this.shakeObj.lastX;
            if(this.shakeObj.lastX==0){
                this.shakeObj.lastX=this.context.math.random(-this.shakeObj.force,this.shakeObj.force)
            }else if(Math.sign(this.shakeObj.lastX)==1){
                this.shakeObj.lastX=this.context.math.random(-this.shakeObj.force,0)
            }else if(Math.sign(this.shakeObj.lastX)==-1){
                this.shakeObj.lastX=this.context.math.random(0,this.shakeObj.force)
            }
			this.context.drawing.cam[this.context.drawing.currCam].x+=this.shakeObj.lastX;

			this.context.drawing.cam[this.context.drawing.currCam].y-=this.shakeObj.lastY;
            if(this.shakeObj.lastY==0){
               this.shakeObj.lastY=this.context.math.random(-this.shakeObj.force,this.shakeObj.force)
            }else if(Math.sign(this.shakeObj.lastY)==1){
                this.shakeObj.lastY=this.context.math.random(-this.shakeObj.force,0)
            }else if(Math.sign(this.shakeObj.lastY)==-1){
                this.shakeObj.lastY=this.context.math.random(0,this.shakeObj.force)
            }
			this.context.drawing.cam[this.context.drawing.currCam].y+=this.shakeObj.lastY;

            if(this.shakeObj.duration>0){
                this.shakeObj.duration--;
                if(this.shakeObj.reduce!=undefined && this.shakeObj.reduce>0){
                    if(this.shakeObj.force>0){
                        this.shakeObj.force-=this.shakeObj.reduce;
                    }
                }
            }else{
                this.context.drawing.cam[this.context.drawing.currCam].x-=this.shakeObj.lastX;
                this.context.drawing.cam[this.context.drawing.currCam].y-=this.shakeObj.lastY;
                this.normalX=undefined;
                this.normalY=undefined;
                this.shakeObj=undefined;
            }
        },

		stopShaking:function(){
			if(this.shakeObj!=undefined){
				this.context.drawing.cam[this.context.drawing.currCam].x-=this.shakeObj.lastX;
				this.context.drawing.cam[this.context.drawing.currCam].y-=this.shakeObj.lastY;
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

		getCombo:function(len){
			if(len==undefined){len=this.comboCurrent.length-1}
			var arr=[];
			for(var i=0;i<this.comboCurrent[len].length;i++){
				if(this.comboCurrent[len][i]!=undefined){
					arr.push(this.comboCurrent[len][i]);
				}
			}
			return arr;
		},

		getDebug:function(){
			return this.debugs;
		},

		debugging:function(bool){
			if(bool!=undefined){
				this.debug=bool;
			}
			return this.debug;
		},

		addDebugText:function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight,stay){
			this.debugs.push({type:"text",string:string,x:x,y:y,color:color,textAlign:textAlign,fontSize:fontSize,rotation:rotation,maxChars:maxChars,newLineHeight:newLineHeight,stay:stay})
		},

		addDebugShape:function(obj){
			obj.type="shape";
			this.debugs.push(obj);
		},

		clearDebugs:function(){
			this.debugs=[];
		},
		
		frameDelay:function(){
			return this.delay;
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
        sound:function(src,name,repeat,volume){
            this.loop.loaded=false;
            if(name==undefined){
                name=src;
            }
			if(volume==undefined){
                volume=0.5;
            }
            this.sounds[name]=new Audio();
            this.sounds[name].src=src;
            this.sounds[name].vol=volume;
            var context=this;
            if(repeat!=undefined){
                if(repeat==true){
                    this.sounds[name].loop=true;
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
        volume:function(vol,sound){
            if(vol!=undefined){
				if(typeof vol == "number"){
					var v=vol;
					if(v<0){v=0;}
					if(v>1){v=1;}

					if(sound!==undefined){
						this.sounds[sound].vol=v;
					}else{
						this.vol=v;
					}
					return v;
				}else if(typeof vol == "string"){
					return this.sounds[vol].vol;
				}
				
				/*for(var sound in this.sounds){
					if(this.sounds.hasOwnProperty(sound)){
						this.sounds[sound].volume=this.vol;
					}
				}*/
            }else{
				if(sound==undefined){
					return this.vol;
				}else{
					return this.sounds[vol].vol;
				}
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
        play:function(name,volume){
			if(volume!=undefined){
				this.sounds[name].vol=volume;
			}
			this.sounds[name].volume=this.sounds[name].vol*this.vol;
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
		//stop all sounds (reset it to 0)
        stopAll:function(){
			for(var soun in this.sounds){
				if(this.sounds.hasOwnProperty(soun)){
					this.stop(soun);
				}
			}
        },
        //stop then play
        stopPlay:function(name,volume){
            this.stop(name);
            this.play(name,volume);
        },
		//get or set a sound to repeat
		repeat:function(name,bool){
			if(bool!=undefined){
				this.sounds[name].loop=bool;
			}
			return this.sounds[name].loop;
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
    this.drawing={
        //10 virtual cameras who each has x,y,w,h,r,active,pos
        cam:[
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
			{x:0,y:0,w:undefined,h:undefined,r:0,active:true,pos:{x:0,y:0,w:undefined,h:undefined}},
		],

		//the current camera
		currCam:0,

        //font
        fontName:"Arial",
        fontSize:18,

        //ctx
        canvas:undefined,
        ctx:undefined,
		saveCpt:0,

		//filters
		filtered:false,
		filters:"",

		filterBlur:0,
		filterBrightness:100,
		filterContrast:100,

		filterShadowX:0,
		filterShadowY:0,
		filterShadowRadius:0,
		filterShadowColor:"#000",

		filterGray:0,
		filterHue:0,
		filterInvert:0,
		filterOpacity:100,
		filterSaturate:100,
		filterSepia:0,

		//loop and assets
		loop:undefined,
        assets:undefined,
        
        //Rotated
        rotated:false,
        rotatedMod:0,
        rotatedCpt:0,
		
		//stats
		clippedI:0,
		clippedA:0,
		clippedT:0,
		clippedS:0,
		calledI:0,
		calledA:0,
		calledT:0,
		calledS:0,

        //public functions

		//add a filter
		filter:function(css,override){
			if(css==undefined){css="none"}
			if(css==""){css="none"}
			if(override==undefined){override=true}
			if(override){
				this.filters=css;
			}else{
                
                if(this.filters=="none"){
                    this.filters=css;
                }else{
                    this.filters+=css+" ";
                }
				
			}
			this.ctx.filter=this.filters;
			this.filtered=true;
			return this.filters;
		},

		defaultFilters:function(){
			this.filterBlur=0;
			this.filterBrightness=100;
			this.filterContrast=100;
			this.filterShadowX=0;
			this.filterShadowY=0;
			this.filterShadowRadius=0;
			this.filterShadowColor="#000";
			this.filterGray=0;
			this.filterHue=0;
			this.filterInvert=0;
			this.filterOpacity=100;
			this.filterSaturate=100;
			this.filterSepia=0;
			this.filtered=false;
		},

		changeBlur:function(num){
			if(num==undefined){num=0}
			this.filterBlur=num;
            this.filter("blur("+this.filterBlur+"px)",false);
			return this.filterBlur;
		},

		changeBrightness:function(num){
			if(num==undefined){num=100}
			this.filterBrightness=num;
            this.filter("brightness("+this.filterBrightness+"%)",false);
			return this.filterBrightness;
		},

		changeContrast:function(num){
			if(num==undefined){num=100}
			this.filterContrast=num;
            this.filter("contrast("+this.filterContrast+"%)",false);
			return this.filterContrast;
		},

		changeDropShadow:function(offsetX,offsetY,blurRadius,color){
			if(offsetX==undefined){offsetX="0"}
			if(offsetY==undefined){offsetY="0"}
			if(blurRadius==undefined){blurRadius="#0"}
			if(color==undefined){color="#000"}
			this.filterShadowX=offsetX;
			this.filterShadowY=offsetY;
			this.filterShadowRadius=blurRadius;
			this.filterShadowColor=this.color(color);
            this.filter("drop-shadow("+this.filterShadowX+"px "+this.filterShadowY+"px "+this.filterShadowRadius+"px "+this.filterShadowColor+")",false);
            return [this.filterShadowX,this.filterShadowY,this.filterShadowRadius,this.filterShadowColor];
		},

		changeGrayscale:function(num){
			if(num==undefined){num=0}
			this.filterGray=num;
            this.filter("grayscale("+this.filterGray+"%)",false);
            return this.filterGray;
		},

		changeHueRotate:function(num){
			if(num==undefined){num=0}
			this.filterHue=num;
            this.filter("hue-rotate("+this.filterHue+"deg)",false);
            return this.filterHue;
		},

		changeInvert:function(num){
			if(num==undefined){num=0}
			this.filterInvert=num;
            this.filter("invert("+this.filterInvert+"%)",false);
            return this.filterInvert;
		},

		changeOpacity:function(num){
			if(num==undefined){num=100}
			this.filterOpacity=num;
            this.filter("opacity("+this.filterOpacity+"%)",false);
            return this.filterOpacity;
		},

		changeSaturate:function(num){
			if(num==undefined){num=100}
			this.filterSaturate=num;
            this.filter("saturate("+this.filterSaturate+"%)",false);
            return this.filterSaturate;
		},

		changeSepia:function(num){
			if(num==undefined){num=0}
			this.filterSepia=num;
            this.filter("sepia("+this.filterSepia+"%)",false);
            return this.filterSepia;
		},

		compileFilters:function(){
			/*this.filtered=true;
			this.ctx.filter="blur("+this.filterBlur+"px) \
							brightness("+this.filterBrightness+"%) \
							contrast("+this.filterContrast+"%) \
							drop-shadow("+this.filterShadowX+"px "+this.filterShadowY+"px "+this.filterShadowRadius+"px "+this.filterShadowColor+") \
							grayscale("+this.filterGray+"%) \
							hue-rotate("+this.filterHue+"deg) \
							invert("+this.filterInvert+"%) \
							opacity("+this.filterOpacity+"%) \
							saturate("+this.filterSaturate+"%) \
							sepia("+this.filterSepia+"%)";
		      */
        },

		resetFilter:function(){
			this.filters="none";
			this.ctx.filter="none";
			this.defaultFilters();
		},

		//change main camera
		currentCam:function(num){
			if(num!=undefined){
				this.currCam=num;
			}
			return this.currCam;
		},

		//reset one camera
        camReset:function(num){
			if(num==undefined){num=this.currCam;}
			this.cam[num].active=false;
			this.cam[num].x=0;
			this.cam[num].y=0;
			this.cam[num].w=this.canvas.w;
			this.cam[num].h=this.canvas.h;
			this.cam[num].r=0;
			this.cam[num].pos.x=0;
			this.cam[num].pos.y=0;
			this.cam[num].pos.w=this.canvas.w;
			this.cam[num].pos.h=this.canvas.h;
        },

		//reset all cameras
		camsReset:function(){
			for(var i=0;i<10;i++){
				this.camReset(i);
			}
        },

        //change cam active
        camActive:function(bool,num){
  			if(num==undefined){num=this.currCam;}

  			if(bool!=undefined){
  				this.cam[num].active=bool;
  			}

            return this.cam[num].active;
        },
		//Check if part of rect in in canvas
		inCanvas:function(x,y,w,h){
			var col=false;
			if (x < this.canvas.w &&
                x + w > 0 &&
                y < this.canvas.h &&
                h + y > 0) {
                col=true;
            }
            return col;
		},
		//Check if full rect in in canvas
		inCanvasFull:function(x,y,w,h){
			var col=false;
			if(x>=0 && x+w<=this.canvas.w &&
			y>=0 && y+h<=this.canvas.h){
                col=true;
            }
            return col;
		},
		//Check if part of rect is in camera
		inCamera:function(x,y,w,h,num) {
            var col=false;
			if(num==undefined){num=this.currCam;}
            if (x < this.cam[num].x + this.cam[num].w &&
                x + w > this.cam[num].x &&
                y < this.cam[num].y + this.cam[num].h &&
                h + y > this.cam[num].y) {
                col=true;
            }
            return col;
        },
		//check if full rect is in camera
		inCameraFull:function(x,y,w,h,num) {
            var col=false;
			if(num==undefined){num=this.currCam;}
            if (x>=this.cam[num].x && x+w<=this.cam[num].x+this.cam[num].w &&
			y>=this.cam[num].y && y+h<=this.cam[num].y+this.cam[num].h){
                col=true;
            }
            return col;
        },
		//camera to non camera horizontal
		xCam:function(x,num){
      if(num==undefined){num=this.currCam;}
      if(x==undefined){x=this.cam[num].x+this.cam[num].w/2}
      var posX=this.cam[num].pos.x
      var posW=Math.abs(this.canvas.w/this.cam[num].pos.w);
      var camX=this.cam[num].x;
			var camW=Math.abs(this.canvas.w/this.cam[num].w);
      camW=camW/posW;
		  return (x*camW)+posX-(camX*camW)
		},

		//camera to non camera vertical
		yCam:function(y,num){
			if(num==undefined){num=this.currCam;}
      if(y==undefined){y=this.cam[num].y+this.cam[num].h/2}
      var posY=this.cam[num].pos.y
      var posH=Math.abs(this.canvas.h/this.cam[num].pos.h);
      var camY=this.cam[num].y;
			var camH=Math.abs(this.canvas.h/this.cam[num].h);
      camH=camH/posH;
		  return (y*camH)+posY-(camY*camH)
		},

		//non camera to camera horizontal
		camX:function(x,num){
			if(num==undefined){num=this.currCam;}
      if(x==undefined){x=this.canvas.w/2;}
      var posX=this.cam[num].pos.x
      var posW=Math.abs(this.canvas.w/this.cam[num].pos.w);
      var camX=this.cam[num].x;
			var camW=Math.abs(this.canvas.w/this.cam[num].w);
      camW=camW/posW;
			return (x+(camX*camW)-posX)/camW;
		},

		//non camera camera vertical
		camY:function(y,num){
			if(num==undefined){num=this.currCam;}
      if(y==undefined){y=this.canvas.h/2;}
      var posY=this.cam[num].pos.y
      var posH=Math.abs(this.canvas.h/this.cam[num].pos.h);
      var camY=this.cam[num].y;
			var camH=Math.abs(this.canvas.h/this.cam[num].h);
      camH=camH/posH;
			return (y+(camY*camH)-posY)/camH;
		},

		//change alpha
		alpha:function(alpha){
			if(alpha!=undefined){
				this.ctx.globalAlpha=alpha;
			}
			return this.ctx.globalAlpha;
		},

        //Drawing a background
        bg:function(color) {
			//remove cam active
			//var cam=this.camActive()
			//this.camActive(false);

			var image=this.assets.images[color];
			var anim=this.assets.anims[color];

            if(this.assets.anims[color]!=undefined){
				this.context.image(color,0,0,this.canvas.w,this.canvas.h)
            }else if(this.assets.images[color]!=undefined){
				this.context.anim(color,0,0,this.canvas.w,this.canvas.h)
			}else if(color!=undefined){
				this.color(color,"fill");
				this.ctx.fillRect(0,0,this.canvas.w,this.canvas.h);
			}else{
				this.ctx.fillRect(0,0,this.canvas.w,this.canvas.h);
			}

			//this.camActive(cam);
        },

        //Check value in percent
        percent:function(val,start,end){
            var value=val;
            if(start==undefined){
                start=0;
            }
            if(end==undefined){
                end=1;
            }
            if(typeof val=="string"){
                value=((end-start)*(parseInt(val))/100)+start;
            }else if(typeof val=="number"){
                value=((end-start)*(val)/100)+start;
            }
            return value;
        },

        //Check horizontal value in percent
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

        //Check vertical value in percent
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

		save:function(){
			this.saveCpt++;
            if(this.rotated){
                this.rotatedCpt++;
            }
			this.ctx.save();
		},

		restore:function(){
			this.saveCpt--;
			if(this.saveCpt<0){this.saveCpt=0;}
            if(this.rotated){
                this.rotatedCpt--;
                if(this.rotatedCpt<=0){
                    this.rotated=false;
                    this.rotatedMod=0;
                    this.rotatedCpt=0;
                }
            }
			this.ctx.restore();
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
            var o=obj.o;
            var lineW=obj.lineW;
            var r=obj.r;
            var d=obj.d;
			var dX=obj.dX;
			var dY=obj.dY;
            var diameter=obj.diameter;
            var diameterX=obj.diameterX;
            var diameterY=obj.diameterY;
            var rotation=obj.rotation;
            var width=obj.width;
            var height=obj.height;
            var color=obj.color;
            var outline=obj.outline;

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
                }else{
					r=0;
				}
            }

            if(d==undefined){
                if(diameter!=undefined){
                    d=diameter;
                }
            }

			if(dX==undefined){
                if(diameterX!=undefined){
                    dX=diameterX;
                }
            }

			if(dY==undefined){
                if(diameterY!=undefined){
                    dY=diameterY;
                }
            }

			if(o==undefined){
                if(outline!=undefined){
                    o=outline;
                }
            }

            if(lineW!=undefined){
              o=lineW;
            }
            
            if(obj.attr!=undefined){
                if(obj.attr.shape!=undefined){
                    if(obj.attr.shape=="circle"){
                        if(d==undefined){
                            d=obj.w;
                        }
                    }else if(obj.attr.shape=="ellipse"){
                        if(dX==undefined){
                            dX=obj.w;
                        }
                        if(dY==undefined){
                            dY=obj.h;
                        }
                    }else if(obj.attr.shape=="line"){
                        if(x1==undefined){
                            var xx1=obj.x;
                            var yy1=obj.y;
                            var xx2=obj.x+obj.w;
                            var yy2=obj.y+obj.h;
                            
                            if(obj.attr.dirX==-1){
                                xx1=obj.x+obj.w;
                                xx2=obj.x;
                            }

                            if(obj.attr.dirY==-1){
                                yy1=obj.y+obj.h;
                                yy2=obj.y;
                            }
                            
                            x1=xx1;
                            y1=yy1;
                            x2=xx2;
                            y2=yy2;
                            w=obj.attr.lineW;
                            if(obj.attr.lineW==undefined){
                                w=1;
                            }
                        }
                    }
                }
            }

            if(x1!=undefined){
                //line
				if(o!=undefined){
					w=o;
				}
                this.line(x1,y1,x2,y2,w,c,r);
            }else if(d!=undefined){
                //circle
				if(o==undefined){
					this.circle(x,y,d,c);
				}else{
					if(o!=undefined){
						w=o;
					}
					this.circleB(x,y,d,c,w);
				}
            }else if(dX!=undefined){
                //ellipse
				if(o==undefined){
					this.ellipse(x,y,dX,dY,c);
				}else{
					if(o!=undefined){
						w=o;
					}
					this.ellipseB(x,y,dX,dY,c,w);
				}
            }else{
                //rect
				if(o==undefined){
					this.rect(x,y,w,h,c,r);
				}else{
					this.rectB(x,y,w,h,c,r,o);
				}
            }

        },

        //Drawing rectangle
        rect: function(x,y,w,h,color,rotation) {
			if(typeof(x)=="object"){
				if(x.o!=undefined){x.o=undefined;}
				if(x.outline!=undefined){x.outline=undefined;}
				this.shape(x);
			}else{
				if(color!=undefined){this.color(color,"fill");}
				this.fill("rect",x,y,w,h,rotation);
			}
        },

        //Drawing rectangle border
        rectB: function(x,y,w,h,color,rotation,lineW){
			if(typeof(x)=="object"){
				if(x.o==undefined && x.outline==undefined){x.o=1;}
				this.shape(x);
			}else{
				if(color!=undefined){this.color(color,"stroke");}
				if(lineW<=0){lineW=1}
				this.ctx.lineWidth = lineW;
				this.fill("rectB",x,y,w,h,rotation);
			}
        },

        //Drawing circle
        circle: function(x,y,d,color) {
			if(typeof(x)=="object"){
				if(x.o!=undefined){x.o=undefined;}
				if(x.outline!=undefined){x.outline=undefined;}
				this.shape(x);
			}else{
				this.ctx.beginPath();
				this.fill("arc",x+d/2,y+d/2,d/2,d/2);
				if(color!=undefined){this.color(color,"fill");}
				this.ctx.fill();
			}
        },

        //Drawing circle border
        circleB: function(x,y,d,color,lineW) {
			if(typeof(x)=="object"){
				if(x.o==undefined && x.outline==undefined){x.o=1;}
				this.shape(x);
			}else{
				this.ctx.beginPath();
				this.fill("arc",x+d/2,y+d/2,d/2,d/2);
				if(color!=undefined){this.color(color,"stroke");}
				if(lineW<=0){lineW=1}
				this.ctx.lineWidth=lineW;
				this.ctx.stroke();
			}
        },

        //Drawing ellipse
        ellipse: function(x,y,dX,dY,color,rotation) {
			if(typeof(x)=="object"){
				if(x.o!=undefined){x.o=undefined;}
				if(x.outline!=undefined){x.outline=undefined;}
				this.shape(x);
			}else{
				this.ctx.beginPath();
				this.fill("ellipse",x+dX/2,y+dY/2,dX/2,dY/2,rotation);
				if(color!=undefined){this.color(color,"fill");}
				this.ctx.fill();
			}
        },

        //Drawing ellipse border
        ellipseB: function(x,y,dX,dY,color,rotation,lineW) {
			if(typeof(x)=="object"){
				if(x.o==undefined && x.outline==undefined){x.o=1;}
				this.shape(x);
			}else{
				this.ctx.beginPath();
				this.fill("ellipse",x+dX/2,y+dY/2,dX/2,dY/2,rotation);
				if(color!=undefined){this.color(color,"stroke");}
				if(lineW<=0){lineW=1}
				this.ctx.lineWidth=lineW;
				this.ctx.stroke();
			}
        },

        //Drawing line
        line: function(x1,y1,x2,y2,width,color,rotation) {
			if(typeof(x1)=="object"){
				this.shape(x1);
			}else{
				var w=Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
				var height=width
				var middleX=(x1+x2)/2;
				var middleY=(y1+y2)/2;

				var deltaX=-x1;
				var deltaY=y1;
				if(w!=undefined){
					deltaX=(x2-x1)*-1;
					deltaY=y2-y1;
				}
				var angle=(Math.atan2(deltaX,deltaY)*180/Math.PI)-90;

				if(rotation==undefined){rotation=angle}else{rotation+=angle;}

				var x=middleX-w/2;
				var y=middleY-height/2;
				var h=height;

				this.rect(x,y,w,h,color,rotation)
				/*if(color!=undefined){this.color(color,"stroke");}
				this.ctx.lineWidth=1;
				if(width!=undefined){
					this.ctx.lineWidth=width;
				}
				this.ctx.beginPath();
				this.fill("line",x1,y1,x2,y2,rotation)
				this.ctx.stroke();*/
			}
        },

        //Setting the font
        font:function(fontName,size,color){
            this.fontName=fontName;
            this.fontSize=size;
            this.ctx.font=this.fontSize+"px "+this.fontName;
			if(color!=undefined){
				this.color(color);
			}
        },

        //Drawing text
        text:function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight){
			string=string.toString();
            if(textAlign!=undefined){
                this.ctx.textAlign=textAlign
            }
            if(fontSize!=undefined){
				this.font(this.fontName,fontSize);
            }
            if(color!=undefined){this.color(color,"fill");}
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

       //Drawing text border
        textB:function(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight){
            if(textAlign!=undefined){
                this.ctx.textAlign=textAlign
            }
            if(fontSize!=undefined){
                this.font(this.fontName,fontSize);
            }
            if(color!=undefined){this.color(color,"stroke");}
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
                    this.fill("textB",x,y+(lineHeight*i),this.ctx.measureText(s).width,this.fontSize,rotation,s)
                }

            }else{
                this.fill("textB",x,y,this.ctx.measureText(string).width,this.fontSize,rotation,string)
            }
        },

        //Get text width
        textW:function(string){
            return this.ctx.measureText(string).width;
        },

        //Get text height (fontSize)
        textH:function(){
            return this.fontSize;
        },

		//Setting the alignment
		align:function(align){
			if(align!=undefined){
				this.ctx.textAlign=align;
			}
			return this.ctx.textAlign;
		},

		//Setting the baseline
        baseline:function(baseline){
			if(baseline!=undefined){
				this.ctx.textBaseline=baseline;
			}
            return this.ctx.textBaseline;
        },

        //Draw an image
        image:function(name,newX,newY,w,h,rotation,sX,sY,sW,sH){

			if(typeof name==="object"){
				newX=name.x;
				newY=name.y;
				w=name.w;
				h=name.h;
				r=name.r;
				sX=name.sX;
				sY=name.sY;
				sW=name.sW;
				sH=name.sH;
				name=name.img;
			}
            var image=this.assets.images[name];

            if(this.assets.images[name]!=undefined){
                if(image.visible==false){
                    //invisible
                }else{
					this.calledI++;
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
					
					if(rotation==undefined){rotation=0;}

                    var tempW=image.img.width;
                    var tempH=image.img.height;

                    var camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
                    var camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)
                    var camX=this.cam[this.currCam].x;
                    var camY=this.cam[this.currCam].y;

                    if(this.cam[this.currCam].active==false){
                        camX=0;
                        camY=0;
                        camW=1;
                        camH=1;
                    }

                    var x=image.x;
                    var y=image.y;
					var w=tempW;
					var h=tempH;

                    var camX=0;
					var camY=0;
					var camW=1;
					var camH=1;

					var posX=0;
					var posY=0;
					var posW=1;
					var posH=1;

					this.ctx.save();
					if(this.cam[this.currCam].active){
						if(rotation!=0 || this.rotated){
							var max=this.maxRotated(x,y,w,h);
							if(!this.inCamera(max[0],max[1],max[2],max[3])){
								this.ctx.restore();
								this.clippedI++;
								return;
							}
						}else{
							if(!this.inCamera(x,y,w,h)){
								this.ctx.restore();
								this.clippedI++;
								return;
							}
						}

						camX=this.cam[this.currCam].x;
						camY=this.cam[this.currCam].y;
						camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
						camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)

						var pos=this.cam[this.currCam].pos;
						if(pos.x!=0 || pos.y!=0 || pos.w!=this.canvas.src.width || pos.h!=this.canvas.src.height){
							posX=this.cam[this.currCam].pos.x;
							posY=this.cam[this.currCam].pos.y;

							posW=Math.abs(this.canvas.src.width/this.cam[this.currCam].pos.w);
							posH=Math.abs(this.canvas.src.height/this.cam[this.currCam].pos.h);

							camW=camW/posW;
							camH=camH/posH;

							if(!this.inCameraFull(x,y,w,h)){
								this.ctx.beginPath();
								this.ctx.rect(posX,posY,this.cam[this.currCam].pos.w,this.cam[this.currCam].pos.h)
								this.ctx.clip();
							}
						}

						if(this.cam[this.currCam].r!=0){
							var transX=((this.canvas.w/2)*camW-camX*camW)
							var transY=((this.canvas.h/2)*camH-camY*camH)

							transX+=posX;
							transY+=posY;

							this.ctx.translate(transX,transY);
							this.ctx.rotate(this.cam[this.currCam].r*Math.PI/180);
							this.ctx.translate(-transX,-transY);
						}
					}else{
						if(rotation!=0 || this.rotated){
							var max=this.maxRotated(x,y,w,h);
							if(!this.inCanvas(max[0],max[1],max[2],max[3])){
								this.ctx.restore();
								this.clippedI++;
								return;
							}
						}else{
							if(!this.inCanvas(x,y,w,h)){
								this.ctx.restore();
								this.clippedI++;
								return;
							}
						}
					}

                    if(rotation!=0){
						var transX=((tempW/2)*camW-camX*camW)+x*camW
						var transY=((tempH/2)*camH-camY*camH)+y*camH

						transX+=posX;
						transY+=posY;


                        this.ctx.translate(transX,transY);
                        this.ctx.rotate(rotation*Math.PI/180);
                        this.ctx.translate(-transX,-transY);
                    }

                    if(sX!=undefined){
                        //this.ctx.drawingImage(image.img,sX,sY,sW,sH,camW-camX,camH-camY,tempW*camW,tempH*camH);

                        if(sW=="w"){sW=image.w}
                        if(sH=="h"){sH=image.h}
                        this.ctx.drawImage(image.img,sX,sY,sW,sH,(x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,tempW*camW,tempH*camH);
                    }else{
                        //this.ctx.drawingImage(image.img,camW-camX,camH-camY,tempW*camW,tempH*camH);
                        this.ctx.drawImage(image.img,(x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,tempW*camW,tempH*camH);
                    }
                    this.ctx.restore();
                }
            }
          },

        //Draw an animation
        anim:function(name,newX,newY,w,h,rotation){
			if(typeof name==="object"){
				newX=name.x;
				newY=name.y;
				w=name.w;
				h=name.h;
				r=name.r;
				name=name.anim;
			}
            var anim=this.assets.anims[name];

            if(this.assets.anims[name]!=undefined){
                if(anim.visible==false){
                    //invisible
                }else{
					this.calledA++;
                    //visible
                    if(newX!=undefined){
                        anim.x=newX;
                    }
                    if(newY!=undefined){
                        anim.y=newY;
                    }
					
					if(rotation==undefined){rotation=0;}

					var x=anim.x;
                    var y=anim.y;
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

                    var camX=0;
					var camY=0;
					var camW=1;
					var camH=1;

					var posX=0;
					var posY=0;
					var posW=1;
					var posH=1;

					this.ctx.save();
					if(this.cam[this.currCam].active){
						if(rotation!=0 || this.rotated){
							var max=this.maxRotated(x,y,w,h);
							if(!this.inCamera(max[0],max[1],max[2],max[3])){
								this.ctx.restore();
								this.clippedA++;
								return;
							}
						}else{
							if(!this.inCamera(x,y,w,h)){
								this.ctx.restore();
								this.clippedA++;
								return;
							}
						}

						camX=this.cam[this.currCam].x;
						camY=this.cam[this.currCam].y;
						camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
						camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)

						var pos=this.cam[this.currCam].pos;
						if(pos.x!=0 || pos.y!=0 || pos.w!=this.canvas.src.width || pos.h!=this.canvas.src.height){
							posX=this.cam[this.currCam].pos.x;
							posY=this.cam[this.currCam].pos.y;

							posW=Math.abs(this.canvas.src.width/this.cam[this.currCam].pos.w);
							posH=Math.abs(this.canvas.src.height/this.cam[this.currCam].pos.h);

							camW=camW/posW;
							camH=camH/posH;

							if(!this.inCameraFull(x,y,w,h)){
								this.ctx.beginPath();
								this.ctx.rect(posX,posY,this.cam[this.currCam].pos.w,this.cam[this.currCam].pos.h)
								this.ctx.clip();
							}
						}

						if(this.cam[this.currCam].r!=0){
							var transX=((this.canvas.w/2)*camW-camX*camW)
							var transY=((this.canvas.h/2)*camH-camY*camH)

							transX+=posX;
							transY+=posY;

							this.ctx.translate(transX,transY);
							this.ctx.rotate(this.cam[this.currCam].r*Math.PI/180);
							this.ctx.translate(-transX,-transY);
						}
					}else{
						if(rotation!=0 || this.rotated){
							var max=this.maxRotated(x,y,w,h);
							if(!this.inCanvas(max[0],max[1],max[2],max[3])){
								this.ctx.restore();
								this.clippedA++;
								return;
							}
						}else{
							if(!this.inCanvas(x,y,w,h)){
								this.ctx.restore();
								this.clippedA++;
								return;
							}
						}
					}

                    if(rotation!=0){
						var transX=((tempW/2)*camW-camX*camW)+x*camW
						var transY=((tempH/2)*camH-camY*camH)+y*camH

						transX+=posX;
						transY+=posY;

                        this.ctx.translate(transX,transY);
                        this.ctx.rotate(rotation*Math.PI/180);
                        this.ctx.translate(-transX,-transY);
                    }

                    this.ctx.drawImage(anim.img,anim.frame*anim.frameW,0,anim.frameW,anim.img.height,(x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,tempW*camW,tempH*camH);

                    this.ctx.restore();
                }
            }
        },

		animPlay:function(name){
			var anim=this.assets.anims[name];

			anim.pause=false;
		},

		animPause:function(name){
			var anim=this.assets.anims[name];

			anim.pause=true;
		},

		animStop:function(name){
			var anim=this.assets.anims[name];

			anim.pause=true;
			anim.frame=0;
			anim.distance=0;
		},

		animPaused:function(name){
			var anim=this.assets.anims[name];

			return anim.pause;
		},

		animFrame:function(name,frame){
			var anim=this.assets.anims[name];

			var f=frame;
			if(frame!=undefined){
				if(anim.frame!=f){
					anim.frame=f;
					anim.distance=f;
				}
			}
			return anim.frame;
		},

		animFrames:function(name,frames){
			var anim=this.assets.anims[name];

			var f=frames;
			if(frames!=undefined){
				if(anim.frames!=f){
					anim.frames=f;
					anim.frameW=anim.img.width/f;
					anim.frame=0;
					anim.distance=0;
				}
			}
			return anim.frames;
		},

		animSpeed:function(name,speed){
			var anim=this.assets.anims[name];

			var s=speed/this.loop.fps;
			if(speed!=undefined){
				anim.speed=s;
			}
			return anim.speed*this.loop.fps;
		},

        //private functions

        //Changes the color
        color: function(col,type) {
            var converted=col;
            if(col!=undefined){
                if(col.gradient!=undefined){

                    if(col.gradient=="linear"){

                        if(this.cam[this.currCam].active==true){
							var camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
							var camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)
							var camX=this.cam[this.currCam].x;
							var camY=this.cam[this.currCam].y;

							var tempX=(col.x1*camW)-(camX*camW);
							var tempY=(col.y1*camH)-(camY*camH);

							var tempW=(col.x2*camW)-(camX*camW);
							var tempH=(col.y2*camH)-(camY*camH);
							converted=this.ctx.createLinearGradient(tempX,tempY,tempW,tempH);
                        }else{
                           converted=this.ctx.createLinearGradient(col.x1,col.y1,col.x2,col.y2);
                        }

                    }else if(col.gradient=="radial"){

                        if(this.cam[this.currCam].active==true){
							var camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
							var camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)
							var camX=this.cam[this.currCam].x;
							var camY=this.cam[this.currCam].y;

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

					var offsets=false;
					if(col.offsets!=undefined){
						offsets=true;
					}

					if(offsets){
						for(var i=0;i<col.colors.length;i++){
							converted.addColorStop(col.offsets[i],this.color(col.colors[i]));
						}
					}else{
						for(var i=0;i<col.colors.length;i++){
							converted.addColorStop(i/(col.colors.length-1),this.color(col.colors[i]));
						}
					}

                }else if(Array.isArray(col)){
                    //rgb
                    if(col.length==3){
                        converted="rgb("+col[0]+","+col[1]+","+col[2]+")";
                    }else if(col.length==4){
                        converted="rgba("+col[0]+","+col[1]+","+col[2]+","+col[3]+")";
                    }
                }else if(typeof col=="string"){
                    //get
					if(col=="fill"){
                        converted=this.ctx.fillStyle;
                    }else if(col=="stroke"){
                        converted=this.ctx.strokeStyle;
                    }
                }
            }else{
				converted=this.ctx.fillStyle;
			}

			if(type!=undefined){
				if(type=="fill"){
					this.ctx.fillStyle = converted;
				}else if(type=="stroke"){
					this.ctx.strokeStyle = converted;
				}else if(type=="both"){
					this.ctx.fillStyle = converted;
					this.ctx.strokeStyle = converted;
				}
			}else if(col!=undefined){
				if(col!="fill" || col!="stroke"){
					this.ctx.fillStyle = converted;
					this.ctx.strokeStyle = converted;
				}
			}

            return converted;
        },

        //Drawing
        fill:function(type,x,y,w,h,rotation,string){
			if(type=="text"){this.calledT++;}else{this.calledS++;}
			
            var camX=0;
			var camY=0;
			var camW=1;
			var camH=1;

			var posX=0;
			var posY=0;
			var posW=1;
			var posH=1;
			
			if(rotation==undefined){rotation=0;}

			var fS=this.fontSize;
			this.ctx.save();
            if(this.cam[this.currCam].active){
				if(type=="text"){
					var align=this.align()
					var newX=x;
					var newY=y;
					var newW=this.textW(string);
					var newH=this.textH(string);
					if(align=="right"){
						newX=x-newW;
					}else if(align=="center"){
						newX=x-newW/2;
					}
					
					
					if(rotation!=0 || this.rotated){
						var max=this.maxRotated(newX,newY,newW,newH);
						if(!this.inCamera(max[0],max[1],max[2],max[3])){
							this.ctx.restore();
							this.clippedT++;
							return;
						}
					}else{
						if(!this.inCamera(newX,newY,newW,newH)){
							this.ctx.restore();
							this.clippedT++;
							return;
						}
					}
					
					
					var ratioCam=((camW+camH)/2);
					if(ratioCam!=1){
						if(camW==1){
							ratioCam=camH;
						}else if(camH==1){
							ratioCam=camW;
						}
						if(camW>1 && camH>1){
							ratioCam=camW+camH;
						}
					}

					fS*=ratioCam;
				}else{
                    var newX=x;
                    var newY=y;
                    var newW=w;
                    var newH=h;
                    if(type=="circle" || type=="ellipse"){
                        newX=x-w;
                        newY=y-h;
                        newW=w*2;
                        newH=h*2;
                    }
					if(rotation!=0 && type!="circle" || this.rotated){
						var max=this.maxRotated(newX,newY,newW,newH);
						if(!this.inCamera(max[0],max[1],max[2],max[3])){
							this.ctx.restore();
							this.clippedS++;
							return;
						}
					}else{
						if(!this.inCamera(newX,newY,newW,newH)){
							this.ctx.restore();
							this.clippedS++;
							return;
						}
					}
				}

				camX=this.cam[this.currCam].x;
				camY=this.cam[this.currCam].y;
				camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
				camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)

				var pos=this.cam[this.currCam].pos;
				if(pos.x!=0 || pos.y!=0 || pos.w!=this.canvas.src.width || pos.h!=this.canvas.src.height){
					posX=this.cam[this.currCam].pos.x;
					posY=this.cam[this.currCam].pos.y;

					posW=Math.abs(this.canvas.src.width/this.cam[this.currCam].pos.w);
					posH=Math.abs(this.canvas.src.height/this.cam[this.currCam].pos.h);

					camW=camW/posW;
					camH=camH/posH;

					var needClip=true;
					if(type=="text"){
						if(align=="left"){
							if(this.inCameraFull(x,y,this.textW(string),this.textH(string))){
								needClip=false;
							}
						}else if(align=="right"){
							if(this.inCameraFull(x-this.textW(string),y,this.textW(string),this.textH(string))){
								needClip=false;
							}
						}else if(align=="center"){
							if(this.inCameraFull(x-this.textW(string)/2,y,this.textW(string),this.textH(string))){
								needClip=false;
							}
						}
					}else if(this.inCameraFull(x,y,w,h)){
						needClip=false;
					}

					if(needClip){
						this.ctx.beginPath();
						this.ctx.rect(posX,posY,this.cam[this.currCam].pos.w,this.cam[this.currCam].pos.h)
						this.ctx.clip();
					}
				}

				if(this.cam[this.currCam].r!=0){
					var transX=((this.canvas.w/2)*camW-camX*camW)
					var transY=((this.canvas.h/2)*camH-camY*camH)

					transX+=posX;
					transY+=posY;

                    this.ctx.translate(transX,transY);
                    this.ctx.rotate(this.cam[this.currCam].r*Math.PI/180);
                    this.ctx.translate(-transX,-transY);
				}
			}else{
				if(type=="text"){
					var align=this.align()
					var newX=x;
					var newY=y;
					var newW=this.textW(string);
					var newH=this.textH(string);
					if(align=="right"){
						newX=x-newW;
					}else if(align=="center"){
						newX=x-newW/2;
					}
					
					
					if(rotation!=0 || this.rotated){
						var max=this.maxRotated(newX,newY,newW,newH);
						if(!this.inCanvas(max[0],max[1],max[2],max[3])){
							this.ctx.restore();
							this.clippedT++;
							return;
						}
					}else{
						if(!this.inCanvas(newX,newY,newW,newH)){
							this.ctx.restore();
							this.clippedT++;
							return;
						}
					}
				}else{
                    var newX=x;
                    var newY=y;
                    var newW=w;
                    var newH=h;
                    if(type=="circle" || type=="ellipse"){
                        newX=x-w;
                        newY=y-h;
                        newW=w*2;
                        newH=h*2;
                    }
					if(rotation!=0 && type!="circle" || this.rotated){
						var max=this.maxRotated(newX,newY,newW,newH);
						if(!this.inCanvas(max[0],max[1],max[2],max[3])){
							this.ctx.restore();
							this.clippedS++;
							return;
						}
					}else{
						if(!this.inCanvas(newX,newY,newW,newH)){
							this.ctx.restore();
							this.clippedS++;
							return;
						}
					}
				}
			}

            if(rotation!=0){
                if(type=="line"){
					var transX=(((w-x)/2)*camW-camX*camW)+x*camW;
					var transY=(((h-y)/2)*camH-camY*camH)+y*camH;

					transX+=posX;
					transY+=posY;

                    this.ctx.translate(transX,transY);
                    this.ctx.rotate(rotation*Math.PI/180);
                    this.ctx.translate(-transX,-transY);
                }else if(type=="ellipse"){
					var beforeW=w;
					var beforeH=h;
					w=0
					h=0

					var transX=((w/2)*camW-camX*camW)+x*camW;
					var transY=((h/2)*camH-camY*camH)+y*camH;

					transX+=posX;
					transY+=posY;

                    this.ctx.translate(transX,transY);
                    this.ctx.rotate(rotation*Math.PI/180);
                    this.ctx.translate(-transX,-transY);
					w=beforeW;
					h=beforeH;
                }else{
					var transX=((w/2)*camW-camX*camW)+x*camW
					var transY=((h/2)*camH-camY*camH)+y*camH

					transX+=posX;
					transY+=posY;

                    this.ctx.translate(transX,transY);
                    this.ctx.rotate(rotation*Math.PI/180);
                    this.ctx.translate(-transX,-transY);
                }

            }
            switch(type){
                case "rect":
                    this.ctx.fillRect((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*camW,h*camH);
                    break;
                case "rectB":
                    this.ctx.strokeRect((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*camW,h*camH);
                    break;
                case "arc":
                    this.ctx.arc((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*((camW+camH)/2),0,2*Math.PI);
                    break;
				case "ellipse":
                    this.ctx.ellipse((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*camW,h*camH,0,0,2*Math.PI);
					break;
                case "arcB":
                    this.ctx.arc((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*((camW+camH)/2),0,2*Math.PI);
                    break;
                case "text":
					this.ctx.font=fS+"px "+this.fontName;
                    this.ctx.fillText(string,(x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY)
                    break;
                case "textB":
                    this.ctx.strokeText(string,(x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY)
                    break;
                case "line":
                    this.ctx.moveTo((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY);
                    this.ctx.lineTo((w*camW)-(camX*camW)+posX,(h*camH)-(camY*camH)+posY);
                    break;
            }


            this.ctx.restore();

        },
		
		maxRotated:function(x,y,w,h){
			var newW=w*1.5;
			var newH=h*1.5;
			if(w>h){
				newW=newW+(newH*0.5);
				newH=newW;
			}else if(w<h){
				newH=newH+(newW*0.5);
				newW=newH;
			}
			
			var newX=(x+w/2)-(newW/2);
			var newY=(y+h/2)-(newH/2);
            
            if(this.rotatedMod>0){
                newX-=this.rotatedMod;
                newY-=this.rotatedMod;
                newW+=this.rotatedMod*2;
                newH+=this.rotatedMod*2;
            }
			
			var coords=[newX,newY,newW,newH];
            
			return coords;
		},
		
		
		//Clipping shapes
		clip:function(type,x,y,w,h,rotation,lineW){
			var camX=0;
			var camY=0;
			var camW=1;
			var camH=1;

			var posX=0;
			var posY=0;
			var posW=1;
			var posH=1;

			this.ctx.save();
			this.saveCpt++;

			if(this.cam[this.currCam].active){
				camX=this.cam[this.currCam].x;
				camY=this.cam[this.currCam].y;
				camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
				camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)

				var pos=this.cam[this.currCam].pos;
				if(pos.x!=0 || pos.y!=0 || pos.w!=this.canvas.src.width || pos.h!=this.canvas.src.height){
					posX=this.cam[this.currCam].pos.x;
					posY=this.cam[this.currCam].pos.y;

					posW=Math.abs(this.canvas.src.width/this.cam[this.currCam].pos.w);
					posH=Math.abs(this.canvas.src.height/this.cam[this.currCam].pos.h);

					camW=camW/posW;
					camH=camH/posH;
				}

				if(this.cam[this.currCam].r!=0){
					var transX=((this.canvas.w/2)*camW-camX*camW)
					var transY=((this.canvas.h/2)*camH-camY*camH)

					transX+=posX;
					transY+=posY;

                    this.ctx.translate(transX,transY);
                    this.ctx.rotate(this.cam[this.currCam].r*Math.PI/180);
                    this.ctx.translate(-transX,-transY);
				}
			}

      var loop=false;
      var len=1;
      this.ctx.beginPath();
      if(Array.isArray(type)){
          loop=true;
          len=type.length;
      }
      for(var i=0;i<len;i++){
        var shape="shape";
        if(loop){
          x=type[i];
        }else{
          shape=type;
        }

        var r=0;
        if(x.x!=undefined){
            h=x.h;
            w=x.w;
            y=x.y;
            r=x.r;
            if(x.shape!=undefined){
              shape=x.shape;
            }
            if(x.lineW!=undefined){
              lineW=x.lineW;
            }
            x=x.x;
        }

        if(shape=="shape"){
          shape="rect";
        }

        if(r!=0){rotation=r;}
  			if(shape=="line"){
  				shape="rect";
  				var width=Math.sqrt(Math.pow(x-w,2) + Math.pow(y-h,2));
  				var height=lineW;
  				var middleX=(x+w)/2;
  				var middleY=(y+h)/2;

  				var deltaX=-x;
  				var deltaY=y;
  				if(w!=undefined){
  					deltaX=(w-x)*-1;
  					deltaY=h-y;
  				}
  				var angle=(Math.atan2(deltaX,deltaY)*180/Math.PI)-90;

  				if(rotation==undefined){rotation=angle}else{rotation+=angle;}

  				x=middleX-width/2;
  				y=middleY-height/2;
  				w=width;
  				h=height;
  			}

  			if(rotation!=undefined){
  				var transX=((w/2)*camW-camX*camW)+x*camW
  				var transY=((h/2)*camH-camY*camH)+y*camH
  				if(shape=="ellipse"){
  					transX=((0/2)*camW-camX*camW)+x*camW;
  					transY=((0/2)*camH-camY*camH)+y*camH;
                  }

  				transX+=posX;
  				transY+=posY;

  				this.ctx.translate(transX,transY);
  				this.ctx.rotate(rotation*Math.PI/180);
  				this.ctx.translate(-transX,-transY);
              }


  			switch(shape){
          case "rect":
              this.ctx.moveTo(0,0)
              this.ctx.rect((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*camW,h*camH)
              break;
          case "circle":
              this.ctx.moveTo(0,0)
              this.ctx.arc((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*((camW+camH)/2),0,2*Math.PI);
              this.ctx
              break;
          case "ellipse":
              this.ctx.moveTo(0,0)
              this.ctx.ellipse((x*camW)-(camX*camW)+posX,(y*camH)-(camY*camH)+posY,w*camW,h*camH,0,0,2*Math.PI);
              break;
        }

        if(rotation!=undefined){
  				var transX=((w/2)*camW-camX*camW)+x*camW
  				var transY=((h/2)*camH-camY*camH)+y*camH
  				if(shape=="ellipse"){
    				transX=((0/2)*camW-camX*camW)+x*camW;
    				transY=((0/2)*camH-camY*camH)+y*camH;
          }

  				transX+=posX;
  				transY+=posY;

  				this.ctx.translate(transX,transY);
  				this.ctx.rotate(-rotation*Math.PI/180);
  				this.ctx.translate(-transX,-transY);
        }
      }


			this.ctx.clip();



			if(this.cam[this.currCam].active){
				if(this.cam[this.currCam].r!=0){
					var transX=((this.canvas.w/2)*camW-camX*camW)
					var transY=((this.canvas.h/2)*camH-camY*camH)

					transX+=posX;
					transY+=posY;

          this.ctx.translate(transX,transY);
          this.ctx.rotate(this.cam[this.currCam].r*Math.PI/180);
          this.ctx.translate(-transX,-transY);
				}
			}
		},


        scale:function(scaleX,scaleY,x,y,w,h){
			var camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
            var camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)
            var camX=this.cam[this.currCam].x;
            var camY=this.cam[this.currCam].y;

            if(this.cam[this.currCam].active==false){
                camX=0;
                camY=0;
                camW=1;
                camH=1;
            }

			var xx=0;
			var yy=0;
			var ww=this.canvas.w;
			var hh=this.canvas.h;
			if(typeof x=="object"){
				xx=x.x;
				yy=x.y;
				ww=x.w;
				hh=x.h;
			}else{
				if(x!=undefined){xx=x;}
				if(y!=undefined){yy=y;}
				if(w!=undefined){ww=w;}
				if(h!=undefined){hh=h;}
			}

			var moveX=((ww/2)*camW-camX*camW)+xx*camW;
			var moveY=((hh/2)*camH-camY*camH)+yy*camH;
            this.ctx.translate(moveX,moveY);
            this.ctx.scale(scaleX,scaleY);
			this.ctx.translate(-moveX,-moveY);
		},
        //rotate
        rotate:function(rotation,x,y,w,h){
            var camW=Math.abs(this.canvas.src.width/this.cam[this.currCam].w)
            var camH=Math.abs(this.canvas.src.height/this.cam[this.currCam].h)
            var camX=this.cam[this.currCam].x;
            var camY=this.cam[this.currCam].y;
            if(this.cam[this.currCam].active==false){
                camX=0;
                camY=0;
                camW=1;
                camH=1;
            }

			var xx=0;
			var yy=0;
			var ww=this.canvas.w;
			var hh=this.canvas.h;
			if(typeof x=="object"){
				xx=x.x;
				yy=x.y;
				ww=x.w;
				hh=x.h;
			}else{
				if(x!=undefined){xx=x;}
				if(y!=undefined){yy=y;}
				if(w!=undefined){ww=w;}
				if(h!=undefined){hh=h;}
			}

			var moveX=((ww/2)*camW-camX*camW)+xx*camW;
			var moveY=((hh/2)*camH-camY*camH)+yy*camH;
            this.ctx.translate(moveX,moveY);
            this.ctx.rotate(rotation*Math.PI/180);
			this.ctx.translate(-moveX,-moveY);
            
            if(rotation!=0){
                this.rotated=true;
                var mod=ww;
                if(hh>ww){mod=hh;}
				if(mod==1){
					if(this.canvas.w>this.canvas.h){
						mod=this.canvas.w-this.canvas.h;
					}else if(this.canvas.h>this.canvas.h){
						mod=this.canvas.h-this.canvas.w;
					}
					mod=mod*1.5;
				}
                this.rotatedMod=mod;
            }
        },

        //Gradients

        //linear gradient
        linear:function(x1,y1,x2,y2,colors,offsets){
            var linear={};

            linear.gradient="linear";

            linear.x1=x1;
            linear.y1=y1;
            linear.x2=x2;
            linear.y2=y2;
            linear.colors=colors;
            linear.offsets=offsets;

            return linear;
        },

        //radial gradient
        radial:function(x1,y1,d1,x2,y2,d2,colors,offsets){
            var radial={};

            radial.gradient="radial";

            radial.x1=x1+d1/2;
            radial.y1=y1+d1/2;
            radial.r1=d1/2;
            radial.x2=x2+d2/2;
            radial.y2=y2+d2/2;
            radial.r2=d2/2;
            radial.colors=colors;
            radial.offsets=offsets;

            return radial;
        },
    }

    this.drawing.assets=this.assets;








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
			var num=0;
            if(min==undefined){
                //no params
				num=Math.floor(Math.random()*(2))
            }else if(max==undefined){
                //only min
                if(min<0){
					num=Math.floor(Math.random()*(min-1)+1);
                }else{
					num=Math.floor(Math.random()*(min+1));
                }
            }else if(variable==undefined){
                //only min and max
				num=Math.floor(Math.random()*(max-min+1)+min);
            }else{
                //all 3
				var round=0;
				if(variable<1){
					round=(variable.toString().length-2)
				}
				num=this.round(Math.floor(Math.random()*((max/variable)-(min/variable)+1)+(min/variable))*variable,round);
            }
            return num;
        },
		odds: function(min,max,winningValue,losingValue) {
			//only min and max
			val=false;
			if(losingValue!=undefined){
				val=losingValue;
			}else{
				if(winningValue!=undefined){
					val=undefined;
				}
			}

			num=Math.floor(Math.random()*(max-min+1)+min);
			if(num==min){
				val=true;
				if(winningValue!=undefined){
					val=winningValue;
				}
			}
            return val;
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
		wrapIndex: function(num,min,max) {
			var done=false;
			if(num<min){
				num=max;
			}else if(num>max){
				num=min;
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
            return Math.sin(angle*Math.PI/180)
        },

        //Get the vertical ratio of an angle
        angleY:function(angle){
            return -Math.cos(angle*Math.PI/180)
        },

       //Get the angle from a direction or 2 points, 0 is the north and goes clockwise
        angle:function(x,y,x2,y2){
            var deltaX=-x;
            var deltaY=y;
            if(x2!=undefined){
                deltaX=(x2-x)*-1;
                deltaY=y2-y;
            }
            var angle=Math.atan2(deltaX,deltaY)*180/Math.PI;

            var degrees=this.wrap(angle-180,0,360)
            return degrees;
        },

		arr: function(w,val){
            var arr=new Array(w);
            for(var i=0;i<arr.length;i++){
				arr[i]=val
            }
            return arr;
        },

        matrix: function(w,h,val){
            var mat=new Array(h);
            for(var i=0;i<mat.length;i++){
                mat[i]=new Array(w);
				for(var j=0;j<mat[i].length;j++){
					mat[i][j]=val;
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
			return min+(max-min)*(percent);
		},

		floor:function(num,digits){
      if(digits==undefined){digits=0;}
			var mult=10**digits;
			return Math.floor((num+Number.EPSILON)*mult)/mult;
		},

		ceil:function(num,digits){
      if(digits==undefined){digits=0;}
			var mult=10**digits;
			return Math.ceil((num+Number.EPSILON)*mult)/mult;
		},

		abs:function(num){
			return Math.abs(num);
		},

		sign:function(num){
			return Math.sign(num);
		},

		round:function(num,digits){
			if(digits==undefined){digits=0;}
			var mult=10**digits;
			return Math.round((num+Number.EPSILON) * mult) / mult;
		},
        
        digits:function(num,digits){
            if(digits==undefined){digits=0;}
            num=num.toString();
            var split=num.split(".");
            if(split.length>1){
                var dot=split[1];
                if(dot.length>digits){
                    var diff=dot.length-digits;
                    num=num.slice(0,-diff);
                    if(digits==0){
                        num=num.slice(0,-1);
                    }
                }else{
                    var diff=digits-dot.length;
                    for(var i=0;i<diff;i++){
                        num+="0";
                    }
                }
            }else{
                if(digits>0){
                    num+=".";
                    for(var i=0;i<digits;i++){
                        num+="0";
                    }
                }
            }
            return num;
            
        },


    },

    this.collision={
        dist: function(obj1,obj2) {return Math.sqrt(Math.pow(obj2.x-obj1.x,2) + Math.pow(obj2.y-obj1.y,2))},
		wrap: function(num,min,max) {var done=false;var cpt=0;while(!done){if(cpt==100){break;}if(num<min){num=max-(min-num);}else if(num>max){num=min+(num-max)}else{done=true;}cpt++;}return num},
		angleX:function(angle){return Math.sin(angle*Math.PI/180)},
        angleY:function(angle){return -Math.cos(angle*Math.PI/180)},
        angle:function(x,y,x2,y2){var deltaX=-x;var deltaY=y;if(x2!=undefined){deltaX=(x2-x)*-1;deltaY=y2-y;}var angle=Math.atan2(deltaX,deltaY)*180/Math.PI;var degrees=this.wrap(angle-180,0,359);return degrees;},
		lerp:function(percent,min,max){return min+(max-min)*(percent);},
        
        automatic:function(obj1,obj2){
            var col=false;
            
            var shape1="point";
            var shape2="point";
            if(obj1.w!=undefined){
                shape1="rect";
            }
            if(obj1.x1!=undefined){
                shape1="line";
            }
            if(obj1.d!=undefined){
                shape1="circle";
            }
            if(obj1.dX!=undefined){
                shape1="ellipse";
            }
            if(shape1=="rect"){
                if(obj1.attr!=undefined){
                    if(obj1.attr.shape=="circle"){
                        shape1="circle";
                    }else if(obj1.attr.shape=="ellipse"){
                        shape1="ellipse";
                    }else if(obj1.attr.shape=="line"){
                        shape1="line";
                    }
                }
            }
            
            if(obj2.w!=undefined){
                shape2="rect";
            }
            if(obj2.x1!=undefined){
                shape2="line";
            }
            if(obj2.d!=undefined){
                shape2="circle";
            }
            if(obj2.dX!=undefined){
                shape2="ellipse";
            }
            if(shape2=="rect"){
                if(obj2.attr!=undefined){
                    if(obj2.attr.shape=="circle"){
                        shape2="circle";
                    }else if(obj2.attr.shape=="ellipse"){
                        shape2="ellipse";
                    }else if(obj2.attr.shape=="line"){
                        shape2="line";
                    }
                }
            }
            
            if(shape1=="rect"){
                if(shape2=="point"){
                    col=this.rectPoint(obj1,obj2);
                }else if(shape2=="rect"){
                    col=this.rect(obj1,obj2);
                }else if(shape2=="circle"){
                    col=this.rectCircle(obj1,obj2);
                }else if(shape2=="ellipse"){
                    col=this.rectEllipse(obj1,obj2);
                }else if(shape2=="line"){
                    col=this.lineRect(obj2,obj1);
                }
            }else if(shape1=="circle"){
                if(shape2=="point"){
                    col=this.circlePoint(obj1,obj2);
                }else if(shape2=="rect"){
                    col=this.rectCircle(obj2,obj1);
                }else if(shape2=="circle"){
                    col=this.circle(obj1,obj2);
                }else if(shape2=="ellipse"){
                    col=this.circleEllipse(obj1,obj2);
                }else if(shape2=="line"){
                    col=this.lineCircle(obj2,obj1);
                }
            }else if(shape1=="ellipse"){
                if(shape2=="point"){
                    col=this.ellipsePoint(obj1,obj2);
                }else if(shape2=="rect"){
                    col=this.rectEllipse(obj2,obj1);
                }else if(shape2=="circle"){
                    col=this.circleEllipse(obj2,obj1);
                }else if(shape2=="ellipse"){
                    col=this.ellipse(obj1,obj2);
                }else if(shape2=="line"){
                    col=this.lineEllipse(obj2,obj1);
                }
            }else if(shape1=="line"){
                if(shape2=="point"){
                    col=this.linePoint(obj1,obj2);
                }else if(shape2=="rect"){
                    col=this.lineRect(obj1,obj2);
                }else if(shape2=="circle"){
                    col=this.lineCircle(obj1,obj2);
                }else if(shape2=="ellipse"){
                    col=this.lineEllipse(obj1,obj2);
                }else if(shape2=="line"){
                    col=this.line(obj1,obj2);
                }
            }else if(shape1=="point"){
                if(shape2=="point"){
                    col=this.pointPoint(obj1,obj2);
                }else if(shape2=="rect"){
                    col=this.rectPoint(obj2,obj1);
                }else if(shape2=="circle"){
                    col=this.circlePoint(obj2,obj1);
                }else if(shape2=="ellipse"){
                    col=this.ellipsePoint(obj2,obj1);
                }else if(shape2=="line"){
                    col=this.linePoint(obj2,obj1);
                }
            }
            
            return col;
        },
        
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
        circle: function(c1,c2) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            var circle1={x:c1.x,y:c1.y,d:c1.d};
            var circle2={x:c2.x,y:c2.y,d:c2.d};
            if(circle1.d==undefined){circle1.d=circle1.diameter}
            if(circle1.d==undefined){
                if(c1.attr!=undefined){
                    if(c1.attr.shape=="circle"){
                        circle1.d=c1.w;
                    }
                }
            }
            if(circle2.d==undefined){circle2.d=circle2.diameter}
            if(circle2.d==undefined){
                if(c2.attr!=undefined){
                    if(c2.attr.shape=="circle"){
                        circle2.d=c2.w;
                    }
                }
            }
            
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
        circlePoint:function(c,point){
            var col=false;
            var circle={x:c.x,y:c.y,d:c.d};
            if(circle.d==undefined){circle.d=circle.diameter}
            if(circle.d==undefined){
                if(c.attr!=undefined){
                    if(c.attr.shape=="circle"){
                        circle.d=c.w;
                    }
                }
            }
            var temp={
                x:circle.x+circle.d/2,
                y:circle.y+circle.d/2
            }
            if (this.dist(temp,point)<circle.d/2) {
                col=true;
            }
            return col;
        },
        rectCircle: function(rect,c) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            
            var circle={x:c.x,y:c.y,d:c.d};
            if(circle.d==undefined){circle.d=circle.diameter}
            if(circle.d==undefined){
                if(c.attr!=undefined){
                    if(c.attr.shape=="circle"){
                        circle.d=c.w;
                    }
                }
            }
			//Check if col with bounding box
			var bounding={x:circle.x,y:circle.y,w:circle.d,h:circle.d};
			if(!this.rect(rect,bounding)){
				col=false;
				return col;

			}

			//Get middle
			var circleMid={x:circle.x+circle.d/2,y:circle.y+circle.d/2}
			var rectMid={x:rect.x+rect.w/2,y:rect.y+rect.h/2}

			//Check corners of rect
			var point={x:rect.x,y:rect.y}
			if(circleMid.x>rectMid.x){
				point.x=rect.x+rect.w;
			}
			if(circleMid.y>rectMid.y){
				point.y=rect.y+rect.h;
			}

			if(this.circlePoint(circle,point)){
				col=true;
				return col;
			}

			//check ellipse sides as points
			circlePX={x:circle.x+circle.d,y:circle.y+circle.d/2};
			if(circleMid.x>rectMid.x){
				circlePX.x=circle.x;
				if(circlePX.x<rect.x+rect.w/2){
					circlePX.x=rectMid.x;
				}
			}else{
				if(circlePX.x>rect.x+rect.w/2){
					circlePX.x=rectMid.x;
				}
			}

			if(this.rectPoint(rect,circlePX)){
				col=true;
				return col;
			}

			circlePY={x:circle.x+circle.d/2,y:circle.y+circle.d};
			if(circleMid.y>rectMid.y){
				circlePY.y=circle.y;
				if(circlePY.y<rect.y+rect.h/2){
					circlePY.y=rectMid.y;
				}
			}else{
				if(circlePY.y>rect.y+rect.h/2){
					circlePY.y=rectMid.y;
				}
			}

			if(this.rectPoint(rect,circlePY)){
				col=true;
				return col;
			}

            return col;
        },
		rectEllipse: function(rect,e) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            var ellipse={x:e.x,y:e.y,dX:e.dX,dY:e.dY};
            if(ellipse.dX==undefined){ellipse.dX=ellipse.diameterX}
            if(ellipse.dX==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dX=e.w;
                    }
                }
            }
            if(ellipse.dY==undefined){ellipse.dY=ellipse.diameterY}
            if(ellipse.dY==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dY=e.h;
                    }
                }
            }
			//Check if col with bounding box
			var bounding={x:ellipse.x,y:ellipse.y,w:ellipse.dX,h:ellipse.dY};
			if(!this.rect(rect,bounding)){
				col=false;
				return col;

			}

			//Check col with small circle
			var x=(ellipse.x+ellipse.dX/2)-ellipse.dY/2
			var y=(ellipse.y+ellipse.dY/2)-ellipse.dX/2
			var smallCircle={x:x,y:ellipse.y,d:ellipse.dY}
			if(ellipse.dY>ellipse.dX){
				var y=(ellipse.y+ellipse.dY/2)-ellipse.dX/2
				var smallCircle={x:ellipse.x,y:y,d:ellipse.dX}
			}

			if(this.rectCircle(rect,smallCircle)){
				col=true;
				return col;
			}

			//Get middle
			var ellipseMid={x:ellipse.x+ellipse.dX/2,y:ellipse.y+ellipse.dY/2}
			var rectMid={x:rect.x+rect.w/2,y:rect.y+rect.h/2}

			//Check corners of rect
			var point={x:rect.x,y:rect.y}
			if(ellipseMid.x>rectMid.x){
				point.x=rect.x+rect.w;
			}
			if(ellipseMid.y>rectMid.y){
				point.y=rect.y+rect.h;
			}

			if(this.ellipsePoint(ellipse,point)){
				col=true;
				return col;
			}

			//check ellipse sides as points
			ellipsePX={x:ellipse.x+ellipse.dX,y:ellipse.y+ellipse.dY/2};
			if(ellipseMid.x>rectMid.x){
				ellipsePX.x=ellipse.x;
				if(ellipsePX.x<rect.x+rect.w/2){
					ellipsePX.x=rectMid.x;
				}
			}else{
				if(ellipsePX.x>rect.x+rect.w/2){
					ellipsePX.x=rectMid.x;
				}
			}

			if(this.rectPoint(rect,ellipsePX)){
				col=true;
				return col;
			}

			ellipsePY={x:ellipse.x+ellipse.dX/2,y:ellipse.y+ellipse.dY};
			if(ellipseMid.y>rectMid.y){
				ellipsePY.y=ellipse.y;
				if(ellipsePY.y<rect.y+rect.h/2){
					ellipsePY.y=rectMid.y;
				}
			}else{
				if(ellipsePY.y>rect.y+rect.h/2){
					ellipsePY.y=rectMid.y;
				}
			}

			if(this.rectPoint(rect,ellipsePY)){
				col=true;
				return col;
			}

            return col;
        },
		circleEllipse: function(c,e) {
            // **** should check if the width/height vars are 'h' form or 'height' form
            var col=false;
            
            var circle={x:c.x,y:c.y,d:c.d};
            if(circle.d==undefined){circle.d=circle.diameter}
            if(circle.d==undefined){
                if(c.attr!=undefined){
                    if(c.attr.shape=="circle"){
                        circle.d=c.w;
                    }
                }
            }
            
            var ellipse={x:e.x,y:e.y,dX:e.dX,dY:e.dY};
            if(ellipse.dX==undefined){ellipse.dX=ellipse.diameterX}
            if(ellipse.dX==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dX=e.w;
                    }
                }
            }
            if(ellipse.dY==undefined){ellipse.dY=ellipse.diameterY}
            if(ellipse.dY==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dY=e.h;
                    }
                }
            }
			//Check if col with bounding box
			var bounding={x:ellipse.x,y:ellipse.y,w:ellipse.dX,h:ellipse.dY};
			if(!this.rectCircle(bounding,circle)){
				col=false;
				return col;

			}

			//Check col with small circle
			var x=(ellipse.x+ellipse.dX/2)-ellipse.dY/2
			var smallCircle={x:x,y:ellipse.y,d:ellipse.dY}
			if(ellipse.dY>ellipse.dX){
				var y=(ellipse.y+ellipse.dY/2)-ellipse.dX/2
				var smallCircle={x:ellipse.x,y:y,d:ellipse.dX}
			}

			if(this.circle(circle,smallCircle)){
				col=true;
				return col;
			}

			//Get middle
			var ellipseMid={x:ellipse.x+ellipse.dX/2,y:ellipse.y+ellipse.dY/2}
			var circleMid={x:circle.x+circle.d/2,y:circle.y+circle.d/2}

			//check corners of circle and sides
			var pointX={x:circle.x,y:circle.y+circle.d/2};
			var pointY={x:circle.x+circle.d/2,y:circle.y};
			var r=this.angleX(45)

			var rXThin=this.angleX(67.5)
			var rYThin=this.angleY(67.5)

			var rXLarge=this.angleX(22.5)
			var rYLarge=this.angleY(22.5)

			var point={x:circle.x+circle.d/2-circle.d/2*r,y:circle.y+circle.d/2-circle.d/2*r}
			var pointThin={x:circle.x+circle.d/2-circle.d/2*rXThin,y:circle.y+circle.d/2+circle.d/2*rYThin}
			var pointLarge={x:circle.x+circle.d/2-circle.d/2*rXLarge,y:circle.y+circle.d/2+circle.d/2*rYLarge}
			if(ellipseMid.x>circleMid.x){
				point.x=circle.x+circle.d/2+circle.d/2*r;
				pointX.x=circle.x+circle.d;
				pointThin.x=circle.x+circle.d/2+circle.d/2*rXThin;
				pointLarge.x=circle.x+circle.d/2+circle.d/2*rXLarge
			}
			if(ellipseMid.y>circleMid.y){
				point.y=circle.y+circle.d/2+circle.d/2*r
				pointY.y=circle.y+circle.d;
				pointThin.y=circle.y+circle.d/2-circle.d/2*rYThin
				pointLarge.y=circle.y+circle.d/2-circle.d/2*rYLarge
			}

			if(this.ellipsePoint(ellipse,point)){
				col=true;
				return col;
			}
			if(this.ellipsePoint(ellipse,pointX)){
				col=true;
				return col;
			}
			if(this.ellipsePoint(ellipse,pointY)){
				col=true;
				return col;
			}
			if(this.ellipsePoint(ellipse,pointThin)){
				col=true;
				return col;
			}
			if(this.ellipsePoint(ellipse,pointLarge)){
				col=true;
				return col;
			}

			//check ellipse sides as points
			ellipsePX={x:ellipse.x+ellipse.dX,y:ellipse.y+ellipse.dY/2};
			if(ellipseMid.x>circleMid.x){
				ellipsePX.x=ellipse.x;
				if(ellipsePX.x<circle.x+circle.d/2){
					ellipsePX.x=circleMid.x;
				}
			}else{
				if(ellipsePX.x>circle.x+circle.d/2){
					ellipsePX.x=circleMid.x;
				}
			}

			if(this.circlePoint(circle,ellipsePX)){
				col=true;
				return col;
			}

			ellipsePY={x:ellipse.x+ellipse.dX/2,y:ellipse.y+ellipse.dY};
			if(ellipseMid.y>circleMid.y){
				ellipsePY.y=ellipse.y;
				if(ellipsePY.y<circle.y+circle.d/2){
					ellipsePY.y=circleMid.y;
				}
			}else{
				if(ellipsePY.y>circle.y+circle.d/2){
					ellipsePY.y=circleMid.y;
				}
			}

			if(this.circlePoint(circle,ellipsePY)){
				col=true;
				return col;
			}

            return col;
        },
		ellipse:function(e,e2){
			//Check col with bounding
			var col=false;
            
            var ellipse={x:e.x,y:e.y,dX:e.dX,dY:e.dY};
            if(ellipse.dX==undefined){ellipse.dX=ellipse.diameterX}
            if(ellipse.dX==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dX=e.w;
                    }
                }
            }
            if(ellipse.dY==undefined){ellipse.dY=ellipse.diameterY}
            if(ellipse.dY==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dY=e.h;
                    }
                }
            }
            
            var ellipse2={x:e2.x,y:e2.y,dX:e2.dX,dY:e2.dY};
            if(ellipse2.dX==undefined){ellipse2.dX=ellipse2.diameterX}
            if(ellipse2.dX==undefined){
                if(e2.attr!=undefined){
                    if(e2.attr.shape=="ellipse"){
                        ellipse2.dX=e2.w;
                    }
                }
            }
            if(ellipse2.dY==undefined){ellipse2.dY=ellipse2.diameterY}
            if(ellipse2.dY==undefined){
                if(e2.attr!=undefined){
                    if(e2.attr.shape=="ellipse"){
                        ellipse2.dY=e2.h;
                    }
                }
            }

			var bounding={x:ellipse.x,y:ellipse.y,w:ellipse.dX,h:ellipse.dY}
			var bounding2={x:ellipse2.x,y:ellipse2.y,w:ellipse2.dX,h:ellipse2.dY}
			if(!this.rect(bounding,bounding2)){
				col=false;
				return col;
			}

			//check if col with small circle
			var x=(ellipse.x+ellipse.dX/2)-ellipse.dY/2
			var smallCircle={x:x,y:ellipse.y,d:ellipse.dY}
			if(ellipse.dY>ellipse.dX){
				var y=(ellipse.y+ellipse.dY/2)-ellipse.dX/2
				smallCircle={x:ellipse.x,y:y,d:ellipse.dX}
			}


			if(this.circleEllipse(smallCircle,ellipse2)){
				col=true;
				return col;
			}

			var x2=(ellipse2.x+ellipse2.dX/2)-ellipse2.dY/2
			var smallCircle2={x:x2,y:ellipse2.y,d:ellipse2.dY}
			if(ellipse2.dY>ellipse2.dX){
				var y2=(ellipse2.y+ellipse2.dY/2)-ellipse2.dX/2
				smallCircle2={x:ellipse2.x,y:y2,d:ellipse2.dX}
			}

			if(this.circleEllipse(smallCircle2,ellipse)){
				col=true;
				return col;
			}

			var ellipseMid={x:ellipse.x+ellipse.dX/2,y:ellipse.y+ellipse.dY/2}
			var ellipse2Mid={x:ellipse2.x+ellipse2.dX/2,y:ellipse2.y+ellipse2.dY/2}

			//Check ellipse sides as points
			var pointX={x:ellipse2.x,y:ellipse2.y+ellipse2.dY/2}
			var pointY={x:ellipse2.x+ellipse2.dX/2,y:ellipse2.y}
			if(ellipseMid.x>ellipse2Mid.x){
				pointX.x=ellipse2.x+ellipse2.dX;
				if(pointX.x>ellipseMid.x){
					pointX.x=ellipseMid.x;
				}
			}else{
				if(pointX.x<ellipseMid.x){
					pointX.x=ellipseMid.x;
				}
			}

			if(this.ellipsePoint(ellipse,pointX)){
				col=true;
				return col;
			}

			if(ellipseMid.y>ellipse2Mid.y){
				pointY.y=ellipse2.y+ellipse2.dY;
				if(pointY.y>ellipseMid.y){
					pointY.y=ellipseMid.y;
				}
			}else{
				if(pointY.y<ellipseMid.y){
					pointY.y=ellipseMid.y;
				}
			}

			if(this.ellipsePoint(ellipse,pointY)){
				col=true;
				return col;
			}

			//Check other ellipse sides as points
			var pointX={x:ellipse.x,y:ellipse.y+ellipse.dY/2}
			var pointY={x:ellipse.x+ellipse.dX/2,y:ellipse.y}
			if(ellipse2Mid.x>ellipseMid.x){
				pointX.x=ellipse.x+ellipse.dX;
				if(pointX.x>ellipse2Mid.x){
					pointX.x=ellipse2Mid.x;
				}
			}else{
				if(pointX.x<ellipse2Mid.x){
					pointX.x=ellipse2Mid.x;
				}
			}

			if(this.ellipsePoint(ellipse2,pointX)){
				col=true;
				return col;
			}

			if(ellipse2Mid.y>ellipseMid.y){
				pointY.y=ellipse.y+ellipse.dY;
				if(pointY.y>ellipse2Mid.y){
					pointY.y=ellipse2Mid.y;
				}
			}else{
				if(pointY.y<ellipse2Mid.y){
					pointY.y=ellipse2Mid.y;
				}
			}

			if(this.ellipsePoint(ellipse2,pointY)){
				col=true;
				return col;
			}

			//Check corner of ellipse
			var r=45;
			var rThin=22.5;
			var rLarge=67.5;
			var rX=this.angleX(r);
			var rXThin=this.angleX(rThin);
			var rXLarge=this.angleX(rLarge);
			var rY=this.angleY(r);
			var rYThin=this.angleY(rThin);
			var rYLarge=this.angleY(rLarge);

			var point={x:ellipse.x+ellipse.dX/2+rX*ellipse.dX/2,y:ellipse.y+ellipse.dY/2+rY*ellipse.dY/2}
			var pointThin={x:ellipse.x+ellipse.dX/2+rXThin*ellipse.dX/2,y:ellipse.y+ellipse.dY/2+rYThin*ellipse.dY/2}
			var pointLarge={x:ellipse.x+ellipse.dX/2+rXLarge*ellipse.dX/2,y:ellipse.y+ellipse.dY/2+rYLarge*ellipse.dY/2}

			if(ellipseMid.x>ellipse2Mid.x){
				point.x=ellipse.x+ellipse.dX/2-rX*ellipse.dX/2;
				pointThin.x=ellipse.x+ellipse.dX/2-rXThin*ellipse.dX/2;
				pointLarge.x=ellipse.x+ellipse.dX/2-rXLarge*ellipse.dX/2;
			}

			if(ellipseMid.y<ellipse2Mid.y){
				point.y=ellipse.y+ellipse.dY/2-rY*ellipse.dY/2;
				pointThin.y=ellipse.y+ellipse.dY/2-rYThin*ellipse.dY/2;
				pointLarge.y=ellipse.y+ellipse.dY/2-rYLarge*ellipse.dY/2;
			}

			if(this.ellipsePoint(ellipse2,point)){
				col=true;
				return col;
			}

			if(this.ellipsePoint(ellipse2,pointThin)){
				col=true;
				return col;
			}

			if(this.ellipsePoint(ellipse2,pointLarge)){
				col=true;
				return col;
			}

			//Check for other ellipse
			var point={x:ellipse2.x+ellipse2.dX/2+rX*ellipse2.dX/2,y:ellipse2.y+ellipse2.dY/2+rY*ellipse2.dY/2}
			var pointThin={x:ellipse2.x+ellipse2.dX/2+rXThin*ellipse2.dX/2,y:ellipse2.y+ellipse2.dY/2+rYThin*ellipse2.dY/2}
			var pointLarge={x:ellipse2.x+ellipse2.dX/2+rXLarge*ellipse2.dX/2,y:ellipse2.y+ellipse2.dY/2+rYLarge*ellipse2.dY/2}

			if(ellipse2Mid.x>ellipseMid.x){
				point.x=ellipse2.x+ellipse2.dX/2-rX*ellipse2.dX/2;
				pointThin.x=ellipse2.x+ellipse2.dX/2-rXThin*ellipse2.dX/2;
				pointLarge.x=ellipse2.x+ellipse2.dX/2-rXLarge*ellipse2.dX/2;
			}

			if(ellipse2Mid.y<ellipseMid.y){
				point.y=ellipse2.y+ellipse2.dY/2-rY*ellipse2.dY/2;
				pointThin.y=ellipse2.y+ellipse2.dY/2-rYThin*ellipse2.dY/2;
				pointLarge.y=ellipse2.y+ellipse2.dY/2-rYLarge*ellipse2.dY/2;
			}

			if(this.ellipsePoint(ellipse,point)){
				col=true;
				return col;
			}

			if(this.ellipsePoint(ellipse,pointThin)){
				col=true;
				return col;
			}

			if(this.ellipsePoint(ellipse,pointLarge)){
				col=true;
				return col;
			}

			return col;
		},
		ellipsePoint: function(e,point) {
            var ellipse={x:e.x,y:e.y,dX:e.dX,dY:e.dY};
            if(ellipse.dX==undefined){ellipse.dX=ellipse.diameterX}
            if(ellipse.dX==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dX=e.w;
                    }
                }
            }
            if(ellipse.dY==undefined){ellipse.dY=ellipse.diameterY}
            if(ellipse.dY==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dY=e.h;
                    }
                }
            }
			var halfW=ellipse.dX/2;
			var halfH=ellipse.dY/2;
            var middle={x:ellipse.x+halfW,y:ellipse.y+halfH};
			var dX=point.x-middle.x;
			var dY=point.y-middle.y;

            var col=false;
			if((dX*dX)/(halfW*halfW)+(dY*dY)/(halfH*halfH)<1){
				col=true;
			}
            return col;
        },
		line:function(l1,l2){
			var col=false;
            
            var line1={x1:l1.x1,y1:l1.y1,x2:l1.x2,y2:l1.y2};
            if(line1.x1==undefined){
                if(l1.attr!=undefined){
                    if(l1.attr.shape=="line"){
                        var x1=l1.x;
                        var y1=l1.y;
                        var x2=l1.x+l1.w;
                        var y2=l1.y+l1.h;
                        
                        if(l1.attr.dirX==-1){
                            x1=l1.x+l1.w;
                            x2=l1.x;
                        }
                        
                        if(l1.attr.dirY==-1){
                            y1=l1.y+l1.h;
                            y2=l1.y;
                        }
                        
                        line1.x1=x1;
                        line1.y1=y1;
                        line1.x2=x2;
                        line1.y2=y2;
                    }
                }
            }
            
            var line2={x1:l2.x1,y1:l2.y1,x2:l2.x2,y2:l2.y2};
            if(line2.x1==undefined){
                if(l2.attr!=undefined){
                    if(l2.attr.shape=="line"){
                        var x1=l2.x;
                        var y1=l2.y;
                        var x2=l2.x+l2.w;
                        var y2=l2.y+l2.h;
                        
                        if(l2.attr.dirX==-1){
                            x1=l2.x+l2.w;
                            x2=l2.x;
                        }
                        
                        if(l2.attr.dirY==-1){
                            y1=l2.y+l2.h;
                            y2=l2.y;
                        }
                        
                        line2.x1=x1;
                        line2.y1=y1;
                        line2.x2=x2;
                        line2.y2=y2;
                    }
                }
            }

			//Get distance to intersection point
			var dist1 = ((line2.x2-line2.x1)*(line1.y1-line2.y1) - (line2.y2-line2.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));
			var dist2 = ((line1.x2-line1.x1)*(line1.y1-line2.y1) - (line1.y2-line1.y1)*(line1.x1-line2.x1)) / ((line2.y2-line2.y1)*(line1.x2-line1.x1) - (line2.x2-line2.x1)*(line1.y2-line1.y1));

			var w1=line1.w;
			var w2=line2.w;

			//If both distance are between 0 and 1, there is a collision
			if (dist1 >= 0 && dist1 <= 1 && dist2 >= 0 && dist2 <= 1) {
				col=true;
			}
			return col;
		},
        
		linePoint:function(l,point){
			var col=false;

            var line={x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2};
            if(line.x1==undefined){
                if(l.attr!=undefined){
                    if(l.attr.shape=="line"){
                        var x1=l.x;
                        var y1=l.y;
                        var x2=l.x+l.w;
                        var y2=l.y+l.h;
                        
                        if(l.attr.dirX==-1){
                            x1=l.x+l.w;
                            x2=l.x;
                        }
                        
                        if(l.attr.dirY==-1){
                            y1=l.y+l.h;
                            y2=l.y;
                        }
                        
                        line.x1=x1;
                        line.y1=y1;
                        line.x2=x2;
                        line.y2=y2;
                    }
                }
            }
			//Get distance from the point to the ends of the line
			var d1 = this.dist(point, {x:line.x1,y:line.y1});
			var d2 = this.dist(point, {x:line.x2,y:line.y2});

			var lineLen = this.dist({x:line.x1,y:line.y1}, {x:line.x2,y:line.y2});

			var buffer = 0.1;

			//If the two distances are equal to lineLen, there is a collision
			if (d1+d2 > lineLen-buffer && d1+d2 < lineLen+buffer) {
				col=true;
			}
			return col;
		},
		lineRect:function(l,rect,steps){
			var col=false;

            var line={x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2};
            if(line.x1==undefined){
                if(l.attr!=undefined){
                    if(l.attr.shape=="line"){
                        var x1=l.x;
                        var y1=l.y;
                        var x2=l.x+l.w;
                        var y2=l.y+l.h;
                        
                        if(l.attr.dirX==-1){
                            x1=l.x+l.w;
                            x2=l.x;
                        }
                        
                        if(l.attr.dirY==-1){
                            y1=l.y+l.h;
                            y2=l.y;
                        }
                        
                        line.x1=x1;
                        line.y1=y1;
                        line.x2=x2;
                        line.y2=y2;
                    }
                }
            }
            
			//Check if the bounding boxes are colliding
			var lineRect={x:line.x1,y:line.y1,w:line.x2-line.x1,h:line.y2-line.y1}
			if(line.x2<line.x1){
				lineRect.x=line.x2;
				lineRect.w=line.x1-line.x2;
			}
			if(line.y2<line.y1){
				lineRect.y=line.y2;
				lineRect.h=line.y1-line.y2;
			}

			if(lineRect.w==0){lineRect.w=1;}
			if(lineRect.h==0){lineRect.h=1;}

			if(this.rect(rect,lineRect)){
				//Check if start or end of line is colliding
				if(this.rectPoint(rect,{x:line.x1,y:line.y1})){
					col=true;
					return col;
				}

				if(this.rectPoint(rect,{x:line.x2,y:line.y2})){
					col=true;
					return col;
				}

				var dist=Math.abs(this.dist({x:line.x1,y:line.y1},{x:line.x2,y:line.y2}))
				var stepNum=Math.floor(dist);
				if(steps!=undefined){stepNum=steps;}
				var oneStep=Math.floor(dist)/stepNum;

				for(var i=oneStep;i<=dist-oneStep;i+=oneStep){
					var x=this.lerp(i/dist,line.x1,line.x2)
					var y=this.lerp(i/dist,line.y1,line.y2)
					if(this.rectPoint(rect,{x:x,y:y})){
						col=true;
						return col;
					}
				}
			}else{
				col=false;
				return col;
			}

			return col;
		},
		lineCircle:function(l,c,steps){
			var col=false;
            
            var line={x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2};
            if(line.x1==undefined){
                if(l.attr!=undefined){
                    if(l.attr.shape=="line"){
                        var x1=l.x;
                        var y1=l.y;
                        var x2=l.x+l.w;
                        var y2=l.y+l.h;
                        
                        if(l.attr.dirX==-1){
                            x1=l.x+l.w;
                            x2=l.x;
                        }
                        
                        if(l.attr.dirY==-1){
                            y1=l.y+l.h;
                            y2=l.y;
                        }
                        
                        line.x1=x1;
                        line.y1=y1;
                        line.x2=x2;
                        line.y2=y2;
                    }
                }
            }
            
            var circle={x:c.x,y:c.y,d:c.d};
            if(circle.d==undefined){circle.d=circle.diameter}
            if(circle.d==undefined){
                if(c.attr!=undefined){
                    if(c.attr.shape=="circle"){
                        circle.d=c.w;
                    }
                }
            }

			//Check if the bounding boxes are colliding
			var lineRect={x:line.x1,y:line.y1,w:line.x2-line.x1,h:line.y2-line.y1}
			if(line.x2<line.x1){
				lineRect.x=line.x2;
				lineRect.w=line.x1-line.x2;
			}
			if(line.y2<line.y1){
				lineRect.y=line.y2;
				lineRect.h=line.y1-line.y2;
			}

			if(lineRect.w==0){lineRect.w=1;}
			if(lineRect.h==0){lineRect.h=1;}

			if(this.rectCircle(lineRect,circle)){
				//Check if start or end of line is colliding
				if(this.circlePoint(circle,{x:line.x1,y:line.y1})){
					col=true;
					return col;
				}

				if(this.circlePoint(circle,{x:line.x2,y:line.y2})){
					col=true;
					return col;
				}

				var dist=Math.abs(this.dist({x:line.x1,y:line.y1},{x:line.x2,y:line.y2}))
				var stepNum=Math.floor(dist);
				if(steps!=undefined){stepNum=steps;}
				var oneStep=Math.floor(dist)/stepNum;

				for(var i=oneStep;i<=dist-oneStep;i+=oneStep){
					var x=this.lerp(i/dist,line.x1,line.x2)
					var y=this.lerp(i/dist,line.y1,line.y2)
					if(this.circlePoint(circle,{x:x,y:y})){
						col=true;
						return col;
					}
				}
			}else{
				col=false;
				return col;
			}

			return col;
		},
		lineEllipse:function(l,e,steps){
			var col=false;
            
            var line={x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2};
            if(line.x1==undefined){
                if(l.attr!=undefined){
                    if(l.attr.shape=="line"){
                        var x1=l.x;
                        var y1=l.y;
                        var x2=l.x+l.w;
                        var y2=l.y+l.h;
                        
                        if(l.attr.dirX==-1){
                            x1=l.x+l.w;
                            x2=l.x;
                        }
                        
                        if(l.attr.dirY==-1){
                            y1=l.y+l.h;
                            y2=l.y;
                        }
                        
                        line.x1=x1;
                        line.y1=y1;
                        line.x2=x2;
                        line.y2=y2;
                    }
                }
            }
            
            var ellipse={x:e.x,y:e.y,dX:e.dX,dY:e.dY};
            if(ellipse.dX==undefined){ellipse.dX=ellipse.diameterX}
            if(ellipse.dX==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dX=e.w;
                    }
                }
            }
            if(ellipse.dY==undefined){ellipse.dY=ellipse.diameterY}
            if(ellipse.dY==undefined){
                if(e.attr!=undefined){
                    if(e.attr.shape=="ellipse"){
                        ellipse.dY=e.h;
                    }
                }
            }

			//Check if the bounding boxes are colliding
			var lineRect={x:line.x1,y:line.y1,w:line.x2-line.x1,h:line.y2-line.y1}
			if(line.x2<line.x1){
				lineRect.x=line.x2;
				lineRect.w=line.x1-line.x2;
			}
			if(line.y2<line.y1){
				lineRect.y=line.y2;
				lineRect.h=line.y1-line.y2;
			}

			if(lineRect.w==0){lineRect.w=1;}
			if(lineRect.h==0){lineRect.h=1;}

			if(this.rectEllipse(lineRect,ellipse)){
				//Check if start or end of line is colliding
				if(this.ellipsePoint(ellipse,{x:line.x1,y:line.y1})){
					col=true;
					return col;
				}

				if(this.ellipsePoint(ellipse,{x:line.x2,y:line.y2})){
					col=true;
					return col;
				}

				var dist=Math.abs(this.dist({x:line.x1,y:line.y1},{x:line.x2,y:line.y2}))
				var stepNum=Math.floor(dist);
				if(steps!=undefined){stepNum=steps;}
				var oneStep=Math.floor(dist)/stepNum;

				for(var i=oneStep;i<=dist-oneStep;i+=oneStep){
					var x=this.lerp(i/dist,line.x1,line.x2)
					var y=this.lerp(i/dist,line.y1,line.y2)
					if(this.ellipsePoint(ellipse,{x:x,y:y})){
						col=true;
						return col;
					}
				}
			}else{
				col=false;
				return col;
			}

			return col;
		},
		pointPoint:function(point1,point2){
			var col=false;

			var buffer=0.1;
			//Check if there is a collision
			if(point1.x+buffer>point2.x &&
			point1.y+buffer>point2.y &&
			point1.x-buffer<point2.x &&
			point1.y-buffer<point2.y){
				col=true;
				return col;
			}

			return col;
		},
    }


	//***** PARTICLES *****//
	this.particles={
		drawing:undefined,
		parts:[],
		addParticle:function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,o,oRate,image,anim,id){
			var part={};
			part.x=x;
			if(x==undefined){part.x=this.drawing.canvas.w/2}
			part.y=y;
			if(y==undefined){part.y=this.drawing.canvas.h/2}
			part.w=w;
			if(w==undefined){part.w=this.drawing.canvas.w/100}
			part.h=h;
			if(h==undefined){part.h=this.drawing.canvas.h/100}

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
			part.r=r;
			if(r==undefined){part.r=0}
			part.rRate=rRate;
			if(rRate==undefined){part.rRate=0}
			part.o=o;
			part.oRate=oRate;
			part.image=image;
			part.anim=anim;
			part.id=id;

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

			p.r+=p.rRate;
			if(p.oRate!=undefined){p.o+=p.oRate;}

			if(p.frame>=p.frames || p.alpha<=0 || p.w<=0 || (p.h<=0 && p.hRate!=0) || p.o<=0){dead=true;}
			p.frame++;
			return dead;
		},
		drawingParticles:function(){
			for(var i=0;i<this.parts.length;i++){
				this.drawingParticle(i);
			}
		},
		getParticles:function(id){
			if(id==undefined){
				return this.parts;
			}else{
				var arr=[];
				for(var i=0;i<this.parts.length;i++){
					if(this.parts[i].id!=undefined){
						if(this.parts[i].id==id){
							arr.push(this.parts[i]);
						}
					}
				}
				return arr;
			}
		},
		drawingParticle:function(i){
			var p=this.parts[i];
			//x,y,w,h,color,r
			if(p.alpha!=1){
				this.drawing.alpha(p.alpha);
			}

			if(p.anim===undefined && p.image===undefined){
				if(p.o===undefined){
					if(p.h==0 && p.hRate==0){
						this.drawing.circle(p.x-p.w/2,p.y-p.w/2,p.w,p.c);
					}else{
						this.drawing.rect(p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.c,p.r);
					}
				}else{
					if(p.h==0 && p.hRate==0){
						this.drawing.circleB(p.x-p.w/2,p.y-p.w/2,p.w,p.c,p.o);
					}else{
						this.drawing.rectB(p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.c,p.r,p.o);
					}
				}
			}else if(p.anim!==undefined){
				this.drawing.anim(p.anim,p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.r);
			}else if(p.image!==undefined){
				this.drawing.image(p.image,p.x-p.w/2,p.y-p.h/2,p.w,p.h,p.r);
			}

			if(p.alpha!=1){
				this.drawing.alpha(1);
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

        check: function(button,controller,and) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(typeof(button)=="object" && button.length>0){
                    var allFound=true;
					var oneFound=false;
					var once=true;
					if(and!=undefined){
						if(and==true){
							once=false;
						}
					}
                    for(var i=0;i<button.length;i++){
                        if(!this.check(button[i],controller)){
                            allFound=false;
                        }else if(once){
							oneFound=true;
							break;
						}
                    }
                    if(once){
						if(oneFound){
							return true;
						}else{
							return false;
						}
					}else{
						if(allFound){
							return true;
						}else{
							return false;
						}
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

		direction:function(direction,axes,controller,press){
			if(controller==undefined){
                controller=0;
            }
			if(axes==undefined){
                axes=0;
            }
            if(this.checkConnected(controller)){
				if(direction==undefined){
					return this.gamepads[controller].direction;
				}
				//one
				var found=false;
				var pressed=false;
				if(press!=undefined){
					if(press==true){
						pressed=true;
					}
				}
				if(!pressed){
					if(direction=="all"){
						if(this.gamepads[controller].directions[axes][0]<0){found=true}
						if(this.gamepads[controller].directions[axes][0]>0){found=true}
						if(this.gamepads[controller].directions[axes][1]<0){found=true}
						if(this.gamepads[controller].directions[axes][1]>0){found=true}
						return found;
					}else if(direction=="left"){if(this.gamepads[controller].directions[axes][0]<0){found=true}}
					else if(direction=="right"){if(this.gamepads[controller].directions[axes][0]>0){found=true}}
					else if(direction=="up"){if(this.gamepads[controller].directions[axes][1]<0){found=true}}
					else if(direction=="down"){if(this.gamepads[controller].directions[axes][1]>0){found=true}}
				}else{
					if(direction=="all"){
						if(this.gamepads[controller].directions[axes][0]==-1){found=true}
						if(this.gamepads[controller].directions[axes][0]==1){found=true}
						if(this.gamepads[controller].directions[axes][1]==-1){found=true}
						if(this.gamepads[controller].directions[axes][1]==1){found=true}
						return found;
					}else if(direction=="left"){if(this.gamepads[controller].directions[axes][0]==-1){found=true}}
					else if(direction=="right"){if(this.gamepads[controller].directions[axes][0]==1){found=true}}
					else if(direction=="up"){if(this.gamepads[controller].directions[axes][1]==-1){found=true}}
					else if(direction=="down"){if(this.gamepads[controller].directions[axes][1]==1){found=true}}
				}
				return found;
			}
		},

		directionReset:function(axes,controller){
			if(controller==undefined){
                controller=0;
            }
			if(this.checkConnected(controller)){
				if(axes==undefined){
					this.gamepads[controller].directions[0][0]=0;
					this.gamepads[controller].directions[1][0]=0;
					this.gamepads[controller].directions[0][1]=0;
					this.gamepads[controller].directions[1][1]=0;
				}else{
					this.gamepads[controller].directions[axes][1]=0;
					this.gamepads[controller].directions[axes][1]=0;
				}
			}
		},

		threshold:function(threshold,axes,controller,val){
			if(controller==undefined){
                controller=0;
            }
			if(axes==undefined){
                axes=0;
            }
            if(this.checkConnected(controller)){
				if(threshold==undefined){
					return this.gamepads[controller].threshold;
				}
				//one
				var found=false;
				if(val==undefined){
					if(threshold=="all"){return this.gamepads[controller].thresholds[axes];}
					else if(threshold=="left"){return this.gamepads[controller].thresholds[axes][0][0];}
					else if(threshold=="right"){return this.gamepads[controller].thresholds[axes][0][1];}
					else if(threshold=="up"){return this.gamepads[controller].thresholds[axes][1][0];}
					else if(threshold=="down"){return this.gamepads[controller].thresholds[axes][1][1];}
				}else{
					if(threshold=="all"){
						this.gamepads[controller].thresholds[axes][0][0]=val;
						this.gamepads[controller].thresholds[axes][0][1]=val;
						this.gamepads[controller].thresholds[axes][1][0]=val;
						this.gamepads[controller].thresholds[axes][1][1]=val;
						return this.gamepads[controller].thresholds[axes];
					}else if(threshold=="left"){return this.gamepads[controller].thresholds[axes][0][0]=val;}
					else if(threshold=="right"){return this.gamepads[controller].thresholds[axes][0][1]=val;}
					else if(threshold=="up"){return this.gamepads[controller].thresholds[axes][1][0]=val;}
					else if(threshold=="down"){return this.gamepads[controller].thresholds[axes][1][1]=val;}
				}
			}
		},

        value: function(button,controller,and) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(typeof(button)=="object" && button.length>0){
                    var allFound=true;
					var oneFound=false;
					var once=true;
					if(and!=undefined){
						if(and==true){
							once=false;
						}
					}
                    for(var i=0;i<button.length;i++){
                        if(!this.value(button[i],controller)){
                            allFound=false;
                        }else if(once){
							oneFound=true;
							break;
						}
                    }
                    if(once){
						if(oneFound){
							return true;
						}else{
							return false;
						}
					}else{
						if(allFound){
							return true;
						}else{
							return false;
						}
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

        press: function(button,controller,and) {
            if(controller==undefined){
                controller=0;
            }
			if(this.checkConnected(controller)){
                if(typeof(button)=="object" && button.length>0){
                    var allFound=true;
					var oneFound=false;
					var once=true;
					if(and!=undefined){
						if(and==true){
							once=false;
						}
					}
                    for(var i=0;i<button.length;i++){
                        if(!this.press(button[i],controller)){
                            allFound=false;
                        }else if(once){
							oneFound=true;
							break;
						}
                    }
                    if(once){
						if(oneFound){
							return true;
						}else{
							return false;
						}
					}else{
						if(allFound){
							return true;
						}else{
							return false;
						}
					}
                }else{
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
            }
        },

        release: function(button,controller) {
            if(controller==undefined){
                controller=0;
            }
            if(this.checkConnected(controller)){
                if(button==undefined){
                    for(var i=0;i<this.gamepads[controller].buttons.length;i++){
                        this.gamepads[controller].buttons[i].value=0;
                    }
                }else{
					if(typeof(button)=="object" && button.length>0){
						for(var i=0;i<button.length;i++){
							var buttonI=button[i];
							if(this.buttons[buttonI]!=undefined){
								buttonI=this.buttons[buttonI];
							}
							this.gamepads[controller].buttons[buttonI].value=0;
						}
					}else{
						if(this.buttons[button]!=undefined){
							button=this.buttons[button];
						}
						this.gamepads[controller].buttons[button].value=0;
					}
                }
            }
        }
    }

    //***** KEYBOARD *****//
    this.keyboard={
        keys:{

            backspace:8,
            tab:9,
            clear:12,
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
            end:35,
            home:36,
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
        keysDown:[],
		keyName:function(keyCode){
			return this.keysName[keyCode]
		},
		keyNum:function(keyCode){
			return this.keys[keyCode]
		},
		simulate:function(evt,keyCode){
			if(this.keys[keyCode]!=undefined){
                keyCode=this.keys[keyCode];
			}
			//keydown,keyup
			var evt = new KeyboardEvent(evt, {'keyCode':keyCode});
			document.dispatchEvent(evt);
		},
        check: function(keyCode,and){
			if(keyCode==undefined){
				if(this.keysDown.length>0){
					return true;
				}else{
					return false;
				}
            }else{
				if(typeof(keyCode)=="object" && keyCode.length>0){
					var allFound=true;
					var oneFound=false;
					var once=true;
					if(and!=undefined){
						if(and==true){
							once=false;
						}
					}
					for(var i=0;i<keyCode.length;i++){
						if(!this.check(keyCode[i])){
							allFound=false;
						}else if(once){
							oneFound=true;
							break;
						}
					}
					if(once){
						if(oneFound){
							return true;
						}else{
							return false;
						}
					}else{
						if(allFound){
							return true;
						}else{
							return false;
						}
					}
				}else{
					if(this.keys[keyCode]!=undefined){
						keyCode=this.keys[keyCode];
					}
					var found = false;
					for(var i=0; i<this.keysDown.length; i++) {
						if(this.keysDown[i].key == keyCode) {
							found=true;
							break;
						}
					}
					return found;
				}
			}

        },

        press: function(keyCode,and){
			if(keyCode==undefined){
				var found=false;
                for(var i=0; i<this.keysDown.length; i++) {
					if(this.keysDown[i].press == true) {
						found=true;
						break;
					}
				}
				if(found){
					return true;
				}else{
					return false;
				}
            }else{
				if(typeof(keyCode)=="object" && keyCode.length>0){
					var allFound=true;
					var oneFound=false;
					var once=true;
					if(and!=undefined){
						if(and==true){
							once=false;
						}
					}
					for(var i=0;i<keyCode.length;i++){
						if(!this.press(keyCode[i])){
							allFound=false;
						}else if(once){
							oneFound=true;
							break;
						}
					}
					if(once){
						if(oneFound){
							return true;
						}else{
							return false;
						}
					}else{
						if(allFound){
							return true;
						}else{
							return false;
						}
					}
				}else{
					if(this.keys[keyCode]!=undefined){
						keyCode=this.keys[keyCode];
					}
					var found = false;
					for(var i=0; i<this.keysDown.length; i++) {
						if(this.keysDown[i].key == keyCode && this.keysDown[i].press==true) {
							found=true;
							break;
						}
					}
					return found;
				}
			}
        },

        release: function(keyCode) {
			if(keyCode==undefined){
                this.keysDown.splice(0,this.keysDown.length)
            }else{
				if(typeof(keyCode)=="object" && keyCode.length>0){
					for(var i=0;i<keyCode.length;i++){
						this.release(keyCode[i]);
					}
				}else{
					if(typeof(keyCode)=="object" && keyCode.length>0){
						for(var i=0;i<keyCode.length;i++){
							var key=keyCode[i];
							if(this.keys[key]!=undefined){
								key=this.keys[key];
							}
							for(var j=0; j<this.keysDown.length; j++) {
								if(this.keysDown[j].key == key) {
									this.keysDown.splice(j,1);
									j--;
									continue;
								}
							}
						}
					}else{
						if(this.keys[keyCode]!=undefined){
							keyCode=this.keys[keyCode];
						}
						var found = undefined;
						for(var i=0; i<this.keysDown.length; i++) {
							if(this.keysDown[i].key == keyCode) {found=i;}
						}
						if(found!=undefined){
							this.keysDown.splice(found,1);
						}
					}
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
        drawing:undefined,
        press:[false,false,false,false,false],
        down:[false,false,false,false,false],
		scroll:0,
        canvas:{w:0,h:0},
        //check if mouse is pressing inside these coordinates, if type is true, check if mouse is pressed instead of down
        check:function(x,y,w,h,press,cam,btn){
            if(x==undefined){x=0;cam=false;}
            if(y==undefined){y=0;}
            if(w==undefined){w=this.canvas.w;}
            if(h==undefined){h=this.canvas.h;}
			if(btn==undefined){btn=0;}
			 var checking=false;
			if(btn==-1){
				checking=true;
			}else{
				checking=this.down[btn];
			}

            var mX=this.cX;
            var mY=this.cY;
            if(press!=undefined){
                if(press==true){
					if(btn==-1){
						checking=true;
					}else{
						checking=this.press[btn];
					}
                }
            }

            if(cam==undefined){
                cam=this.drawing.cam[this.drawing.currCam].active;
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
		//release all
		release:function(){
			this.press=[false,false,false,false,false];
			this.down=[false,false,false,false,false];
		}
    }

	//***** TOUCH *****//
	this.touch={
		touches:[],
		down:false,
		press:false,
		force:0,
		drawing:undefined,
		canvas:{w:0,h:0},
		//check if touch is pressing inside these coordinates, if type is true, check if touch is pressed instead of down
		check:function(x,y,w,h,press,cam,num){
            if(x==undefined){x=0;cam=false;}
            if(y==undefined){y=0;}
            if(w==undefined){w=this.canvas.w;}
            if(h==undefined){h=this.canvas.h;}
			if(num==undefined){num=-1;}
            var checking=this.down;
            if(press!=undefined){
                if(press==true){
                    checking=this.press;
                }
            }

            if(cam==undefined){
                cam=this.drawing.cam[this.drawing.currCam].active;
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
			if(num==-1){
				if(force>=1){
					return true;
				}else{
					return false;
				}
			}else{
				if(force==num){
					return true;
				}else{
					return false;
				}
			}
        },
		release:function(){
			this.touches=[];
		},
        x:function(cam,touch){
            if(cam==undefined){cam=true;}
            if(touch==undefined){touch=0;}
            if(this.touches.length-1>=touch){
                if(cam){
                    return this.touches[touch].cX;
                }else{
                    return this.touches[touch].x;
                }
            }
        },
        y:function(cam,touch){
            if(cam==undefined){cam=true;}
            if(touch==undefined){touch=0;}
            if(this.touches.length-1>=touch){
                if(cam){
                    return this.touches[touch].cY;
                }else{
                    return this.touches[touch].y;
                }
            }
        }
	}

    //***** MOBILE *****//
    this.mobile={
        isAndroid: function() {
			if(navigator.userAgent.match(/Android/i)==null){
				return false;
			}else{
				return true;
			}
        },
        isBlackBerry: function() {
			if(navigator.userAgent.match(/BlackBerry/i)==null){
				return false;
			}else{
				return true;
			}
        },
        isIOS: function() {
			if(navigator.userAgent.match(/iPhone|iPad|iPod/i)==null){
				return false;
			}else{
				return true;
			}
        },
        isOpera: function() {
			if(navigator.userAgent.match(/Opera Mini/i)==null){
				return false;
			}else{
				return true;
			}
        },
        isWindows: function() {
			if(navigator.userAgent.match(/IEMobile/i)==null){
				return false;
			}else if(navigator.userAgent.match(/WPDesktop/i)==null){
				return false;
			}else{
				return true;
			}
        },
        isAny: function() {
            return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isOpera() || this.isWindows());
        },
    }
	
	
	
	//***** STATS *****//
	this.stats={
		drawing:undefined,
		loop:undefined,
		//round numbers
		round:function(num,digits){
			if(digits==undefined){digits=0;}
			var mult=10**digits;
			return Math.round((num+Number.EPSILON) * mult) / mult;
		},
		//Draw all stats
		drawingStats:function(showFps,showDrawn,showSeparate){
			if(this.loop.debug){
				if(showFps==undefined){showFps=true;}
				if(showDrawn==undefined){showDrawn=true;}
				if(showSeparate==undefined){showSeparate=true;}
				
				var h=0;
				if(showFps){h+=10;this.drawing.calledT--;}
				if(showDrawn){h+=10;this.drawing.calledT--;}
				if(showSeparate){h+=40;this.drawing.calledT-=4;}
				
				if(h>0){
					this.drawing.calledS--;
				
					var delay=this.round(this.loop.delay/1000,3);
					var fps=this.round((this.loop.fps/delay)/this.loop.fps,2);
					if(fps.toString().split(".").length==2){
						if(fps.toString().split(".")[1].length==1){
							fps=fps+"0";
						}
					}else{
						fps=fps+".00";
					}
					var fpsText="Fps: "+fps;
					
					var calledAll=this.drawing.calledI+this.drawing.calledA+this.drawing.calledT+this.drawing.calledS;
					var clippedAll=this.drawing.clippedI+this.drawing.clippedA+this.drawing.clippedT+this.drawing.clippedS;
					var drawnAll=calledAll-clippedAll;
					
					var drawnText="Drawn: "+drawnAll+"/"+calledAll;
					
					var drawnI="Images: "+(this.drawing.calledI-this.drawing.clippedI)+"/"+this.drawing.calledI;
					if(this.drawing.calledI==0){drawnI="Images: 0";}
					
					var drawnA="Anims: "+(this.drawing.calledA-this.drawing.clippedA)+"/"+this.drawing.calledA;
					if(this.drawing.calledA==0){drawnA="Anims: 0";}
					
					var drawnT="Texts: "+(this.drawing.calledT-this.drawing.clippedT)+"/"+this.drawing.calledT;
					if(this.drawing.calledT==0){drawnT="Texts: 0";}
					
					var drawnS="Shapes: "+(this.drawing.calledS-this.drawing.clippedS)+"/"+this.drawing.calledS;
					if(this.drawing.calledS==0){drawnS="Shapes: 0";}
					
					var separateText=drawnI+" | "+drawnA+" | "+drawnT+" | "+drawnS;
					var fS=10;
					var y=0;
		
					this.loop.addDebugShape({x:0,y:0,w:85,h:h,c:[0,0,0,0.5],r:0,stay:false})
					
					if(showFps){this.loop.addDebugText(fpsText,0,0,[0,255,0],"left",fS,0,50,fS,false);y++;}
					if(showDrawn){this.loop.addDebugText(drawnText,00,fS*y,[0,255,0],"left",fS,0,50,fS,false);y++;}
					if(showSeparate){
						this.loop.addDebugText(drawnI,0,fS*y,[0,255,0],"left",fS,0,50,fS,false);y++;
						this.loop.addDebugText(drawnA,0,fS*y,[0,255,0],"left",fS,0,50,fS,false);y++;
						this.loop.addDebugText(drawnT,0,fS*y,[0,255,0],"left",fS,0,50,fS,false);y++;
						this.loop.addDebugText(drawnS,0,fS*y,[0,255,0],"left",fS,0,50,fS,false);
					}
				}
			}
        },
		//Log all stats
		log:function(showFps,showDrawn,showSeparate){
			if(this.loop.debug){
				if(showFps==undefined){showFps=true;}
				if(showDrawn==undefined){showDrawn=true;}
				if(showSeparate==undefined){showSeparate=true;}
				var delay=this.round(this.loop.delay/1000,3);
				var fps=this.round((this.loop.fps/delay)/this.loop.fps,2);
				if(fps.toString().split(".").length==2){
					if(fps.toString().split(".")[1].length==1){
						fps=fps+"0";
					}
				}else{
					fps=fps+".00";
				}
				var fpsText="Fps: "+fps;
				if(!showFps){fpsText="";}
				
				var calledAll=this.drawing.calledI+this.drawing.calledA+this.drawing.calledT+this.drawing.calledS;
				var clippedAll=this.drawing.clippedI+this.drawing.clippedA+this.drawing.clippedT+this.drawing.clippedS;
				var drawnAll=calledAll-clippedAll;
				
				var drawnText="Drawn: "+drawnAll+"/"+calledAll;
				if(!showDrawn){drawnText="";}
				
				var drawnI="Images: "+(this.drawing.calledI-this.drawing.clippedI)+"/"+this.drawing.calledI;
				if(this.drawing.calledI==0){drawnI="Images: 0";}
				
				var drawnA="Anims: "+(this.drawing.calledA-this.drawing.clippedA)+"/"+this.drawing.calledA;
				if(this.drawing.calledA==0){drawnA="Anims: 0";}
				
				var drawnT="Texts: "+(this.drawing.calledT-this.drawing.clippedT)+"/"+this.drawing.calledT;
				if(this.drawing.calledT==0){drawnT="Texts: 0";}
				
				var drawnS="Shapes: "+(this.drawing.calledS-this.drawing.clippedS)+"/"+this.drawing.calledS;
				if(this.drawing.calledS==0){drawnS="Shapes: 0";}
				
				var separateText=drawnI+" | "+drawnA+" | "+drawnT+" | "+drawnS;
				if(!showSeparate){separateText="";}
			
				console.log("(JT"+this.loop.version+") Stats: "+fpsText+" | "+drawnText+" | "+separateText );
			}
		},
	}

    //***** CREATE EVENT LISTENERs *****//
    this.createEventListeners=function(context) {
        context.canvas.src.addEventListener("mousemove", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				var rect = context.canvas.src.getBoundingClientRect();

				var camW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].w)
				var camH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].h)
				var camX=context.drawing.cam[context.drawing.currCam].x;
				var camY=context.drawing.cam[context.drawing.currCam].y;

				var mX=Math.round(((evt.clientX-rect.left)/(rect.right-rect.left))*context.canvas.src.width)/context.canvas.pixelRate;
				var mY=Math.round(((evt.clientY-rect.top)/(rect.bottom-rect.top))*context.canvas.src.height)/context.canvas.pixelRate;

				context.mouse.x=mX;
				context.mouse.y=mY;

        var posX=context.drawing.cam[context.drawing.currCam].pos.x;
        var posY=context.drawing.cam[context.drawing.currCam].pos.y;
        var posW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].pos.w)
        var posH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].pos.h)
        camW=camW/posW;
        camH=camH/posH;

				context.mouse.cX = (mX+(camX*camW)-posX)/camW;
				context.mouse.cY = (mY+(camY*camH)-posY)/camH;
			}
        });

        context.canvas.src.addEventListener("mousedown", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();



				context.mouse.down[evt.which-1]=true;
				context.mouse.press[evt.which-1]=true;
			}
        });

        context.canvas.src.addEventListener("mouseup", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();


				context.mouse.down[evt.which-1]=false;
				context.mouse.press[evt.which-1]=false;
			}
        });

		context.canvas.src.addEventListener("mouseout", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();


				context.mouse.down[evt.which-1]=false;
				context.mouse.press[evt.which-1]=false;
			}
        });

		context.canvas.src.addEventListener("wheel", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				context.mouse.scroll=Math.round(evt.deltaY/100);
			}
        });

		context.canvas.src.addEventListener("contextmenu", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				if(context.mouse.preventRight){evt.preventDefault();}
			}
        });


		context.canvas.src.addEventListener("touchstart", function(evt) {
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				var rect = context.canvas.src.getBoundingClientRect();

				var camW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].w)
				var camH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].h)
				var camX=context.drawing.cam[context.drawing.currCam].x;
				var camY=context.drawing.cam[context.drawing.currCam].y;

				var touches=[];

				var force=0;

				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var w=context.canvas.w;
					var h=context.canvas.h;

					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*w)/context.canvas.pixelRate;
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*h)/context.canvas.pixelRate;

					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;

          var posX=context.drawing.cam[context.drawing.currCam].pos.x;
          var posY=context.drawing.cam[context.drawing.currCam].pos.y;
          var posW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].pos.w)
          var posH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].pos.h)
          camW=camW/posW;
          camH=camH/posH;

					touches[i].cX = (tX+(camX*camW)-posX)/camW;
					touches[i].cY = (tY+(camY*camH)-posY)/camH;

					if(document.fullscreen){
						var ratioWindow=window.innerWidth/window.innerHeight;
						var ratioGame=w/h;

						if(ratioWindow>ratioGame){
							var actualH=window.innerHeight;
							var actualW=window.innerHeight*ratioGame;

							var barW=(window.innerWidth-actualW)/2;

							var finalX=(touch.clientX-barW)*(w/actualW)

							touches[i].x=finalX;
							touches[i].cX = (finalX+(camX*camW)-posX)/camW;
						}else{
							var actualW=window.innerWidth;
							var actualH=window.innerWidth/ratioGame;

							var barW=(window.innerHeight-actualH)/2;

							var finalY=(touch.clientY-barW)*(h/actualH)

							touches[i].y=finalY;
							touches[i].cY = (finalY+(camY*camH)-posY)/camH;
						}
					}
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
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				var rect = context.canvas.src.getBoundingClientRect();

				var camW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].w)
				var camH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].h)
				var camX=context.drawing.cam[context.drawing.currCam].x;
				var camY=context.drawing.cam[context.drawing.currCam].y;

        var posX=context.drawing.cam[context.drawing.currCam].pos.x;
        var posY=context.drawing.cam[context.drawing.currCam].pos.y;
        var posW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].pos.w)
        var posH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].pos.h)
        camW=camW/posW;
        camH=camH/posH;

				var touches=[];

				var force=0;

				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var w=context.canvas.w;
					var h=context.canvas.h;

					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*w)/context.canvas.pixelRate;
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*h)/context.canvas.pixelRate;

					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;

          touches[i].cX = (tX+(camX*camW)-posX)/camW;
					touches[i].cY = (tY+(camY*camH)-posY)/camH;

					if(document.fullscreen){
						var ratioWindow=window.innerWidth/window.innerHeight;
						var ratioGame=w/h;

						if(ratioWindow>ratioGame){
							var actualH=window.innerHeight;
							var actualW=window.innerHeight*ratioGame;

							var barW=(window.innerWidth-actualW)/2;

							var finalX=(touch.clientX-barW)*(w/actualW)

							touches[i].x=finalX;
							touches[i].cX = (finalX+(camX*camW)-posX)/camW;
						}else{
							var actualW=window.innerWidth;
							var actualH=window.innerWidth/ratioGame;

							var barW=(window.innerHeight-actualH)/2;

							var finalY=(touch.clientY-barW)*(h/actualH)

							touches[i].y=finalY;
							touches[i].cY = (finalY+(camY*camH)-posY)/camH;
						}
					}
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
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				var rect = context.canvas.src.getBoundingClientRect();

				var camW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].w)
				var camH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].h)
				var camX=context.drawing.cam[context.drawing.currCam].x;
				var camY=context.drawing.cam[context.drawing.currCam].y;

        var posX=context.drawing.cam[context.drawing.currCam].pos.x;
        var posY=context.drawing.cam[context.drawing.currCam].pos.y;
        var posW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].pos.w)
        var posH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].pos.h)
        camW=camW/posW;
        camH=camH/posH;

				var touches=[];

				var force=0;

				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var w=context.canvas.w;
					var h=context.canvas.h;

					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*w)/context.canvas.pixelRate;
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*h)/context.canvas.pixelRate;

					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;

          touches[i].cX = (tX+(camX*camW)-posX)/camW;
					touches[i].cY = (tY+(camY*camH)-posY)/camH;

					if(document.fullscreen){
						var ratioWindow=window.innerWidth/window.innerHeight;
						var ratioGame=w/h;

						if(ratioWindow>ratioGame){
							var actualH=window.innerHeight;
							var actualW=window.innerHeight*ratioGame;

							var barW=(window.innerWidth-actualW)/2;

							var finalX=(touch.clientX-barW)*(w/actualW)

							touches[i].x=finalX;
							touches[i].cX = (finalX+(camX*camW)-posX)/camW;
						}else{
							var actualW=window.innerWidth;
							var actualH=window.innerWidth/ratioGame;

							var barW=(window.innerHeight-actualH)/2;

							var finalY=(touch.clientY-barW)*(h/actualH)

							touches[i].y=finalY;
							touches[i].cY = (finalY+(camY*camH)-posY)/camH;
						}
					}
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
			if(document.activeElement.id==context.canvas.id){
				evt.preventDefault();

				var rect = context.canvas.src.getBoundingClientRect();

				var camW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].w)
				var camH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].h)
				var camX=context.drawing.cam[context.drawing.currCam].x;
				var camY=context.drawing.cam[context.drawing.currCam].y;

        var posX=context.drawing.cam[context.drawing.currCam].pos.x;
        var posY=context.drawing.cam[context.drawing.currCam].pos.y;
        var posW=Math.abs(context.canvas.src.width/context.drawing.cam[context.drawing.currCam].pos.w)
        var posH=Math.abs(context.canvas.src.height/context.drawing.cam[context.drawing.currCam].pos.h)
        camW=camW/posW;
        camH=camH/posH;

				var touches=[];

				var force=0;

				for(var i=0;i<evt.touches.length;i++){
					var touch=evt.touches[i];
					force++;
					var w=context.canvas.w;
					var h=context.canvas.h;

					var tX=Math.round(((touch.clientX-rect.left)/(rect.right-rect.left))*w)/context.canvas.pixelRate;
					var tY=Math.round(((touch.clientY-rect.top)/(rect.bottom-rect.top))*h)/context.canvas.pixelRate;

					touches[i]={};
					touches[i].x=tX;
					touches[i].y=tY;

          touches[i].cX = (tX+(camX*camW)-posX)/camW;
					touches[i].cY = (tY+(camY*camH)-posY)/camH;

					if(document.fullscreen){
						var ratioWindow=window.innerWidth/window.innerHeight;
						var ratioGame=w/h;

						if(ratioWindow>ratioGame){
							var actualH=window.innerHeight;
							var actualW=window.innerHeight*ratioGame;

							var barW=(window.innerWidth-actualW)/2;

							var finalX=(touch.clientX-barW)*(w/actualW)

							touches[i].x=finalX;
							touches[i].cX = (finalX+(camX*camW)-posX)/camW;
						}else{
							var actualW=window.innerWidth;
							var actualH=window.innerWidth/ratioGame;

							var barW=(window.innerHeight-actualH)/2;

							var finalY=(touch.clientY-barW)*(h/actualH)

							touches[i].y=finalY;
							touches[i].cY = (finalY+(camY*camH)-posY)/camH;
						}
					}
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
			if(document.activeElement.id==context.canvas.id){
				event.preventDefault();


				var keys = context.keyboard.keysDown;
				var found = false;
				for(var i=0; i<keys.length; i++) {
					if(keys[i].key==event.keyCode) {
						found = true;
					}
				}
				if(found==false) {
					context.keyboard.keysDown.push({key:event.keyCode,press:true});
				}
			}
        });

        document.addEventListener("keyup", function(){
			if(document.activeElement.id==context.canvas.id){
				event.preventDefault();

				var keys = context.keyboard.keysDown;
				for(var i=0; i<keys.length; i++) {
					if(keys[i].key==event.keyCode) {context.keyboard.keysDown.splice(i,1);}
				}
			}
        });

		/*document.addEventListener("fullscreenchange", function(){
			if(document.fullscreen){
				setTimeout(context.canvas.fullscreen.bind(context),100);
			}else{
				if(context.canvas.lastW!=undefined){
					setTimeout(context.canvas.resize.call(context.canvas,context.canvas.lastW,context.canvas.lastH),100);
				}else{
					setTimeout(context.canvas.fullscreen.bind(context),100);
				}
			}
        });*/



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

    this.resize=function(w,h,camsReset){
        return this.canvas.resize(w,h,camsReset);
    }

	this.ratio=function(){
        return this.canvas.ratio();
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

    this.fullscreen=function(bool){
        return this.canvas.fullscreen(bool);
    }

	this.fullScreen=function(bool){
        return this.canvas.fullscreen(bool);
    }

    this.autoResize=function(bool,x,y){
        return this.canvas.autoresize(bool,x,y);
    }

    this.cursor=function(style){
        return this.canvas.cursor(style);
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
    
    this.getAlarm=function(name){
        if(this.loop.alarms[name]==undefined){
            return undefined;
        }else{
            return this.loop.alarms[name].time;
        }
    }

	this.alarms=function(alarms){
		if(alarms!=undefined){
			this.loop.alarms=alarms;
		}
		return this.loop.alarms;
	}

    this.shake=function(force,duration,reduce){
        return this.loop.shake(force,duration,reduce);
    }

    this.shaking=function(){
		if(this.loop.shakeObj==undefined){
			return false;
		}else{
			return true;
		}
    }

	this.shakeStop=function(){
        return this.loop.stopShaking();
    }

	this.stopShake=function(){
        return this.loop.stopShaking();
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

    this.comboTimer=function(frames){
        return this.loop.changeComboTimer(frames);
    }

    this.comboLength=function(len){
        return this.loop.changeComboLength(len);
    }

	this.getCombo=function(len){
		return this.loop.getCombo(len);
	}

    this.fps=function(fps){
		if(fps==undefined){
			return this.loop.fps
		}else{
			this.loop.fps=fps;
			this.loop.changeLoop();
			return this.loop.fps;
		}
    }

	this.frame=function(frame){
        if(frame==undefined){return this.loop.frames;}
        return this.loop.frames=frame;
    }

    this.frames=function(frame){
        if(frame==undefined){return this.loop.frames;}
        return this.loop.frames=frame;
    }

    this.sec=function(sec){
        if(sec==undefined){return this.loop.sec;}
        return this.loop.sec=sec;
    }

    this.pauseJt=function(bool){
        if(bool==undefined){return this.loop.pause;}
        return this.loop.pause=bool;
    }

    this.stopJt=function(bool){
        if(bool==undefined){return this.loop.stop;}
        return this.loop.stop=bool;
    }

    this.wavePi=function(num){
        if(num==undefined){return this.loop.waveX;}
        return this.loop.waveX=num;
    }

    this.waveTau=function(num){
        if(num==undefined){return this.loop.waveX;}
        return this.loop.waveX=num;
    }

    this.waveX=function(num){
        if(num==undefined){return this.loop.waveX/(this.loop.waveIterations*this.loop.fps);}
        return this.loop.waveX=num*(this.loop.waveIterations*this.loop.fps);
    }

    this.waveY=function(num){
        if(num==undefined){return this.loop.waveY;}
        return this.loop.waveY=num;
    }

    this.waveYPos=function(num){
        if(num==undefined){return this.loop.waveYPos;}
        return this.loop.waveYPos=num;
    }

	this.debugging=function(bool){
		return this.loop.debugging(bool);
	}

	this.debug=function(bool){
		return this.loop.debugging(bool);
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

	this.clearDebugs=function(){
		return this.loop.clearDebugs();
	}

	this.clearDebug=function(){
		return this.loop.clearDebugs();
	}

	this.delDebugs=function(){
		return this.loop.clearDebugs();
	}

	this.delDebug=function(){
		return this.loop.clearDebugs();
	}

	this.getDebugs=function(){
		return this.loop.debugs;
	}

	this.debugs=function(){
		return this.loop.debugs;
	}
	
	this.loaded=function(){
		return this.loop.loaded;
	}


    //assets

    this.newImage=function(src,name,x,y,visible){
        return this.assets.image(src,name,x,y,visible);
    }

    this.loadImage=function(src,name,x,y,visible){
        return this.assets.image(src,name,x,y,visible);
    }

    this.newSound=function(src,name,repeat,volume){
        return this.assets.sound(src,name,repeat,volume);
    }

    this.loadSound=function(src,name,repeat,volume){
        return this.assets.sound(src,name,repeat,volume);
    }

    this.newAnim=function(src,name,frames,speed,x,y,visible){
        return this.assets.anim(src,name,frames,speed,x,y,visible);
    }

    this.loadAnim=function(src,name,frames,speed,x,y,visible){
        return this.assets.anim(src,name,frames,speed,x,y,visible);
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


	//sound

	this.volume=function(volume,sound){
        return this.assets.volume(volume,sound);
    }

    this.mute=function(bool){
        return this.assets.mute(bool);
    }

	this.play=function(name,volume){
        return this.assets.play(name,volume);
    }

    this.sound=function(name,volume){
        return this.assets.play(name,volume);
    }

    this.pause=function(name){
        return this.assets.pause(name);
    }

    this.stop=function(name){
        return this.assets.stop(name);
    }
	
	this.stopAll=function(){
        return this.assets.stopAll();
    }

    this.stopPlay=function(name,volume){
        return this.assets.stopPlay(name,volume);
    }

	this.repeat=function(name,bool){
		return this.assets.repeat(name,bool)
	}


    //draw

	this.filter=function(css,override){
		return this.drawing.filter(css,override);
	}

	this.filters=function(css,override){
		return this.drawing.filter(css,override);
	}

	this.blur=function(pixels,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeBlur(pixels);
	}

	this.brightness=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeBrightness(percent);
	}

	this.contrast=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeContrast(percent);
	}

	this.dropShadow=function(offsetX,offsetY,blurRadius,color,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeDropShadow(offsetX,offsetY,blurRadius,color);
	}

	this.shadow=function(offsetX,offsetY,blurRadius,color,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeDropShadow(offsetX,offsetY,blurRadius,color);
	}

	this.grayScale=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeGrayscale(percent);
	}

	this.gray=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeGrayscale(percent);
	}

	this.grayscale=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeGrayscale(percent);
	}

	this.hueRotate=function(angle,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeHueRotate(angle);
	}

	this.hue=function(angle,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeHueRotate(angle);
	}

	this.invert=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeInvert(percent);
	}

	this.opacity=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeOpacity(percent);
	}

	this.saturate=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeSaturate(percent);
	}

	this.sepia=function(percent,override){
        if(override==undefined){override=true}
        if(override){this.drawing.resetFilter();}
		return this.drawing.changeSepia(percent);
	}

	this.resetFilter=function(){
		return this.drawing.resetFilter();
	}

	this.noFilter=function(){
		return this.drawing.resetFilter();
	}

	this.resetFilters=function(){
		return this.drawing.resetFilter();
	}

	this.noFilters=function(){
		return this.drawing.resetFilter();
	}

	this.none=function(){
		return this.drawing.resetFilter();
	}

    this.cam=function(num){
		if(num==undefined){num=this.drawing.currCam;}
        return this.drawing.cam[num];
    }

	this.camCurrent=function(num){
		return this.drawing.currentCam(num);
	}

	this.currentCam=function(num){
		return this.drawing.currentCam(num);
	}

	this.camCurr=function(num){
		return this.drawing.currentCam(num);
	}

	this.currCam=function(num){
		return this.drawing.currentCam(num);
	}

	this.camChange=function(num){
		return this.drawing.currentCam(num);
	}

	this.changeCam=function(num){
		return this.drawing.currentCam(num);
	}

	this.camReset=function(num){
		if(num==undefined){num=this.drawing.currCam;}
		return this.drawing.camReset(num);
	}

	this.camDefault=function(num){
		if(num==undefined){num=this.drawing.currCam;}
		return this.drawing.camReset(num);
	}

	this.camsReset=function(){
		return this.drawing.camsReset();
	}

	this.camsDefault=function(){
		return this.drawing.camsReset();
	}

	this.camActive=function(bool,num){
		return this.drawing.camActive(bool,num);
	}

	this.inCanvas=function(x,y,w,h){
		if(typeof x=="number"){
			return this.drawing.inCanvas(x,y,w,h);
		}else{
			return this.drawing.inCanvas(x.x,x.y,x.w,x.h);
		}
	}

	this.inCanvasFull=function(x,y,w,h){
		if(typeof x=="number"){
			return this.drawing.inCanvasFull(x,y,w,h);
		}else{
			return this.drawing.inCanvasFull(x.x,x.y,x.w,x.h);
		}
	}

	this.inCam=function(x,y,w,h,num){
		if(typeof x=="number"){
			return this.drawing.inCamera(x,y,w,h,num);
		}else{
			return this.drawing.inCamera(x.x,x.y,x.w,x.h,num);
		}
	}

	this.inCamFull=function(x,y,w,h,num){
		if(typeof x=="number"){
			return this.drawing.inCameraFull(x,y,w,h,num);
		}else{
			return this.drawing.inCameraFull(x.x,x.y,x.w,x.h,num);
		}
	}

	this.xCam=function(x,num){
		return this.drawing.xCam(x,num);
	}

	this.yCam=function(y,num){
		return this.drawing.yCam(y,num);
	}

	this.camX=function(x,num){
		return this.drawing.camX(x,num);
	}

	this.camY=function(y,num){
		return this.drawing.camY(y,num);
	}

	this.alpha=function(alpha){
        return this.drawing.alpha(alpha);
    }

    this.bg=function(color){
        return this.drawing.bg(color);
    }

    this.background=function(color){
        return this.drawing.bg(color);
    }

    this.shape=function(obj){
        return this.drawing.shape(obj);
    }

	this.point=function(x,y,color,rotation){
        return this.drawing.rect(x,y,1,1,color,rotation);
    }

    this.rect=function(x,y,w,h,color,rotation){
        return this.drawing.rect(x,y,w,h,color,rotation);
    }

    this.rectB=function(x,y,w,h,color,rotation,lineW){
        return this.drawing.rectB(x,y,w,h,color,rotation,lineW);
    }

    this.circle=function(x,y,diameter,color){
        return this.drawing.circle(x,y,diameter,color);
    }

    this.circleB=function(x,y,diameter,color,lineW){
        return this.drawing.circleB(x,y,diameter,color,lineW);
    }

	this.ellipse=function(x,y,diameterX,diameterY,color,rotation){
        return this.drawing.ellipse(x,y,diameterX,diameterY,color,rotation);
    }

    this.ellipseB=function(x,y,diameterX,diameterY,color,rotation,lineW){
        return this.drawing.ellipseB(x,y,diameterX,diameterY,color,rotation,lineW);
    }

    this.line=function(x1,y1,x2,y2,width,color,rotation){
        return this.drawing.line(x1,y1,x2,y2,width,color,rotation);
    }

	this.save=function(){
		return this.drawing.save();
	}

	this.restore=function(){
		return this.drawing.restore();
	}

	this.clip=function(shape,y,w,h,r){
    if(shape.x==undefined && shape.x1==undefined){
      if(r==undefined){r=0;}
      shape={x:shape,y:y,w:w,h:h,r:r};
    }
    if(shape.h!=undefined){
      shape.shape="rect";
    }else if(shape.d!=undefined){
      shape.shape="circle";
      shape.x=shape.x+shape.d/2;
      shape.y=shape.y+shape.d/2;
      shape.w=shape.d/2;
      shape.h=shape.d/2;
    }else if(shape.dX!=undefined){
      shape.shape="ellipse";
      shape.x=shape.x+shape.dX/2;
      shape.y=shape.y+shape.dY/2;
      shape.w=shape.dX/2;
      shape.h=shape.dY/2;
    }else if(shape.x1!=undefined){
      shape.shape="line";
      shape.x=shape.x1;
      shape.y=shape.y1;

      shape.h=shape.y2;
      if(shape.lineW==undefined){
        if(shape.w!=undefined){
          shape.lineW=shape.w;
        }else{
          shape.lineW=1;
        }
      }
      shape.w=shape.x2;

    }else if(shape.x!=undefined){
      shape.shape="rect";
      shape.w=1;
      shape.h=1;
    }
    return this.drawing.clip("shape",shape);
	}

  this.clips=function(shapes){
    for(var i=0;i<shapes.length;i++){
      if(shapes[i].x==undefined && shapes[i].x1==undefined){
        if(shapes[i][4]==undefined){shapes[i][4]=0}
        shapes[i]={x:shapes[i][0],y:shapes[i][1],w:shapes[i][2],h:shapes[i][3],r:shapes[i][4]};
      }
      if(shapes[i].h!=undefined){
        shapes[i].shape="rect";
      }else if(shapes[i].d!=undefined){
        shapes[i].shape="circle";
        shapes[i].x=shapes[i].x+shapes[i].d/2;
        shapes[i].y=shapes[i].y+shapes[i].d/2;
        shapes[i].w=shapes[i].d/2;
        shapes[i].h=shapes[i].d/2;
      }else if(shapes[i].dX!=undefined){
        shapes[i].shape="ellipse";
        shapes[i].x=shapes[i].x+shapes[i].dX/2;
        shapes[i].y=shapes[i].y+shapes[i].dY/2;
        shapes[i].w=shapes[i].dX/2;
        shapes[i].h=shapes[i].dY/2;
      }else if(shapes[i].x1!=undefined){
        shapes[i].shape="line";
        shapes[i].x=shapes[i].x1;
        shapes[i].y=shapes[i].y1;

        shapes[i].h=shapes[i].y2;
        if(shapes[i].lineW==undefined){
          if(shapes[i].w!=undefined){
            shapes[i].lineW=shapes[i].w;
          }else{
            shapes[i].lineW=1;
          }
        }
        shapes[i].w=shapes[i].x2;
      }else if(shapes[i].x!=undefined){
        shapes[i].shape="rect";
        shapes[i].w=1;
        shapes[i].h=1;
      }
    }
    return this.drawing.clip(shapes);
	}

	this.unclip=function(){
		return this.drawing.restore();
	}

	this.clipPoint=function(x,y){
		return this.drawing.clip("rect",x,y,1,1,0);
	}

	this.clipLine=function(x1,y1,x2,y2,lineW,r){
		return this.drawing.clip("line",x1,y1,x2,y2,r,lineW);
	}

	this.clipRect=function(x,y,w,h,r){
		return this.drawing.clip("rect",x,y,w,h,r);
	}

	this.clipCircle=function(x,y,d){
		return this.drawing.clip("circle",x+d/2,y+d/2,d/2,d/2,0);
	}

	this.clipEllipse=function(x,y,dX,dY,r){
		return this.drawing.clip("ellipse",x+dX/2,y+dY/2,dX/2,dY/2,r);
	}

    this.font=function(fontName,fontSize,color){
        return this.drawing.font(fontName,fontSize,color)
    }

    this.fontName=function(name){
		if(name!=undefined){
			this.drawing.font(name,this.drawing.fontSize)
		}
		return this.drawing.fontName;
    }

    this.fontSize=function(size){
		if(size!=undefined){
			this.drawing.font(this.drawing.fontName,size)
		}
		return this.drawing.fontSize;
    }

    this.text=function(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight){
        return this.drawing.text(string,x,y,color,textAlign,fontSize,rotation,maxChars,newLineHeight);
    }

    this.textB=function(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight){
        return this.drawing.textB(string,x,y,color,textAlign,fontSize,rotation,lineW,maxChars,newLineHeight);
    }

    this.textW=function(string){
		if(string==undefined){
			string="a";
		}
        return this.drawing.textW(string);
    }

    this.textH=function(){
        return this.drawing.textH();
    }

	this.align=function(align){
        return this.drawing.align(align)
    }

	this.baseLine=function(baseline){
        return this.drawing.baseline(baseline)
    }

	this.baseline=function(baseline){
        return this.drawing.baseline(baseline)
    }

    this.image=function(name,newX,newY,w,h,rotation,sX,sY,sW,sH){
        return this.drawing.image(name,newX,newY,w,h,rotation,sX,sY,sW,sH)
    }

    this.anim=function(name,newX,newY,w,h,rotation){
        return this.drawing.anim(name,newX,newY,w,h,rotation)
    }

	this.animPlay=function(name){
		return this.drawing.animPlay(name)
	}

	this.animPause=function(name){
		return this.drawing.animPause(name)
	}

	this.animStop=function(name){
		return this.drawing.animStop(name)
	}

	this.animStopPlay=function(name){
		this.drawing.animStop(name)
		return this.drawing.animPlay(name)
	}

	this.animPaused=function(name){
		return this.drawing.animPaused(name)
	}

	this.animFrame=function(name,frame){
        return this.drawing.animFrame(name,frame)
    }

	this.animFrames=function(name,frames){
        return this.drawing.animFrames(name,frames)
    }

	this.animSpeed=function(name,speed){
        return this.drawing.animSpeed(name,speed)
    }

    this.color=function(col,type){
        return this.drawing.color(col,type)
    }

	this.scale=function(scaleX,scaleY,x,y,w,h){
        return this.drawing.scale(scaleX,scaleY,x,y,w,h);
    }

    this.rotate=function(rotation,x,y,w,h){
        return this.drawing.rotate(rotation,x,y,w,h);
    }

    this.linear=function(x1,y1,x2,y2,colors,offsets){
        return this.drawing.linear(x1,y1,x2,y2,colors,offsets)
    }

    this.radial=function(x1,y1,d1,x2,y2,d2,colors,offsets){
        return this.drawing.radial(x1,y1,d1,x2,y2,d2,colors,offsets)
    }


    //math

    this.random=function(min,max,interval){
        return this.math.random(min,max,interval);
    }

	this.odds=function(min,max,winningVal,losingVal){
        return this.math.odds(min,max,winningVal,losingVal);
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

    this.wrapIndex=function(num,min,max){
        return this.math.wrapIndex(num,min,max);
    }
    
    this.wrapId=function(num,min,max){
        return this.math.wrapIndex(num,min,max);
    }

	this.index=function(num,min,max){
        return this.math.wrapIndex(num,min,max);
    }

    this.choose=function(arr){
        return this.math.choose(arr);
    }

    this.dist=function(obj1,obj2){
        return this.math.dist(obj1,obj2);
    }

    this.distP=function(x1,y1,x2,y2){
        return this.math.distPoint(x1,y1,x2,y2);
    }

    this.angle=function(obj1,obj2){
        return this.math.angle(obj1.x,obj1.y,obj2.x,obj2.y);
    }

	this.angleP=function(x1,y1,x2,y2){
        return this.math.angle(x1,y1,x2,y2);
    }

    this.angleX=function(angle){
        return this.math.angleX(angle);
    }

	this.ratioX=function(angle){
        return this.math.angleX(angle);
    }

    this.angleY=function(angle){
        return this.math.angleY(angle);
    }

	this.ratioY=function(angle){
        return this.math.angleY(angle);
    }

	this.arr=function(len,val){
        return this.math.arr(len,val);
    }

    this.matrix=function(w,h,val){
        return this.math.matrix(w,h,val);
    }

    this.arr2D=function(w,h,val){
        return this.math.matrix(w,h,val);
    }

	this.copyArr=function(arr){
        return this.math.copyArr(arr);
    }

	this.floor=function(num,digits){
		return this.math.floor(num,digits);
	}

	this.round=function(num,digits){
		return this.math.round(num,digits);
	}

	this.ceil=function(num,digits){
		return this.math.ceil(num,digits);
	}

	this.ceiling=function(num,digits){
		return this.math.ceil(num,digits);
	}

	this.abs=function(num){
		return this.math.abs(num);
	}

	this.sign=function(num){
		return this.math.sign(num);
	}
        
    this.digits=function(num,digits){
		return this.math.digits(num,digits);
	}
    
    this.decimals=function(num,digits){
		return this.math.digits(num,digits);
	}

	this.lerp=function(val,min,max){
        return this.drawing.percent(val*100,min,max);
    }

	this.p=function(percent,start,end){
		return this.drawing.percent(percent,start,end)
	}

	this.percent=function(percent,start,end){
		return this.drawing.percent(percent,start,end)
	}

    this.pX=function(percent,start,end){
        return this.drawing.percentX(percent,start,end);
    }

    this.percentX=function(percent,start,end){
        return this.drawing.percentX(percent,start,end);
    }

    this.pY=function(val,start,end){
        return this.drawing.percentY(val,start,end);
    }

    this.percentY=function(percent,start,end){
        return this.drawing.percentY(percent,start,end);
    }


    //collision
    
    this.col=function(obj1,obj2){
        return this.collision.automatic(obj1,obj2)
    }
    
    this.c=function(obj1,obj2){
        return this.collision.automatic(obj1,obj2)
    }

	this.cPoint=function(point1,point2){
		return this.collision.pointPoint(point1,point2)
	}

	this.cPointPoint=function(point1,point2){
		return this.collision.pointPoint(point1,point2)
	}

	this.cPointP=function(point1,point2){
		return this.collision.pointPoint(point1,point2)
	}

	this.cPointLine=function(point,line){
		return this.collision.linePoint(line,point)
	}

	this.cPointRect=function(point,rect){
		return this.collision.rectPoint(rect,point)
	}

	this.cPointCircle=function(point,circle){
		return this.collision.circlePoint(circle,point)
	}

	this.cPointEllipse=function(point,ellipse){
		return this.collision.ellipsePoint(ellipse,point)
	}

	this.cLine=function(line1,line2){
		return this.collision.line(line1,line2)
	}

	this.cLineLine=function(line1,line2){
		return this.collision.line(line1,line2)
	}

	this.cLinePoint=function(line,point){
		return this.collision.linePoint(line,point)
	}

	this.cLineP=function(line,point){
		return this.collision.linePoint(line,point)
	}

	this.cLineRect=function(line,rect,steps){
		return this.collision.lineRect(line,rect,steps)
	}

	this.cLineCircle=function(line,circle,steps){
		return this.collision.lineCircle(line,circle,steps)
	}

	this.cLineEllipse=function(line,ellipse,steps){
		return this.collision.lineEllipse(line,ellipse,steps)
	}

    this.cRect=function(rect1,rect2){
        return this.collision.rect(rect1,rect2);
    }

	this.cRectRect=function(rect1,rect2){
        return this.collision.rect(rect1,rect2);
    }

	this.cRectPoint=function(rect,point){
        return this.collision.rectPoint(rect,point);
    }

    this.cRectP=function(rect,point){
        return this.collision.rectPoint(rect,point);
    }

	this.cRectLine=function(rect,line,steps){
        return this.collision.lineRect(line,rect,steps);
    }

	this.cRectCircle=function(rect,circle){
        return this.collision.rectCircle(rect,circle);
    }

	this.cRectEllipse=function(rect,ellipse){
        return this.collision.rectEllipse(rect,ellipse);
    }

    this.cCircle=function(circle1,circle2){
        return this.collision.circle(circle1,circle2);
    }

    this.cCircleCircle=function(circle1,circle2){
        return this.collision.circle(circle1,circle2);
    }

	this.cCirclePoint=function(circle,point){
        return this.collision.circlePoint(circle,point);
    }

    this.cCircleP=function(circle,point){
        return this.collision.circlePoint(circle,point);
    }

	this.cCircleLine=function(circle,line,steps){
        return this.collision.lineCircle(line,circle,steps);
    }

	this.cCircleRect=function(circle,rect){
        return this.collision.rectCircle(rect,circle);
    }

	this.cCircleEllipse=function(circle,ellipse){
        return this.collision.circleEllipse(circle,ellipse);
    }

	this.cEllipse=function(ellipse1,ellipse2){
        return this.collision.ellipse(ellipse1,ellipse2);
    }

	this.cEllipseEllipse=function(ellipse1,ellipse2){
        return this.collision.ellipse(ellipse1,ellipse2);
    }

	this.cEllipsePoint=function(ellipse,point){
		return this.collision.ellipsePoint(ellipse,point);
	}

	this.cEllipseP=function(ellipse,point){
		return this.collision.ellipsePoint(ellipse,point);
	}

	this.cEllipseLine=function(ellipse,line,steps){
		return this.collision.lineEllipse(line,ellipse,steps);
	}

	this.cEllipseRect=function(ellipse,rect){
        return this.collision.rectEllipse(rect,ellipse);
    }

	this.cEllipseCircle=function(ellipse,circle){
        return this.collision.circleEllipse(circle,ellipse);
    }

    this.cAssets=function(name1,name2){
        return this.assets.collision(name1,name2);
    }


	//particles

	this.addPart=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,o,oRate,image,anim,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.rRate,x.o,x.oRate,x.image,x.anim,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,o,oRate,image,anim,id);
		}
	}


	this.parts=function(id){
		return this.particles.getParticles(id);
	}

	this.getParts=function(id){
		return this.particles.getParticles(id);
	}

	this.drawParts=function(){
		return this.particles.drawingParticles();
	}
	
	this.drawPart=function(i){
		return this.particles.drawingParticle(i);
	}

	this.delParts=function(){
		return this.particles.clear();
	}

	this.clearParts=function(){
		return this.particles.clear();
	}


    //gamepad


    this.padConnected=function(controller){
        return this.gamepad.checkConnected(controller);
    }

    this.pConnected=function(controller){
        return this.gamepad.checkConnected(controller);
    }

    this.padCheck=function(button,controller,and){
        return this.gamepad.check(button,controller,and);
    }

    this.pCheck=function(button,controller,and){
        return this.gamepad.check(button,controller,and);
    }

    this.padPress=function(button,controller,and){
        return this.gamepad.press(button,controller,and);
    }

    this.pPress=function(button,controller,and){
        return this.gamepad.press(button,controller,and);
    }

    this.padValue=function(button,controller,and){
        return this.gamepad.value(button,controller,and);
    }

    this.pValue=function(button,controller,and){
        return this.gamepad.value(button,controller,and);
    }

    this.padRelease=function(button,controller){
        return this.gamepad.release(button,controller);
    }

    this.pRelease=function(button,controller){
        return this.gamepad.release(button,controller);
    }

    this.padStick=function(stick,controller){
        return this.gamepad.axes(stick,controller);
    }

    this.pStick=function(stick,controller){
        return this.gamepad.axes(stick,controller);
    }

    this.padAxes=function(axes,controller){
        return this.gamepad.axes(axes,controller);
    }

    this.pAxes=function(axes,controller){
        return this.gamepad.axes(axes,controller);
    }

    this.padDirCheck=function(direction,stick,controller){
        return this.gamepad.direction(direction,stick,controller,false);
    }

    this.pDirCheck=function(direction,stick,controller){
        return this.gamepad.direction(direction,stick,controller,false);
    }

    this.padDirPress=function(direction,stick,controller){
        return this.gamepad.direction(direction,stick,controller,true);
    }

    this.pDirPress=function(direction,stick,controller){
        return this.gamepad.direction(direction,stick,controller,true);
    }

    this.padDirReset=function(stick,controller){
        return this.gamepad.directionReset(stick,controller);
    }

    this.pDirReset=function(stick,controller){
        return this.gamepad.directionReset(stick,controller);
    }

    this.padThreshold=function(threshold,stick,controller,val){
        return this.gamepad.threshold(threshold,stick,controller,val);
    }

    this.pThreshold=function(threshold,stick,controller,val){
        return this.gamepad.threshold(threshold,stick,controller,val);
    }

    this.pads=function(){
        return this.gamepad.gamepads;
    }

    this.gamepads=function(){
        return this.gamepad.gamepads;
    }


    //keyboard

	this.keyCheck=function(keyName,and){
        return this.keyboard.check(keyName,and);
    }

    this.kCheck=function(keyName,and){
        return this.keyboard.check(keyName,and);
    }

	this.keyDown=function(keyName,and){
        return this.keyboard.check(keyName,and);
    }

    this.kDown=function(keyName,and){
        return this.keyboard.check(keyName,and);
    }

    this.keyPress=function(keyName,and){
        return this.keyboard.press(keyName,and);
    }

    this.kPress=function(keyName,and){
        return this.keyboard.press(keyName);
    }

    this.keyRelease=function(keyName){
        return this.keyboard.release(keyName);
    }

    this.kRelease=function(keyName){
        return this.keyboard.release(keyName);
    }

	this.simKeyDown=function(keyName){
		return this.keyboard.simulate("keydown",keyName);
	}

	this.simKDown=function(keyName){
		return this.keyboard.simulate("keydown",keyName);
	}

	this.simDown=function(keyName){
		return this.keyboard.simulate("keydown",keyName);
	}

	this.simKeyUp=function(keyName){
		return this.keyboard.simulate("keyup",keyName);
	}

	this.simKUp=function(keyName){
		return this.keyboard.simulate("keyup",keyName);
	}

	this.simUp=function(keyName){
		return this.keyboard.simulate("keyup",keyName);
	}

    this.keys=function(keys){
        if(keys!=undefined){this.keyboard.keysDown=keys;}
        return this.keyboard.keysDown;
    }

    this.k=function(keys){
        if(keys!=undefined){this.keyboard.keysDown=keys;}
        return this.keyboard.keysDown;
    }

    this.keysList=function(byName){
		if(byName!=undefined){
			if(byName){
				return this.keyboard.keysName
			}else{
				return this.keyboard.keys;
			}
		}else{
			return this.keyboard.keys;
		}
    }

    this.kList=function(byName){
		if(byName!=undefined){
			if(byName){
				return this.keyboard.keysName
			}else{
				return this.keyboard.keys;
			}
		}else{
			return this.keyboard.keys;
		}
    }

    this.keyName=function(keyCode){
        return this.keyboard.keyName(keyCode);
    }

	this.kName=function(keyCode){
        return this.keyboard.keyName(keyCode);
    }

    this.keyCode=function(keyName){
        return this.keyboard.keyNum(keyName);
    }

	this.kCode=function(keyName){
        return this.keyboard.keyNum(keyName);
    }


    //mouse

    this.mouseCheck=function(x,y,w,h,cam,btn){
		if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,false,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,false,cam,btn);
		}

    }

    this.mCheck=function(x,y,w,h,cam,btn){
        if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,false,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,false,cam,btn);
		}
    }

    this.mousePress=function(x,y,w,h,cam,btn){
		if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,true,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,true,cam,btn);
		}
    }

    this.mPress=function(x,y,w,h,cam,btn){
        if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,true,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,true,cam,btn);
		}
    }

	this.mouseIn=function(x,y,w,h,cam){
		if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,false,x.cam,-1);
		}else{
			return this.mouse.check(x,y,w,h,false,cam,-1);
		}
	}

	this.mIn=function(x,y,w,h,cam){
		if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,false,x.cam,-1);
		}else{
			return this.mouse.check(x,y,w,h,false,cam,-1);
		}
	}

    this.mouseDown=function(btn){
		if(btn==undefined){btn=0;}
        return this.mouse.down[btn];
    }

    this.mDown=function(btn){
		if(btn==undefined){btn=0;}
        return this.mouse.down[btn];
    }

	this.mouseRelease=function(){
		this.mouse.release();
	}

	this.mRelease=function(){
		this.mouse.release();
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

	this.mouseScroll=function(){
        return this.mouse.scroll;
    }

    this.mScroll=function(){
        return this.mouse.scroll;
    }

	this.mousePrevent=function(bool){
		if(bool!=undefined){this.mouse.preventRight=bool;}
		return this.mouse.preventRight;
	}

	this.mPrevent=function(bool){
		if(bool!=undefined){this.mouse.preventRight=bool;}
		return this.mouse.preventRight;
	}

	//touch

	this.touches=function(){
		return this.touch.touches;
	}

	this.touchCheck=function(x,y,w,h,cam,fingers){
		if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,false,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,false,cam,fingers);
		}
    }

	this.tCheck=function(x,y,w,h,cam,fingers){
        if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,false,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,false,cam,fingers);
		}
    }

	this.touchPress=function(x,y,w,h,cam,fingers){
        if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,true,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,true,cam,fingers);
		}
    }

	this.tPress=function(x,y,w,h,cam,fingers){
        if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,true,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,true,cam,fingers);
		}
    }

	this.touchDown=function(){
        return this.touch.down;
    }

    this.tDown=function(){
        return this.touch.down;
    }

	this.touchRelease=function(){
		this.touch.release();
	}

	this.tRelease=function(){
		this.touch.release();
	}
    
    this.touchX=function(touch){
        return this.touch.x(false,touch);
    }
    
    this.tX=function(touch){
        return this.touch.x(false,touch);
    }
    
    this.touchY=function(touch){
        return this.touch.y(false,touch);
    }
    
    this.tY=function(touch){
        return this.touch.y(false,touch);
    }
    
    this.touchCamX=function(touch){
        return this.touch.x(true,touch);
    }
    
    this.tCX=function(touch){
        return this.touch.x(true,touch);
    }
    
    this.touchCamY=function(touch){
        return this.touch.y(true,touch);
    }
    
    this.tCY=function(touch){
        return this.touch.y(true,touch);
    }

    //mobile

    this.isMobile=function(){
        return this.mobile.isAny();
    }

	//retro compatibility

  this.pixelRate=function(rate){
    if(rate!=undefined){this.canvas.pixelRate=rate;}
    return this.canvas.pixelRate;
  }

  this.pR=function(rate){
    if(rate!=undefined){this.canvas.pixelRate=rate;}
    return this.canvas.pixelRate;
  }

    this.revFullscreen=function(){
        return this.canvas.revFullscreen();
    }

	this.addAlarm=function(name,time){
        return this.loop.alarm(name,time);
    }

	this.wrapVal=function(num,min,max){
        return this.math.wrap(num,min,max);
    }

	this.colAssets=function(name1,name2){
        return this.assets.collision(name1,name2);
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

	this.camactive=function(bool){
		return this.drawing.camActive(bool);
	}

	this.fontsize=function(size){
		if(size!=undefined){
			this.drawing.font(this.drawing.fontName,size)
		}
		return this.drawing.fontSize;
    }

	this.animP=function(name){
		return this.drawing.animPaused(name)
	}

	this.animF=function(name,frame){
        return this.drawing.animFrame(name,frame)
    }

	this.animS=function(name,speed){
        return this.drawing.animSpeed(name,speed)
    }
	//html
    this.id=function(id){
        return this.html.id(id);
    }

    this.class=function(className){
        return this.html.class(className);
    }

	this.webRatio=function(){
        return this.html.ratio();
    }

    this.htmlRatio=function(){
        return this.html.ratio();
    }

    this.cRectC=function(rect,circle){
        return this.collision.rectCircle(rect,circle);
    }

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

	this.particleAdd=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.rRate,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id);
		}
	}

	this.addParticle=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.rRate,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id);
		}
	}

	this.particlesDraw=function(){
		return this.particles.drawingParticles();
	}

	this.drawParticles=function(){
		return this.particles.drawingParticles();
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

	this.partDraw=function(){
		return this.particles.drawingParticles();
	}

	this.partAdd=function(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id){
		if(typeof x=="object"){
			return this.particles.addParticle(x.x,x.y,x.w,x.h,x.frames,x.wRate,x.hRate,x.alpha,x.alphaRate,x.vX,x.vY,x.aX,x.aY,x.c,x.cRate,x.cMax,x.r,x.rRate,x.id);
		}else{
			return this.particles.addParticle(x,y,w,h,frames,wRate,hRate,alpha,alphaRate,vX,vY,aX,aY,c,cRate,cMax,r,rRate,id);
		}
	}

	/*this.drawPart=function(){
		return this.particles.drawingParticles();
	}*/

	this.delPart=function(){
		return this.particles.clear();
	}

	this.clearPart=function(){
		return this.particles.clear();
	}

	//keyboard

	this.simKey=function(evt,keyName){
		return this.keyboard.simulate(evt,keyName);
	}

	this.sim=function(evt,keyName){
		return this.keyboard.simulate(evt,keyName);
	}

    this.keysDown=function(keys){
		if(keys!=undefined){this.keyboard.keysDown=keys;}
        return this.keyboard.keysDown;
    }

	//mouse


    this.mC=function(x,y,w,h,cam,btn){
		if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,false,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,false,cam,btn);
		}
    }

    this.mP=function(x,y,w,h,cam,btn){
        if(typeof x=="object"){
			return this.mouse.check(x.x,x.y,x.w,x.h,true,x.cam,x.btn);
		}else{
			return this.mouse.check(x,y,w,h,true,cam,btn);
		}
    }

	//touch


	this.tC=function(x,y,w,h,cam,fingers){
        if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,false,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,false,cam,fingers);
		}
    }

	this.tP=function(x,y,w,h,cam,fingers){
        if(typeof x=="object"){
			return this.touch.check(x.x,x.y,x.w,x.h,true,x.cam,x.fingers);
		}else{
			return this.touch.check(x,y,w,h,true,cam,fingers);
		}
    }


    this.mS=function(){
        return this.mouse.scroll;
    }
	
	//stats
	this.drawStats=function(showFps,showDrawn,showAll){
        return this.stats.drawingStats(showFps,showDrawn,showAll);
    }
	
	this.logStats=function(showFps,showDrawn,showAll){
        return this.stats.log(showFps,showDrawn,showAll);
    }

    //super macro

    this.r=function(min,max,val){
        return this.math.random(min,max,val);
    }

    this.kC=function(keyCode){
        return this.keyboard.check(keyCode);
    }

    this.kP=function(keyCode){
        return this.keyboard.press(keyCode);
    }

    this.m=function(x,y,w,h,press,cam){
        return this.mouse.check(x,y,w,h,press,cam);
    }

    this.i=function(name,newX,newY,w,h,sX,sY,sW,sH,rotate){
        return this.drawing.image(name,newX,newY,w,h,sX,sY,sW,sH,rotate);
    }

    this.a=function(name,newX,newY,w,h,rotate){
        return this.drawing.anim(name,newX,newY,w,h,rotate);
    }

    this.s=function(name,src){
        return this.assets.stopPlay(name,src);
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
        <span>Made with <a href="https://github.com/ToniestTony/jt_lib">jt_lib17.js</a></span>
            </div>
    </body>
    <script src="jt_lib17.js"></script>

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
