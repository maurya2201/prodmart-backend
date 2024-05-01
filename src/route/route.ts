import express from "express";
import { registerController, updateUserController,deleteUserController, getUserController,userVerification, loginController, getUsersController, forgotPassword, updatePasswordController, updateStateController} from "../controller/userController";
import { placeOrder, viewOrderController } from "../controller/orderController";

export const userRouter = express.Router();
export const verifyRouter =  express.Router();
export const loginRouter = express.Router();
export const forgotPasswordRouter = express.Router();
export const orderRouter = express.Router();
export const updatePasswordRouter = express.Router();
export const updateStateRouter = express.Router();
export const viewOrderRouter = express.Router();

userRouter.route('/').post(registerController).get(getUsersController);
userRouter.route('/:id').put(updateUserController).delete(deleteUserController).get(getUserController);
verifyRouter.route('/').post(userVerification);
loginRouter.route('/').post(loginController);
forgotPasswordRouter.route('/').post(forgotPassword);
orderRouter.route('/').post(placeOrder);
updatePasswordRouter.route('/:id').put(updatePasswordController);
updateStateRouter.route('/:id').put(updateStateController);
viewOrderRouter.route('/:id').get(viewOrderController);