import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as speciesController from "../controllers/speciesController";
import { paramsIdSchema } from "../const";
import {
  addSpeciesToZoneSchema,
  createSpeciesSchema,
  queryParamsSchema,
  removeSpeciesToZoneSchema,
  updateSpeciesSchema,
} from "../schemas/speciesSchemas";
const router = Router();

router.get("/", validate(queryParamsSchema), speciesController.getAll);
router.get("/:id", validate(paramsIdSchema), speciesController.getById);
router.post("/", validate(createSpeciesSchema), speciesController.create);
router.put("/:id", validate(updateSpeciesSchema), speciesController.update);
router.delete("/:id", validate(paramsIdSchema), speciesController.getById);

router.post(
  "/:id/zones",
  validate(addSpeciesToZoneSchema),
  speciesController.addSpecies,
);
router.delete(
  "/:id/zones/:zoneId",
  validate(removeSpeciesToZoneSchema),
  speciesController.removeSpecies,
);

export default router;
