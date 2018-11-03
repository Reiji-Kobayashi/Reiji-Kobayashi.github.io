let localStream = null;
let peer = null;
let existingCall = null;

let constraints = {
    video: {},
    audio: true
};
constraints.video.width = {
    min: 320,
    max: 320
};
constraints.video.height = {
    min: 240,
    max: 240
};

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
      // Success
    	$('#my-video').get(0).srcObject = stream;
      localStream = stream;
    }).catch(function (error) {
    	// Error
    	console.error('mediaDevice.getUserMedia() error:', error);
    	return;
		});

peer = new Peer({
	key: '084fb3fd-aa38-4399-860a-0d6556715b69',
	debug: 3
});


peer.on('open', function(){
	$('#my-id').text(peer.id);
});

peer.on('error', function(err){
	alert(err.message);
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
	e.preventDefault();
  let roomName = $('#join-room').val();
  if (!roomName) {
      return;
  }
  const call = peer.joinRoom(roomName, {mode: 'sfu', stream: localStream});
  setupCallEventHandlers(call);
});

$('#end-call').click(function(){
  existingCall.close();
});

peer.on('call', function(call){
  call.answer(localStream);
  setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
	if (existingCall) {
		existingCall.close();
	};

	existingCall = call;
    setupEndCallUI();
    $('#room-id').text(call.name);

    call.on('stream', function(stream){
        addVideo(stream);
    });

    call.on('peerLeave', function(peerId){
        removeVideo(peerId);
    });

    call.on('close', function(){
        removeAllRemoteVideos();
        setupMakeCallUI();
    });
}

function addVideo(call,stream){
	const videoDom = $('<video autoplay>');
	videoDom.attr('id',stream.peerId);
	videoDom.get(0).srcObject = stream;
	$('.videosContainer').append(videoDom);
}

function removeVideo(peerId){
     $('#' + peerId).remove();
}

function removeAllRemoteVideos(){
    $('.videosContainer').empty();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
