'use strict';

process.env.NODE_ENV = 'development';

const {
    getOrganisationUnitDetailsAndConfigByName
} = require('../../src/data_access/organisation_unit_dao');

describe('getOrganisationUnitDetailsAndConfigByName', () => {
    describe('no database errors thrown', () => {
        test('should get organisation unit details and config by name', async done => {
            const input = {
                name: 'branch_c'
            };

            const expected_output = {
                name: 'branch_c',
                parent_org: 'area_a',
                has_fixed_membership_fee: 0,
                fixed_membership_fee_amount: 0
            };

            const organisationUnitDetailsAndConfig = await getOrganisationUnitDetailsAndConfigByName(
                input.name
            );

            expect(organisationUnitDetailsAndConfig.name).toBe(
                expected_output.name
            );
            expect(organisationUnitDetailsAndConfig.parent_org).toBe(
                expected_output.parent_org
            );
            expect(
                organisationUnitDetailsAndConfig.has_fixed_membership_fee
            ).toBe(expected_output.has_fixed_membership_fee);
            expect(
                organisationUnitDetailsAndConfig.fixed_membership_fee_amount
            ).toBe(expected_output.fixed_membership_fee_amount);

            done();
        });
    });

    describe('database errors thrown', () => {
        test('should throw DATABASE_ERROR', async () => {
            const input = {
                name: undefined
            };

            try {
                await getOrganisationUnitDetailsAndConfigByName(input.name);

                throw new Error('I should never reach this error!');
            } catch (err) {
                expect(err.name).toBe('DATABASE_ERROR');
            }
        });
    });
});
