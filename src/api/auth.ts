import { Router } from 'express';
const r = Router();
r.post('/login', (req,res) => res.json({token:'jwt-token'}));
export default r;






