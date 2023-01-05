import Router from "../framework/Router";
import * as controller from "./user-controller";
const router = new Router();

router.get("/api/users", controller.getUsers);
router.post("/api/users", controller.createUser);
router.get("/api/users/:id", controller.getUser);
router.put("/api/users/:id", controller.updateUser);
router.delete("/api/users/:id", controller.deleteUser);

export default router;
