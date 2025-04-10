const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClothingItemSchema = new Schema({
    UserId: {type: String, required: true},
    Name: {type: String, required: true},
    Color: {type: String, required: true},
    Category: {type: String, enum: ['Shirts', 'LongSleeves', 'Pants', 'Shorts', 'Shoes'],required: true},
    Size: {type: String, required: true},
    file: {type: Buffer, required: true},
    fileType: {type: String, required: true},
    isFavorite: { type: Boolean, default: false }
}, {timestamps: true});

ClothingItemSchema.index({ UserId: 1 });

module.exports = mongoose.model('ClothingItem', ClothingItemSchema);