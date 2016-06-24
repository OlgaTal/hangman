var _id;
var _remainingSec = 60;

$(document).ready( initialize );

function initialize() {

  $('#newGame').click(newgame);
  $('#start').click(startGame);
  $('#letter').keyup(() => {
    guess();
  });

  $('#startContainer').css('visibility', 'hidden');

}

function newgame() {
  const name = $('#name').val();
  $.ajax( {
    url: '/hangman/save',
    method: 'post',
    dataType: 'json',
    data: { name },
    success: (rsp) => {

      $('#id').text(rsp.id);
      $('#wordLength').text("The word's length is " + rsp.wordLen);
      let templ = '';
      for (let i = 0; i < rsp.wordLen; i++) {
        templ += '- ';
      }
      $('#wordContainer').text(templ);
      $('#startContainer').css('visibility', 'visible');
      $('#countdown').val(_remainingSec);
    }
  });
}

function guess() {

  const id = $('#id').text();
  const letter = $('#letter').val();
  const myUrl = '/hangman/' + id  + '/guess';

  $.ajax( {
    url: myUrl,
    method: 'post',
    dataType: 'json',
    data: { letter, timeLeft: _remainingSec },
    success: (rsp) => {
      $('#prevGueses').text(rsp.prevGueses);
      $('#wordContainer').text(rsp.word);
      $('#letter').val('');
      if (rsp.didWin) {
        alert('You win!');
        stopTimer();
      }
    }
  });
}

function stopTimer() {
  clearInterval(_id);
}

function timer() {
  _id = setInterval(function() {
    _remainingSec --;
    $('#countdown').val(_remainingSec);
    if(_remainingSec <= 0) {
      stopTimer();
      alert('Game is over');
    }
  }, 1000);
}

function startGame() {
  $('#countdown').addClass('awesome');

  timer();
}
