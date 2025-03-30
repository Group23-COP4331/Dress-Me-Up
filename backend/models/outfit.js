const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitSchema = new Schema({
    UserId: {type: Number, required: true},
    Name: {type: String, required: true},
    Top: {type: Schema.Types.ObjectId, ref: 'ClothingItem', required: true},
    Bottom: {type: Schema.Types.ObjectId, ref: 'ClothingItem', required: true},
    Shoes: {type: Schema.Types.ObjectId, ref: 'ClothingItem', required: true},
    WeatherCategory: {type: String, enum: ['Hot', 'Cold', 'Normal','Rainy', 'Sunny', 'Cloudy'], required: true},
}, {timestamps: true});

module.exports = mongoose.model('Outfit', OutfitSchema);