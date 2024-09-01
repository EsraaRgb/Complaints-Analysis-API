const clusterModel = require("../../../DB/models/cluster.model")
const sectorModel = require("../../../DB/models/sector.model")
const employeeModel = require("../../../DB/models/employee.model")
const complaintDetailsModel = require("../../../DB/models/complaintDetails.model")
const getClusters = async (req, res) => {
    try {
        const clusters = await clusterModel.findAll();
        res.send(clusters);

    } catch (error) {
        res.status(500).json({ message: "catch an error" });
    }

}
const getSectorsClusters = async (req, res) => {
    try {
        const sectorID = await sectorModel.findOne({
            attributes: ['id'],
            where: { name: req.params.name }
        })
        const clusters = await clusterModel.findAll({ where: { sectorId: sectorID.dataValues.id } });
        res.send(clusters);
    } catch (error) {
        if (req.params.name === 'Sectors') {
            res.send([]);
        } else {
            console.log(error);
            res.status(500).json({ message: [] });
        }

    }
}

const addCluster = async (req, res) => {
    try {
        const complaint = await clusterModel.create({
            name: req.body.name,
            keywords: req.body.keywords,
            sectorId: req.body.sectorId,
        });

        res.status(200).json({ message: "Done", complaint })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
};
const updateCluster = async (req, res) => {
    try {
        const updateCluster = await clusterModel.update({
            name: req.body.name,
            keywords: req.body.keywords,
            sectorId: req.body.sectorId,
        },
            {
                where: {
                    id: req.params.id
                }
            });
        res.status(200).json({ message: "The update done successfully" })

    } catch (error) {
        res.status(500).json({ message: "catch an errorrrrrr" })
    }
}
const deleteCluster = async (req, res) => {
    try {
        const deleteCluster = await clusterModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ message: "The citizen deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "catch an error" })
    }
};

const createClusters = async (req, res) => {
    try {
        let { clusters } = req.body
        const employee = await employeeModel.findOne({ where: { userId: req.user.id } })
        if (!clusters) return res.status(400).json({ message: 'clusters is required' })
        await clusterModel.destroy({ where: { sectorId: employee.sectorId } })
        // create new cluster and update it's complaints
        let createdClusters = []
        for (const cluster of clusters) {
            cluster.keywords = cluster.keywords.join(',')
            let newCluster = {
                name: cluster.cluster_name,
                sectorId: employee.sectorId,
                popularWords: cluster.keywords
            }
            const createdCluster = await clusterModel.create(newCluster)
            if (!createdCluster) {
                return res.status(400).json({ message: 'error while creating cluster' })
            }
            createdClusters.push(createdCluster)
            for (const complaint of cluster.complaints) {
                const updated = await complaintDetailsModel.update({ clusterId: createdCluster.id }, { where: { complaintId: complaint.id, sectorId: employee.sectorId } })
            }
        }
        
        res.json({ message: "clusters saved successfully", createdClusters })
    } catch (error) {
        return res.status(500).json({ message: 'catch an error', error })
    }
}


module.exports = {
    getClusters,
    addCluster,
    updateCluster,
    deleteCluster,
    getSectorsClusters,
    createClusters,
}