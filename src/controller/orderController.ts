import Order from "../schema/order";
import { Request,Response } from "express";
import User from "../schema/user";
import nodemailer from "nodemailer";

const mailer = (mail:any, order:string) => {
  const transporter = nodemailer.createTransport({
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
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

function emailTemplate(rows:string){
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

export const placeOrder=async(req:Request,res:Response)=>{
  try{
    let order:string =``;
    const {uid} = req.body[0];
    const _id = uid;
    const findEmail = await User.find({_id});
    const email = findEmail[0].email;
    const orders = await Order.create(req.body);
    if(Array.isArray(orders)){
      orders.map((element)=>{
        order+=`<tr>
        <td>${element.title}</td>
        <td><img src="${element.thumbnail}" height="100px" width="150px" loadin="lazy"></td>
        <td>$${element.totalprice}</td>
        <td>${element.quantity}</td>
        </tr>`
      })}
      mailer(email,emailTemplate(order));
    res.status(200).json({message:"Order placed successfully!"});
  }catch(error){
    res.status(400).json(error);
  }
}

export const viewOrderController=async(req:Request,res:Response)=>{
  try{
  const uid = req.params.id;
  const orders = await Order.find({uid});
  const data:{}[] = orders;
  if(data.length==0){
    res.status(404).json({message:"not found"});
  }else{
    res.status(200).json(orders);
  }
}catch(error){
  res.status(400).json(error);
}
}
