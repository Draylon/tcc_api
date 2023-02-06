const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    type: String,
    type_en: String,
});

module.exports = mongoose.model('location_type', profileSchema);


/* const res = await fetch("https://libretranslate.com/translate", {
	method: "POST",
	body: JSON.stringify({
		q: "Hello!",
		source: "en",
		target: "es"
	}),
	headers: { "Content-Type": "application/json" }
});
console.log(await res.json());
*/


/**
 * 
 * Região: Tipo de localização
 * Região de praia: conjunto de todas as localizações 
 * 
 */