import Usermodel from "../schema/User.schema.js";
import { setUser } from "../services/auth.js";
import { otpsendmailer } from "../services/mailer.js";

export const Loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Add login logic here
        if (!email || !password) {
            return res.status(400).render("login", { message: "Email and password are required" });
        }

        const user = await Usermodel.findOne({email, password})

        if (!user) {
            return res.status(401).render("login", { message: "Invalid email or password" });
        }



        if(user.verifyUser === false){
            return res.status(401).render("login", { message: "User not verified. Please check your email for the OTP." });
        }

        const token = setUser(user);
        res.cookie("uid", token);

        res.status(200).render("Homepage")

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


export const SignUpUser = async (req, res) => {
    try {
        const { username,email, password } = req.body;
        // Add signup logic here
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await Usermodel.findOne({email})

        

        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP


        if(user && user.verifyUser === false){
            otpsendmailer(email, otp)
            user.otpexpiry = Date.now() + 10 * 60 * 1000;
            user.userOtp = otp; // Store the generated OTP in the user document
            await user.save();
            return res.status(200).render("OtpPage",{email:email});
        }

        if (user) {
            return res.status(400).render("signup", { message: "User already exists" });
        }

        const newUser =  await Usermodel.create({ username, email, password });

        if(!newUser){
            return res.status(500).render("signup", { message: "Failed to create user" });
        }

        const otpsent = otpsendmailer(email, otp)

        if(!otpsent){
            return res.status(500).json({ message: "Failed to send OTP email" });
        }


        newUser.otpexpiry = Date.now() + 10 * 60 * 1000; // Set OTP expiry time to 10 minutes
        newUser.userOtp = otp; // Store the generated OTP in the user document
        await newUser.save();
        
        res.status(201).render("OtpPage",{email:email})

    } catch (error) {
        res.status(500).render("signup", { message: "Internal server error" });
    }
}


export const OtpChecker = async (req, res) => {
    try {
        const { email, otp } = req.body;

        
        if (!email || !otp) {
            return res.status(400).render("OtpPage", {email:email, message: "Email and OTP are required" });
        }

        const user = await Usermodel.findOne({ email });


        if (!user) {
            return res.status(404).render("OtpPage", { email: email, message: "User not found" });
        }

        if (user.otpexpiry < Date.now()) {
            return res.status(400).render("OtpPage", { email: email, message: "OTP has expired" });
        }

        if (user.userOtp !== otp) {
            return res.status(400).render("OtpPage", { email: email, message: "Invalid OTP" });
        }

        // Add OTP verification logic here
        user.verifyUser = true;
        user.otpexpiry = undefined;
        user.userOtp = undefined; // Clear the userOtp after successful verification
        await user.save();
        const token = setUser(user);
        res.cookie("uid", token);

        return res.status(200).render("Homepage")

    } catch (error) {
        res.status(500).render("signup", { message: "Internal server error" });
    }
}


export const SignUppage = (req, res) => {
    res.render("signup");
}

export const Loginpage = (req, res) => {
    res.render("login");
}

export const OTppage = (req, res) => {
    res.render("OtpPage");
}

export const SignOut = async (req, res) => {
  try {
    // Cookie ko overwrite karke expire kar dein
    res.cookie("uid", token, {
  path: "/",
  httpOnly: true,
  secure: true,   // Vercel par iska true hona zaroori hai
  sameSite: "lax" // Agar single domain hai to 'lax' rakhein
});
    
    return res.status(200).render("login");
  } catch (error) {
    return res.status(500).render("login");
  }
};
