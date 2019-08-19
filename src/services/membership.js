'use strict';
const assert = require('assert-plus');
const RENT_LIMITS = require('../config/rent_amount_limits');

const PERIOD_WEEK = 'week';
const PERIOD_MONTH = 'month';
const VAT_MULTIPLIER = 1.2;
const MIN_MEMBERSHIP_FEE_WITH_VAT = 120 * 1.2;

const calculateMembershipFee = async function(
    rent_amount,
    rent_period,
    organisation_unit
) {
    assert.number(rent_amount);
    assert.string(rent_period);
    assert.string(organisation_unit);

    _checkRentAmountInput(rent_amount, rent_period);

    let membershipFee;

    if (rent_period === PERIOD_WEEK) {
        membershipFee = rent_period * VAT_MULTIPLIER;
    }

    if (rent_period === PERIOD_MONTH) {
        membershipFee =
            _convertMonthlyRentToWeekly(rent_amount) * VAT_MULTIPLIER;
    }

    if (membershipFee < MIN_MEMBERSHIP_FEE_WITH_VAT) {
        membershipFee = MIN_MEMBERSHIP_FEE_WITH_VAT;
    }

    return membershipFee;
};

function _convertMonthlyRentToWeekly(monthly_amount) {
    const weeklyAmount = ((monthly_amount * 12) / 365) * 7;

    return Math.round(weeklyAmount * 100) / 100;
}

function _checkRentAmountInput(amount, period) {
    const isOutOfWeeklyAmountRange =
        amount < RENT_LIMITS.MIN_RENT_AMOUNT_PER_WEEK ||
        amount > RENT_LIMITS.MAX_RENT_AMOUNT_PER_WEEK;
    const isOutOfMonthlyAmountRange =
        amount < RENT_LIMITS.MIN_RENT_AMOUNT_PER_MONTH ||
        amount > RENT_LIMITS.MAX_RENT_AMOUNT_PER_MONTH;

    if (period === PERIOD_WEEK) {
        if (isOutOfWeeklyAmountRange) {
            throw new RangeError(
                `Input amount ${amount} is outside the range of min ${RENT_LIMITS.MIN_RENT_AMOUNT_PER_WEEK}/week and max ${RENT_LIMITS.MAX_RENT_AMOUNT_PER_WEEK}/week`
            );
        }
    }

    if (period === PERIOD_MONTH) {
        if (isOutOfMonthlyAmountRange) {
            throw new RangeError(
                `Input amount ${amount} is outside the range of min ${RENT_LIMITS.MIN_RENT_AMOUNT_PER_MONTH}/month and max ${RENT_LIMITS.MAX_RENT_AMOUNT_PER_MONTH}/month`
            );
        }
    }

    return;
}

module.exports = {
    calculateMembershipFee,
    _checkRentAmountInput,
    _convertMonthlyRentToWeekly
};
