"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const route_1 = require("./route/route");
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/user/", route_1.userRouter);
app.use("/api/verifyuser/", route_1.verifyRouter);
app.use("/api/login/", route_1.loginRouter);
app.use("/api/forgotpassword/", route_1.forgotPasswordRouter);
app.use("/api/order/", route_1.orderRouter);
app.use("/api/updatepassword/", route_1.updatePasswordRouter);
app.use("/api/updatestate/", route_1.updateStateRouter);
app.use("/api/vieworder/", route_1.viewOrderRouter);
app.listen(process.env.PORT, () => {
    console.log(`app running on ${process.env.PORT}`);
});
