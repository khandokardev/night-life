import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import contentRouter from "./content";
import bookingsRouter from "./bookings";
import usersRouter from "./users";
import reviewsRouter from "./reviews";
import notificationsRouter from "./notifications";
import paymentsRouter from "./payments";
import chatRouter from "./chat";
import promotionsRouter from "./promotions";
import adminRouter from "./admin";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/content", contentRouter);
router.use("/bookings", bookingsRouter);
router.use("/users", usersRouter);
router.use("/reviews", reviewsRouter);
router.use("/notifications", notificationsRouter);
router.use("/payments", paymentsRouter);
router.use("/chat", chatRouter);
router.use("/promotions", promotionsRouter);
router.use("/admin", adminRouter);
router.use("/admin", uploadRouter);

export default router;
