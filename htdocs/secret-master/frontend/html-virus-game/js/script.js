var gameIntro = document.getElementById('game-intro');
var playerName = document.getElementById('txtplayername');
var startButton = document.getElementById('start-button');
var resetButton = document.getElementById('reset-button');
var tryAgain = document.getElementById('cobalagi-button');
var btnD = document.getElementById('btn-d');
var btnF = document.getElementById('btn-f');
var btnJ = document.getElementById('btn-j');
var btnK = document.getElementById('btn-k');
var trackHeight = parseInt(document.getElementById('piano-track1').offsetHeight);
var startTime = 0; 
var virus = [];
var tick = 100;
var gamePlay = 0;
var lastTick = 0;
var score = 0;
var totalNote = 0;
var fail = 0;
var bgMusic = new Audio('./media/bgmusic.mp3');
bgMusic.volume = 1;
var shotMusic = new Audio('./media/shoteffect2.wav');
bgMusic.volume = 1;
var animationTime = 6000;

startButton.addEventListener('click', function(){
	if(playerName.value == ''){
		alert('Silahkan isi nama pemain dulu!');
		playerName.focus();
	}else{
		prepareGame();
		startGame();
		startStopwatch();

		bgMusic.play();
		startButton.classList.add('hide');
		gameIntro.classList.add('game-started');
		document.getElementById('lblplayername').innerHTML = playerName.value;
	}
});

resetButton.addEventListener('click', function(){
	location.reload();
});

tryAgain.addEventListener('click', function(){
	startTime = 0; 
	virus = [];
	tick = 100;
	gamePlay = 0;
	lastTick = 0;
	score = 0;
	totalNote = 0;
	fail = 0;
	document.getElementById('game-end').classList.remove('active');
	document.getElementById('piano-checkbox').innerHTML = '';
    document.getElementById('piano-track1').innerHTML = '';
    document.getElementById('piano-track2').innerHTML = '';
    document.getElementById('piano-track3').innerHTML = '';
    document.getElementById('piano-track4').innerHTML = '';
    document.getElementById('percentage-text').innerHTML = 0;
    document.getElementById('fail-text').innerHTML = 0;

    prepareGame();
	startGame();
	bgMusic.play();
	resetStopwatch();
	startStopwatch();
});

function prepareGame(){
	for(var x=0; x<20; x++){
		var ranPosisiNote = Math.floor(Math.random() * 4) + 1;
		startTime += (Math.floor(Math.random() * 2) + 1) * 1000;
		
		virus.push({"note":ranPosisiNote, "time": startTime});
	}

	totalNote = virus.length;
}

function startGame(){
	var labels = {'label1':[], 'label2':[], 'label3':[], 'label4':[]};
    var checkboxes = [];

    virus.forEach(function(currentValue, index, arr){
    	var noteItem = currentValue;
    	var notePosition = noteItem.note;
    	var time = noteItem.time;
    	// var delay = currentTime + 0.5;

    	var label = '<label id="pianonote'+ time +'" class="piano-note" for="note'+ time +'" data-time="'+ time +'"></label>';
    	var labelPos = 'label'+notePosition;
    	labels[labelPos].push(label);
    	checkboxes.push('<input type="checkbox" id="note'+ time +'" name="note">');

    	if(index == virus.length-1){
    		lastTick = time;
    	}

    	// currentTime = time;
    })

    document.getElementById('piano-checkbox').innerHTML = checkboxes.join('');
    document.getElementById('piano-track1').innerHTML = labels['label1'].join('');
    document.getElementById('piano-track2').innerHTML = labels['label2'].join('');
    document.getElementById('piano-track3').innerHTML = labels['label3'].join('');
    document.getElementById('piano-track4').innerHTML = labels['label4'].join('');

    gamePlay = setInterval(startVirus, 100);
}

btnD.addEventListener('click', function(){
	hitTheNote('piano-track1');
});
btnF.addEventListener('click', function(){
	hitTheNote('piano-track2');
});
btnJ.addEventListener('click', function(){
	hitTheNote('piano-track3');
});
btnK.addEventListener('click', function(){
	hitTheNote('piano-track4');
});

document.addEventListener('keydown', (event) => {
  var keyCode = event.keyCode;

  switch(keyCode){
  	case 68:
		hitTheNote('piano-track1');
	break;
	case 70:
		hitTheNote('piano-track2');
	break;
	case 74:
		hitTheNote('piano-track3');
	break;
	case 75:
		hitTheNote('piano-track4');
	break;
  }

}, false);

function startVirus(){
	if(!!document.getElementById('pianonote'+tick)){
		document.getElementById('pianonote'+tick).classList.add('active');
	}

	//cek for failed
	var pianoNotesObj = document.getElementsByClassName("piano-note active");
	for(var x=0; x<pianoNotesObj.length; x++){
		if(parseInt(pianoNotesObj[x].offsetTop) > trackHeight){
			if(!pianoNotesObj[x].classList.contains('hit')){
				var curNote = pianoNotesObj[x].getAttribute('data-time');
				document.getElementById('note'+curNote).classList.add('failed-hit');
			}
		}
	}

	var checkObj = document.getElementsByClassName('failed-hit');
	if(!!checkObj){
		fail = checkObj.length;
		document.getElementById('fail-text').innerHTML = fail;
	}

	if(tick > lastTick + (animationTime - 500)){ //angka adalah nilai animasi dr atas ke bawah
		gameEnd();
	}

	tick += 100;
}

function hitTheNote(trackNote){
	var trackObject = document.getElementById(trackNote);
	if(!!trackObject){
		var notes = trackObject.getElementsByClassName("piano-note");

		for(var x=0; x<notes.length; x++){
			var timeData = parseInt(trackObject.getElementsByClassName("piano-note")[x].getAttribute('data-time'));
			var timeDataWithDuration = timeData + (animationTime - 1000);
			var toleranceUp = timeDataWithDuration + 50;
			var toleranceDown = timeDataWithDuration - (0.27 * animationTime); //27% dari total lama animasi 6 detik (6000)

			if(tick<=toleranceUp && tick>=toleranceDown){
				if(!trackObject.getElementsByClassName("piano-note")[x].classList.contains('hit')){
					trackObject.getElementsByClassName("piano-note")[x].classList.add('hit');
					document.getElementById('note'+timeData).checked = true;
					updateScore();

					if(isPlaying(shotMusic)){
						stopSound(shotMusic);
						shotMusic.play();
					}else{
						shotMusic.play();
					}

					//cek apakah virus terakhir
					if(parseInt(trackObject.getElementsByClassName("piano-note")[x].getAttribute('data-time')) == lastTick){
						gameEnd();
					}
				}
			}
		}
	}
}

function updateScore(){
	score++;
	// var percentage = (score / totalNote * 100).toFixed(2);
	document.getElementById('percentage-text').innerHTML = score;
}

function isPlaying(audelem) {
	return !audelem.paused;
}

function stopSound(audelem){
	audelem.pause();
	audelem.src = audelem.src;
}

function gameEnd(){
	clearInterval(gamePlay);
	stopStopwatch();
	waktu = document.getElementById('time-elapsed-text').innerHTML;
	document.getElementById('end-waktu').innerHTML = waktu;
	document.getElementById('end-skor').innerHTML = score;
	document.getElementById('end-gagal').innerHTML = fail;	
	document.getElementById('game-end').classList.add('active');
	stopSound(bgMusic);
}