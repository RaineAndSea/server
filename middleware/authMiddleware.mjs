import jwt from 'jsonwebtoken';

export const secure = (req, res, next) => {
    let token = req.headers['authorization'];
    if(!token) {
        return res.status(403).json({errorMessage: 'Unauthorized'});
    }
    
    token = token.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errorMessage: 'Unauthorized' });
      }
      req.decodedToken = decoded;
      next();
    });
  };

  export const protectedWithRole = (role) => (req, res, next) => {
    let token = req.headers['authorization'];
    if(!token) {
        return res.status(403).json({errorMessage: 'Unauthorized'});
    }
    
    token = token.replace('Bearer ', '');
    if (!token) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errorMessage: 'Unauthorized' });
      }

      if(decoded.role !== role) {
        return res.status(403).json({ errorMessage: 'Unauthorized' });
      }
  
      req.decodedToken = decoded;
      next();
    });
  }