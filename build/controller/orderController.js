"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewOrderController = exports.placeOrder = void 0;
const order_1 = __importDefault(require("../schema/order"));
const user_1 = __importDefault(require("../schema/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer = (mail, order) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: "mauryasoni71@gmail.com",
            pass: "otaj woaa kcsa lqea",
        },
    });
    const mailOptions = {
        from: "mauryasoni71@gmail.com",
        to: `${mail}`,
        subject: "Order details",
        text: "Your order details",
        html: `${order}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        }
        else {
            console.log("Email sent: ", info.response);
        }
    });
};
function emailTemplate(rows) {
    return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Order</title>
    <style>
    body{
      background-color:#DFF5FF;
      margin: 0%;
      padding: 0%;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    table{
      width: 50%;
      margin: auto;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid black;
      text-align: center;
    }
    th, td {
      padding: 10px;
    }
    th{
      background-color:#5BBCFF;
      color:white;  
      font-size:20px;
    }
    td{
      font-size:16px;
    }
    </style>
  </head>
  <body>
    <center>
      <h1>Your order</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </center>
  </body>
  </html>
  
  `;
}
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let order = ``;
        const { uid } = req.body;
        const findEmail = yield user_1.default.findOne(uid);
        const email = findEmail === null || findEmail === void 0 ? void 0 : findEmail.email;
        const orders = yield order_1.default.create(req.body);
        if (Array.isArray(orders)) {
            orders.map((element) => {
                order += `<tr>
        <td>${element.title}</td>
        <td><img src="${element.thumbnail}" height="100px" width="150px" loadin="lazy"></td>
        <td>$${element.totalprice}</td>
        <td>${element.quantity}</td>
        </tr>`;
            });
        }
        mailer(email, emailTemplate(order));
        res.status(200).json({ message: "Order placed successfully!" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.placeOrder = placeOrder;
const viewOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uid = req.params.id;
        const orders = yield order_1.default.find({ uid });
        const data = orders;
        if (data.length == 0) {
            res.status(404).json({ message: "not found" });
        }
        else {
            res.status(200).json(orders);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.viewOrderController = viewOrderController;
