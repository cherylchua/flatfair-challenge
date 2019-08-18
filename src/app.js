const express = require('express');
const expressValidation = require('express-validation');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');
const knex = require('knex')(require('../knexfile').development)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

app.get(
    '/organisation-units',
    async function(req, res, next) {
        try {
            const organisationUnits = await knex('organisationunits').select('*')
            return res.json(organisationUnits);
        } catch (err) {
            next(err);
        }
    }
);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
