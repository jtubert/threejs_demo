var com={jtubert:{}};
var conf={APIKey: '2_Gv88X3iBr1nbPVMh2LPXmy0h1vQU2PduRFqkBy6DAg_rpu0I0S1TizqaZgZlwJzi',enabledProviders: 'facebook,twitter,linkedin,myspace,yahoo,google',connectWithoutLoginBehavior: 'alwaysLogin'}
com.jtubert.gigya = function(){
  var self = this;
  
  this.init = function(){
    
    //self.getSessionInfo();
    
    self.getUserInfo();
    //self.getAlbums();
    
    gigya.socialize.addEventHandlers({ 
      onLogin:self.displayEventMessage,
        onConnectionAdded:self.displayEventMessage,
        onConnectionRemoved:self.displayEventMessage
       }
    );
    
    var connect_params=
    {
      showTermsLink: 'false'
      ,showEditLink: 'true'
      ,height: 70
      ,width: 300
      ,containerID: 'connectionsUIHolder'
      ,UIConfig: '<config><body><controls><snbuttons buttonsize="40" /></controls></body></config>'
    }
    
    gigya.services.socialize.showAddConnectionsUI(connect_params);
    
    
    
  }
  
  this.getAlbums = function(){
    gigya.services.socialize.getAlbums(conf,{callback:self.getAlbumsCallback});  
  }
  
  this.getAlbumsCallback = function(response){
     if (  response.errorCode == 0 ) {               
            //console.log(response); 
        var myAlbums = response['albums'].asArray();            
             if ( null!=myAlbums && myAlbums.length>0) {          
                 self.getPhotos(myAlbums[0]['albumID']);  
             }  
             else {  
                 //alert('No albums were returned');  
          console.log('No albums were returned');
             }  
         }  
         else { 
        console.log('Error :' + response.errorMessage);
             //alert('Error :' + response.errorMessage);  
         }
  }
  
  this.getPhotos = function(albumID) {  
      gigya.services.socialize.getPhotos(conf, { callback:self.getPhotos_callback, albumIDs:albumID });  
  }
  
  this.getPhotos_callback = function(response) {  
      var picsArray = [];
    if (response.status == 'OK') {  
          var myPhotos = response.photos.asArray();  
          
          for (var i = 0; i < Math.min(3, myPhotos.length); i++) {  
              if (myPhotos[i].photoURL){
          picsArray.push(myPhotos[i].photoURL); 
        } 
          }
        //com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
      sphere.createCanvasTexture(picsArray);
      }  
  }
  

  this.displayEventMessage=function(eventObj) {
      console.log(eventObj.eventName);
  
    if(eventObj.eventName == "connectionAdded"){
      currentNetwork = eventObj.provider;
      //gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback});
      self.getAlbums(); 
    }else if(eventObj.eventName == "connectionRemoved"){
      //com.jtubert.cubeMakerInstance.clearCube();
    }
  }
  
  
  this.getFriendsInfoCallback = function(response) {    
      //console.log("response");
    var picsArray = [];
    if ( response.errorCode == 0 ) {    
      var myFriends = response['friends'].asArray();
      if ( null!=myFriends && myFriends.length>0) {          
        for (var index=0;index<myFriends.length;index++) {  
          var currFriend = myFriends[index];              
            picsArray.push(currFriend['photoURL']);           
          }
          //com.jtubert.cubeMakerInstance.putImagesOnCube(picsArray);
          sphere.createCanvasTexture(picsArray);
            }  
           else {  
               console.log('No friends were returned');  
           }  
       }  
       else {  
           console.log('Error (getFriendsInfoCallback):' + response.errorMessage);  
       }  
   }
  
  this.getSessionInfo = function(){
    gigya.services.socialize.getSessionInfo(conf,{provider:currentNetwork,callback:self.getSessionInfoCallback});
  }

  this.getSessionInfoCallback = function(response){
    if ( response.errorCode == 0 ) {               
      var authToken = response['authToken'];
      console.log("authToken: ",response);
      //self.getUserInfo();
    }else{
      console.log('Error/getSessionInfoCallback :',response);  
    }
  }
  
  this.addConnection = function(p)
    {

        var params = {
           callback: self.onConnectionAdded,
       facebookExtraPermissions: "publish_stream",
           provider: p

        };    

        gigya.services.socialize.addConnection(conf, params); 

    }

    this.onConnectionAdded = function(response)
    {
        console.log(response.requestParams.provider);

    self.getAvailableProviders();

    if (response.errorCode == 0)
        {            
            //jQuery('#canvasHolder').append("<h2>"+response.user.identities[response.requestParams.provider].nickname+"</h2>");
      //jQuery('#canvasHolder').append("<img src='"+response.user.identities[response.requestParams.provider].photoURL+"'/>");          
      //gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback}); 
      
      self.getSessionInfo();
        }
        else
        {
            //handle errors
            $("#console").html("An error has occurred!" + '\n' + 
                "Error details: " + response.errorMessage + '\n' +
                "In method: " + response.operation);
        }
    }
  
  this.getAvailableProviders = function(){
    var context = {  
        message:'This is my message to you',   
        myAppTitle:'These are my providers:'  
    };


    var params = {  
        requiredCapabilities: 'friends',   
        callback:self.printResponse,  
        context:context   
    };  

    gigya.services.socialize.getAvailableProviders(conf,params);
  }
  
  this.printResponse = function(response) {
    console.log(response);
  }

  this.getUserInfoCallback = function(response){
    console.log("You are logged in to: ",response.user.providers);
    
    if ( response.errorCode == 0 ) { 
      self.userPhotoURL = response.user.photoURL;
      if(self.userPhotoURL != ""){
        //$("#login").hide();
        //$("#networks").hide();
        //$("#logout").show();
        $("#merge").show();
        gigya.services.socialize.getFriendsInfo(conf,{callback:self.getFriendsInfoCallback}); 
      }else{
        $("#login").show();
        $("#merge").hide();
        $("#networks").show();
        $("#logout").hide();
        $("#console").html('userPhotoURL :' + self.userPhotoURL);   
      }    
    }else{
      $("#console").html('Error :' + response.errorMessage);  
    }
  }
  
  this.getUserInfo = function(){
    gigya.services.socialize.getUserInfo(conf,{callback:self.getUserInfoCallback}); 
       
  }
  
  this.logoutCallback = function(response) {
     location.reload();
    
       if ( response.errorCode == 0 ) {                   
          $("#console").html('User has logged out');
        $("#login").show();
      $("#networks").show();
      $("#logout").hide();
      $("#merge").hide();
      
       }    
       else {    
           $("#console").html('Error :' + response.errorMessage);
      $("#login").hide();
      $("#networks").hide();
      $("#logout").show(); 
      $("#merge").show();   
       }    
   }   
     
  this.logout = function(){
    gigya.services.socialize.logout(conf,{callback:self.logoutCallback});
  } 
  
  this.onLogin = function(response){  
       //getUserInfo();
    $("#console").html("response: "+response);   
  } 
  
  this.login = function(){
     var params = {  
         provider:currentNetwork,  
         callback: 'onLogin',
       redirectURL: document.location.href
     };        
     //gigya.services.socialize.login(conf, params); 
    
    self.addConnection(currentNetwork);    
  }
  
  this.getUrlVars = function()
  {
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
  
  this.changeNetwork = function() {
    //currentNetwork = $("#networks").val(); 
    //$("#console").html('currentNetwork :' + currentNetwork);    
  }
  
  return this;
}