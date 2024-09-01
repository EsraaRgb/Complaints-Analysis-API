const complaintDetailsModel = require("../../../DB/models/complaintDetails.model")
const clusterModel = require("../../../DB/models/cluster.model")
const Cluster = require("../../../DB/models/cluster.model")

const sectorModel = require("../../../DB/models/sector.model")
const sequelize = require('sequelize');
const { Sequelize } = require("../../../DB/connection")
const sector = require("../../../DB/models/sector.model")

const allComplainDetails = async (req, res) => {
    try {
        const complainDetails = await complaintDetailsModel.findAll()
        res.send(complainDetails);
    } catch (error) {
        res.status(500).json({ message: "catch an error" })
    }
}

const countComplainsForClusterInSectors = async (req, res) => {
    try {
        const sectorName = req.params.name;
        const sectorId = await sectorModel.findOne({ where: { name: req.params.name } })
        const counts = await complaintDetailsModel.findAll({
            attributes: [
                [sequelize.literal('Cluster.name'), 'clusterName'],
                'clusterId', [sequelize.literal('COUNT(*)'), 'count']],
            where: { sectorId: sectorId.id, clusterId: { [sequelize.Op.ne]: null } },
            group: ['clusterId'],
            include: [
                {
                    model: Cluster,
                    attributes: [],
                    
                },
            ],
        });
        res.json(counts);
    } catch (error) {
        if (req.params.name === 'Sectors') {
            res.send([]);
        } else {
            console.log(error);
            res.status(500).json({ message: "catch an error" });
        }
    }
}
// count for each sector number of complaints
const complaintsCount = async (req, res) => {

    try {

        const { sequelize } = require("../../../DB/connection.js")
        const { Sequelize, DataTypes } = require('sequelize');

        const query = `
        SELECT 
        CASE s.name
          WHEN 'food' THEN 'الطعام'
          WHEN 'entertainment' THEN 'ترفيه'
          WHEN 'Tech' THEN 'تكنولوجيا'
          ELSE 'اخرى'
        END AS sectorName,
        COUNT(cd.complaintId) AS complaintCount
      FROM sectors s
      JOIN complaintdetails cd ON s.id = cd.sectorId
      GROUP BY s.id;
       `;


        const { QueryTypes } = require('sequelize');
        const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
        // console.log(complaint);
        res.send(sentiments);
    } catch (error) {
        res.status(500).json({ message: "catch error" });
    }
}

const countComplainsInClusters = async (req, res) => {
    try {
        const clusterId = await clusterModel.findOne({ where: { name: req.params.name } })
        const complainCounts = await complaintDetailsModel.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'n_complaints'],
            ],
            where: {
                clusterId: clusterId.id
            }
        });

        res.send(complainCounts);
    } catch (error) {

        if (req.params.name === 'clusters') {
            res.send([]);
        } else {
            console.log(error);
            res.status(500).json({ message: "catch an error" });
        }
    }
}
//get sector name for given cluster in api
const getSector = async (req, res) => {
    try {
        const sectorID = await clusterModel.findOne({
            attributes: ['sectorId'],
            where: { name: req.params.name }
        })
        console.log(sectorID.dataValues.sectorId);
        const sectorName = await sectorModel.findOne({
            attributes: ['name'],
            where: { id: sectorID.dataValues.sectorId }
        })
        console.log(sectorName);
        res.send(sectorName);
    } catch (error) {
        if (req.params.name === 'clusters') {
            res.send([]);
        } else {
            console.log(error);
            res.status(500).json({ message: "catch an error" });
        }
    }
}

const countComplainsInSector = async (req, res) => {
    try {
        const sector = await sectorModel.findOne({ where: { name: req.params.name } })
        const complainCounts = await complaintDetailsModel.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'n_complaints'],
            ],
            where: {
                sectorId: sector.id
            }
        });

        res.send(complainCounts);
    } catch (error) {

        if (req.params.name === 'Sectors') {
            res.send([]);
        } else {
            console.log(error);
            res.status(500).json({ message: "catch an error" });
        }
    }
}


const addComplainDetails = async (req, res) => {
    try {
        const addComplainDetails = await complaintDetailsModel.create({
            complaintId: req.body.complaintId,
            sectorId: req.body.sectorId,
            clusterId: req.body.clusterId
        });
        res.status(200).json({ message: "Done", addComplainDetails })
    } catch (error) {
        res.status(500).json({ message: "catch an error" })
    }
}

const update = async (req, res) => {
    try {
        const sector = await sectorModel.findOne({ where: { name: req.params.name } })
        //   console.log(req.params.id)
        //   console.log(req.params.name)
        console.log(sector)
        const updated_user = await complaintDetailsModel.update({
            complaintId: req.body.complaintId,
            sectorId: sector.id,
            clusterId: null
        },
            {
                where: {
                    complaintId: req.params.id
                }
            });
        res.send(updated_user)
        //  res.status(200).json({message:"The update done successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "catch error" });
    }
}


module.exports = {
    allComplainDetails,
    countComplainsForClusterInSectors,
    addComplainDetails,
    update,
    countComplainsInSector,
    countComplainsInClusters,
    getSector,
    complaintsCount,
}