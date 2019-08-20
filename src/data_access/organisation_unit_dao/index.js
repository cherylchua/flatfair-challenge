'use strict';

const environment = process.env.NODE_ENV || 'development';

const knex = require('knex')(require('../../../knexfile')[environment]);

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
            .leftJoin(
                'organisationunitconfigs',
                'organisationunits.config_id',
                'organisationunitconfigs.id'
            )
            .where('name', organisation_unit_name);

        return organisationUnitDetailsAndConfig[0];
    } catch (err) {
        err.name = 'DATABASE_ERROR';
        throw err;
    }
}

module.exports = {
    getOrganisationUnitDetailsAndConfigByName
};
