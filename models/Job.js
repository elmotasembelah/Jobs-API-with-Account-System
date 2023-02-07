const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "please provide a company name"],
            maxLength: 50,
        },
        position: {
            type: String,
            required: [true, "please provide a position name"],
            maxLength: 200,
        },
        status: {
            type: String,
            enum: ["pending", "interview", "declined"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: [true, "please provide a user"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
