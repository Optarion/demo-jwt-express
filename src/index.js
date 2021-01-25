const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3033;

const jwtSecret = 'Sup3r_S3cr3t';

const authorisedUsers = {
    nibbler: 'coucou',
    tommy: 'bestCoach'
};

app.use(cookieParser());

const authMiddleware = (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).send('You have no token and thus you are not authorized. Please login at ./signup')
    }

    const { login: decodedLogin, password: decodedPassword } = jwt.verify(token, jwtSecret)

    const stringifiedToken = JSON.stringify({login: decodedLogin, password: decodedPassword})

    return authorisedUsers[decodedLogin] === decodedPassword
        ? res.status(200).send(`Hello ${decodedLogin}. Your token is ${stringifiedToken}`)
        : res.status(401).send(`Your token ${stringifiedToken} is wrong and thus you are not authorized. Please login at ./signup`)
};

app.get('/', authMiddleware, (req, res) => {
    const { login, password } = req.query;


});

app.get('/signup', (req, res) => {
    const { login, password } = req.query;

    if (!login || !password || authorisedUsers[login] !== password) {
        return res.status(401).send('You are not authorized')
    }

    const token = jwt.sign({ login, password }, jwtSecret, {
		algorithm: 'HS256',
	});

    res.cookie('token', token);

    res.send(`Hello World ! ${login}. You are now logged in`)
});

app.listen(port, () => {
    console.log('Server is listening');
});
