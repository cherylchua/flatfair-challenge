exports.up = async function(knex) {
    return await _createOrganisationUnitConfigsTable(knex)
    .then (await _createOrganisationUnitsTable(knex));
};

exports.down = async function(knex) {
    return await knex.schema.dropTableIfExists('organisationunitconfigs')
    .then (await knex.schema.dropTableIfExists('organisationunits'))
};

async function _createOrganisationUnitConfigsTable(knex) {
    return await knex.schema.createTableIfNotExists('organisationunitconfigs', function(table) {
        table.increments('id').primary().unsigned()
        table.boolean('has_fixed_membership_fee').notNullable()
        table.integer('fixed_membership_fee_amount').unsigned()
        table.timestamps(false, true)
    })
}

async function _createOrganisationUnitsTable(knex) {
    return await knex.schema.createTableIfNotExists('organisationunits', function(table) {
        table.increments('id').primary().unsigned()
        table.string('name').notNullable()
        table.string('parent_org')
        table.integer('config_id').unsigned()
        table.foreign('config_id').references('organisationunitconfigs.id').onDelete('CASCADE')
        table.timestamps(false, true)
        table.unique(['name', 'parent_org'])
    })
}
