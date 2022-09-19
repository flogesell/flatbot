# TAB Teamportal

This is the new tech stack for our tab teamportal. 
Included: 
- React with Material Ui & React Query
- Nestjs with Prisma
- Portgres database

**API Doku:** http://localhost:3001/api#/

## Development

Install dependencies for all with `npm install`

run on docker with `docker-compose up`

after seed data with `docker exec tab-backend npx prisma db seed`

## Useful code snippets

Deletes and recreates the database, or performs a 'soft reset' by removing all data, tables, indexes, and other artifacts 
`docker exec tab-backend prisma migrate reset --force`
