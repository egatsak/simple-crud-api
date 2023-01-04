import Router from "../framework/Router";
import * as controller from "./user-controller";
const router = new Router();

router.get("/api/users", controller.getUsers);

router.post("/api/users/:id", controller.createUser);

export default router;
