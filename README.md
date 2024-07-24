<p align="center">
  <a target="blank"><img src="https://upload.wikimedia.org/wikipedia/pt/d/dc/Academy_Award_trophy.jpg" width="200" alt="Academy Award trophy" /></a>
</p>

## Project Title

Golden Raspberry Awards API

## Description

A RESTful API to enable reading the list of nominees and winners in the Worst Picture category of the Golden Raspberry Awards.

This project was developed using NestJs, TypeScript, and Prisma ORM. Upon starting the project, a CSV file will be read, and its content will be added to an in-memory database. The CSV file is located in a folder named assets at the root of the project. If you wish to replace this file, the new file must have the same name.

```bash
movielist.csv
```

## Technology Stack

    •	NestJs
    •	TypeScript
    •	Prisma ORM
    •	SqlLite

## Notes

- The database is in-memory and uses SQLite. No external installation is required.

## API Maturity

This project was developed based on level 2 of Richardson’s Maturity Model. As a result, the following endpoints are available:

    •	/movie/: This path allows all operations including create, findAll, findOne, update, and remove.
    •	/report/producer-intervals: This path returns the expected results as specified in the test requirements.

## Usage

To run the project, follow these steps:

    1.	Clone the repository
    2.	Install dependencies using npm install
    3.	Execute the comando mpx prisma db push to create the database structure
    4.	Start the project using npm run start

Ensure the CSV file is located in the assets folder at the root of the project.

## Integration Tests

The project includes integration tests to ensure the data retrieved is consistent with the data provided in the proposal. These tests are implemented using Jest and can be run using

```bash
$ npm run test:e2e
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```
