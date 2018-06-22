var currentStrokeWeight = 0;
const canvasHeight = 960, canvasWidth = 1280, canvasMarginHorizontal = canvasWidth / 8, canvasMarginVertical = canvasHeight / 8, brickViewPort = {width: canvasWidth - canvasMarginHorizontal, height: canvasHeight - canvasMarginVertical}, scoreBoxHeight = 50;
const squareWidth = 50;
const barWidth = 200, barHeight = 50;
const brickWidth = 100, brickHeight = 50;
const initialVelocity = 10;
var xPosSqr = 40, yPosSqr = 460, xPosBar = 0, xVelSqr = 0, yVelSqr = 0, pauseVelBufferX = 10, pauseVelBufferY = 10, pauseCooldown = 0, barCollisionCooldown = 0, brickCollisionCooldown = 0;
const yPosBar = canvasHeight - (canvasHeight / 5);
var xPosPastSqr = [], yPosPastSqr = [], xPosPastBar = [], yPosPastBar = [];
var tailLengthSqr = 20, tailLengthBar= 5;
xPosPastSqr = Array(tailLengthSqr);
yPosPastSqr = Array(tailLengthSqr);
xPosPastBar = Array(tailLengthSqr);
yPosPastBar = Array(tailLengthSqr);
var messageX = canvasWidth / 3, messageY = canvasHeight /2;
var gameOver = false, allBricksCleared = false, isPaused = false, playerScore = 0;

function setup()
{
  createCanvas(canvasWidth, canvasHeight);
	background(51);
	frameRate(60);
	noCursor();
	strokeWeight(currentStrokeWeight);
	
	//Draw Score area
	fill(35);
	rect(0, 0, canvasWidth, scoreBoxHeight);
	textSize(32);
	fill('rgba(255,127,0,1)');
	text('Score: 0', 10, 35);
	
	//Draw Bricks
	for(i=0; i<bricks.length; i++)
	{
		fill('rgba(255,63,0, ' + 1 + ')');
		rect(bricks[i].x, bricks[i].y, brickWidth, brickHeight);
	}
	
	//Draw Title Screen
	textSize(32);
	fill('rgba(255,127,0,1)');
	text('BREAKOUT \(Left Click to start\)', messageX, messageY );
}

function draw()
{
	//----------------------------------UX HANDLING----------------------------------------------------------------------------------------------------
		
		
	if (mouseIsPressed)
	{
		if (mouseButton === LEFT && pauseCooldown == 0 && !gameOver && !allBricksCleared)
		{
			pauseCooldown = 20;
			if(xVelSqr != 0 && yVelSqr !=0)
			{
				isPaused = true;
				textSize(32);
				fill('rgba(255,127,0,1)');
				text('PAUSED \(Left Click to unpause\)', messageX, messageY);
				pauseVelBufferX = xVelSqr;
				pauseVelBufferY = yVelSqr;
				xVelSqr = yVelSqr = 0;
			}else
			{
				isPaused = false;
				fill(51);
				rect(messageX - 150, messageY - 75, 800, 300 );
				xVelSqr = pauseVelBufferX;
				yVelSqr = pauseVelBufferY;
			}
		}
	}
	
	if(!gameOver && !isPaused && !allBricksCleared)
	{
		//----------------------------------POSITIONAL CALCULATIONS----------------------------------------------------------------------------------------
		
		//shift the past positions
		for(i=tailLengthSqr; i>0; i--)
		{
			xPosPastSqr[i] = xPosPastSqr[i-1];
			yPosPastSqr[i] = yPosPastSqr[i-1];
		}
		
		for(i=tailLengthBar; i>0; i--)
		{
			xPosPastBar[i] = xPosPastBar[i-1];
			yPosPastBar[i] = yPosPastBar[i-1];
		}
		
		//store last frame's position
		xPosPastSqr[0] = xPosSqr;
		yPosPastSqr[0] = yPosSqr;
		xPosPastBar[0] = xPosBar;
		yPosPastBar[0] = yPosBar;
		
		//horizontal bounce
		if((xPosSqr + squareWidth >= canvasWidth) || (xPosSqr <= 0))
		{
			//console.log('horizontal collision');
			xVelSqr *= -1;
		}
		
		//Top bounce
		if(yPosSqr <= scoreBoxHeight)
		{
			yVelSqr *= -1;
		}
		
		if(yPosSqr + squareWidth >= canvasHeight)
		{
			gameOver = true;
			textSize(32);
			fill('rgba(255,127,0,1)');
			text('WHAT A TERRIBLE PLAYER!', messageX, messageY);
			
		}
		
		//Collision detection between block and bar
		if(barCollisionCooldown == 0)
		{
			if(yPosSqr >= yPosBar - barHeight &&
				 yPosSqr <= yPosBar &&
				 xPosSqr + squareWidth >= xPosBar &&
				 xPosSqr <= xPosBar + barWidth)
			{
				barCollisionCooldown = 10;
				yVelSqr *= -1
			}
		}
		
		
		//Collision detection between bar and bricks
		if(yPosSqr <= brickViewPort.height + (canvasMarginVertical / 2) && brickCollisionCooldown == 0)
		{
			for(i = 0; i < bricks.length; i ++)
			{
				if(bricks[i].exists && brickCollisionCooldown == 0)
				{
					if(xPosSqr + squareWidth >= bricks[i].x && xPosSqr <= bricks[i].x + brickWidth && yPosSqr + squareWidth >= bricks[i].y && yPosSqr <= bricks[i].y + brickHeight)
					{
						//Top
						if(yPosSqr + squareWidth * .6667 < bricks[i].y && xPosSqr + squareWidth > bricks[i].x && xPosSqr < bricks[i].x + brickWidth)
						{
							console.log('collision from Top');
							brickCollisionCooldown = 3;
							yVelSqr *= -1;
						}
						
						//Bottom
						else if(yPosSqr > bricks[i].y + brickHeight * .6667 && xPosSqr + squareWidth > bricks[i].x && xPosSqr < bricks[i].x + brickWidth)
						{
							console.log('collision from Bottom');
							brickCollisionCooldown = 3;
							yVelSqr *= -1;
						}else //Sides
						{
							brickCollisionCooldown = 3;
							xVelSqr *= -1;
						}
						
						playerScore += bricks[i].pointValue;
						fill(35);
						rect(10, 8, 240, 30)
						fill('rgba(255,127,0,1)');
						text('Score: ' + playerScore, 10, 35);
						console.log('Player Score: ' + playerScore);
						bricks[i].exists = false;
						
						fill(51);
						rect(bricks[i].x-10, bricks[i].y-10, brickWidth+20, brickHeight+20);
						
						for(k = 0; k < bricks.length; k ++)
						{
							allBricksCleared = true;
							if(bricks[k].exists)
							{
								allBricksCleared = false;
								break;
							}
						}
						if(allBricksCleared)
						{
							textSize(32);
							fill('rgba(255,127,0,1)');
							text('MISSION COMPLETE!', messageX + 20, messageY);
						}
					}
				}
			}
		}

		//Movement for Square
		xPosSqr += xVelSqr;
		yPosSqr += yVelSqr;
		//Movement for Bar
		xPosBar = mouseX;
		if(xPosBar > canvasWidth - barWidth)
		{
			xPosBar = canvasWidth - barWidth;
		}
		
		//----------------------------------DRAWING--------------------------------------------------------------------------------------------------------
		
		//Clear tail for block
		for(i=1; i<=tailLengthSqr; i++)
		{
			fill('rgba(51,51,51, ' + 1 + ')');
			rect(xPosPastSqr[i-1], yPosPastSqr[i-1], squareWidth, squareWidth);
		}
		//Clear tail for Bar
		for(i=1; i<=tailLengthBar; i++)
		{
			fill('rgba(51,51,51, ' + 1 + ')');
			rect(xPosPastBar[i-1], yPosPastBar[i-1], barWidth, barHeight);
		}
		
		//Tail effect for Square
		var tAlpha;
		for(i=1; i<=tailLengthSqr; i++)
		{
			tAlpha = ((1-((i) / (tailLengthSqr)))/1);
			if(tAlpha < 0)
			{
				tAlpha = 0;
			}
			if(tAlpha > 1)
			{
				tAlpha = 1;
			}
			fill('rgba(255,255,0, ' + tAlpha + ')');
			rect(xPosPastSqr[i-1], yPosPastSqr[i-1], squareWidth, squareWidth);
		}
		
		//Tail effect for Bar
		for(i=1; i<=tailLengthBar; i++)
		{
			tAlpha = ((1-((i) / (tailLengthBar)))/1);
			if(tAlpha < 0)
			{
				tAlpha = 0;
			}
			if(tAlpha > 1)
			{
				tAlpha = 1;
			}
			fill('rgba(255,127,0, ' + tAlpha + ')');
			rect(xPosPastBar[i-1], yPosPastBar[i-1], barWidth, barHeight);
		}
		
		//Draw square
		fill('rgba(255,255,0,1)');
		rect(xPosSqr, yPosSqr, squareWidth, squareWidth);
		
		//4. Player controlled bar
		//Draw bar
		fill('rgba(255,127,0,1)');
		rect(xPosBar, yPosBar, barWidth, barHeight);
	}
	
	//Cooldown resets
		if(pauseCooldown > 0)
		{
			pauseCooldown --;
		}
		if(barCollisionCooldown > 0)
		{
			barCollisionCooldown --;
		}
		if(brickCollisionCooldown > 0)
		{
			brickCollisionCooldown --;
		}
}

function mouseWheel(event)
{
	clear();
	background(51);
	tailLengthSqr -= event.delta;
	if(tailLengthSqr < 1)
	{
		tailLengthSqr = 1;
	}
	xPosPastSqr.fill(-50, tailLengthSqr-1);
	yPosPastSqr.fill(-50, tailLengthSqr-1);
}

function createBricks(columns, rows)
{
	var bricks = [];
	
	for(i = 0; i < columns * rows ; i++)
	{
		bricks[i] =
		{
			x: 0,
			y: 0,
			pointValue: 100,
			exists: true
		}
	}
	
	//Columns
	for(i = 0; i < columns * rows; i ++)
	{
		bricks[i].x = (i % columns)/columns * (canvasWidth - canvasMarginHorizontal) + (canvasMarginHorizontal / 1.36);
		bricks[i].y = ((i / columns) - (i % columns) / columns) * (((canvasHeight / 2) - canvasMarginVertical) / rows) + (canvasMarginVertical / 1.5);
	}
	
	return bricks;
}

const bricks = createBricks(6, 3);