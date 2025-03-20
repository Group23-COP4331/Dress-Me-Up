const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClothingItemSchema = new Schema({
    UserId: {type: Number, required: true},
    Name: {type: String, required: true},
    Color: {type: String, required: true},
    Category: {type: String, enum: ['Shirts', 'LongSleeves', 'Pants', 'Shorts', 'Shoes'],required: true},
    Size: {type: Number, required: true},
    ImageURL: {type: String, required: true},
}, {timestamps: true});

mondule.exports = mongoose.model('ClothingItem', ClothingItemSchema);