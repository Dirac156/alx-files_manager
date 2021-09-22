/* eslint-disable */

class AuthController {
    static getConnect(req, res) {
        const token = req.header('Authorization') || null;
        if (!token) return response.status(401).send({ error: 'Unauthorized' });
    }

    static getDisconnect(req, res) {
        
    }
}

export default AuthController;
