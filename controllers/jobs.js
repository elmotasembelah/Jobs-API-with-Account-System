const jobSchema = require("../models/Job.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
    const jobs = await jobSchema
        .find({ createdBy: req.user.userId })
        .sort("createdAt");
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const newJob = await jobSchema.create(req.body);
    res.status(StatusCodes.CREATED).json({ newJob });
};

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;
    const job = await jobSchema.findOne({ _id: jobId, createdBy: userId });
    if (!job) throw new NotFoundError("no job matched the given id");

    res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
        body: { company: newCompany, position: newPosition },
    } = req;
    if (!newCompany || !newPosition)
        throw new BadRequestError(
            "incomplete data was given, please check the input again"
        );

    const job = await jobSchema.findOneAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!job) throw new NotFoundError("no job matched the given ID");
    res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const deletedJob = await jobSchema.findOneAndDelete({
        createdBy: userId,
        _id: jobId,
    });
    if (!deletedJob) throw new NotFoundError("no job matched the given id");

    res.status(StatusCodes.OK).json(deletedJob);
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};
