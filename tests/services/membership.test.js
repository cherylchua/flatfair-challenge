'use strict';

process.env.NODE_ENV = 'development';

const {
    _checkRentAmountInput,
    _convertMonthlyRentToWeekly,
    _checkForFixedMembershipFee,
    calculateMembershipFee
} = require('../../src/services/membership');
const RENT_LIMITS = require('../../src/config/rent_amount_limits');

describe('_checkRentAmountInput', () => {
    describe('when weekly rent amount is outside range', () => {
        test('should return RangeError', () => {
            const input = {
                amount: 20,
                period: 'week'
            };

            try {
                _checkRentAmountInput(input.amount, input.period);

                throw new Error('I should never reach this error!');
            } catch (err) {
                expect(err).toBeInstanceOf(RangeError);
                expect(err.message).toBe(
                    `Input amount ${input.amount} is outside the range of min ${RENT_LIMITS.MIN_RENT_AMOUNT_PER_WEEK}/week and max ${RENT_LIMITS.MAX_RENT_AMOUNT_PER_WEEK}/week`
                );
            }
        });
    });

    describe('when monthly rent amount is outside range', () => {
        test('should return RangeError', () => {
            const input = {
                amount: 9000,
                period: 'month'
            };

            try {
                _checkRentAmountInput(input.amount, input.period);

                throw new Error('I should never reach this error!');
            } catch (err) {
                expect(err).toBeInstanceOf(RangeError);
                expect(err.message).toBe(
                    `Input amount ${input.amount} is outside the range of min ${RENT_LIMITS.MIN_RENT_AMOUNT_PER_MONTH}/month and max ${RENT_LIMITS.MAX_RENT_AMOUNT_PER_MONTH}/month`
                );
            }
        });
    });

    describe('when weekly rent amount is within range', () => {
        test('should not throw any error', () => {
            const input = {
                amount: 70,
                period: 'week'
            };

            try {
                _checkRentAmountInput(input.amount, input.period);

                throw new Error(
                    'I should get this error since the function ran successfully!'
                );
            } catch (err) {
                expect(err.message).toBe(
                    'I should get this error since the function ran successfully!'
                );
            }
        });
    });
});

describe('_convertMonthlyRentToWeekly', () => {
    test('should convert monthly rent into weekly', () => {
        const input = {
            monthly_amount: 8500
        };

        const weeklyRentAmount = _convertMonthlyRentToWeekly(
            input.monthly_amount
        );
        expect(weeklyRentAmount).toBe(1956.16);
    });
});

describe('_checkForFixedMembershipFee', () => {
    describe('branch does not have any config, but area has fixed membership fee', () => {
        test('should return the fixed_membership_fee_amount of the area', async done => {
            const input = {
                branch_organisation_unit_name: 'branch_d'
            };

            const fixedMembershipFee = await _checkForFixedMembershipFee(
                input.branch_organisation_unit_name
            );
            expect(fixedMembershipFee).toBe(45000);
            done();
        });
    });

    describe('branch has fixed membership fee', () => {
        test('should return the fixed_membership_fee_amount', async done => {
            const input = {
                branch_organisation_unit_name: 'branch_k'
            };

            const fixedMembershipFee = await _checkForFixedMembershipFee(
                input.branch_organisation_unit_name
            );
            expect(fixedMembershipFee).toBe(25000);
            done();
        });
    });

    describe('branch does not have fixed membership fee, but area has fixed membership fee', () => {
        test('should return the fixed_membership_fee_amount for the area', async done => {
            const input = {
                branch_organisation_unit_name: 'branch_b'
            };

            const fixedMembershipFee = await _checkForFixedMembershipFee(
                input.branch_organisation_unit_name
            );
            expect(fixedMembershipFee).toBe(45000);
            done();
        });
    });

    describe('branch and area does not have fixed membership fee, but division has fixed membership fee', () => {
        test('should return the fixed_membership_fee_amount for the division', async done => {
            const input = {
                branch_organisation_unit_name: 'branch_o'
            };

            const fixedMembershipFee = await _checkForFixedMembershipFee(
                input.branch_organisation_unit_name
            );
            expect(fixedMembershipFee).toBe(35000);
            done();
        });
    });

    describe('branch, area, and division does not have fixed membership fee', () => {
        test('should return a null', async done => {
            const input = {
                branch_organisation_unit_name: 'branch_g'
            };

            const fixedMembershipFee = await _checkForFixedMembershipFee(
                input.branch_organisation_unit_name
            );
            expect(fixedMembershipFee).toBe(null);
            done();
        });
    });
});

describe('calculateMembershipFee', () => {
    describe('input validation for rent amount fails', () => {
        test('should throw RangeError', async () => {
            const input = {
                rent_amount: 10,
                rent_period: 'week',
                organisation_unit: 'branch_k'
            };
            try {
                await calculateMembershipFee(
                    input.rent_amount,
                    input.rent_period,
                    input.organisation_unit
                );
            } catch (err) {
                expect(err).toBeInstanceOf(RangeError);
            }
        });
    });

    describe('branch has fixed membership fee', () => {
        test('should return the fixed_membership_fee_amount', async done => {
            const input = {
                rent_amount: 30,
                rent_period: 'week',
                organisation_unit: 'branch_k'
            };

            const membershipFee = await calculateMembershipFee(
                input.rent_amount,
                input.rent_period,
                input.organisation_unit
            );
            expect(membershipFee).toBe(250);
            done();
        });
    });

    describe('branch has fixed membership fee in one of its parents', () => {
        test('should return the fixed_membership_fee_amount of its parent', async done => {
            const input = {
                rent_amount: 200,
                rent_period: 'month',
                organisation_unit: 'branch_i'
            };

            const membershipFee = await calculateMembershipFee(
                input.rent_amount,
                input.rent_period,
                input.organisation_unit
            );
            expect(membershipFee).toBe(450);
            done();
        });
    });

    describe('branch does not have fixed membership fee in parents, fee is lower than the minimum', () => {
        test('should return the minimum fee', async done => {
            const input = {
                rent_amount: 110,
                rent_period: 'month',
                organisation_unit: 'branch_e'
            };

            const membershipFee = await calculateMembershipFee(
                input.rent_amount,
                input.rent_period,
                input.organisation_unit
            );
            expect(membershipFee).toBe(144);
            done();
        });
    });

    describe('branch does not have fixed membership fee in parents, fee is greater than minimum', () => {
        test('should return fee as one week rent plus VAT', async done => {
            const input = {
                rent_amount: 1500,
                rent_period: 'month',
                organisation_unit: 'branch_f'
            };

            const membershipFee = await calculateMembershipFee(
                input.rent_amount,
                input.rent_period,
                input.organisation_unit
            );
            expect(membershipFee).toBe(414);
            done();
        });
    });
});
