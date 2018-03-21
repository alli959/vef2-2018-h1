# Kröfur:

* setja skal upp Node.js
  - Installa pökkunum með `npm i`

* setja skal upp postgresql.

* .env file skal innihalda:
  - DATABASE_URL=postgresql://postgres:keytothecity@localhost:5432/hopverkefni1
  - JWT_SECRET=Itsdietconsistsoffruitsplantssmallwoodlandanimalslargewoodlandanimalswoodlandsfruitgrovesfruitfarmersandsmallcities
  - TOKEN_LIFETIME=5000000000
  - CLOUDINARY_URL=cloudinary://142165852137671:IKX-e9ZF7NfeEwaBPc9g4DiZnP4@daqflito7
  - CLOUDINARY_CLOUD=daqflito7
  - CLOUDINARY_API_KEY=142165852137671
  - CLOUDINARY_API_SECRET=IKX-e9ZF7NfeEwaBPc9g4DiZnP4
  - PAGE_LIMIT=10


# Keyrsla

## atriði fyrir neðan skulu vera keyrð í þessari röð
* keyra skal `node createdb.js` til þess að búa til database
* keyra skal `node insert-data.js` til þess að setja gögn úr books.csv inn í databaseið
* til að byrja skal keyra `node app.js` eða `npm start`

# Höfundar:

* Alexander Guðmundsson - alg35@hi.is
* Geir Garðarsson       - geg2@hi.is

### Github repo:

* https://github.com/alli959/vef2-2018-h1
 


