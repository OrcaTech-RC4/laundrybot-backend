# Backend of Orcatech Laundry Bot

## Requirements

Visit `package.json`. This node app uses `cron` and `sequelize`.


## Setup

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

Then run the following with reference to https://sequelize.org/master/manual/migrations.html.
```
npx sequelize-cli db:migrate
```

## API description

### GET `/api/levels`
Returns a list of all laundry levels
```
[5,8,11,14,17]
```

### GET `/api/levels/<level_number>/statuses
Returns the machine statuses. The start time and time are all SGT. Machine duration for now can be hardcoded in a separate configuration file.

```
[{
    type: “washer-coin”,
    start-time: START_TIME,
    time: TIME,
    status: 0/1/2,
    machine-duration: 30, (in minutes),
    level: 5
}. {
    type: “washer-ezlink”,
    start-time: START_TIME,
    time: TIME,
    status: 0/1/2,
    machine-duration: 30, (in minutes),
    level: 5
}. {
    type: “dryer-ezlink”,
    start-time: START_TIME,
    time: TIME,
    status: 0/1/2,
    machine-duration: 40, (in minutes),
    level: 5
}. {
    type: “dryer-coin”,
    start-time: START_TIME,
    time: TIME,
    status: 0/1/2,
    machine-duration: 40, (in minutes),
    level: 5
}]
```

### GET `/api/levels/<level_number>/charts`
Returns a list for each day, containing a list of INTEGERS (0 < x < 60) showing the hourly runtime of machines. The list has n = 24 entries each (stands for every hour, per 60 minute increments). First entry is 00:00 - 00:55, last entry is 23:00 - 23:55. Example, a machine runs from 00:10 - 00:50 on Monday, that means the first entry on Mon is 40. Rounded off to the nearest 5 mins.

```
{
  mon: [40, 0, 60, 10, …, 10, 20],
  tue: [0, 10, 20, 30, …, 0, 0],
  wed: [0, 0, 0, 35, …, 10, 10],
  thu: [40, 0, 60, 10, …, 10, 15],
  fri: [40, 0, 0, 0, …, 50, 60],
  sat: [40, 0, 60, 10, …, 15, 15],
  sun: [40, 0, 60, 10, …, 10, 10]
}
```

### POST `/api/update`

This lets the raspberry pi send an update to the machine, whenever there is a status change. The numbers in data are the statuses of the machines, representing the following: 0 - Off; 1 - On; 2 - Soon is done. The data field is a four digit number encoded as a string. From left to right, the machine types are: “washer-coin”, “washer-ezlink”, “dryer-ezlink”, “dryer-coin”.

```
{
  floor: <int> floor_number, (e.g. 5)
  data: <str> ABCD (e.g. 0102)
}
```