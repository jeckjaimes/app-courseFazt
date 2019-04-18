const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async(password) => { // Para encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Patron de cifrado
    const hash = await bcrypt.hash(password, salt); // Se cifra la contraseña
    return hash;
};

helpers.matchPassword = async(password, savedPassword) => { // Comparar la contraseña
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;