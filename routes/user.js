const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect("/");
    } catch (error) {
        console.error("Error during signin:", error);
        if (!res.headersSent) {
            return res.render('signin', {
                error: "Incorrect email or password",
            });
        }
    }
});


router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect("/");
});

router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        await User.create({
            fullName,
            email,
            password
        });
        return res.redirect("/");
    } catch (error) {
        console.error("Error during signup:", error);
        if (!res.headersSent) {
            return res.status(500).render('signup', {
                error: "An error occurred during signup. Please try again.",
            });
        }
    }
});

module.exports = router;

