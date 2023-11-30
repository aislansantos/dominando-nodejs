import jwt from "jsonwebtoken";
import { promisify } from "util";

import authConfig from "../../config/auth";

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log({ authHeader });

    if (!authHeader) {
        return res.status(401).json({ error: "Token was note provide." });
    }

    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzAxMzU0MTQ1LCJleHAiOjE3MDE5NTg5NDV9.N4rDGl1TvRT69IxpPv0qzSSsllpPSXaa--ayGFaOHs0
    const [, token] = authHeader.split(" ");

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userID = decoded.id;

        console.log({ decoded });

        return next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalid." });
    }
};
