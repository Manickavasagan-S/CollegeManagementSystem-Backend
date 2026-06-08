const User=require("../Models/UserModel");

const SignupUser= async(req,res) =>{
    try{
        const {firstname,lastname,email,password} = req.body;
        const NewUser = new User({
            firstname,
            lastname,
            email,
            password
        });
        const SavedUser = await NewUser.save();
          res.status(200).json({
            message:"User Registered Successfully",
            data:SavedUser,
        });
    }
    catch(error){
        res.status(400).json({
            message:"Invalid Detail",
            error:error.message,
        })
    }0
};

const LoginUser = async(req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        res.status(200).json({
            message: "Login Successful",
            data: {
                name: `${user.firstname} ${user.lastname}`,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }, "firstname lastname email role");
        const formatted = users.map(u => ({
            name: `${u.firstname} ${u.lastname}`,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            role: u.role,
        }));
        res.status(200).json({ message: "Users fetched", data: formatted });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { SignupUser, LoginUser, GetAllUsers }