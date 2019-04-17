const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => { // Recibe una fecha no legible
    return format(timestamp); // Retorna un tiempo desde que se creó
};

module.exports = helpers;