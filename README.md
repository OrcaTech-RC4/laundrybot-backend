# Backend of Orcatech Laundry Bot

In your local repo directory, create a directory called `config` and a `config.json` file inside that contains the following:
```
{
  "development": {
    "username": "yourdevusername",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorAliases": 0
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "postgres",
    "password": "XXXX",
    "database": "orcatech-laundrybot",
    "host": "188.166.181.174",
    "dialect": "postgres"
  }
}

```