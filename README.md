# Flatfair Challenge

A web application to calculate membership fee based on the rental amount, period of rent, and the organisation unit. 

## Getting Started

### Installation

Use npm to install all dependencies.

```
npm install
```

### Running Tests

The test suite uses Jest. Several processes are built into the test command, running it triggers the Prettier formatter, Eslint and Jest. 

```
npm test
```

### Database
The SQLite3 database has already been seeded. If you would like to re-boot the database, please remove the database file and use knex to migrate and seed the database. 

```
rm database/dev.sqlite3
knex migrate:latest --env development
knex seed:run --env development
```

## Running the App
The application has not been deployed to any servers. To run the application, use the command:
```
node src/app.js 
```

### API Requests
The app's default port is 3000. There is only one endpoint in the application, with the purpose of calculating membership fee.  

To make a request, make a [Postman](https://www.getpostman.com/) request to ```http://localhost:3000/calculate-membership-fee``` with an example body structure below
```
{
	"rent_amount": { integer },
	"rent_period": { string },
	"organisation_unit": { string }
}
```

![image](https://user-images.githubusercontent.com/32840688/63343240-666ba080-c345-11e9-8227-e80435d10d37.png)

### Possible Error Responses

1. Express Validation Errors: Request body must conform to these rules
```{
    rent_amount: Joi.number()
        .integer()
        .min(1)
        .max(Number.MAX_SAFE_INTEGER)
        .required(),
    rent_period: Joi.string()
        .valid(RENT_PERIODS.WEEK, RENT_PERIODS.MONTH)
        .required(),
    organisation_unit: Joi.string().required()
}
```

2. RangeError: The `rent_amount` must be within these constraints
```
    MIN_RENT_AMOUNT_PER_WEEK: 25,
    MIN_RENT_AMOUNT_PER_MONTH: 110,
    MAX_RENT_AMOUNT_PER_WEEK: 2000,
    MAX_RENT_AMOUNT_PER_MONTH: 8660
``` 

3. DATABASE_ERROR: There is an issue connecting or querying from the database, for example
```
{
    "error_name": "DATABASE_ERROR",
    "error_message": "select `name`, `parent_org`, `has_fixed_membership_fee`, `fixed_membership_fee_amount` from `organisationunits` left join `organisationunitconfigs` on `organisationunits`.`config_id` = `organisationunitconfigs`.`id` where `name` = 'branch_d' - SQLITE_ERROR: no such table: organisationunits"
}
```

4. CALCULATE_MEMBERSHIP_FEE_ERROR: Errors in calculating membership fee

## Built With
- [ExpressJS](https://expressjs.com/)
- SQLite3 with [Knex](http://knexjs.org/)
- [Jest](https://jestjs.io/docs/en/getting-started)
