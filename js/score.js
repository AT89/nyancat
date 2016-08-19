//SCORE ENTER

//ENTER THE SCOREBOARD
var scoreState = {

  create: function() {


    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    startKey.onDown.addOnce(this.start, this)
  },
  start: function() {
    game.state.start('menu')
  }

}
