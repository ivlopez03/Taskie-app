import { Router } from "express";
import { card } from "../controllers/cards_controller.js";


const router = Router();

//Endpoints
router.get('/cards',card.GET);
router.post('/cards',card.POST);
router.put('/cards/:id',card.PUT);
router.delete('/cards/:id',card.DELETE);


export default router