const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coinId: { type: String, required: true },       // e.g., 'bitcoin'
    symbol: { type: String, required: true },       // e.g., 'btc'
    amount: { type: Number, required: true },       // e.g., 0.5
    buyPrice: { type: Number, required: true }      // USD
  },
  { timestamps: true }
);

module.exports = mongoose.model('Holding', HoldingSchema);
