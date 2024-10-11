const { genSalt, hash, compare } = require("bcryptjs")
const jwt = require("jsonwebtoken")
const transporter = require("../Middleware/nodemailer.js");
const generateOTP = require("../Middleware/otpMiddleware");
const User = require("../Model/userModle.js");

const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in seconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}


const registerUser = async (req, res) => {
  const { name, email, password, admin } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(401).json({ message: "input required" })
    }
    // Check if email already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      if (existUser.verified) {
        // If user is verified, return the message
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // Update the name
        existUser.name = name;
        existUser.password = password;

        // Generate a new OTP and update it
        const newOTP = generateOTP();
        existUser.otp = newOTP;

        // Save the updated user
        await existUser.save();

        // Send the OTP email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Email Verification OTP',
          text: `Your OTP for email verification is: ${newOTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ message: 'Error sending OTP email.' });
          }
          setTimeout(async () => {
            existUser.otp = null;
            await existUser.save();
          }, 300000); // 5 minute
          return res.status(200).json({
            message: 'OTP resent. Please verify your email.', user: {
              name: existUser.name,
              email: existUser.email,
              admin: existUser.admin,
              verified: existUser.verified,
              id: existUser._id

            }
          });
        });

        return;
      }
    }

    // Create new user
    const newUser = new User({ name, email, password });

    // Generate OTP and assign it to the user
    const otp = generateOTP();
    newUser.otp = otp;

    // Save new user
    await newUser.save();
    // Send OTP via email
    const mailOptions = {
      from: "nagarkotichandu38@gmail.com",
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}`,
    };

    // Use transporter to send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP email.', err: error }); // Return after error response
      }
      setTimeout(async () => {
        newUser.otp = null;
        await newUser.save();
      }, 300000); // 5 minute
      return res.status(200).json({
        message: 'OTP sent to your email. Please verify.', user: {
          name: newUser.name,
          email: newUser.email,
          admin: newUser.admin,
          verified: newUser.verified,
          id: newUser._id

        }
      }); // Return after success response
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', msg: error }); // Return after sending error response
  }
};


//verify otp

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    if (user.otp === otp) {
      user.verified = true;
      user.otp = undefined;
      await user.save();

      const token = createToken(email, user._id);
      res.cookie("jwt", token, {
        maxAge,
        secure: true, // Ensure secure cookie in production
        sameSite: "None"
      });

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          admin: user.admin,
          verified: user.verified,
          id: user._id
        }
      });
    } else {
      // OTP does not match
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', msg: error }); // Return after sending error response
  }
};


// Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Generate a new OTP and set its expiry time
    const newOtp = generateOTP();
    user.otp = newOtp;
    // Save the updated user document
    await user.save();

    // Send the new OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification OTP',
      text: `Your new OTP for email verification is: ${newOtp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP email.' });
      }
      setTimeout(async () => {
        user.otp = null;
        await user.save();
      }, 300000); // 5 minute
      res.status(200).json({ message: 'New OTP sent to your email. Please verify.' });
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.verified) {
      return res.status(404).json({ message: "invalid credentials" })
    }
    const auth = await compare(password, user.password)
    if (!auth) {
      return res.status(401).json({ message: "invalid credentials" })
    }

    // Generate a token and set it in the cookie
    const token = createToken(email, user._id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true, // Ensure secure cookie in production
      sameSite: "None"
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        admin: user.admin,
        verified: user.verified,
      }
    });

  } catch (error) {
    console.error("Signup error:", error); // Improved error logging
    return res.status(500).send("Internal Server Error");
  }
}


//user info 
const getUSerInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId)
    if (!userData) {
      return res.status(404).send("User with the given id is not found")
    }
    return res.status(201).json({
      userData: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        admin: userData.admin,
        verified: userData.verified,
      }
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

// Logout
const logout = async (req, res) => {
  try {

    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" })
    return res.status(200).send("logout successfull")
  } catch (error) {
    console.log(error)
    return res.status(500).send("internal server errror")
  }
}





module.exports = { registerUser, verifyOTP, resendOTP, login, getUSerInfo, logout };
