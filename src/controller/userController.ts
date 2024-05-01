import { Response, Request } from "express";
import bcrypt from "bcrypt";
import User from "../schema/user";
import nodemailer from "nodemailer";

const mailer = (mail: string, otp: any) => {
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
    subject: "Email verification",
    text: "Email verification",
    html: `<h1><pre>Your otp is:${otp}</pre></h1>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

function otpGenerator() {
  let otp = ``;
  for (let i = 0; i < 5; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

interface Details {
  name: string;
  email: string;
  password: string;
  mobile: number;
  gender: string;
  otp: number;
  isUser: boolean;
  state: boolean;
}

export const registerController = async (req: Request, res: Response) => {
  try {
    let { name, email, password, mobile, otp, isUser, gender, state } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      res.status(200).json({ message: "user exist" });
    } else {
      const salt = await bcrypt.genSalt(5);
      password = await bcrypt.hash(password, salt);
      const details: Details = {
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        gender: gender,
        otp: otp,
        isUser: isUser,
        state: state
      }
      const newUser = await User.create(details);
      res.status(201).json(newUser);
      getOtp(email);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "User updated." });
  } catch (error) {
    res.status(400).json(error);
  }
}

export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    let { password } = req.body;
    const salt = await bcrypt.genSalt(5);
    password = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(req.params.id, { password: password });
    res.status(200).json({ message: "User updated." });
  } catch (error) {
    res.status(400).json(error);
  }
}

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted." });
  } catch (error) {
    res.status(400).json(error);
  }
}

export const getUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Not found" })
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

async function getOtp(email: string) {
  try {
    const findUser = await User.findOne({ email });
    const id: any = findUser?._id;
    await User.findByIdAndUpdate(id, { otp: otpGenerator() });
    const findOtp = await User.findOne({ email });
    const otp: any = findOtp?.otp;
    mailer(email, otp);
  } catch (error) {
    console.log(error);
  }
}

export const userVerification = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const findUser = await User.findOne({ otp });
    const id: any = findUser?._id;
    if (findUser) {
      res.status(200).json(id);
      await User.findByIdAndUpdate(id, { otp: 0, isUser: true, state: true });
    } else {
      res.status(404).json({ message: "not found" });
    }
  }
  catch (error) {
    res.status(400).json(error);
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let userPassword = password;
    const user = await User.findOne({ email });
    if (user) {
      const { password }: any = user;
      const checkPassword = await bcrypt.compare(userPassword, password);
      if (checkPassword) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "invalid password!" })
      }
    } else {
      res.status(404).json({ message: "no user found here!" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    if (!allUsers) {
      res.status(404).json({ message: "No user available." })
    } else {
      res.status(200).json(allUsers);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      const id = findUser?.id;
      const checkUser = await User.findById(id);
      if (checkUser?.state === true && checkUser.isUser === true) {
        await User.findByIdAndUpdate(id, { otp: otpGenerator() });
        const findOtp = await User.findById(id);
        mailer(email, findOtp?.otp);
        res.status(200).json({ message: "otp sent successfully." });
      } else {
        res.status(400).json({ message: "Not a verified user." });
      }
    } else {
      res.status(404).json({ message: "email not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

export const updateStateController = async (req: Request, res: Response) => {
  try {
    const { state } = req.body;
    await User.findByIdAndUpdate(req.params.id, { state: state });
    res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
}