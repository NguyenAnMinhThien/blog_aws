const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const {response} = require("express");


//Register
router.post("/register", async (req, res) => {
    try {
        console.log(req.body.name);
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: hashedPass,
            }
        );
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        //if the user is found, it will return a value, then !user && //expression ->
        console.log(user)
        // if this command success, it will response a status code 400 and finish the try block, but if it dont response the status, it will hangup
        // proceed.
        if (!user) {
           return res.status(400).json("Wrong credentials!");
        }
       // //this bcrypt compare (data, hash, cb) -> the data will be hash with salt before
        const validated = await bcrypt.compare(req.body.password, user.password);
        if (!validated) {
           return res.status(400).json("Wrong credentials!");
        }
        // //append array, disperate an array, the && logic operator and the expression will be excuted.
        const {password, ...others} = user._doc;
        return res.status(200).json(others);


    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;