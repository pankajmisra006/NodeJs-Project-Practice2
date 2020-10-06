
// var _videoGrid=$('#videos-container')
// var _myVideo = document.createElement('video')
// _myVideo.muted = true;





var connection = new RTCMultiConnection();
var bitrates = 512;
var resolutions = 'HD';
var videoConstraints = {};

if (resolutions == 'HD') {
    videoConstraints = {
        width: {
            ideal: 1280
        },
        height: {
            ideal: 720
        },
        frameRate: 30
    };
}

if (resolutions == 'Ultra-HD') {
    videoConstraints = {
        width: {
            ideal: 1920
        },
        height: {
            ideal: 1080
        },
        frameRate: 30
    };
}

connection.mediaConstraints = {
    video: videoConstraints,
    audio: true
};

var CodecsHandler = connection.CodecsHandler;

connection.processSdp = function(sdp) {
    var codecs = 'vp8';
    
    if (codecs.length) {
        sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
    }

    if (resolutions == 'HD') {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
            audio: 128,
            video: bitrates,
            screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });
    }

    if (resolutions == 'Ultra-HD') {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
            audio: 128,
            video: bitrates,
            screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });
    }

    return sdp;
};




connection.session = {
  audio: true,
  video: true
};

connection.sdpConstraints.mandatory = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true
};



connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

// use your own TURN-server here!
// connection.iceServers = [{
//     'urls': [
//         'stun:stun.l.google.com:19302',
//         'stun:stun1.l.google.com:19302',
//         'stun:stun2.l.google.com:19302',
//         'stun:stun.l.google.com:19302?transport=udp',
//     ]
//   }];





// first step, ignore default STUN+TURN servers
connection.iceServers = [];

// second step, set STUN url
connection.iceServers.push({
  urls:[ 'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
           'stun:stun2.l.google.com:19302',
            'stun:stun.l.google.com:19302?transport=udp',


       ]
});

// last step, set TURN url (recommended)
connection.iceServers.push({
  
url: 'turn:numb.viagenie.ca',
credential: 'muazkh',
username: 'webrtc@live.com'

});

 
$( document ).ready(function() {

$('#open-room').on('click',function(){

     connection.open($('#room-id').val(), function(isRoomOpened, roomid, error) {
        if(isRoomOpened === true) {
        console.log("your are the host!")
        //connection.setHostinfo.available=true
    


        }
        else {
        //   if(error === 'Room not available') {
        //     alert('Someone already created this room. Please either join or create a separate room.');
        //     return;
        //   }
        //   alert(error);
        connection.videosContainer.remove()
        alert("room already opened! you can join")
        
        return
        }
    });;
   

})

$('#join-room').on('click',function(){

    connection.checkPresence($('#room-id').val(), function(isRoomExist, roomid) {
        if (isRoomExist === true) {
        
            connection.join(roomid);
        } else {
            alert("Please let the host open the meeting")
        }
    });
   

})

connection.videosContainer = document.getElementById('videos-container');
connection.onstream = function(event) {
  
    var isInitiator = connection.isInitiator;

   

    // if (isInitiator === true && event.type === 'remote') {
    //     // initiator recieved stream from someone else
    //     alert('dear initiator, you just receive a remote stream');
    // }


    var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }


    if (event.type == 'local') {
        // if (isInitiator === true && event.type === 'local') {
        //     // initiator's own stream
        //     connection.setHost={
        //         id:event.streamid
        //     }
        //     alert('you are initiator');

        // }
        showLocalVideo(event);
        return;
    }

    if (event.type == 'remote') {
        var numberOfUsers = connection.getAllParticipants().length;
        if (numberOfUsers == 1) {
            showLocalVideo(event);
        } else {
            showLocalVideo(event);
        }
    }

    // event.mediaElement.removeAttribute('src');
    // event.mediaElement.removeAttribute('srcObject');
    // event.mediaElement.muted = true;
    // event.mediaElement.volume = 0;

    // var video = document.createElement('video');

    // try {
    //     video.setAttributeNode(document.createAttribute('autoplay'));
    //     video.setAttributeNode(document.createAttribute('playsinline'));
    // } catch (e) {
    //     video.setAttribute('autoplay', true);
    //     video.setAttribute('playsinline', true);
    // }

    // if(event.type === 'local') {
    //   video.volume = 0;
    //   try {
    //       video.setAttributeNode(document.createAttribute('muted'));
    //   } catch (e) {
    //       video.setAttribute('muted', true);
    //   }
    // }
    // video.srcObject = event.stream;

    // var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
    // var mediaElement = getHTMLMediaElement(video, {
    //     //title: event.userid,
    //     buttons: ['mute-audio'],
    //     width: width,
    //     showOnMouseEnter: true
    // });

    // connection.videosContainer.appendChild(mediaElement);

    // // setTimeout(function() {
    // //     mediaElement.media.play();
    // // }, 5000);

    // mediaElement.id = event.streamid;

    // // to keep room-id in cacheconnectToNewUser


    // // if(chkRecordConference.checked === true) {
    // //   btnStopRecording.style.display = 'inline-block';
    // //   recordingStatus.style.display = 'inline-block';

    // //   var recorder = connection.recorder;
    // //   if(!recorder) {
    // //     recorder = RecordRTC([event.stream], {
    // //       type: 'video'
    // //     });
    // //     recorder.startRecording();
    // //     connection.recorder = recorder;
    // //   }
    // //   else {
    // //     recorder.getInternalRecorder().addStreams([event.stream]);
    // //   }

    // //   if(!connection.recorder.streams) {
    // //     connection.recorder.streams = [];
    // //   }

    // //   connection.recorder.streams.push(event.stream);
    // //   recordingStatus.innerHTML = 'Recording ' + connection.recorder.streams.length + ' streams';
    // // }

    // if(event.type === 'local') {
    //   connection.socket.on('disconnect', function() {
    //     if(!connection.getAllParticipants().length) {
    //       location.reload();
    //     }
    //   });
    // }
}

connection.onstreamended = function(event) {
    //$("#videos-container").empty()
    var mediaElement = document.getElementById(event.streamid);
    // .id==connection.setHost.id) { 
    //     //host left  end the meeting now for all
    //     connection.attachStreams.forEach(function(stream) {
    //         stream.stop();
    //     });
    // //     connection.getAllParticipants().forEach(function(participant) {
    // //         connection.disconnectWith( participant );
    // //    });
       

    //     $("#videos-container").empty()
    //     //alert("Host has ended the meeting!")
        

    // }else{
    //     mediaElement.parentNode.removeChild(mediaElement);


    // }

    if (mediaElement){
        mediaElement.parentNode.removeChild(mediaElement);

    }

  };
  

  connection.onPeerStateChanged = function(state) {
    
    if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
        console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
    }
};


});


// connection.getAllParticipants().forEach(function(pid) {
//   var userObject = connection.peers[pid];
//   var nativePeer = userObject.peer;
//   nativePeer.getSenders().forEach(function(sender) {
//       if(sender.track.kind === 'video') {
//            sender.removeTrack(sender.track);

//            // you can also check for track.id
//            // if(sender.track.id === 'stream-id-or-track-id') {}
//       }
//   });
// });

function showLocalVideo(event){

 event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }

    if(event.type === 'local') {
      video.volume = 0;
      try {
          video.setAttributeNode(document.createAttribute('muted'));
      } catch (e) {
          video.setAttribute('muted', true);
      }
    }
    video.srcObject = event.stream;

    var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
    var mediaElement = getHTMLMediaElement(video, {
        //title: event.userid,
        buttons: ['mute-audio'],
        width: width,
        showOnMouseEnter: true
    });

    connection.videosContainer.appendChild(mediaElement);

 
    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;


}


