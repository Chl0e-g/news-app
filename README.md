# Northcoders News API

## Database connection set-up
This repo uses environment variables to connect to the test and development databases locally. After cloning this repo, create the following .env files in the root directory:

| File             | Contents                             |
| ---------------- | ------------------------------------ |
| .env.test        | PGDATABASE=<test_database_name_here> |
| .env.development | PGDATABASE=<dev_database_name_here>  |