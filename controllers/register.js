const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("Please complete all fields.")
    }
    const hash = bcrypt.hashSync(password);

        db.transaction(trx => { // when you have to do more than two things in database, use trx
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*') // return all columns
                .insert({
                    email: loginEmail[0], // email is email from the body (user input)
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]) // database.users is an array
                })
            })
            .then(trx.commit) // if all the above passes, send through
            .catch(trx.rollback) // if anything fails rollback changes
        })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = { //
    handleRegister: handleRegister
}