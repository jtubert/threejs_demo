//http://instagram.com/developer/

com.jtubert.instagram = function(){
  var self = this;
  var token = "";
  var user = "";
  var endpoint = "https://api.instagram.com/v1/";
  var userPhotoURL = "";
  var picsArray;

  this.init = function(obj){    
    picsArray = []; 
    
    if(window.location.href.indexOf("http://localhost") == 0){
      $("#login").append("<a href='https://instagram.com/oauth/authorize/?client_id=16650ae8b4094996b21367c76a95845a&redirect_uri=http://localhost:8888/git/cube/?mode=instagram&type="+obj.type+"&response_type=token'>Add instagram images</a>");
    }else{
      $("#login").append("<a href='https://instagram.com/oauth/authorize/?client_id=16650ae8b4094996b21367c76a95845a&redirect_uri="+window.location.href+"&type="+obj.type+"&response_type=token'>Add instagram images</a>");
    }   
    
    $("#canvasHolder").append("<div id='holder'></div>");
    self.getAccessToken(obj);
    
  }

  this.getAccessToken = function(obj){
    if(window.location.hash) {
        var hash = window.location.hash.substring(1); 
        self.token = hash.split("=")[1];
      
      if(obj.type == "userInfo"){
        self.userInfo();
      }else if(obj.type == "userSelfFeed"){
        self.userSelfFeed();
      }else if(obj.type == "userFollows"){
        self.userFollows();
      }     
    }
  }

  this.userMediaRecent = function(uid){
    var id =(uid == null)?"self":uid;
  
    $("#grams").html("");
  
    var url = endpoint+"users/"+id+"/media/recent/?access_token="+self.token+"&callback=callbackFunction";
    self.loadWithURL(url,self.userMediaRecentSuccess,"grams");
  }

  this.userInfo = function(){
    var url = endpoint+"users/self/?access_token="+self.token+"&callback=callbackFunction";
    self.loadWithURL(url,self.userInfoSuccess,"user");
  }

  this.userSelfFeed = function(){
    var url = endpoint+"users/self/feed/?access_token="+self.token+"&callback=callbackFunction";
    self.loadWithURL(url,self.userMediaRecentSuccess,"selfFeed");
  }

  this.userFollows = function(){
    var url = endpoint+"users/self/follows/?access_token="+self.token+"&callback=callbackFunction";
    self.loadWithURL(url,self.userFollowsSuccess,"user");
  }

  this.loadWithURL = function(url,callback,div){
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(obj){callback(obj,div);}
      });
  }

  this.showFeedForUser = function(uid){
    self.userMediaRecent(uid);
  }

  this.userFollowsSuccess = function(obj,divName){
      //console.log("data",obj);
  
    var div = "";
    var len = (obj.data.length >= 10)?10:obj.data.length;
  
    for(var i=0;i<len;i++){
      var data = obj.data[i];
      picsArray.push(data.profile_picture);     
    } 
    
    var next_url = obj.pagination.next_url;
    
    if(next_url){
      self.loadWithURL(next_url,self.userFollowsSuccess,divName);
    }else{
      //com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
      sphere.createCanvasTexture(picsArray);
    }
  
  }

  this.userInfoSuccess = function(obj,divName){
      //console.log("data",obj);
    user = obj.data.id;
  
  
    self.userPhotoURL = obj.data.profile_picture;
  
    $("#login").html("");
  
    
    
    self.userMediaRecent();
    //self.userFollows();
  }

  this.userMediaRecentSuccess = function(obj,divName){
      //console.log("data",obj);
    var len = obj.data.length;
  
    for(var i=0;i<len;i++){     
      var data = obj.data[i];
      var thumbURL = data.images.thumbnail.url;
      /*
      var imageURL = data.images.low_resolution.url;
      
      var captionObject = data.caption;
      var link = data.link;
      var filter = data.filter;
      var user = data.user.full_name;

      var caption = "{No caption}";

      if(captionObject){
        caption = captionObject.text;
      }
      */
      
      picsArray.push(thumbURL);
    } 
  
    var next_url = obj.pagination.next_url;
  
    if(next_url){
      self.loadWithURL(next_url,self.userMediaRecentSuccess,divName);
    }else{      
      //com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
      sphere.createCanvasTexture(picsArray);
    }
  }
  
  return this;
}