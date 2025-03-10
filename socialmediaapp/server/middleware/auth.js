import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(403).send({ error: 'Access Denied' });
        }
        if (token.startsWith('PhotoSynthesis ')) {
            token = token.slice(15, token.length).trimStart();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'AlmostImpossibleToGuess')
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}