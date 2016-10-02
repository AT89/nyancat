//add score function here
function addHighScore(name, score) {
    var obj = { name: name, player_score: score }
    // console.log(obj)
    $.ajax({
      url: "https://nyancatscores.herokuapp.com/scores",
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      dataType: 'json',
      data: obj,
      crossDomain: true,
      success: function(data, textStatus, jqXHR) {
        // console.log(data)
        // console.log("JSON POST FIRE!!!")
        console.log("HIGH SCORE SUBMITTED NYAAAAA")
      },
      error: function(data, textStatus, jqXHR) {
        console.log("It no work ):")
      }
    });
}


var playState = {
  ////////////////////CREATE////////////////////////
  create: function()  {
    //create the background
    var bgrandom = this.rnd.integerInRange(1,15);
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background'+bgrandom);
    this.background.autoScroll(-80, 0);

    //creating the tail first so the cat can go ontop of the tail
    this.tailPool = this.add.group();
    this.tailPool.enableBody = true;
    this.tailPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.tailPool.createMultiple(50, 'nyantail');
    this.tailPool.setAll('anchor.x', 0.5);
    this.tailPool.setAll('anchor.y', 0.5);
    this.tailPool.setAll('outOfBoundsKill', true);
    this.tailPool.setAll('checkWorldBounds', true);

    //create nyan-cat
    var catrandom = this.rnd.integerInRange(3,3);
    if (catrandom == 1){
      this.player = this.add.sprite(64, 220, 'player1');
      this.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.anchor.setTo(0.5, 0.5);
      this.player.animations.add('wiggle', [0, 1, 2, 3, 4], 10, true);
      this.player.animations.play('wiggle')
      this.player.body.collideWorldBounds = true; //make it so player cant go outside edge** for now..
      this.player.body.setSize(20, 20, 35, 5);
    }
    else if (catrandom == 2){
      this.player = this.add.sprite(64, 220, 'player2');
      this.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.anchor.setTo(0.5, 0.5);
      this.player.animations.add('wiggle', [ 0, 1, 2, 3], 10, true);
      this.player.animations.play('wiggle')
      this.player.body.collideWorldBounds = true; //make it so player cant go outside edge** for now..
      this.player.body.setSize(25, 20, 35, 5);
    }
    else if (catrandom == 3){
      this.player = this.add.sprite(64, 220, 'player3');
      this.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.anchor.setTo(0.5, 0.5);
      this.player.animations.add('wiggle', [ 0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14], 10, true);
      this.player.animations.play('wiggle')
      this.player.body.collideWorldBounds = true; //make it so player cant go outside edge** for now..
      this.player.body.setSize(25, 25, 35, 5);
    }

    //grouping is necessary to adhere to memory leaks and reuse sprites, for time & memory, as well as giving it all properties
    //nyan-cat pew pew
    this.beamPool = this.add.group();
    this.beamPool.enableBody = true;
    this.beamPool.physicsBodyType = Phaser.Physics.ARCADE;
    //limit to only 100 beams on screen at once
    this.beamPool.createMultiple(100, 'beam');
    this.beamPool.setAll('anchor.x', 0.5);
    this.beamPool.setAll('anchor.y',0.5);
    // Automatically kill the beam sprites when they go out of bounds
    this.beamPool.setAll('outOfBoundsKill', true);
    this.beamPool.setAll('checkWorldBounds', true);
    this.nextFire = 0;
    this.shotDelay = 40; //SHOOTINGRATE! use this for powerup etc


    this.cursors = this.input.keyboard.createCursorKeys(); //this is a-conveniene function built-in with phaser <3

    //bombPool!
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(150, 'bombEnemy');
    this.enemyPool.setAll('anchor.x', 0.5)
    this.enemyPool.setAll('anchor.y', 0.5)
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('reward', 100, false, false, 0, true); //-!-
    this.enemyPool.forEach(function (enemy){
      enemy.animations.add('bombMovement', [0, 2, 1, 3], 5, true);
    });

    this.nextEnemyAt = 0;
    this.enemyDelay = (200)
    this.reaperCounter = 0; //this is the counter for reaperspawn!
    this.firereaperCounter = 0; //firereaperspawn!
    this.speedCounter = 0; //speed multiplier
    this.spawnCounter = 0; //spawn multiplier

    //reaperPool!
    this.reaperPool = this.add.group();
    this.reaperPool.enableBody = true;
    this.reaperPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.reaperPool.createMultiple(80, 'reaperEnemy');
    this.reaperPool.setAll('anchor.x', 0.5)
    this.reaperPool.setAll('anchor.y', 0.5)
    this.reaperPool.setAll('outOfBoundsKill', true);
    this.reaperPool.setAll('checkWorldBounds', true);
    this.reaperPool.setAll('reward', 500, false, false, 0, true);
    this.reaperPool.forEach(function (reaper){
      reaper.animations.add('reaperMovement', [0, 1, 2, 3], 10, true);
    });

    //firereaperPool!
    this.firereaperPool = this.add.group();
    this.firereaperPool.enableBody = true;
    this.firereaperPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.firereaperPool.createMultiple(80, 'fireReaper');
    this.firereaperPool.setAll('anchor.x', 0.5)
    this.firereaperPool.setAll('anchor.y', 0.5)
    this.firereaperPool.setAll('outOfBoundsKill', true);
    this.firereaperPool.setAll('checkWorldBounds', true);
    this.firereaperPool.setAll('reward', 1000, false, false, 0, true);
    this.firereaperPool.forEach(function (firereaper){
      firereaper.animations.add('reaperSlicing', [1, 1, 1, 0, 0, 0, 2], 15, true);
    });


    this.beamPool.enableBody = true;
    this.beamPool.physicsBodyType = Phaser.Physics.ARCADE;
    //limit to only 100 beams on screen at once
    this.beamPool.createMultiple(100, 'beam');
    this.beamPool.setAll('anchor.x', 0.5);
    this.beamPool.setAll('anchor.y',0.5);
    // Automatically kill the beam sprites when they go out of bounds
    this.beamPool.setAll('outOfBoundsKill', true);
    this.beamPool.setAll('checkWorldBounds', true);
    this.nextFire = 0;
    this.shotDelay = 40; //SHOOTINGRATE! use this for powerup etc

    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);
    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add('boom');
    });

    this.explosion4Pool = this.add.group();
    this.explosion4Pool.enableBody = true;
    this.explosion4Pool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosion4Pool.createMultiple(100, 'explosion4');
    this.explosion4Pool.setAll('anchor.x', 0.5);
    this.explosion4Pool.setAll('anchor.y', 0.5);
    this.explosion4Pool.forEach(function (explosion4) {
      explosion4.animations.add('boom');
    });

    this.explosion5Pool = this.add.group();
    this.explosion5Pool.enableBody = true;
    this.explosion5Pool.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosion5Pool.createMultiple(100, 'explosion5');
    this.explosion5Pool.setAll('anchor.x', 0.5);
    this.explosion5Pool.setAll('anchor.y', 0.5);
    this.explosion5Pool.forEach(function (explosion5) {
      explosion5.animations.add('boom');
    });

    //audio
    this.deathSFX = this.add.audio('sad');
    this.pewSFX = this.add.audio('pew');
    this.reaperDeathSFX = this.add.audio('reaperDeath');
    this.firereaperDeathSFX = this.add.audio('firereaperDeath');


    //playerscore!
    this.score = 0;
    this.scoreText = this.add.text(
      780, 20, '' + this.score,
      {font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(1, 0.5);


    //instructionsmessage!
    this.instructions = this.add.text(400,550,
      'Use the arrow keys to move nyan-cat\n'+
      'and Space to pew-pew',
      {font: '20px monospace', fill: '#fff', align: 'center'});
      this.instructions.anchor.setTo(0.5, 0.5);
      this.instExpire = this.time.now + 6000;
    },


    ////////////////////UPDATE////////////////////////
    update: function() {

      if ((this.firereaperCounter > 2) && (this.firereaperPool.countDead() > 0)) {
        this.firereaperCounter = 0;
        var firereaper = this.firereaperPool.getFirstExists(false);

        // spawn at a random location at the bottom
        firereaper.reset(
          this.rnd.integerInRange(20, this.game.width - 20), 600);

          // choose a random target location at the bottom
          var target = this.rnd.integerInRange(20, this.game.width - 20);

          // move to target and rotate the sprite accordingly
          firereaper.rotation = this.physics.arcade.moveToXY(
            firereaper, target, -this.game.height,this.rnd.integerInRange(200, 500)*this.speedCounter*(.02)) - Math.PI / 2;
            firereaper.play('reaperSlicing');

            // each firereaper has their own shot timer
            firereaper.nextShotAt = 0;
          }

          if ((this.reaperCounter > 3) && (this.reaperPool.countDead() > 0)) {
            this.reaperCounter = 0;
            var reaper = this.reaperPool.getFirstExists(false);

            // spawn at a random location at the top
            reaper.reset(
              this.rnd.integerInRange(20, this.game.width - 20), 0);

              // choose a random target location at the bottom
              var target = this.rnd.integerInRange(20, this.game.width - 20);

              // move to target and rotate the sprite accordingly
              reaper.rotation = this.physics.arcade.moveToXY(
                reaper, target, this.game.height,this.rnd.integerInRange(200, 300)) - Math.PI / 2;
                reaper.play('reaperMovement');

                // each reaper has their own shot timer
                reaper.nextShotAt = 0;
              }



              if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
                this.nextEnemyAt = this.time.now + this.enemyDelay;
                var enemy = this.enemyPool.getFirstExists(false);
                // spawn at a random location, right of the screen
                enemy.reset(800,this.rnd.integerInRange (0, 600));
                // also randomize the speed
                enemy.body.velocity.x = -this.rnd.integerInRange(60, 300);
                enemy.play('bombMovement');
              }
              //U.PHYSICS!


              this.physics.arcade.overlap(
                this.beamPool, this.enemyPool, this.enemyHit, null, this
              )
              this.physics.arcade.overlap(
                this.beamPool, this.reaperPool, this.reaperHit, null, this
              )
              this.physics.arcade.overlap(
                this.beamPool, this.firereaperPool, this.firereaperHit, null, this
              )
              this.physics.arcade.overlap(
                this.player, this.enemyPool, this.playerHit, null, this
              )
              this.physics.arcade.overlap(
                this.player, this.reaperPool, this.playerbyReaperHit, null, this
              )
              this.physics.arcade.overlap(
                this.player, this.firereaperPool, this.playerbyFireReaperHit, null, this
              )
              this.physics.arcade.overlap(
                this.tailPool, this.enemyPool, this.enemyHitbyTail, null, this
              )
              this.physics.arcade.overlap(
                this.tailPool, this.reaperPool, this.reaperHitbyTail, null, this
              )
              this.physics.arcade.overlap(
                this.tailPool, this.firereaperPool, this.firereaperHitbyTail, null, this
              )

              //nyan-cat pew-pew
              if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                if (this.returnText && this.returnText.exists) {
                  this.restartGame();
                } else {
                  this.fire();
                }
                this.player.speed = 400; //player shooting speed speed
              }
              if (!this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                this.player.speed = 600;
              }
              //nyan tail
              this.maketail();

              //player movement!
              this.player.body.velocity.x = 0;
              this.player.body.velocity.y = 0;

              if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -this.player.speed;
              } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = this.player.speed;
              }

              if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -this.player.speed;
              } else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = this.player.speed;
              }
              if (this.instructions.exists && this.time.now > this.instExpire) {
                this.instructions.destroy();
              }
              if (this.showReturn && this.time.now > this.showReturn) {
                this.returnText = this.add.text(
                  this.game.width / 2, this.game.height / 2 + 80,
                  'Enter your name (and hit enter) to save to Leaderboard\n\n\n=^.^= Hit space to play again =^.^=',
                  { font: '20px monospace', fill: '#fff', align: 'center'}
                )

                var name_input = this.game.add.inputField
                (game.world.width * 2/5, game.world.height * 6/10, {
                  placeHolder: 'nyanCat',
                });
                  name_input.anchor.setTo(0 ,0)
                  //LOGIC GOES HERE
                  // console.log(inputField)
                  var finalScore = this.score;
                  console.log(finalScore)
                  var entercounter = 0;
                  if (name_input.exists) {
                    $(document).keypress(function(e) {
                      if(e.which == 13) { //enter key is 13
                        entercounter = entercounter +1;
                        if (entercounter == 1){
                          addHighScore(name_input.domElement.value, finalScore)
                          // console.log("POST!!!")
                        }

                        // var player_name = name_input.domElement.value;


                      }
                    });

                  }
                  // console.log(name_input.domElement.value)
                  // var player_score = this.score;
                  // console.log(player_name, player_score);

                  //POST STUFF FOR PLAYER_NAME AND PLAAYER_SCORE GOES HERE
                this.returnText.anchor.setTo(0.5, 0.5);
                this.showReturn = false;
              }

            },


            //collisions!
            playerHit: function (enemy, player) {
              player.kill();
              enemy.kill()
              var explosion = this.add.sprite(player.x, player.y, 'explosion3');
              explosion.anchor.setTo(0.5, 0.5);
              explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11]);
              explosion.play('boom', 15, false, true);
              this.deathSFX.play();
              this.displayEnd(false);
            },
            playerbyReaperHit: function (reaper, player) {
              player.kill();
              reaper.kill()
              var explosion = this.add.sprite(player.x, player.y, 'explosion3');
              explosion.anchor.setTo(0.5, 0.5);
              explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11]);
              explosion.play('boom', 15, false, true);
              this.deathSFX.play();
              this.displayEnd(false);
            },
            playerbyFireReaperHit: function (player) {
              player.kill();
              // firereaper.kill()
              //took out firereaper from function to keep firereaper alive while player goes boom
              var explosion = this.add.sprite(player.x, player.y, 'explosion5');
              explosion.anchor.setTo(0.5, 0.5);
              explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11]);
              explosion.play('boom', 15, false, true);
              this.deathSFX.play();
              this.displayEnd(false);
            },
            enemyHit: function (beam, enemy) {
              beam.kill();
              this.explode(enemy);
              enemy.kill();
              this.addToScore(enemy.reward);
              this.pewSFX.play();
              this.reaperCounter++;
              this.firereaperCounter++
              this.speedCounter++
              this.spawnCounter++

            },
            reaperHit: function (beam, reaper) {
              beam.kill();
              this.explode4(reaper);
              reaper.kill();
              this.addToScore(reaper.reward);
              this.reaperDeathSFX.play();
              this.firereaperCounter++

            },
            firereaperHit: function (beam, firereaper) {
              beam.kill();
              this.explode5(firereaper);
              firereaper.kill();
              this.addToScore(firereaper.reward);
              this.firereaperDeathSFX.play();
              this.reaperCounter++;

            },
            enemyHitbyTail: function (tail, enemy) {
              tail.kill();
              this.explode(enemy);
              enemy.kill();
              this.addToScore(enemy.reward);
              this.pewSFX.play();
              this.reaperCounter++;
              this.firereaperCounter++
              this.speedCounter++
              this.spawnCounter++

            },
            reaperHitbyTail: function (tail, reaper) {
              tail.kill();
              this.explode4(reaper);
              reaper.kill();
              this.addToScore(reaper.reward);
              this.reaperDeathSFX.play();
              this.firereaperCounter++

            },
            firereaperHitbyTail: function (tail, firereaper) {
              tail.kill();
              this.explode5(firereaper);
              firereaper.kill();
              this.addToScore(firereaper.reward);
              this.firereaperDeathSFX.play();
              this.reaperCounter++;

            },


            fire: function()  {
              if (!this.player.alive || this.time.now < this.nextFire) { //similar to set timeout, if this time now is less than the cooldown (function below), FIRE!
                return;
              }
              if (this.beamPool.countDead() === 0)  {
                return;
              }
              this.nextFire = this.time.now + this.shotDelay;

              var beam = this.beamPool.getFirstExists(false);

              beam.reset(this.player.x+70, this.player.y);
              beam.body.velocity.x = 1000; //firerate

            },
            maketail: function() {
              if  (!this.player.alive || this.tailPool.countDead() === 0) {
                return;
              }
              var tail = this.tailPool.getFirstExists(false);
              tail.reset(this.player.x-10, this.player.y);
              //change tail! start point here
              tail.body.velocity.x = -700;

            },

            explode: function (sprite) {
              if (this.explosionPool.countDead() === 0) {
                return;
              }
              var explosion = this.explosionPool.getFirstExists(false);
              explosion.reset(sprite.x, sprite.y);
              explosion.play('boom', 15, false, true);
              // add the original sprite's velocity to the explosion
              explosion.body.velocity.x = sprite.body.velocity.x;
              explosion.body.velocity.y = sprite.body.velocity.y;
            },
            explode4: function (sprite) {
              if (this.explosion4Pool.countDead() === 0) {
                return;
              }
              var explosion4 = this.explosion4Pool.getFirstExists(false);
              explosion4.reset(sprite.x, sprite.y);
              explosion4.play('boom', 15, false, true);
              // add the original sprite's velocity to the explosion
              explosion4.body.velocity.x = sprite.body.velocity.x;
              explosion4.body.velocity.y = sprite.body.velocity.y;
            },
            explode5: function (sprite) {
              if (this.explosion5Pool.countDead() === 0) {
                return;
              }
              var explosion5 = this.explosion5Pool.getFirstExists(false);
              explosion5.reset(sprite.x, sprite.y);
              explosion5.play('boom', 15, false, true);
              // add the original sprite's velocity to the explosion
              explosion5.body.velocity.x = sprite.body.velocity.x;
              explosion5.body.velocity.y = sprite.body.velocity.y;
            },

            addToScore: function (score) {
              this.score += score;
              this.scoreText.text = this.score;
            },
            displayEnd: function (win) {
              // you can't win and lose at the same time
              if (this.endText && this.endText.exists) {
                return;
              }

              var msg = win ? 'You Win!!!' : 'Game Over!';
              //no win conditions lol
              this.endText = this.add.text(
                this.game.width / 2, this.game.height / 2 - 60, msg,
                { font: '72px monospace', fill: '#fff' }
              );

              this.endText.anchor.setTo(0.5, 0);

              this.showReturn = this.time.now + 2000;
          },

          restartGame: function ()  {
            this.enemyPool.destroy()
            this.reaperPool.destroy()
            this.firereaperPool.destroy()
            this.speedCounter = 0;
            this.spawnCounter = 0;
            this.reaperCounter = 0;
            this.firereaperCounter = 0;
            obj = null;
            game.state.start('menu');
          },


      };
