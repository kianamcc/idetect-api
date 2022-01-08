/*
Planning - create these endpoints then test w/ Postman
/ --> res = this is working
/ signin --> POST = sucess/fail (posting some data, user info)
/ resgister --> POST = user (new user)
/ profile/:userId --> GET = user (get user info)
/ image --> PUT --> user (updating score)
*/

const express = require('express');
const cors = require('cors'); // by[ass access control allow origin security error
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const entries = require('./controllers/entries');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
});

const app = express(); // create app variable
app.use(express.json()); // after app variable created

app.use(cors());

app.get('/', (req, res) => {res.send('success')})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt )})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // inject required dependencies 

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => { entries.handleEntries(req, res, db)})

app.post('/imageurl', (req, res) => { entries.handleAPICall(req, res)})

// ************************* RUN APP ************************* //
app.listen(process.env.PORT || 3000, () => { // run on port 3000
    console.log(`app is running on port ${process.env.PORT}`);
})