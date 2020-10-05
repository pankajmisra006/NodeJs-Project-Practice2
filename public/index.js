
// var _videoGrid=$('#videos-container')
// var _myVideo = document.createElement('video')
// _myVideo.muted = true;





var connection = new RTCMultiConnection();

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
  urls: 'stun:stun.l.google.com:19302'
});

// last step, set TURN url (recommended)
connection.iceServers.push({
  
urls: 'turn:numb.viagenie.ca',
credential: 'muazkh',
username: 'webrtc@live.com'

});


 
$( document ).ready(function() {

console.log(connection)
$('#open-room').on('click',function(){

    connection.open($('#room-id').val(), function(isRoomExist, roomid) {
        if (isRoomExist === true) {
        } else {
            
        }
    });
   

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
    var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

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
      
        width: width,
        showOnMouseEnter: false
    });

    connection.videosContainer.appendChild(mediaElement);

    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;

    // to keep room-id in cacheconnectToNewUser
    localStorage.setItem(connection.socketMessageEvent, connection.sessionid);

    chkRecordConference.parentNode.style.display = 'none';

    // if(chkRecordConference.checked === true) {
    //   btnStopRecording.style.display = 'inline-block';
    //   recordingStatus.style.display = 'inline-block';

    //   var recorder = connection.recorder;
    //   if(!recorder) {
    //     recorder = RecordRTC([event.stream], {
    //       type: 'video'
    //     });
    //     recorder.startRecording();
    //     connection.recorder = recorder;
    //   }
    //   else {
    //     recorder.getInternalRecorder().addStreams([event.stream]);
    //   }

    //   if(!connection.recorder.streams) {
    //     connection.recorder.streams = [];
    //   }

    //   connection.recorder.streams.push(event.stream);
    //   recordingStatus.innerHTML = 'Recording ' + connection.recorder.streams.length + ' streams';
    // }

    if(event.type === 'local') {
      connection.socket.on('disconnect', function() {
        if(!connection.getAllParticipants().length) {
          location.reload();
        }
      });
    }
}

connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
  };
  


});


function addVideoStream(video, stream,streamid) {
    video.srcObject = stream
    video.setAttribute("id", streamid);
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    _videoGrid.append(video)
  }

