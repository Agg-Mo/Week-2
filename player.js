var METER = TILE;

var GRAVITY = METER * 9.8 * 3;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;

var JUMP = METER * 500000;

var player = function ()
{
	this.image = document.createElement("img");
	
	this.x = 0 * TILE;
	this.y = 9 * TILE;
	
	this.width = 159;
	this.height = 163;
	
	this.velocity_x = 0;
	this.velocity_y = 0;
	
	this.falling = true;
	this.jumping = true;
	
	this.image.src = "hero.png";
} 

player.prototype.update = function(deltaTime)
{
	var left, right, jump;
	left = right = jump = false;

	if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		left = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		right = true;
	}
	if (keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		jump = true;
	}
	
	var wasleft = this.velocity_x < 0;
	var wasright = this.velocity_x > 0;
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if(left)
		ddx = ddx - ACCEL
	else if (wasleft)
		ddx = ddx + FRICTION
	
	if(right)
		ddx = ddx + ACCEL
	else if (wasright)
		ddx = ddx - FRICTION
	
	if(jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;
		this.jumping = true;
	}
	

	
	this.x = Math.floor(this.x +(deltaTime * this.velocity_x));
	this.y = Math.floor(this.y +(deltaTime * this.velocity_y));
	this.velocity_x = bound(this.velocity_x + (deltaTime * ddx), -MAXDY, MAXDX)
	this.velocity_y = bound(this.velocity_y + (deltaTime * ddy), -MAXDY, MAXDY)	
	
		if ((wasleft &&(this.velocity_x > 0)) || 
		(wasright && (this.velocity_x < 0)))
	{
		this.velocity_x = 0;
	}
	
	var tx = pixelToTile(this.x);
	var ty = pixelToTile(this.y);
	var nx = (this.x) % TILE;
	var ny = (this.y) % TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

	if (this.velocity_y > 0)
	{
		if((celldown && !cell) || (celldiag && !cellright && nx))
		{
			this.y = tileToPixel(ty);
			this.velocity_y = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;
		}
	}
	else if (this.velocity_y < 0)
	{
		if((cell && !celldown) || (cellright&& !celldiag &&nx))
		{
			this.y = tileToPixel(ty + 1);
			this.velocity_y = 0;
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	
	if (this.velocity_x > 0)
	{
		if((cellright&& !cell) ||(celldiag && !celldown && ny))
		{
			this.x = tileToPixel(tx)
			this.velocity_x = 0;
		}
	}
	else if (this.velocity_x < 0)
	{
		if((cell && !cellright) || (celldown && !celldiag && ny))
		{
			this.x = tileToPixel(tx + 1)
			this.velocity_x = 0;
		}
	}
}

player.prototype.draw = function(_cam_x, _cam_y)
{
	context.save();
		context.translate(this.x - _cam_x, this.y - _cam_y);
		context.drawImage(this.image, -55, -87);
	context.restore();
}