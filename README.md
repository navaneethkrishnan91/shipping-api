# Shipping Backend

This is a simple NestJS web application that provides APIs to insert and list packages.

## Requirements
- Node.js version 14.x or higher
- npm package manager
- Docker (optional)

## Installation

- Clone the repository to your local machine.
- Open a terminal and navigate to the project's root directory.
- Run `npm install` to install the required dependencies.

## Running the App Locally
- Run `npm run build` to build the app.
- Run `npm run start` to start the app.
- Open a web browser and navigate to http://localhost:3000.

## Running the App with Docker
- Make sure you have Docker installed on your machine.
- Open a terminal and navigate to the project's root directory.
- Run `docker-compose up --build` to build and start the Docker container.
- Open a web browser and navigate to http://localhost:3000.

## Testing
- Run `npm run test` to run the unit tests for the app.

## e2e Testing [Only inside docker container shell]
- Run `npm run test:e2e` to run the end-to-end tests for the app

## API Routes
The following routes have been implemented:

### All Parcels
- URL: 
       [GET] /parcels
- Optional Query Parameters:
        description: [string]
        country: [string]
- Response status:
        status: 200
- Response Body:
```
[
    {
        "id" [number],
        "sku" [string],
        "description": [string],
        "address": [string],
        "town": [string],
        "country": [string],
        "deliveryDate": [date]
    },
    ...
]
```
### Check Duplicate SKUs

- URL: 
        [GET] /parcels/skus/:sku
- Response status:
        status: 200
- Response Body:
```
{
    "exists": boolean
}
```

### Insert Parcel
- URL: 
        [POST] /parcels
- Request Body:
```
{
    "sku" [string],
    "description": [string],
    "address": [string],
    "town": [string],
    "country": [string],
    "deliveryDate": [date]
}
```
- Response status:
        status: 201

- Response body:
```
{
    "sku" [string],
    "description": [string],
    "address": [string],
    "town": [string],
    "country": [string],
    "deliveryDate": [date],
    "id": [number]
}
```



