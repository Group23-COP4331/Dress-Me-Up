const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutfitPlanSchema = new Schema({
    UserId: {type: Number, required: true},
    Name: {type: String, required: true},
    Date: {type: Date, required: true}, //YYYY-MM-DD Use $gte and $lt to get range/query
    OutfitId: {type: Schema.Types.ObjectId, ref: 'Outfit', required: true},
}, {timestamps: true});

module.exports = mongoose.model('OutfitPlan', OutfitPlanSchema);