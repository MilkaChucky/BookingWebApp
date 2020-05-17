# BookingWebApp
A solution for users to book hotel rooms

## Project architecture

|  | Type | Name | Description |
| --- | --- | --- | --- |
| **Database** | MongoDB | BookingWebApp | MongoDB database with 3 collections (users, hotels, bookings) |
| **Backend** | NodeJS | BookingWebApi | NodeJS API |
| **Frontend** | Angular | BookingWebApp | Angular web app for booking |

## Available npm commands:
 - `npm install` : Install all dependencies for both backend and frontend
 - `npm run build` : Build docker images from both the backend and frontend
 - `npm start` : Start all docker containers according to the settings specified in the _`docker-compose.yml`_ file