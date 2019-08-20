const express = require('express');
const expressValidation = require('express-validation');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');

const { calculateMembershipFee } = require('../src/services/membership');
const RENT_PERIODS = require('../src/config/rent_periods');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

app.get(
    '/calculate-membership-fee',
    expressValidation({
        body: Joi.object().keys({
            rent_amount: Joi.number()
                .integer()
                .min(1)
                .max(Number.MAX_SAFE_INTEGER)
                .required(),
            rent_period: Joi.string()
                .valid(RENT_PERIODS.WEEK, RENT_PERIODS.MONTH)
                .required(),
            organisation_unit: Joi.string().required()
        })
    }),
    async function(req, res) {
        try {
            const membershipFee = await calculateMembershipFee(
                req.body.rent_amount,
                req.body.rent_period,
                req.body.organisation_unit
            );
            return res.json({ membershipFee: membershipFee });
        } catch (err) {
            return res.send({
                error_name: err.name,
                error_message: err.message
            });
        }
    }
);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

app.use(function(err, req, res, next) {
    res.status(400).json(err);
});
