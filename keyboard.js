/* HOW TO USE

Link this script to the html

1: When you want to start the keyboard, call keyboard.start() in your update function
keyboard.start(msg,str,lines,size) has 4 params
msg: you can write the info message
str: you can insert a pre-written string in the input
lines: the max number lines (25 chars per line, 1 by default)
size: the font size (24 by default)

2: In your main update code, before the keyboard.start(), write something like this to get the input which is in keyboard.str:
if(keyboard.finished){
	keyboard.finished=false;
	this.str=keyboar.str;
}

3: At the end of your whole update/draw function call this to put a dark background and help make it pop-up:
if(keyboard.on){
	jt.bg([0,0,0,0.5])
}


*/

var keyboard={
	on:false,
	msg:"",
	str:"",
	max:25,
	size:24,
	sizeDefault:24,
	lines:1,
	
	shift:false,
	shiftHold:false,
	num:false,
	
	iteration:0,
	backspaceTimer:0,
	backspaceTimerMax:15,
	backspaceInterval:2,
	waveI:0,
	waveX:0,
	waveY:0,
	
	frame:0,
	fps:60,
	interval:undefined,
	
	finished:false,
	
	start:function(msg,str,lines,size){
		this.finished=false;

		  this.msg=msg;
		  this.str=str;

		  if(this.msg===undefined){this.msg="Write here...";}
		  if(this.str===undefined){this.str="";}

		  this.shift=false;
		  this.num=false;
		  
		  if(lines!=undefined){
			this.lines=lines;
		  }else{
			this.lines=1;
		  }
		  
		  if(size!=undefined){
			this.size=size;
		  }else{
			this.size=24; 
		  }
		  
		  this.max=25*this.lines;
			
		  this.backspaceTimer=0;
		  this.iteration=0;
		  this.waveI=Math.PI*2/this.fps;
		  this.waveX=0;
		  this.waveY=0;

		  this.on=true;
		  var context=this;
		  jt.pauseJt(true);
		  this.interval=setInterval(context.loop,1000/this.fps,context)
		  jt.camActive(false);
		  
		  jt.kRelease();
		  jt.release();
		  jt.restore();
		  this.update(context);
	},
	loop:function(context){
		context.update();
	},
	update:function(context){
		var jtFullH=jt.h()+jt.addH();
		jt.camActive(false);
		  if(this.iteration==0){
			jt.bg([0,0,0,0.5])
		  }
		  this.iteration++;
		  this.waveX+=this.waveI;
		  if(this.waveX>this.waveI*this.fps){
			this.waveX=this.waveI;
		  }
		  this.waveY=Math.sin(this.waveX)
		  this.waveYPos=(this.waveY+1)/2

		  //draw keyboard bg
		  var rect={x:0,y:jtFullH*2/3,w:jt.w(),h:jtFullH*1/3,c:[200,200,200]}

		  jt.rect(rect)

		  var keys=[
			["q","w","e","r","t","y","u","i","o","p"],
			["a","s","d","f","g","h","j","k","l"],
			["^","z","x","c","v","b","n","m","<="],
			["123","Space","Enter"],
		  ]

		  var nums=[
			[1,2,3],
			[4,5,6],
			[7,8,9],
			[".",0,"<="],
			["ABC","Space","Enter"]
		  ]

		  //choose the good keyboard
		  var num=false;
		  if(this.num){
			num=true;
		  }

		  if(this.num && jt.kPress(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])){
			num=false;
		  }else if(!this.num && jt.kCheck([0,1,2,3,4,5,6,7,8,9])){
			num=true;
		  }

		  if(num){
			keys=[];
			keys=nums;
			this.num=true;
		  }else{
			this.num=false;
		  }

		  //get spacing and width/height of the keyboard
		  var spacingW=jt.w()/100;
		  var spacingH=(jtFullH/100)*jt.ratio();
		  var keyboardW=jt.w();
		  var keyboardH=(jtFullH*1/3);
		  var startX=0;
		  var startY=jtFullH*2/3;

		  var kCheck=jt.kCheck();
		  var kPress=jt.kPress();

		  if(!jt.check()){
			this.backspaceTimer=0; 
		  }
		  
		  //Draw all keys
		  jt.font("Consolas",this.size);
		  var h=(keyboardH)/keys.length;
		  for(var y=0;y<keys.length;y++){
			var w=(keyboardW)/keys[y].length;
			for(var x=0;x<keys[y].length;x++){
			  var ww=w-spacingW*2;
			  var hh=h-spacingH*2;
			  var xx=startX+spacingW+x*w;
			  var yy=startY+spacingH+y*h;
			  var c=[255,255,255];
			  var btn={x:startX+x*w,y:startY+y*h,w:w,h:h};

			  if(jt.check(btn) || kCheck){
				if(kCheck){
				  var key=keys[y][x];
				  if(jt.kCheck(key)){
					c=[127,127,127];
				  }else{
					if(key=="^" && jt.kCheck("shift")){
					  c=[127,127,127];
					}else if(key=="<=" && jt.kCheck("backspace")){
					  c=[127,127,127];
					}else if(key=="123" && jt.kCheck([0,1,2,3,4,5,6,7,8,9])){
					  c=[127,127,127];
					}else if(key=="ABC" && jt.kCheck(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])){
					  c=[127,127,127];
					}else if(key=="Space" && jt.kCheck("space")){
					  c=[127,127,127];
					}else if(key=="Enter" && jt.kCheck("enter")){
					  c=[127,127,127];
					}
				  }
				}else{
				  c=[127,127,127];
				}

				if(jt.press(btn) || kPress || (jt.check(btn) && keys[y][x]=="<=")){
				  var key=keys[y][x];
				  var valid=true;
				  if(kPress){
					valid=false;
					if(jt.kPress(key)){
					  valid=true;
					}else{
					  if(key=="^" && jt.kPress("shift")){
						valid=true;
					  }else if(key=="<=" && jt.kPress("backspace")){
						valid=true;
					  }else if(key=="123" && jt.kPress([0,1,2,3,4,5,6,7,8,9])){
						valid=true;
					  }else if(key=="ABC" && jt.kPress(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])){
						valid=true;
					  }else if(key=="Space" && jt.kPress("space")){
						valid=true;
					  }else if(key=="Enter" && jt.kPress("enter")){
						valid=true;
					  }
					}
				  }
				  
				  
				  if(key!="^" && key!="<=" && key!="ABC" && key!="123" && key!="Space" && key!="Enter" && valid){
					var k=key;
					if(this.shift){
					  this.shift=false;
					  if(typeof k=="string"){
						k=k.toUpperCase();
					  }
					  
					}
					this.str+=k;
				  }else if(valid){
					if(key=="^"){
					  this.shift=!this.shift;
					}else if(key=="<="){
					  var checkInterval=false;
					  if(jt.check(btn)){
						this.backspaceTimer++;
						if(this.backspaceTimer>=this.backspaceTimerMax){
						  if(this.iteration%this.backspaceInterval==0){
							checkInterval=true;
						  }
						}
					  }else{
						this.backspaceTimer=0;
					  }
					  if(jt.press(btn) || kPress || checkInterval){
						 if(this.str.length>0){
						  this.str=this.str.slice(0,this.str.length-1);
						}
					  }
					 
					}else if(key=="123"){
					  this.num=true;
					}else if(key=="ABC"){
					  this.num=false;
					}else if(key=="Space"){
					  this.str+=" ";
					}else if(key=="Enter"){
					  this.finished=true;
					}
				  }
				  if(this.str.length>this.max){this.str=this.str.slice(0,this.max)}
				  if(valid){
					/*jt.mRelease();
					jt.tRelease();
					jt.release();*/
					jt.kRelease();
				  }
				}
			  }

			  if(keys[y][x]=="^"){
				if(this.shift){
				  c=[127,127,127];
				}
			  }

			  if(this.shift && keys[y][x]!="Space" && keys[y][x]!="Enter"){
				if(typeof keys[y][x]=="string"){
					keys[y][x]=keys[y][x].toUpperCase();
				}
			  }
			  jt.rect(xx,yy,ww,hh,c)
			  jt.text(keys[y][x],xx+ww/2,yy+hh/2-jt.fontSize()/2,"black","center")
			}
		  }

		  //show text
		  var textW=jt.w();
		  var textH=jt.fontSize()*4+10;
		  textH+=(jt.fontSize()+5)*(this.lines-1)
		  var textX=jt.w()/6;
		  var textY=jtFullH*(1/3)-textH/2;
		  jt.rectB(textX,textY,textW-textX*2,textH,[0,0,0],0,5)
		  jt.rect(textX,textY,textW-textX*2,textH,[200,200,200])
		  var writingH=((jt.fontSize()+5)*this.lines);
		  jt.rect(textX+spacingW,textY+textH-writingH-5,textW-spacingW*2-textX*2,writingH,[255,255,255])

		  jt.font("Consolas",this.size);
		  jt.text(this.msg,textX+spacingW*2,textY+10,"black","left",jt.fontSize(),0,28,jt.fontSize());
		  jt.text(this.str.slice(0,25),textX+spacingW*2,textY+textH-writingH,"black","left");
		  var lineH=0;
		  var strW=jt.textW(this.str.slice(0,25));
		  if(this.str.length>25){
			jt.text(this.str.slice(25,50),textX+spacingW*2,textY+textH-writingH+jt.fontSize(),"black","left");
			lineH=jt.fontSize();
			strW=jt.textW(this.str.slice(25,50));
		  }
		  if(this.str.length>50){
			jt.text(this.str.slice(50,75),textX+spacingW*2,textY+textH-writingH+jt.fontSize()*2,"black","left");
			lineH=jt.fontSize()*2;
			strW=jt.textW(this.str.slice(50,75));
		  }
		  if(this.str.length>75){
			jt.text(this.str.slice(75,100),textX+spacingW*2,textY+textH-writingH+jt.fontSize()*3,"black","left");
			lineH=jt.fontSize()*3;
			strW=jt.textW(this.str.slice(75,100));
		  }
		  
		  jt.alpha(this.waveYPos);
		  jt.rect(textX+spacingW*2+strW,textY+textH-writingH+(lineH),spacingW/2,jt.fontSize())
		  jt.alpha(1);
		  
		  if(jt.press()){
			if(!jt.press(textX,textY,textW,textH) && !jt.press(startX,startY,keyboardW,keyboardH)){
			  this.finished=true;
			  jt.release();
			}
		  }
		  
		  //remove mouse press
		  jt.mouse.press=[false,false,false,false,false]

		  //remove touch press
		  if(jt.touch.press==true){
			jt.touch.press=false;
		  }

		  
		  
		  if(jt.kPress("enter")){
			this.finished=true; 
		  }

		  if(this.finished){
			jt.mRelease();
			jt.tRelease();
			jt.release();
			clearInterval(this.interval);
			jt.pauseJt(false);
			this.on=false;
			return this.str;
		  }
		
	},
}