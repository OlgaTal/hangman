/* eslint-disable new-cap */

import express from 'express';
const router = module.exports = express.Router();
import Game from '../models/game';
import Words from '../models/words';


router.get('/', (req, res) => {
  res.render('hangman/index');
});

router.post('/save', (req, res) => {
  const w = Words.getWord();
  // save game in DB
  // get id back
  const game = new Game(req.body);
  game.word = w;

  game.save((err, game1) => {
    res.send({ wordLen: w.length, id: game1.id });
  });
});

router.post('/:id/guess', (req, res) => {
  console.log('letteris ', req.body.letter);
  Game.findById(req.params.id, (err, game) => {
    game.guesses.push(req.body.letter);
    game.timeLeft = req.body.timeLeft * 1;

    const gueses = game.guesses;
    let result = '';
    const myLetters = game.word.split('');
    for (let i = 0; i < myLetters.length; i++) {
      const a = gueses.find(g => g === myLetters[i]);
      if (a) {
        result += `${a} `;
      } else {
        result += '- ';
      }
    }
    if (!result.split('').find(r => r === '-')) {
      game.didWin = true;
    }

    game.update(game, () => {
      res.send({ prevGueses: gueses, word: result, didWin: game.didWin });
    });
  });
});
