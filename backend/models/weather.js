const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeatherSchema = new Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
    temperature: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  });

module.exports = mongoose.model('Weather', WeatherSchema);