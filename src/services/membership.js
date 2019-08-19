'use strict';
const assert = require('assert-plus');
const RENT_LIMITS = require('../config/rent_amount_limits');
const {
    getOrganisationUnitDetailsAndConfigByName
} = require('../data_access/organisation_unit_dao');

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

    const fixedMembershipFee = _checkForFixedMembershipFee(organisation_unit);

    if (fixedMembershipFee !== null) {
        // NOTE: amount stored as pence in db
        membershipFee = fixedMembershipFee / 100;
    }

    return membershipFee;
};

async function _checkForFixedMembershipFee(branch_organisation_unit_name) {
    let fixedMembershipFee = null;

    const branchDetailsAndConfig = await getOrganisationUnitDetailsAndConfigByName(
        branch_organisation_unit_name
    );

    if (branchDetailsAndConfig.has_fixed_membership_fee === 1) {
        fixedMembershipFee = branchDetailsAndConfig.fixed_membership_fee_amount;

        return fixedMembershipFee;
    }

    let parentOrganisation;

    parentOrganisation = branchDetailsAndConfig.parent_org;

    while (parentOrganisation !== null) {
        const organisationUnitDetailsAndConfig = await getOrganisationUnitDetailsAndConfigByName(
            parentOrganisation
        );

        if (organisationUnitDetailsAndConfig.has_fixed_membership_fee === 1) {
            fixedMembershipFee =
                organisationUnitDetailsAndConfig.fixed_membership_fee_amount;
            return fixedMembershipFee;
        }

        parentOrganisation = organisationUnitDetailsAndConfig.parent_org;
    }

    return fixedMembershipFee;
}

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
    _convertMonthlyRentToWeekly,
    _checkForFixedMembershipFee
};
