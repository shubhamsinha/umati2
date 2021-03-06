var socket;
var name;
$(document).ready(function(){
    name = Math.random().toString(36).substring(10);

    // start the socket.io connection and set up the handlers
    socket = io.connect('http://' + window.location.host);
    socket.on('connect', function(){
        $('div#message').html('Controller connected to server');
        socket.emit('newPlayer', {title: 'Multipong', name: name});
    });
    socket.on('playerConnected', function(data){
        if(data.error){
            $('div#message').html('Error: ' + data.error);
            socket.disconnect();
        }else{
            $('div#message').html(data.title + ' controller connected to display as player ' + name);
        }
    });
    initKey();
    initSlider();
});

function keyHandler(event) {
    var deltaY = 0;
    switch(parseInt(event.keyCode)){
        case 38: //up arrow
            deltaY = -1;
            break;
        case 40:  //down arrow
            deltaY = 1;
            break;
        case 0:
            if(event.charCode == 112) socket.emit('pause');
            break;
        default:
            return;
    }
    if(deltaY != 0){
        socket.emit('move', {y: deltaY});
    }
}

function initKey()
{
    window.addEventListener('keydown', keyHandler, true);
}

function sliderHandler(event, ui) {
    console.log(ui.value);
    socket.emit('slide', {value: ui.value});
}

function initSlider()
{
    $( "div#slider" ).on('slidechange', sliderHandler);
}