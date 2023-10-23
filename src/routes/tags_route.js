import { Router } from "express";
import { tag } from "../controllers/tags_controller.js"


const router = Router();

//Endpoints
router.get('/tags',tag.GET);
router.post('/tags',tag.POST);
router.delete('/tags/:id',tag.DELETE);


export default router