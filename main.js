var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var background = document.createElement("img")
background.src = "background.png"
var death_background = document.createElement("img")
death_background.src = "death_background.png"
var win_background = document.createElement("img")
win_background.src = "win_background.png"



var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_GAMEWIN = 3;
var splashTimer = 4;
var gameState = STATE_SPLASH;


function runSplash(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height)
	
	context.fillStyle = "#000";
	context.font = "24px Arial";
	context.fillText("Wanna play a Game?", 220, 200);
	
	context.font = "17px Arial";
	context.fillText("Press Space To Play Game", 227, 240);
	
	context.font = "15px Arial";
	context.fillText("WARNING: you need to be moving to shoot", 200, 270);
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && (gameState == STATE_SPLASH))
	{
		gameState = STATE_GAME;
		return;
	}
}

function runGame (deltaTime) 
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height)
	
	var wanted_cam_x;
	var wanted_cam_y;
	
	wanted_cam_x = player.x - SCREEN_WIDTH/2;
	wanted_cam_y = player.y - SCREEN_HEIGHT/2;
	
	if(wanted_cam_x < 0)
		wanted_cam_x = 0;
	if(wanted_cam_y < 0)
		wanted_cam_y = 0;
	
	if(wanted_cam_x > MAP.tw * TILE - SCREEN_WIDTH)
		wanted_cam_x = MAP.tw * TILE - SCREEN_WIDTH;
	if(wanted_cam_y > MAP.th * TILE - SCREEN_HEIGHT)
		wanted_cam_y = MAP.th * TILE - SCREEN_HEIGHT;
	
	cam_x = Math.floor(lerp(0.5, cam_x, wanted_cam_x));
	cam_y = Math.floor(lerp(0.5, cam_y, wanted_cam_y))
	
	drawMap(cam_x, cam_y);

	player.update(deltaTime);
	player.draw(cam_x, cam_y);
	
	//example_emitter.update(deltaTime)			//Emitter
	//example_emitter.draw(cam_x, cam_y)

	if (player.x < canvas.height)
		player.LIVES == player.LIVES - 1
}


function runGameOver(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(death_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "40px Arial";
	context.fillStyle = "white";
	context.fillText("GAME OVER", 200, 200);
	
	context.font = "20px Arial";
	context.fillStyle = "white";
	context.fillText("OH NO! Chuck fell, thats not good..", 180, 220);
	
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Press Space to Restart", 260, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && (gameState == STATE_GAMEOVER))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 3;
			player.x = player.respawn_x;
			player.y = player.respawn_y;
			return;
		}
}


function runGameWin(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(win_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "25px Arial";
	context.fillStyle = "white";
	context.fillText("WELL DONE, Chuck is impressed", 150, 150);
	
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Press Space to Play Again", 240, 200);
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) && (gameState == STATE_GAMEWIN))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 3;
			player.x = player.respawn_x;
			player.y = player.respawn_y;
			return;
		}
}

function lerp(value, min , max)
{
	return value * min + value * max
}

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var background_sound = new Howl(
{
	urls: ["background.ogg"],
	loop: true,
	buffer: true,
	volume: 0.5,
});
background_sound.play();

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


function initialize(input_level)
{
	var return_cells = [];
	
	for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		return_cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < input_level.layers[layerIdx].height; y++)
		{
			return_cells[layerIdx][y] = [];
			for(var x = 0; x < input_level.layers[layerIdx].width; x++)
			{
				if(input_level.layers[layerIdx].data[idx] != 0)
				{
					return_cells[layerIdx][y][x] = 1;
					return_cells[layerIdx][y][x+1] = 1;
					
					if (y != 0)
					{
						return_cells[layerIdx][y-1][x] = 1;
						return_cells[layerIdx][y-1][x+1] = 1;
					}
				}
				else if(return_cells[layerIdx][y][x] != 1)
				{
					return_cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
	return return_cells;
} 

var cells = initialize(level);



var keyboard = new keyboard();
var player = new player();

var cam_x = 0;
var cam_y = 0;

//var example_emitter = new Emitter();
//
//example_emitter.Initialise(200, 200, 1, 0, 3000, 0.5, 50, 0.5, true)

function run()
{
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
		case STATE_GAMEWIN:
			runGameWin(deltaTime);
			break;
	}
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
