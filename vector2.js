var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.set = function(_x,_y)
{
	this.x = _x;
	this.y = _y;
}

Vector2.prototype.add = function(other)
{
	if(typeof(other)==typeof(this))
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}
	return null;
}

Vector2.prototype.minus = function(other)
{
	if(typeof(other)==typeof(this))
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}
	return null;
}

Vector2.prototype.multiply = function(scaler)
{
this.x *= scaler;
this.y *= scaler;
return this;
}