const SectorModel = require('../../../DB/models/sector.model');

const createSectors = async () => {
    try {
        const sectors = await SectorModel.findAll({})
        if (sectors.length == 0 ) {
            const createdsectors = await SectorModel.bulkCreate([
                { name: 'Food', description: 'Food Sector description' },
                { name: "Entertainment", description: 'Entertainment Sector description' },
                { name: 'Tech', description: 'Tech Sector description' },
                { name: 'Others', description: 'Others Sector description' }
            ])
            console.log("sectors has been Created Successfully");
        }
        else console.log("sectors Already Created ");
    } catch (error) {}
}

module.exports = createSectors;
