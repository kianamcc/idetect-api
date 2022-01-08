const Clarifai = require('clarifai');
const { json } = require('express/lib/response');

const app = new Clarifai.App({
    apiKey: 'e2251cc2cbad4eacbfae87ce8c9f35bd'
   });

const handleAPICall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // url as input, cannot use image url here
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}

const handleEntries = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entry count'))
}

module.exports = {
    handleEntries,
    handleAPICall
}
