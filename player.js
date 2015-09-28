var player = function ()
{
	this.image = document.createElement("img");
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;
	this.width = 159;
	this.height = 163;
	this.rotation = 0;
	
	this.image.src = "hero.png";
} 

player.prototype.update = function(deltaTime)
{
	if (keyboard.isKeyDown(keyboard.KEY_SPACE))
	{	
		player.rotation += deltaTime
	}
	else
	{
		player.rotation -= deltaTime
	}
}

player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}