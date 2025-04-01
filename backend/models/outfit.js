const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitSchema = new Schema({
  UserId: Number,
  Name: String,
  Top: { type: Schema.Types.ObjectId, ref: 'ClothingItem' },
  Bottom: { type: Schema.Types.ObjectId, ref: 'ClothingItem' },
  Shoes: { type: Schema.Types.ObjectId, ref: 'ClothingItem' },
  WeatherCategory: String,
}, { timestamps: true });

module.exports = mongoose.model('Outfit', OutfitSchema);
