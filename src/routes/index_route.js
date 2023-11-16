import { Router } from "express";
import { card } from "../controllers/cards_controller.js";



const router = Router();

//Endpoints
router.get('/cards',card.GET);
router.post('/cards',card.POST);
router.put('/cards/:id',card.PUT);
router.delete('/cards/:id',card.DELETE);

router.get('/cards/:id',card.GET_BY_ID);
router.get('/card/iscompleted=true',card.GET_COMPLETED_TASKS)
router.get('/card/iscompleted=false',card.GET_OPEN_TASKS)
export default router