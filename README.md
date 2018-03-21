# Hópverkefni 1 - Bókaþjónusta

## Vefforritun 2 2018 - Háskóli Íslands

## Kröfur fyrir forrit:

* [Node.js](https://nodejs.org/en/)
  - Installa pökkunum með `npm i`

* [PSQL](https://www.postgresql.org/)

* [Cloudinary](https://cloudinary.com/) aðgangur

* .env file skal innihalda:
  - DATABASE_URL - Url fyrir postgres gagnagrunn
  - JWT_SECRET - Secret fyrir JWT
  - TOKEN_LIFETIME - Tala - token líftími
  - CLOUDINARY_URL - Cloudinary
  - CLOUDINARY_CLOUD - Fengið á Cloudinary
  - CLOUDINARY_API_KEY - Fengið á Cloudinary
  - CLOUDINARY_API_SECRET - Fengið á Cloudinary
  - PAGE_LIMIT - Fjöldi niðurstaðna á síðu, default 10


## Uppsetning

* keyra `node createdb.js` til þess að búa til database
* keyra `node insert-data.js` til þess að setja prufugögn inn í gagnagrunn
* til að byrja skal keyra `node app.js` eða `npm start`

## Notkunardæmi

#### POST á: `/register` 
með json-body:    
```javascript
{
  "username": "newusername",
  "name": "newname",
  "password": "securepassword"  
}
```
skilar:
```javascript
{
  "username": "newusername",
  "name": "newname",
  "photo": ""  
}
```
#### POST á: `/login` 
með json-body:    
```javascript
{
  "username": "newusername",
  "password": "securepassword"  
}
```
skilar:
```javascript
{
  "token": // generated token
  "expiresIn": // TOKEN_LIFETIME
}
```
#### GET á: `/users` 
með `?offset` til að velja síðu-offset skilar:
```javascript
{
  "limit": // item-limit
  "offset": // PAGE_OFFSET
  "items": [
    // x many user objects
  ]
}
```
#### GET á: `/users/:id` 
skilar:
```javascript
{
  "id": // :id
  "username": "newusername",
  "name": "newname",
  "photo": ""  
}
```
#### GET á: `/users/me` 
skilar:
```javascript
{
  "id": // logged-in user
  "username": 
  "name": 
  "photo":   
}
```
#### PATCH á `/users/me`
uppfærir mynd
```javascript
{
  "photo": // cloudinary url  
}
```

* `/categories`
  - `GET` skilar _síðu_ af flokkum
  - `POST` býr til nýjan flokk og skilar
* `/books`
  - `GET` skilar _síðu_ af bókum
  - `POST` býr til nýja bók ef hún er gild og skilar
* `/books?search=query`
  - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
* `/books/:id`
  - `GET` skilar stakri bók
  - `PATCH` uppfærir bók
* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda
* `/users/me/read`
  - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
  - `POST` býr til nýjan lestur á bók og skilar
* `/users/me/read/:id`
  - `DELETE` eyðir lestri bókar fyrir innskráðann notanda


## Höfundar:

* Alexander Guðmundsson - alg35@hi.is [GitHub](https://github.com/alli959)
* Geir Garðarsson       - geg42@hi.is [GitHub](https://github.com/geirgardarsson)




