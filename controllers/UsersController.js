/* eslint-disable */
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class UsersController {
    static async postNew(req, res) {
        if (!req.body.email) return res.status(400).send({ error: 'Missing email' });

        if (!req.body.password) return res.status(400).send({ error: 'Missing password'});

        const ExistingEmail = DBClient.database.collection('users').findOne({ email: req.body.email });

        if (ExistingEmail) return res.status(400).send({ error: 'Already exist'});

        const securedPassword = sha1(req.body.password);

        const userCreated = await DBClient.database.collection('users').insertOne({ email: req.body.email, password: securedPassword });
        return res.status(201).send({ id: userCreated.insertedId, email: req.body.email });
    }

    static async getMe(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });
    
        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });
    
        const user = await DBClient.db.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        delete user.password;
    
        return res.status(200).send({ id: user._id, email: user.email })
    }
}

export default UsersController ;
