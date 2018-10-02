import $ from 'jquery';
import 'assets/style.css';
import LukeSkywalkerImg from 'assets/luke-skywalker.webp';
import ObiWanKenobiImg from 'assets/obi-wan-kenobi.webp';
import DarthSidiousPic from 'assets/darth-sidious.png';
import DarthMaulPic from 'assets/darth-maul.jpeg';

function newGame() {
  $('.character').detach();

  let characters = [
    {
      name: 'Luke Skywalker',
      hp: 100,
      attack: 0,
      attackDelta: 12,
      counter: 5,
      img: LukeSkywalkerImg
    },
    {
      name: 'Obi-Wan Kenobi',
      hp: 120,
      attack: 0,
      attackDelta: 8,
      counter: 10,
      img: ObiWanKenobiImg
    },
    {
      name: 'Darth Sidious',
      hp: 150,
      attack: 0,
      attackDelta: 4,
      counter: 20,
      img: DarthSidiousPic
    },
    {
      name: 'Darth Maul',
      hp: 180,
      attack: 0,
      attackDelta: 2,
      counter: 25,
      img: DarthMaulPic
    }
  ];

  characters.forEach(c =>
    $('<div>')
      .addClass('character')
      .data(c)
      .append($('<div>').addClass('name').text(c.name))
      .append($('<img>').attr('src', c.img))
      .append($('<div>').addClass('hp').text(c.hp))
      .on('click', choosePlayer)
      .appendTo($('#characters'))
  );

  $('#results').text('');
  $('#restart').hide();
}

function choosePlayer(e) {
  $('.character').off(); // Only one player, so remove click handlers.

  // Move the target to #player and prepare other .characters to be picked as defender
  $(e.currentTarget).appendTo($('#player'));
  $('#characters .character').appendTo($('#available')).on('click', chooseDefender);
}

function chooseDefender(e) {
  $('#results').text(''); // Remove any results text left over from previous defender
  $('.character').off(); // Only one defender at a time, so remove click handlers.

  // Move the target to #defender and enable the attack button
  $(e.currentTarget).appendTo($('#defender'));
  $('#attack').on('click', attack);
}

function attack() {
  let player = $('#player .character');
  let defender = $('#defender .character');

  // Update player's attack power, then attack
  player.data('attack', player.data('attack') + player.data('attackDelta'));
  defender.data('hp', defender.data('hp') - player.data('attack'));
  defender.find('.hp').text(defender.data('hp'));

  let defenderIsAlive = defender.data('hp') > 0;
  if (defenderIsAlive) {
    // If the defender survived, he counter-attacks
    player.data('hp', player.data('hp') - defender.data('counter'));
    player.find('.hp').text(player.data('hp'));

    let playerIsAlive = player.data('hp') > 0;
    if (!playerIsAlive) {
      // If the player's character is dead, lose.
      $('#attack').off();
      $('#results').text('You been defeated...GAME OVER!!!');
      $('#restart').show();
    } else {
      // Otherwise show a damage report.
      $('#results').text(`You attacked ${defender.data('name')} for ${player.data('attack')} damage. ${defender.data('name')} attacked you back for ${defender.data('counter')} damage.`);
    }
  } else {
    // If the defender died, his DOM element is deleted
    $('#attack').off();
    defender.detach();

    let enemiesAreAvailable = $('#available .character').length > 0;
    if (enemiesAreAvailable) {
      // If more enemies are available, the player can choose one
      $('#results').text(`You have defeated ${defender.data('name')}, you can choose to fight another enemy.`);
      $('#available .character').on('click', chooseDefender);
    } else {
      // If no more enemies are available, win.
      $('#results').text('You Won!!!! GAME OVER!!!');
      $('#restart').show();
    }
  }
}

$(() => {
  $('#restart').on('click', newGame);
  newGame();
});