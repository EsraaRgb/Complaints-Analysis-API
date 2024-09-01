const axios = require("axios")


const predictSentiment = async (sentence) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/predict/sentiment`,
            { sentence }
        )
        if (response.status == 200 && response.data.prediction) {
            return response.data.prediction
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service sentiment api" });
    }
}
const classify = async (sentence) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/predict/sector`,
            { sentence }
        )
        if (response.status == 200 && response.data.prediction) {
            return response.data.prediction
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service classification api" });

    }
}
const getEmbedding = async (sentence) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/complaint/embedding`,
            { sentence }
        )
        if (response.status == 200 && response.data.embedding) {
            return response.data.embedding
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service Get Embedding api" });

    }
}
const summarizeComplaint = async (sentence) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/summarize/complaint`,
            { sentence }
        )
        if (response.status == 200 && response.data.prediction) {
            return response.data.prediction
        }
        return null
    } catch (error) {
        console.log({ message: "catch error from ML Service summarize complaint api" });

    }
}
const summarizeComplaints = async (complaints) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/summarize/complaints`,
            { complaints }
        )
        if (response.status == 200 && response.data.prediction) {
            return response.data.prediction
        }
        return null
    } catch (error) {
        console.log({ message: "catch error from ML Service summarize complaints api" });

    }
}
const getClusters = async (complaints) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/cluster/complaints`,
            { complaints }
        )
        if (response.status == 200 && response.data) {
            return response.data
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service clustering api" });
    }
}

const smartSearch = async (query, complaints) => {
    try {
        const response = await axios.post(
            `${process.env.ML_URL}/complaint/search`,
            { query, complaints}
        )
        if (response.status == 200 && response.data) {
            return response.data
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service smart search api" });
    }
}
const getSectorTags = async (complaints) => {
try {
        const response = await axios.post(
            `${process.env.ML_URL}/tag/complaints`,
            complaints
        )
        if (response.status == 200 && response.data) {
            return response.data
        }
        return null
    }
    catch {
        console.log({ message: "catch error from ML Service Tagging api" });
    }
}
module.exports = { predictSentiment, classify, getEmbedding, summarizeComplaint,summarizeComplaints, getClusters, smartSearch, getSectorTags }
