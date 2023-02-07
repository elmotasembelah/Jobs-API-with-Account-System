require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authinticateUser = require("./middleware/authentication");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const express = require("express");
const app = express();

app.use(express.json());

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: (15 * 60) ^ 1000,
        max: 100,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authinticateUser, jobsRouter);

app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
