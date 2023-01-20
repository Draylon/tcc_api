const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    type: String,
});

module.exports = mongoose.model('location_type', profileSchema);

/**
 * Região: Tipo de localização
 * Região de praia: conjunto de todas as localizações 
 * 
 */