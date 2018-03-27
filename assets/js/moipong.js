$(document).ready(function() {

  var players = [];
  var currentPlayers = [];
  var currentId = 0;
  var nextPlayer = undefined;
  var maxPoints = 5;

  $('.btn-config').on('click', function() {
    $('#configModal').modal();
    $('#configMaxPoints').val(maxPoints);
  });

  $('.btn-save-config').on('click', function() {
    maxPoints = $('#configMaxPoints').val();
    $('#configModal').modal('hide');
  });

  $('.add-player').on('keydown', function(e) {
    if (!e) {
      var e = window.event;
    }

    if (e.keyCode == 13) {
      addPlayer($('.add-player').val());
      $('.add-player').val('');
    }
  });

  $(document).on('click', '.next-player, .player-list-item', function() {
    let playerId = $(this).data('player-id');
    removePlayer(playerId);
  });

  $('.add-score-player-1').on('click', function() {
    let playerOne = currentPlayers[0];
    let playerTwo = currentPlayers[1];
    playerOne.currentScore += 1;
    updateScores();
    if (playerOne.currentScore == maxPoints) {
      currentPlayers[0].currentScore = 0;
      currentPlayers[1].currentScore = 0;
      winGame(currentPlayers[0]);
      if (nextPlayer != undefined) {
        players.push(currentPlayers[1]);
        currentPlayers[1] = nextPlayer;
        players.shift();
        nextPlayer = players[0];
        buildPlayerList();
      }
      buildCurrentPlayersInterface();
    }
  });

  $('.add-score-player-2').on('click', function() {
    let playerOne = currentPlayers[0];
    let playerTwo = currentPlayers[1];
    playerTwo.currentScore += 1;
    updateScores();
    if (playerTwo.currentScore == maxPoints) {
      currentPlayers[0].currentScore = 0;
      currentPlayers[1].currentScore = 0;
      winGame(currentPlayers[1]);
      if (nextPlayer != undefined) {
        players.push(currentPlayers[0]);
        currentPlayers[0] = nextPlayer;
        players.shift();
        nextPlayer = players[0];
        buildPlayerList();
      }
      buildCurrentPlayersInterface();
    }
  });

  function winGame(player) {
    $('.winner').text(player.name + " wins!");
    $('#winModal').modal();
    setTimeout(resetWin, 2000);
  }

  function resetWin() {
    $('#winModal').modal("hide");
  }

  function addPlayer(playerName) {
    players.push({id: currentId, name: playerName, currentScore: 0});
    currentId += 1;
    updateInterface();
  }

  function removePlayer(playerId) {
    let player = players.find(p => p.id === playerId);
    if (player != undefined) {
      players.splice(players.indexOf(player), 1);
      buildPlayerList();
    }
  }

  function updateInterface() {
    if (currentPlayers.length == 0) {
      currentPlayers.push(players[0]);
      players.shift();
      buildCurrentPlayersInterface();
    } else if (currentPlayers.length == 1) {
      currentPlayers.push(players[0]);
      players.shift();
      buildCurrentPlayersInterface();
      $('.add-score-player-1, .add-score-player-2').removeClass('disabled');
    } else if (currentPlayers.length == 2) {
      $('.player-1-name').text(currentPlayers[0].name).data('player-id', currentPlayers[0].id);
      $('.player-1-score').text(currentPlayers[0].currentScore).data('player-id', currentPlayers[0].id);
      $('.player-2-name').text(currentPlayers[1].name).data('player-id', currentPlayers[1].id);
      $('.player-2-score').text(currentPlayers[1].currentScore).data('player-id', currentPlayers[1].id);
      buildPlayerList();
    }
  }

  function buildCurrentPlayersInterface() {
    if (currentPlayers[0] != undefined) {
      $('.player-1-name').text(currentPlayers[0].name).data('player-id', currentPlayers[0].id);
      $('.player-1-score').text(currentPlayers[0].currentScore).data('player-id', currentPlayers[0].id);
    }
    if (currentPlayers[1] != undefined) {
      $('.player-2-name').text(currentPlayers[1].name).data('player-id', currentPlayers[1].id);
      $('.player-2-score').text(currentPlayers[1].currentScore).data('player-id', currentPlayers[1].id);
    }
  }

  function buildPlayerList() {
    if (players.length > 0) {
      setNextPlayer(players[0]);
    } else {
      removeNextPlayer();
    }
    let html = "";
    if (players.length > 1) {
      for (var i = 1; i < players.length; i++) {
        let player = players[i];
        let li = "<li class='list-group-item player-list-item' data-player-id='" + player.id + "'>" + player.name + "</li>";
        html += li;
      }
    }
    $('.player-list').html(html);
  }

  function setNextPlayer(player) {
    nextPlayer = player;
    $('.next-player').html(nextPlayer.name).data('player-id', nextPlayer.id).css('display', 'inline');
  }

  function removeNextPlayer() {
    nextPlayer = undefined;
    $('.next-player').html('').data('player-id', '').css('display', 'none');
  }

  function addPlayerInterface(player, index) {
    if (index == 0) {
      return;
    }
    if (!currentPlayersInInterface().includes(player.id)) {
      $('.player-list').append("<span class='player-list-item' data-player-id='" + player.id + "'>" + player.name + " <i class='fas fa-minus-square remove-player'></i></span>")
    }
  }

  function currentPlayersInInterface() {
    let currentPlayersInInterface = [];
    if ($('.player-list').children().length == 0) {
      return currentPlayersInInterface;
    }
    for (var i = 0; i < $('.player-list').children().length; i++) {
      let element = $($('.player-list').children()[i]);
      let id = element.data('player-id');
      currentPlayersInInterface.push(id);
    }
    return currentPlayersInInterface;
  }

  function updateScores() {
    $('.player-1-score').text(currentPlayers[0].currentScore);
    $('.player-2-score').text(currentPlayers[1].currentScore);
  }

});
