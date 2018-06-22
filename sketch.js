function setup()
{
  createCanvas(640, 480);
	frameRate(60);
}

var currentStrokeWeight = 1;

function draw()
{
	if(mouseIsPressed)
	{
		if (mouseButton === LEFT)
		{
			fill(255,255,0);
			ellipse(mouseX, mouseY, 80, 80);
		}
		if (mouseButton === CENTER)
		{
			clear();
		}
	}
}

function mouseWheel(event)
{
	currentStrokeWeight -= event.delta;
	if(currentStrokeWeight < 0)
		currentStrokeWeight = 0;
	strokeWeight(currentStrokeWeight);
	console.log('Stroke Weight set to: ' + currentStrokeWeight);
}