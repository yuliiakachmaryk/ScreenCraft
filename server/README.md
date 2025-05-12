# Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# ScreenCraft API Documentation

This document provides information about the available API endpoints, their request/response formats, and example usage.

## Base URL

```
http://localhost:4000
```

## Endpoints

### Home Screen Configuration

#### Get All Configurations
```http
GET /home-screen
```
Response:
```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "isActive": true,
    "recomendaciones": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Breaking Bad",
        "introImage": "breaking-bad.jpg",
        "isExclusive": true,
        "category": "Drama",
        "episodes": []
      }
    ],
    "topCharts": [],
    "mostTrending": [],
    "mostPopular": [],
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

#### Get Active Configuration
```http
GET /home-screen/active
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    }
  ],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Get Configuration by ID
```http
GET /home-screen/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    }
  ],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Create Configuration
```http
POST /home-screen
```
Request Body:
```json
{
  "isActive": true,
  "recomendaciones": ["60d21b4667d0d8992e610c86"],
  "topCharts": ["60d21b4667d0d8992e610c87"],
  "mostTrending": ["60d21b4667d0d8992e610c88"],
  "mostPopular": ["60d21b4667d0d8992e610c89"]
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    }
  ],
  "topCharts": [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Game of Thrones",
      "introImage": "got.jpg",
      "isExclusive": true,
      "category": "Fantasy",
      "episodes": []
    }
  ],
  "mostTrending": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Stranger Things",
      "introImage": "stranger-things.jpg",
      "isExclusive": false,
      "category": "Sci-Fi",
      "episodes": []
    }
  ],
  "mostPopular": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "The Office",
      "introImage": "the-office.jpg",
      "isExclusive": false,
      "category": "Comedy",
      "episodes": []
    }
  ],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Update Configuration
```http
PATCH /home-screen/:id
```
Request Body:
```json
{
  "isActive": false,
  "recomendaciones": ["60d21b4667d0d8992e610c86", "60d21b4667d0d8992e610c87"],
  "topCharts": ["60d21b4667d0d8992e610c88"],
  "mostTrending": ["60d21b4667d0d8992e610c89"],
  "mostPopular": []
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": false,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    },
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "Game of Thrones",
      "introImage": "got.jpg",
      "isExclusive": true,
      "category": "Fantasy",
      "episodes": []
    }
  ],
  "topCharts": [
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Stranger Things",
      "introImage": "stranger-things.jpg",
      "isExclusive": false,
      "category": "Sci-Fi",
      "episodes": []
    }
  ],
  "mostTrending": [
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "The Office",
      "introImage": "the-office.jpg",
      "isExclusive": false,
      "category": "Comedy",
      "episodes": []
    }
  ],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:30:00.000Z"
}
```

#### Set Configuration as Active
```http
PATCH /home-screen/:id/active
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    }
  ],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:00:00.000Z"
}
```

#### Delete Configuration
```http
DELETE /home-screen/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Add Content Item to Section
```http
POST /home-screen/:id/section/:sectionName/content/:contentItemId
```
Example:
```http
POST /home-screen/60d21b4667d0d8992e610c85/section/recomendaciones/content/60d21b4667d0d8992e610c86
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Breaking Bad",
      "introImage": "breaking-bad.jpg",
      "isExclusive": true,
      "category": "Drama",
      "episodes": []
    }
  ],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T11:30:00.000Z"
}
```

#### Remove Content Item from Section
```http
DELETE /home-screen/:id/section/:sectionName/content/:contentItemId
```
Example:
```http
DELETE /home-screen/60d21b4667d0d8992e610c85/section/recomendaciones/content/60d21b4667d0d8992e610c86
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "isActive": true,
  "recomendaciones": [],
  "topCharts": [],
  "mostTrending": [],
  "mostPopular": [],
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T12:00:00.000Z"
}
```

### Content Items

#### Get All Content Items
```http
GET /content-items
```
Response:
```json
[
  {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Breaking Bad",
    "introImage": "breaking-bad.jpg",
    "isExclusive": true,
    "category": "Drama",
    "episodes": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Pilot",
        "isExclusive": true,
        "likesNumber": 1000,
        "reviewed": true,
        "createdAt": "2024-03-20T10:00:00.000Z",
        "updatedAt": "2024-03-20T10:00:00.000Z"
      }
    ]
  }
]
```

#### Get Content Item by ID
```http
GET /content-items/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Pilot",
      "isExclusive": true,
      "likesNumber": 1000,
      "reviewed": true,
      "createdAt": "2024-03-20T10:00:00.000Z",
      "updatedAt": "2024-03-20T10:00:00.000Z"
    }
  ]
}
```

#### Create Content Item
```http
POST /content-items
```
Request Body:
```json
{
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama"
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": []
}
```

#### Update Content Item
```http
PATCH /content-items/:id
```
Request Body:
```json
{
  "name": "Breaking Bad Season 1",
  "introImage": "breaking-bad-s1.jpg",
  "isExclusive": true,
  "category": "Drama"
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad Season 1",
  "introImage": "breaking-bad-s1.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Pilot",
      "isExclusive": true,
      "likesNumber": 1000,
      "reviewed": true,
      "createdAt": "2024-03-20T10:00:00.000Z",
      "updatedAt": "2024-03-20T10:00:00.000Z"
    }
  ]
}
```

#### Delete Content Item
```http
DELETE /content-items/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": []
}
```

#### Add Episode to Content Item
```http
POST /content-items/:id/episodes/:episodeId
```
Example:
```http
POST /content-items/60d21b4667d0d8992e610c86/episodes/60d21b4667d0d8992e610c90
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Pilot",
      "isExclusive": true,
      "likesNumber": 1000,
      "reviewed": true,
      "createdAt": "2024-03-20T10:00:00.000Z",
      "updatedAt": "2024-03-20T10:00:00.000Z"
    }
  ]
}
```

#### Remove Episode from Content Item
```http
DELETE /content-items/:id/episodes/:episodeId
```
Example:
```http
DELETE /content-items/60d21b4667d0d8992e610c86/episodes/60d21b4667d0d8992e610c90
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Breaking Bad",
  "introImage": "breaking-bad.jpg",
  "isExclusive": true,
  "category": "Drama",
  "episodes": []
}
```

### Episodes

#### Get All Episodes
```http
GET /episodes
```
Response:
```json
[
  {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Pilot",
    "isExclusive": true,
    "likesNumber": 1000,
    "reviewed": true,
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
]
```

#### Get Episode by ID
```http
GET /episodes/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "name": "Pilot",
  "isExclusive": true,
  "likesNumber": 1000,
  "reviewed": true,
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Create Episode
```http
POST /episodes
```
Request Body:
```json
{
  "name": "Pilot",
  "isExclusive": true,
  "likesNumber": 0,
  "reviewed": false
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "name": "Pilot",
  "isExclusive": true,
  "likesNumber": 0,
  "reviewed": false,
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

#### Update Episode
```http
PATCH /episodes/:id
```
Request Body:
```json
{
  "name": "Pilot Episode",
  "isExclusive": true,
  "likesNumber": 1000,
  "reviewed": true
}
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "name": "Pilot Episode",
  "isExclusive": true,
  "likesNumber": 1000,
  "reviewed": true,
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:30:00.000Z"
}
```

#### Delete Episode
```http
DELETE /episodes/:id
```
Response:
```json
{
  "_id": "60d21b4667d0d8992e610c90",
  "name": "Pilot",
  "isExclusive": true,
  "likesNumber": 1000,
  "reviewed": true,
  "createdAt": "2024-03-20T10:00:00.000Z",
  "updatedAt": "2024-03-20T10:00:00.000Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### Not Found (404)
```json
{
  "statusCode": 404,
  "message": "Home screen configuration with ID 60d21b4667d0d8992e610c85 not found",
  "error": "Not Found"
}
```

### Bad Request (400)
```json
{
  "statusCode": 400,
  "message": "Invalid request body",
  "error": "Bad Request"
}
```

## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:4000`.
