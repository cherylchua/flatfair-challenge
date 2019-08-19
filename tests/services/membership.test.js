'use strict';

const {
    _checkRentAmountInput,
    _convertMonthlyRentToWeekly
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
