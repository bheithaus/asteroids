function Controller(canvas) {
  this.ctx = canvas.getContext('2d');
  this.game = new Game(700);
  this.bgIMG = new Image();
  this.bgIMG.src = 'images/stars.jpg';
  this.asteroidIMG = new Image();
  this.asteroidIMG.src = 'images/asteroid01.png';
  this.shipIMG = new Image();
  this.shipIMG.src = 'images/ship.png';
}

Controller.prototype.render = function() {
  this.clear();
  this.drawBackground();
  this.renderBullets();
  this.renderShip();
  this.renderAsteroids();
};

Controller.prototype.addEventHandler = function() {
  var controller = this;
  $('html').keydown(function (event) {
      controller.startTurn(event.keyCode);
  });
  $('html').keyup(function (event) {
      controller.stopTurn(event.keyCode);
  });
};

Controller.prototype.startTurn = function(keyCode) {
  switch (keyCode) {
    case (37):
    //console.log("left");
      this.game.ship.turning = -1;
      break;
    case (38):
    //console.log("accelerate");
      this.game.ship.accelerating = true;
      break;
    case (39):
    //console.log("right");
      this.game.ship.turning = 1;
      break;
    case (32):
    // console.log("firing!!");
      this.game.ship.firing = true;
      break;
  }
};

Controller.prototype.stopTurn = function(keyCode) {
  switch (keyCode) {
    case (37):
      this.game.ship.turning = 0;
      break;
    case (38):
      this.game.ship.accelerating = false;
      break;
    case (39):
      this.game.ship.turning = 0;
      break;
    case (32):
      this.game.ship.firing = false;
      break;
  }
};

Controller.prototype.drawCircle = function(obj, color) {
  var ctx = this.ctx;
  ctx.beginPath();
  ctx.arc(obj.position[0],
          obj.position[1],
          obj.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
};

Controller.prototype.renderShip = function() {
  var img = this.shipIMG,
    ctx = this.ctx,
	ship = this.game.ship;
 
  var r = ship.radius * 3;
  var x = ship.position[0] - r/2;
  var y = ship.position[1] - r/2;
  var rad = ship.direction + Math.PI/2;
  helpers.drawImageRotated(ctx, img, x, y, r, r, rad);
};

Controller.prototype.drawAsteroid = function(asteroid) {
	var ctx = this.ctx;
	var img = this.asteroidIMG;
	var x = asteroid.position[0];
	var y = asteroid.position[1];
	var r = asteroid.radius;
	ctx.drawImage(img, x, y, r, r);
}

Controller.prototype.renderAsteroids = function() {
  var asteroids = this.game.asteroids;
  var img = new Image();
  
  img.src = 'images/asteroid01.png';
  for (var i = 0; i < asteroids.length; i++) {
	  this.drawAsteroid(asteroids[i]);
		//this.drawCircle(asteroids[i], asteroids[i].color);
  }
};

Controller.prototype.renderBullets = function() {
  var bullets = this.game.bullets;
  for (var i = 0; i < bullets.length; i++) {
    this.drawCircle(bullets[i], "red");
  }
};

Controller.prototype.drawPrompt = function(text, color) {
  var ctx = this.ctx;
  ctx.font = "bold 20px zapfino";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, this.game.length/2, this.game.length/2);
};

Controller.prototype.bindClickHandler = function() {
  var controller = this;
  $('html').on('click', function() {
    controller.reset();
    $(this).off('click');
	controller.animLoop();
  });
};

Controller.prototype.reset = function() {
  this.game = new Game(700);
  this.game.spawnAsteroids(10);
};


Controller.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.game.length, this.game.length);
};

Controller.prototype.drawBackground = function() {
  var ctx = this.ctx;
  var bg = this.bgIMG;
  ctx.drawImage(bg, 0, 0, this.game.length, this.game.length );
}

Controller.prototype.animLoop = function() {
  var controller = this;
  if (controller.game.alive) {
    window.requestAnimFrame(controller.animLoop.bind(controller));
    controller.game.update();
    controller.render();
  } else {
    controller.bindClickHandler();
    controller.drawPrompt("Good Game!", 'white');
  }
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 500 / 60);
          };
})();

$(function() {
  var canvas = $('<canvas width="'+ 700 +'" height="'+ 700 +'"></canvas>');
  canvas.appendTo($('body'));
  var controller = new Controller(canvas.get(0));
  controller.game.spawnAsteroids(10);
  controller.addEventHandler();
  controller.animLoop();
});
