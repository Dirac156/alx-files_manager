/* eslint-disable */
import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class UsersController{
    static async postNew(req, res) {
        if (!req.body.email) return res.status(400).send({ error: 'Missing email' });

        if (!req.body.password) return res.status(400).send({ error: 'Missing password'});

        const ExistingEmail = DBClient.database.collection('users').findOne({ email: req.body.email });

        if (ExistingEmail) return res.status(400).send({ error: 'Already exist'});

        const securedPassword = sha1(req.body.password);

        await DBClient.database.collection('users').insertOne({ email: req.body.email, password: securedPassword });
        return response.status(201).send({ id: result.insertedId, email: req.body.email });
    }
}

export default UsersController;
