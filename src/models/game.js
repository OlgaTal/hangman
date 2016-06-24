import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  word: String,
  guesses: [String],
  didWin: Boolean,
  timeLeft: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', gameSchema);
