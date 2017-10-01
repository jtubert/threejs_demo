com.jtubert.Sphere = function(){
  var self = this;
  
  var materials = [];
  var textures = [];
  var width = window.innerWidth;
  var height = window.innerHeight;
  var sphereTexture;

  var size = 1500;
  var sphere;
  var mouseX,mouseY;
  
  var halfWidth = window.innerWidth / 2;
  var halfHeight = window.innerHeight / 2;
  
  
  this.init = function(obj){
    if(self.getUrlVars().mode.indexOf("gigya") == 0){
      //cube with pictures from FB, TW, LinkedIn
      var gigya = com.jtubert.gigya();
      gigya.init();
    }else if(self.getUrlVars().mode.indexOf("instagram") == 0 ){
      var t = "userInfo";
      
      if(self.getUrlVars().type == "userInfo"){
        t = "userInfo";
      }else if(self.getUrlVars().type == "userSelfFeed"){
        t = "userSelfFeed";
      }else if(self.getUrlVars().type == "userFollows"){
        t = "userFollows";
      }     
      //cube with pictures from instagram
      var instagram = com.jtubert.instagram();
      instagram.init({type:t});//userSelfFeed userFollows userInfo
    }else{
      self.simpleCanvasTexture();
    }
    
    self.instance = self;
  }
  
  self.simpleCanvasTexture = function() {
      var canvas = document.getElementById('canvas');
    canvas.width = canvas.height = size;
      var context = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
      self.createScene();
    }
    img.src = "instagram.jpeg"; 
    context.drawImage(img, 0, 0);
    
    
  }
  
  
  self.createCanvasTexture = function(picsArray){
    console.log(picsArray.length);
    
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    var totalPieces = picsArray.length;
    var column = Math.ceil(Math.sqrt(totalPieces));
    var space = 0;
        var scale = Math.floor((900 - (space * (column - 1))) / column);
    var counter = 0;
    
    console.log(column, scale);
    
    //var column = 6;
    var startX = 0;
    
    //var scale = 50;
    for(var i=0;i<totalPieces;i++){     
      var img = new Image();
      img.i = i;  
      img.onload = function() {       
        var x,y;
        if (this.i <= column - 1) {
                  x = startX + (((scale + space) * this.i));
                  y = 0;               
              } else {
                  x = startX + (((scale + space) * (this.i - (Math.floor(this.i / column)) * column)));
                  y = (((scale + space) * (Math.floor(this.i / column))));
              }       
        ctx.drawImage(this, x, y,scale,scale);
        if(counter == picsArray.length){
          console.log("done loading");
        }
        counter++;            
      };
      //img.src = "proxy.php?url="+picsArray[i];
      //console.log(picsArray[i]);
      img.crossOrigin = "anonymous";
      img.src = picsArray[i];


      
    }   
    
    self.createScene();
    
    
    
  }
  
  this.animate = function() {
    sphere.rotation.x = 0.005 + (mouseY*0.005);
    sphere.rotation.y = 0.005 + (mouseX*0.005);
      requestAnimationFrame(self.animate);
      self.render();
  }
  
  
  this.render = function() {
    //self.simpleCanvasTexture();
    /*
    for (var i = 0; i < textures.length; i++) {
          textures[i].needsUpdate = true;
      }
    */
    sphereTexture.needsUpdate = true;
    sphereTexture.minFilter = THREE.LinearFilter;
    renderer.render(scene, camera);
  }
  

  this.onMouseMove = function( event ) {
    mouseX = event.clientX - halfWidth;
    mouseY = event.clientY - halfHeight;
  }
  
  this.createScene = function(){
    var canvas = document.getElementById('canvas');
    
    $(document).bind('mousemove', self.onMouseMove);
    
    
    scene = new THREE.Scene();
    
    scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
    
      camera = new THREE.PerspectiveCamera(20, width / height, 1, 500);
      camera.position.y = 0;
      camera.position.z = 500;
      scene.add(camera);

      for (var i = 0; i < 6; i++) {
          var texture = new THREE.Texture(canvas);//self.changeCanvas());
          textures.push(texture);

          var material = new THREE.MeshBasicMaterial({ map: texture });
          materials.push(material);
      }
  
    // sphere
    sphereTexture = new THREE.Texture(canvas);//self.changeCanvas());
    sphereTexture.needsUpdate = true;
    
    var radius = 50, segments = 36, rings = 36;
    
        sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), new THREE.MeshBasicMaterial({
            map: sphereTexture
        }));
        sphere.overdraw = true;
        scene.add(sphere);
     
    //var cube = new THREE.Mesh(new THREE.CubeGeometry(size, size, size, 1, 1, 1, materials), new THREE.MeshFaceMaterial());
      //cube.position.y = 150;
      //cube.rotation.y = 10;
      //scene.add(cube);
  
    
    

      renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled   = true;
    
    
      renderer.setSize(width, height);
      document.body.appendChild(renderer.domElement);
    
    self.animate();
  }
  
  this.getUrlVars = function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  } 
  
  return this;
}