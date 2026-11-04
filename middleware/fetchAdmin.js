
const jwt = require("jsonwebtoken");

const fetchAdmin = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const data = jwt.verify(token, process.env.JWT_SECRET);

        if (data.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }

        req.admin = data;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = fetchAdmin;
