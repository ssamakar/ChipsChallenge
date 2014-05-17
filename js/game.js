var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var timeCheck;

function create() {
	timeCheck = game.time.now;
	game.world.setBounds(0, 0, 600, 600);

	//Ground and Platforms

	//this loads a physics system into the game.
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//this adds the Sky background. it comes first because everything 
	//else is gonna be overlayed on top.
	//the 0,0 args place the 'sky' image in the upper left corner of the screen.
	game.add.sprite(0,0,'sky');

	//by making the platforms variable a group via game.add.group(),
	//we can make changes to every object in the group at once.
	platforms = game.add.group();
	//enableBody gives the objects in the group mass,
	//so that we can collide and interact with them.
	platforms.enableBody = true;

	//game.world.height-64 is an argument just like the 0,0 we put in
	//for game.add.sprite up there. it's telling Phaser that the position 
	//on the Y axis of this element should be 64px less than the total
	//height of the game world. 
	var ground = platforms.create(0, game.world.height-64, 'ground');
	ground.scale.setTo(2,2);
	//setting the ground to immovable will prevent it from moving when we collide with it.
	ground.body.immovable = true;

	//more ledges being added here. they use the same image as the ground does.
	//that's why the third argument in each function is called 'ground'.
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;
	// ledge.body.gravity.y=1000;


	//Adding Players!

	player = game.add.sprite(game.world.width/2, game.world.height/2, 'dude');
	game.physics.arcade.enable(player);

	player.body.collideWorldBounds = true;

	player.gravity = 200;

	//Animations for walking. We define em here but we don't call em till later.
	player.animations.add('left', [0,1,2,3], 10, true);
	player.animations.add('right', [5,6,7,8], 10, true);

	// player.fixedToCamera = true;
	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

	//this next line returns a function any time a key is pressed.
	//use it in conjunction with the movement logic to possibly refactor it
	//into one function instead of a bunch of repetetive statements.
	// game.input.keyboard.onDownCallback = function(){console.log('hi')};
	// var checker = (game.time.now - timeCheck > 170);

}

function update() {

	//check for collisions
	game.physics.arcade.collide(player, platforms);

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
	// 	// test for 3 second delay
	// if (game.time.now - timeCheck > 2000)
	// {
	// //3 seconds have elapsed, so safe to do something
	// console.log("time");
	// timeCheck = game.time.now;
	// }
	// else
	// {
	// //still waiting
	// }




	//can we wrap this in a function? lots of repetition here...
	if (cursors.left.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.x -= 32;
		timeCheck = game.time.now;
	} else if (cursors.right.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.x += 32;
		timeCheck = game.time.now;
	} else if (cursors.up.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.y -= 32;
		timeCheck = game.time.now;
	} else if (cursors.down.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.y += 32;
		timeCheck = game.time.now;
	} else {
		player.animations.stop();
		player.frame = 4;
	}

	//jumping!
	// if (cursors.up.isDown && player.body.touching.down){
	// 	player.body.velocity.y = -400;
	// }

}



