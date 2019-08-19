'use strict';

const knex = require('knex')(require('../../../knexfile').development);

async function getOrganisationUnitDetailsAndConfigByName(
    organisation_unit_name
) {
    try {
        const organisationUnitDetailsAndConfig = await knex
            .select(
                'name',
                'parent_org',
                'has_fixed_membership_fee',
                'fixed_membership_fee_amount'
            )
            .from('organisationunits')
            .innerJoin(
                'organisationunitconfigs',
                'organisationunits.config_id',
                'organisationunitconfigs.id'
            )
            .where('name', organisation_unit_name);

        return organisationUnitDetailsAndConfig;
    } catch (err) {
        err.name = 'DATABASE_ERROR';
        throw err;
    }
}

module.exports = {
    getOrganisationUnitDetailsAndConfigByName
};
