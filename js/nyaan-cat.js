//use of ! is equal part for excitement and bookmarking

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

PhaserGame = {
  ////////////////////PRELOAD////////////////////////
  preload: function() {
    //sprites and images
    this.load.image('background', 'assets/props/bgspace.jpg');
    this.load.spritesheet('player', 'assets/cat/nyancat.png', 61, 28);
    this.load.image('beam', 'assets/props/beam.png');
    this.load.image('bullet', 'assets/props/bullet.png');
    this.load.spritesheet('nyantail', 'assets/cat/tail.png', 38, 28);
    this.load.spritesheet('magusEnemy', 'assets/bogeys/mages.png', 19, 19);
    this.load.spritesheet('bombEnemy', 'assets/bogeys/bombs.png', 18, 18);
    //explosions
    this.load.spritesheet('explosion', 'assets/props/explosion.png', 94, 94);
    this.load.spritesheet('explosion2', 'assets/props/explosion2.png', 94, 94);
    this.load.spritesheet('explosion3', 'assets/props/explosion3.png', 94, 94);
    this.load.spritesheet('explosion4', 'assets/props/explosion4.png', 94, 94);
    this.load.spritesheet('explosion5', 'assets/props/explosion5.png', 94, 94);

    //reaperEnemy
    this.load.spritesheet('reaperEnemy', 'assets/reaper/reaper.png',70,77 );
    // this.load.spritesheet('reaperEnemy', 'assets/reaper/reaperSlice.png', 76, 99);

    // this.load.spritesheet('reaperSlice', 'assets/reaper/reaperSlice.png', 76, 99);

    this.load.spritesheet('fireReaper', 'assets/reaper/firereaperSlicing.png', 142, 139);
    this.load.spritesheet('reaperShot', 'assets/reaper/sliceShot.png', 17, 100);

    //sounds
    this.load.audio('sad','assets/sounds/sad.mp3');
    this.load.audio('pew','assets/sounds/pew.mp3');
    this.load.audio('reaperDeath','assets/sounds/reaperdeath.wav')
    this.load.audio('firereaperDeath','assets/sounds/reaperdeath2.wav')

  },

  ////////////////////CREATE////////////////////////
  create: function()  {
    //create the background
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(-80, 0);

    //create nyan-cat
    this.player = this.add.sprite(64, 220, 'player');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('wiggle', [0, 1, 2, 3, 4], 10, true);
    this.player.animations.play('wiggle')
    this.player.body.collideWorldBounds = true; //make it so player cant go outside edge** for now..
    this.player.body.setSize(20, 20, 35, 5);

    //grouping is necessary to adhere to memory leaks and reuse sprites, for time & memory, as well as giving it all properties

    this.tailPool = this.add.group();
    this.tailPool.enableBody = true;
    this.tailPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.tailPool.createMultiple(50, 'nyantail');
    this.tailPool.setAll('anchor.x', 0.5);
    this.tailPool.setAll('anchor.y', 0.5);
    this.tailPool.setAll('outOfBoundsKill', true);
    this.tailPool.setAll('checkWorldBounds', true);

    //nyan-cat pew pew
    this.beamPool = this.add.group();
    this.beamPool.enableBody = true;
    this.beamPool.physicsBodyType = Phaser.Physics.ARCADE;
    //limit to only 100 beams on screen at once
    this.beamPool.createMultiple(100, 'beam');
    this.beamPool.setAll('anchor.x', 0.5);
    this.beamPool.setAll('anchor.y',0.5);
    // Automatically kill the bullet sprites when they go out of bounds
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
    this.firereaperCounter = 0; //firereaper spawn
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
    // Automatically kill the bullet sprites when they go out of bounds
    this.beamPool.setAll('outOfBoundsKill', true);
    this.beamPool.setAll('checkWorldBounds', true);
    this.nextFire = 0;
    this.shotDelay = 40; //SHOOTINGRATE! use this for powerup et

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
                enemy.reset(700,this.rnd.integerInRange (0, 600));
                // also randomize the speed
                enemy.body.velocity.x = -this.rnd.integerInRange(60, 300);
                enemy.play('bombMovement');
              }
              //U.PHYSICS!
              // this.physics.arcade.overlap(
              //   this.bulletPool, this.player, this.playerHit, null, this
              // );

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
                this.fire();
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
            },
            playerbyReaperHit: function (reaper, player) {
              player.kill();
              reaper.kill()
              var explosion = this.add.sprite(player.x, player.y, 'explosion3');
              explosion.anchor.setTo(0.5, 0.5);
              explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11]);
              explosion.play('boom', 15, false, true);
              this.deathSFX.play();
            },
            playerbyFireReaperHit: function (firereaper, player) {
              player.kill();
              firereaper.kill()
              var explosion = this.add.sprite(player.x, player.y, 'explosion5');
              explosion.anchor.setTo(0.5, 0.5);
              explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11]);
              explosion.play('boom', 15, false, true);
              this.deathSFX.play();
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
              tail.reset(this.player.x-35, this.player.y);
              tail.body.velocity.x = -700;

              //MEANINGLESS ANIMATION
              // tail.animations.add('makerainbowwiggle', [0,1], 30, true);
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


          };
          //end
          game.state.add('Game', PhaserGame, true);
