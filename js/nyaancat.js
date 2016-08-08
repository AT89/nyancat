var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game');
//variable for lives (will dictate tail length hehe)
var lives = 4;

var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true; //need to keep this in or code errors out
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

  Bullet.prototype = Object.create(Phaser.Sprite.prototype);
  Bullet.prototype.constructor = Bullet;

  Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

      gx = gx || 0;
      gy = gy || 0;

      this.reset(x, y);
      this.scale.set(1);

      this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

      this.angle = angle;

      this.body.gravity.set(gx, gy);

  };

  Bullet.prototype.update = function () {

      if (this.tracking)  {
          this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      }

      if (this.scaleSpeed > 0)  {
          this.scale.x += this.scaleSpeed;
          this.scale.y += this.scaleSpeed;
      }

  };

var Weapon = {};

Weapon.Beam = function (game) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 45;

    for (var i = 0; i < 64; i++){
        this.add(new Bullet(game, 'bullet'), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 80;
    var y = source.y + 15;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};


//  The core game loop

var PhaserGame = function (){

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 300;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {


        this.load.image('background', 'assets/props/bg.png');
        this.load.image('foreground', 'assets/props/fore.png');
        this.load.spritesheet('player', 'assets/cat/nyancat.png', 61, 28);
        this.load.bitmapFont('shmupfont', 'assets/props/shmupfont.png', 'assets/props/shmupfont.xml');
        this.load.image('bullet', 'assets/props/beam.png');
        this.load.spritesheet('nyantail', 'assets/cat/tail.png', 38, 28);
        this.load.spritesheet('mage', 'assets/enemies/mages.png', 19, 17);
        this.load.spritesheet('bomb', 'assets/enemies/bombs.png', 18, 18);

    },

    create: function () {

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.autoScroll(-40, 0);



        this.weapons.push(new Weapon.Beam(this.game));
        this.currentWeapon = 0;



        this.player = this.add.sprite(64, 200, 'player');
                ///TAILBOOKMARK///
        // this.tail = this.add.sprite(44, 200,'nyantail');

        //boogies - mages
        this.mages = game.add.group();
        this.mages.enableBody = true;
        this.mage = this.add.sprite(500, 200, 'mage')
        //boogies - bombs
        this.bombs = game.add.group();
        this.bombs.enableBody = true;
        this.bomb = this.add.sprite(300, 100, 'bomb')


        this.physics.arcade.enable(this.mages);
        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        // foregroundBOOKMARK
        // this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
        // this.foreground.autoScroll(-60, 0);


        //  Cursor keys to fly + space to fire
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        //animation the nyan-cat-sama
    		this.player.animations.add('any', [0, 1, 2, 3, 4], 10, true);

        //animation on boogies
    		this.mage.animations.add('mageMovement', [0, 1], 10, true);
    		this.bomb.animations.add('bombMovement', [0, 1], 10, true);

        //making the tail
        ///TAILBOOKMARK///
        // this.tail.animations.add('makerainbowwiggle', [0,1], 10, true);

    },



    update: function () {


        this.player.body.velocity.set(0);
        if (this.cursors) {
          this.player.animations.play('any');
                  ///TAILBOOKMARK///
          // this.tail.animations.play('makerainbowwiggle')
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.speed;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.speed;
        }

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.speed;
        }
        else if (this.cursors.down.isDown)  {
            this.player.body.velocity.y = this.speed;
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.weapons[this.currentWeapon].fire(this.player);
        }


        //boogie animations
        this.mage.animations.play('mageMovement')
        this.bomb.animations.play('bombMovement')


    }

};

game.state.add('Game', PhaserGame, true);
