import { Router } from "express";
import { tag } from "../controllers/tags_controller.js"


const router = Router();

//Endpoints
router.get('/tags',tag.GET);
router.post('/tags',tag.POST);
router.delete('/tags/:id',tag.DELETE);
router.get('/tags/:id',tag.GET_BY_ID);

export default router