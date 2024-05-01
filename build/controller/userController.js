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
exports.updateStateController = exports.forgotPassword = exports.getUsersController = exports.loginController = exports.userVerification = exports.getUserController = exports.deleteUserController = exports.updatePasswordController = exports.updateUserController = exports.registerController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../schema/user"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer = (mail, otp) => {
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
        subject: "Email verification",
        text: "Email verification",
        html: `<h1><pre>Your otp is:${otp}</pre></h1>`,
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
function otpGenerator() {
    let otp = ``;
    for (let i = 0; i < 5; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, password, mobile, otp, isUser, gender, state } = req.body;
        const findUser = yield user_1.default.findOne({ email });
        if (findUser) {
            res.status(200).json({ message: "user exist" });
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(5);
            password = yield bcrypt_1.default.hash(password, salt);
            const details = {
                name: name,
                email: email,
                password: password,
                mobile: mobile,
                gender: gender,
                otp: otp,
                isUser: isUser,
                state: state
            };
            const newUser = yield user_1.default.create(details);
            res.status(201).json(newUser);
            getOtp(email);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.registerController = registerController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "User updated." });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updateUserController = updateUserController;
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(5);
        password = yield bcrypt_1.default.hash(password, salt);
        yield user_1.default.findByIdAndUpdate(req.params.id, { password: password });
        res.status(200).json({ message: "User updated." });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updatePasswordController = updatePasswordController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted." });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.deleteUserController = deleteUserController;
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "Not found" });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getUserController = getUserController;
function getOtp(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const findUser = yield user_1.default.findOne({ email });
            const id = findUser === null || findUser === void 0 ? void 0 : findUser._id;
            yield user_1.default.findByIdAndUpdate(id, { otp: otpGenerator() });
            const findOtp = yield user_1.default.findOne({ email });
            const otp = findOtp === null || findOtp === void 0 ? void 0 : findOtp.otp;
            mailer(email, otp);
        }
        catch (error) {
            console.log(error);
        }
    });
}
const userVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const findUser = yield user_1.default.findOne({ otp });
        const id = findUser === null || findUser === void 0 ? void 0 : findUser._id;
        if (findUser) {
            res.status(200).json(id);
            yield user_1.default.findByIdAndUpdate(id, { otp: 0, isUser: true, state: true });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.userVerification = userVerification;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let userPassword = password;
        const user = yield user_1.default.findOne({ email });
        if (user) {
            const { password } = user;
            const checkPassword = yield bcrypt_1.default.compare(userPassword, password);
            if (checkPassword) {
                res.status(200).json(user);
            }
            else {
                res.status(400).json({ message: "invalid password!" });
            }
        }
        else {
            res.status(404).json({ message: "no user found here!" });
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.loginController = loginController;
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_1.default.find();
        if (!allUsers) {
            res.status(404).json({ message: "No user available." });
        }
        else {
            res.status(200).json(allUsers);
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getUsersController = getUsersController;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const findUser = yield user_1.default.findOne({ email });
        if (findUser) {
            const id = findUser === null || findUser === void 0 ? void 0 : findUser.id;
            const checkUser = yield user_1.default.findById(id);
            if ((checkUser === null || checkUser === void 0 ? void 0 : checkUser.state) === true && checkUser.isUser === true) {
                yield user_1.default.findByIdAndUpdate(id, { otp: otpGenerator() });
                const findOtp = yield user_1.default.findById(id);
                mailer(email, findOtp === null || findOtp === void 0 ? void 0 : findOtp.otp);
                res.status(200).json({ message: "otp sent successfully." });
            }
            else {
                res.status(400).json({ message: "Not a verified user." });
            }
        }
        else {
            res.status(404).json({ message: "email not found" });
        }
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.forgotPassword = forgotPassword;
const updateStateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req.body;
        yield user_1.default.findByIdAndUpdate(req.params.id, { state: state });
        res.status(200).json({ message: "updated successfully" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updateStateController = updateStateController;
