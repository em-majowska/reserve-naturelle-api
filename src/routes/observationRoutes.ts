import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createObservationSchema,
  getObservationsSchema,
} from "../schemas/observationSchemas";
import * as observationController from "../controllers/observationController";
import { paramsIdSchema } from "../const";
const router = Router();

router.get("/", validate(getObservationsSchema), observationController.getAll);
router.get("/:id", validate(paramsIdSchema), observationController.getById);
router.post(
  "/",
  validate(createObservationSchema),
  observationController.create,
);
router.delete("/:id", validate(paramsIdSchema), observationController.remove);

export default router;
