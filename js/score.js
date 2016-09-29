//CURRENTLY NOT USED, BUT I WANT TO ADD ANOTHER SCREEN FOR A ITEMSHOP

//SCORE ENTER

//ENTER THE SCOREBOARD
var scoreState = {



  create: function() {
    var your_score = game.add.text(game.world.width /2,
      game.world.height * 2/10,
       ''+this.score+'',
      {font: '32px monospace', fill:'#fff'});
      your_score.anchor.setTo(.5, 0);

    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    startKey.onDown.addOnce(this.start, this)
  },
  start: function() {
    game.state.start('menu')
  }

}

//SCRAP THIS STATE
