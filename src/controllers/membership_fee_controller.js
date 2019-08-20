'use strict';
const { calculateMembershipFee } = require('../services/membership');

exports.getMembershipFee = async function(req, res) {
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

