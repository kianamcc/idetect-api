const handleSignin = (req, res, db, bcrypt) => { // check user input against database for successful signin
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Please complete all fields.")
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users') // always return
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Unable to get user'))
            }
            else {
            res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
    handleSignin: handleSignin
}