import express,{Application} from "express";
const app:Application = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({path:".env"})
import morgan from "morgan";
import connectDb from "./config/db";
import { forgotPasswordRouter, loginRouter, orderRouter, updatePasswordRouter, updateStateRouter, userRouter,verifyRouter,viewOrderRouter} from "./route/route";
connectDb();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user/",userRouter);
app.use("/api/verifyuser/",verifyRouter);
app.use("/api/login/",loginRouter);
app.use("/api/forgotpassword/",forgotPasswordRouter);
app.use("/api/order/",orderRouter);
app.use("/api/updatepassword/",updatePasswordRouter);
app.use("/api/updatestate/",updateStateRouter);
app.use("/api/vieworder/",viewOrderRouter);

app.listen(process.env.PORT,()=>{
  console.log(`app running on ${process.env.PORT}`);
});
