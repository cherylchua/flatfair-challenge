
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('organisationunitconfigs').del()
    .then(function() {
      return knex('organisationunits').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('organisationunitconfigs').insert([
        {id: 1, has_fixed_membership_fee: false, fixed_membership_fee_amount: 0},
        {id: 2, has_fixed_membership_fee: true, fixed_membership_fee_amount: 25000},
        {id: 3, has_fixed_membership_fee: true, fixed_membership_fee_amount: 35000},
        {id: 4, has_fixed_membership_fee: true, fixed_membership_fee_amount: 45000}
      ]);
    })
    .then(function() {
      return knex('organisationunits').insert([
        {id: 1, name: 'client', parent_org: null, config_id: 1},
        {id: 2, name: 'division_a', parent_org: 'client', config_id: 1},
        {id: 3, name: 'division_b', parent_org: 'client', config_id: 3},
        {id: 4, name: 'area_a', parent_org: 'division_a', config_id: 4},
        {id: 5, name: 'area_b', parent_org: 'division_a', config_id: 1},
        {id: 6, name: 'area_c', parent_org: 'division_b', config_id: 4},
        {id: 7, name: 'area_d', parent_org: 'division_b', config_id: 1},
        {id: 8, name: 'branch_a', parent_org: 'area_a', config_id: null},
        {id: 9, name: 'branch_b', parent_org: 'area_a', config_id: 1},
        {id: 10, name: 'branch_c', parent_org: 'area_a', config_id: 1},
        {id: 11, name: 'branch_d', parent_org: 'area_a', config_id: null},
        {id: 12, name: 'branch_e', parent_org: 'area_b', config_id: 1},
        {id: 13, name: 'branch_f', parent_org: 'area_b', config_id: 1},
        {id: 14, name: 'branch_g', parent_org: 'area_b', config_id: 1},
        {id: 15, name: 'branch_h', parent_org: 'area_b', config_id: 1},
        {id: 16, name: 'branch_i', parent_org: 'area_c', config_id: 1},
        {id: 17, name: 'branch_j', parent_org: 'area_c', config_id: 1},
        {id: 18, name: 'branch_k', parent_org: 'area_c', config_id: 2},
        {id: 19, name: 'branch_l', parent_org: 'area_c', config_id: 1},
        {id: 20, name: 'branch_m', parent_org: 'area_d', config_id: null},
        {id: 21, name: 'branch_n', parent_org: 'area_d', config_id: 1},
        {id: 22, name: 'branch_o', parent_org: 'area_d', config_id: 1},
        {id: 23, name: 'branch_p', parent_org: 'area_d', config_id: 1}
      ])
    })
};
