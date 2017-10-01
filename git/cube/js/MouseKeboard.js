com.jtubert.MouseKeyboard = function(){
  var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0;
  var pressX = 0, pressY = 0;

  var dragging = false;           

  var rotateX = 0, rotateY = 0;
  var rotateVX = 0, rotateVY = 0;
  var rotateXMax = 90 * Math.PI/180;  

  var rotateTargetX = undefined;
  var rotateTargetY = undefined;
  

  this.onDocumentMouseMove = function( event ) {
    pmouseX = mouseX;
    pmouseY = mouseY;
    mouseX = event.clientX - window.innerWidth * 0.5;
    mouseY = event.clientY - window.innerHeight * 0.5;
    if(dragging){
      camera.position.x -= (mouseX - pmouseX) * .5; 
        camera.position.y += (mouseY - pmouseY) * .5;
    }
  }

  this.onDocumentMouseDown = function( event ) {        
      dragging = true;         
      pressX = mouseX;
      pressY = mouseY;    
      rotateTargetX = undefined;
      rotateTargetX = undefined;
  } 

  this.onDocumentMouseUp = function( event ){   
    dragging = false;
    histogramPressed = false;
  }

  this.onClick = function( event ){
    //  make the rest not work if the event was actually a drag style click
    if( Math.abs(pressX - mouseX) > 3 || Math.abs(pressY - mouseY) > 3 )
      return;       

    
  }

  this.onKeyDown = function( event ){ 
  }

  this.handleMWheel = function( delta ) {
    camera.scale.z += delta * 0.1;
    camera.scale.z = constrain( camera.scale.z, 0.7, 5.0 );
  }

  this.onMouseWheel = function( event ){
    var delta = 0;

    if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta/120;
    } 
    //  firefox
    else if( event.detail ){
      delta = -event.detail/3;
    }

    if (delta)
            self.handleMWheel(delta);

    event.returnValue = false;      
  } 

  this.onDocumentResize = function(e){
  }
  
  return this;
}