const express = require('express');
const expressValidation = require('express-validation');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

app.get(
    '/clients/:id',
    expressValidation({
        params: {
            id: Joi.string().required()
        }
    }),
    async function(req, res, next) {
        try {
            res.send(`Hello! You've requested for id ${req.params.id}!`);
        } catch (err) {
            next(err);
        }
    }
);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
