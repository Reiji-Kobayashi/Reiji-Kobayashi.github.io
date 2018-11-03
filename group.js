let localStream = null;
let peer = null;
let existingCall = null;

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

multiparty = new MultiParty({
	key: '084fb3fd-aa38-4399-860a-0d6556715b69',
	debug: 3
});

multiparty.on('open', function(){
	$('#my-id').text(myid);
});

multiparty.on('error', function(err){
	alert(err.message);
});

$('#make-call').submit(function(e){
  e.preventDefault();
  const call = peer.call($('#callto-id').val(), localStream);
  setupCallEventHandlers(call);
});

$('#end-call').click(function(){
  existingCall.close();
});



function setupCallEventHandlers(call){
	if (existingCall) {
		existingCall.close();
	};

  existingCall = call;

  call.on('stream', function(stream){
		addVideo(call,stream);
		setupEndCallUI();
		$('#their-id').text(call.remoteId);
	});

	call.on('close', function(){
			removeVideo(call.remoteId);
			setupMakeCallUI();
	});
}

function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
     $('#' + peerId).remove();
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
