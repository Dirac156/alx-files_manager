/* eslint-disable */
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
    static getConnect(req, res) {
        const Authorization = req.header('Authorization') || null;
        if (!Authorization) return res.status(401).send({ error: 'Unauthorized' });

        const buff = Buffer.from(Authorization.replace('Basic ', ''), 'base64');
        const credentials = {
          email: buff.toString('utf8').split(':')[0],
          password: buff.toString('utf8').split(':')[1],
        };

        if (!credentials.email || !credentials.password) return res.status(401).send({ error: 'Unauthorized' });
    
        credentials.password = sha1(credentials.password);
    
        const user = await DBClient.db.collection('users').findOne({ email: credentials.email, password: credentials.password });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
    
        const token = uuidv4();
        const key = `auth_${token}`;
    
        await RedisClient.set(key, user._id.toString(), 86400);
        return res.status(200).send({ token });
    }

    static getDisconnect(req, res) {

    }
}

export default AuthController;
