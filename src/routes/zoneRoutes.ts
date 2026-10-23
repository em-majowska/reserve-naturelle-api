import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as zoneController from "../controllers/zoneController";
import { paramsIdSchema } from "../const";
import { createZoneSchema, updateZoneSchema } from "../schemas/zoneSchemas";

const router = Router();

router.get("/", zoneController.getAll);
router.get("/:id", validate(paramsIdSchema), zoneController.getById);
router.post("/", validate(createZoneSchema), zoneController.create);
router.put("/:id", validate(updateZoneSchema), zoneController.update);
router.delete("/:id", validate(paramsIdSchema), zoneController.remove);

export default router;
