import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import adminRouter from "./admin.js";
import competitionsRouter from "./competitions.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(competitionsRouter);

export default router;
