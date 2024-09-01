const CitizenModel = require("../../../DB/models/citizen.model.js");
const ComplaintModel = require("../../../DB/models/complaint.model");
const CommentModel = require("../../../DB/models/comment.model.js");
const {
  predictSentiment,
  classify,
  getEmbedding,
  summarizeComplaint,
  getClusters,
  smartSearch,
  getSectorTags,
  summarizeComplaints: summarizeComplaintsService,
} = require("../../services/mlServices.js");
const SectorModel = require("../../../DB/models/sector.model.js");
const ComplaintHistoryModel = require("../../../DB/models/complaintHistory.model.js");
const ComplaintDetailsModel = require("../../../DB/models/complaintDetails.model.js");
const TagModel = require("../../../DB/models/tag.model.js");
const clusterModel = require("../../../DB/models/cluster.model.js");
const employeeModel = require("../../../DB/models/employee.model.js");
const EmployeeModel = require("../../../DB/models/employee.model.js");
const UserModel = require("../../../DB/models/user.model.js");
const ClusterModel = require("../../../DB/models/cluster.model");
const complaintDetails = require("../../../DB/models/complaintDetails.model");
const sequelize = require('sequelize');
const ComplaintTagModel = require("../../../DB/models/complaintTag.model.js");

const getComplaints = async (conditions = {}, complaintsDetailsCond = {}) => {
  const complaints = await ComplaintModel.findAll({
    where: conditions,
    attributes: [
      "id",
      "body",
      ["createdAt", "delivered-date"],
      "sentiment",
      "title",
      "employeeId",
      "state",
    ],
    include: [
      {
        model: CommentModel,
        attributes: ["body", "senderID", "createdAt", "attachments"],
      },
      {
        model: ComplaintDetailsModel,
        where: complaintsDetailsCond,
        //show all attributes except id
        attributes: {
          exclude: ["id", "createdAt", "updatedAt", "complaintId"],
        },
        include: [
          {
            model: SectorModel,
            attributes: ["name", "id"],
          },
          {
            model: clusterModel,
            attributes: ["name"],
          },
        ],
      },
      {
        model: TagModel,
        attributes: ["name"],
      },
      {
        model: ComplaintHistoryModel,
      },
      {
        model: CitizenModel,
        attributes: ["id"],
        include: [
          {
            model: UserModel,
            attributes: ["city", "birthdate"],
          },
        ],
      },
    ],
  });

  let complaintsWithNumberOfComments = complaints.map((complaint) => {
    complaint = { ...complaint.toJSON() };
    if (complaint.complaintDetails.length > 0) {
      complaint.complaintDetails = complaint.complaintDetails[0];
      complaint.complaintDetails.sector
        ? (complaint.complaintDetails.sector =
          complaint.complaintDetails.sector.name)
        : "";
      complaint.complaintDetails.cluster
        ? (complaint.complaintDetails.cluster =
          complaint.complaintDetails.cluster.name)
        : "";
    }
    complaint.numberOfComments = complaint.comments.length;
    let events = [];
    events = [...complaint.comments, ...complaint.complaintHistories];
    events.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    complaint.events = events;
    let age = 0;
    if (complaint.citizen.user.birthdate) {
      age =
        new Date().getFullYear() -
        new Date(complaint.citizen.user.birthdate).getFullYear();
      complaint.citizen.user.age = age;
      delete complaint.citizen.user.birthdate;
    }
    return complaint;
  });
  return complaintsWithNumberOfComments;
};

const getSingelComplaint = async (req, res) => {

}

const foundDate = async (req, res) => {
  try {
    const complaints = await ComplaintModel.findAll({
      attributes: [
        [
          sequelize.fn(
            "DISTINCT",
            sequelize.fn("YEAR", sequelize.col("createdAt"))
          ),
          "year",
        ],
      ],
    });

    res.send(complaints);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
};
const complaints = async (req, res) => {
  try {
    const { sequelize } = require("../../../DB/connection.js")
    const { QueryTypes } = require('sequelize');

    const query = `
    SELECT DISTINCT complaints.id, complaints.title,complaints.body,complaints.sentiment,DATE(complaints.createdAt) AS Date, complaints.state, clusters.name AS clusterName,sectors.name As sectorName,tags.name AS Topic
    from complaints, clusters,tags,complainttags,complaintdetails,sectors
    where complaints.id=complaintdetails.id AND complaintdetails.sectorId=sectors.id AND complaintdetails.clusterId=clusters.id AND complaints.id=complainttags.complaintId AND complainttags.tagId=tags.id
    `;

    const complaints = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
};
const getComplaintsForAdmin = async (req, res) => {
  try {
    let complaints = await getComplaints()
    if (complaints) {
      res.json(complaints);
    }
    else {
      res.status(404).json([])
    }
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
}

const countofComplaintsInMonths = async (req, res) => {
  try {

    const { sequelize } = require("../../../DB/connection.js")
    const { QueryTypes } = require('sequelize');

    const query = `
    SELECT 
  YEAR(complaints.createdAt) AS year,
  MONTHNAME(complaints.createdAt) AS month,
  COUNT(complaints.id) AS complaintCount
FROM complaints
WHERE YEAR(complaints.createdAt) = '${req.params.name}' 
GROUP BY YEAR(complaints.createdAt), MONTH(complaints.createdAt)
ORDER BY YEAR(complaints.createdAt), MONTH(complaints.createdAt);
`;


    const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(sentiments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch errorrerer" });
  }
}

const cardsCountInAdmin = async (req, res) => {
  try {

    const { sequelize } = require("../../../DB/connection.js")
    const { QueryTypes } = require('sequelize');

    const query = `
    SELECT 
    complaints.complaintCount,
    complaints.completedCount,
   citizenCount,
    employees.employeeCount
  FROM
    (SELECT 
       COUNT(DISTINCT c.id) AS complaintCount,
       COUNT(CASE WHEN c.state = 'completed' THEN 1 END) AS completedCount
     FROM complaints c) complaints
  CROSS JOIN
    (SELECT 
       COUNT(DISTINCT citizens.id) AS citizenCount,
       COUNT(DISTINCT employees.id ) AS employeeCount
     FROM citizens, employees) AS employees
`;


    const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(sentiments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch errorrerer" });
  }
}

const countsForSectorPageAdmin = async (req, res) => {
  try {

    const { sequelize } = require("../../../DB/connection.js")
    const { QueryTypes } = require('sequelize');

    const query = `
  SELECT 
  s.name,s.description,s.id AS sectorId,
    COUNT(*) AS complaintCount,
    COUNT(CASE WHEN c.state = 'completed' THEN 1 END) AS completedCount,
    COUNT(DISTINCT c.citizenId) AS citizenCount,
    COUNT(DISTINCT c.employeeId) AS employeeCount
  FROM complaints c
  INNER JOIN complaintdetails cd ON c.id = cd.complaintId
  INNER JOIN sectors s ON cd.sectorId = s.id
  INNER join employees e ON s.id=e.sectorId
  GROUP by s.name
  `;


    const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(sentiments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch errorrerer" });
  }
}

const sentiment = async (req, res) => {
  try {

    const { sequelize } = require("../../../DB/connection.js")
    const { Sequelize, DataTypes } = require('sequelize');

    const query = `
   SELECT 
   CASE c.sentiment 
     WHEN 0 THEN 'negative' 
     WHEN 1 THEN 'positive' 
     ELSE 'unknown' 
   END AS sentiment_type, 
   COUNT(*) AS sentiment_count 
 FROM complaintDetails cd 
 INNER JOIN complaints c ON cd.complaintId = c.id 
 INNER JOIN sectors s ON cd.sectorId = s.id 
 WHERE s.name ='${req.params.sector}'
 GROUP BY c.sentiment;
  `;


    const { QueryTypes } = require('sequelize');
    const sentiments = await sequelize.query(query, { type: QueryTypes.SELECT });
    // console.log(complaint);
    res.send(sentiments);
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
}


const heatMapQAuery = async (req, res) => {
  try {

    const { sequelize } = require("../../../DB/connection.js")

    // const { Sequelize, DataTypes } = require('sequelize');
    //const givenYear=req.params.year 
    const query = `
    SELECT
    COUNT(CASE WHEN state = "delivered" THEN 1 END) AS delivered,
    COUNT(CASE WHEN state = "viewed" THEN 1 END) AS viewed,
    COUNT(CASE WHEN state = "need-action" THEN 1 END) AS needAction,
    COUNT(CASE WHEN state = "completed" THEN 1 END) AS completed,
   sector.name  AS sectorName
  FROM
    complaints AS complaint
    LEFT OUTER JOIN complaintDetails ON complaint.id = complaintDetails.complaintId
    LEFT OUTER JOIN sectors AS sector ON complaintDetails.sectorId = sector.id
    WHERE YEAR(complaint.createdAt) ='${req.params.year}'
  GROUP BY
    sectorName
  `;


    const { QueryTypes } = require('sequelize');
    const complaints = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.send(complaints);

  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "catch error" });
  }
}

const getEmployeeComplaints = async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      where: { userId: req.user.id },
    });
    const employeeComplaints = await getComplaints({ employeeId: employee.id });
    res.status(200).json({ complaints: employeeComplaints });
  } catch (error) {
    res.status(500).json({ message: "catch an error" });
  }
};
const getEmployeeSectorComplaints = async (req, res) => {
  try {
    const employee = await employeeModel.findOne({
      where: { userId: req.user.id },
      include: [{ model: SectorModel, attributes: ["name"] }],
    });
    const sectorComplaints = await (
      await getComplaints({})
    ).filter(
      (complaint) => complaint.complaintDetails.sector == employee.sector.name
    );
    res.status(200).json({ complaints: sectorComplaints });
  } catch (error) {
    res.status(500).json({ message: "catch an error", error });
  }
};

// return list of complains contains comments and sector name and tags and topics and number of comments
const getCitizenComplaints = async (req, res) => {
  try {
    const citizen = await CitizenModel.findOne({
      where: { userId: req.user.id },
    });
    const complaints = await getComplaints({ citizenId: citizen.id });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ message: "catch error" });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    let complaint = await getComplaints({ id });
    if (complaint.length == 0) {
      return res.status(404).json({ message: "complaint not found" });
    }
    complaint = complaint[0];
    complaint.comments = complaint.comments.map((comment) => {
      comment.sender = comment.senderID;
      delete comment.senderID;
      if (comment.sender == req.user.id) {
        comment.sender = "أنت";
      } else {
        req.user.roleId == 2
          ? (comment.sender = "المواطن")
          : (comment.sender = "الموظف");
      }
      return comment;
    });
    // check if the complaint is the employee's complaint
    if (req.user.roleId == 3) {
      const employee = await employeeModel.findOne({
        where: { userId: req.user.id },
      });
      complaint.employeeId == employee.id
        ? (complaint.isHisComplaint = true)
        : (complaint.isHisComplaint = false);
    }
    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const addComplaint = async (req, res) => {
  try {
    const { body, attachments } = req.body;
    const { id } = await CitizenModel.findOne({
      where: { userId: req.user.id },
    });
    const complaint = await ComplaintModel.create({
      body,
      citizenId: id,
    });
    if (complaint) {
      await ComplaintHistoryModel.create({ complaintId: complaint.id });
      res.status(201).json({ message: "Done", complaint });
    } else {
      return res.status(500).json({ message: "error while adding complaint" });
    }
    const sentiment = await predictSentiment(body);
    const classification = await classify(body);
    const embedding = await getEmbedding(body);
    const summarization = await summarizeComplaint(body)
    let sector = "";
    classification
      ? (sector = await SectorModel.findOne({ where: { name: classification } }))
      : "";
    let updates = {};
    let complaintDetails = "";
    sentiment ? (updates.sentiment = sentiment) : "";
    sector
      ? (complaintDetails = await ComplaintDetailsModel.create({
        complaintId: complaint.id,
        sectorId: sector.id,
      }))
      : "";
    complaintDetails ? (updates.complaintDetailId = complaintDetails.id) : "";
    summarization ? updates.title = summarization : ''
    if (embedding) {
      let stringEmbedding = "";
      stringEmbedding += embedding[0];
      for (let i = 1; i < embedding.length; i++) {
        stringEmbedding += "$" + embedding[i];
      }
      updates.embedding = stringEmbedding;
    }
    await ComplaintModel.update(updates, { where: { id: complaint.id } });

  } catch (error) {
    console.log(error);
  }
};

const updateComplaint = async (req, res) => {
  try {
    const updateComplain = await ComplaintModel.update(
      {
        title: req.body.title,
        body: req.body.body,
        sentiment: req.body.sentiment,
        state: req.body.state,
        endDate: req.body.endDate,
        citizenId: req.body.citizenId,
        employeeId: req.body.employeeId,
        complaintDetailId: req.body.complaintDetailId,
        embedding: req.body.embedding,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "the complaint updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "catch an error" });
  }
};




const deleteComplaint = async (req, res) => {
  try {
    const deleteComplaint = await ComplaintModel.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "complain deleted successfully" });
    // const employee = await employeesModel.findOne({ where: { id: req.params.id } })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch an error" });
  }
};
// Dashboard endpoint -> has num of complains and num of complains with state = 'closed' and num of clusters in the sector
const getDashboardData = async (req, res) => {
  try {
    let dashBoardData = {};
    const employee = await EmployeeModel.findOne({
      where: { userId: req.user.id },
    });
    const complaints = await getComplaints({}, { sectorId: employee.sectorId });
    let numOfColsedComplaints = 0;
    for (let i = 0; i < complaints.length; i++) {
      if (complaints[i].state == "closed") {
        numOfColsedComplaints++;
      }
      if (complaints[i].employeeId == employee.id) {
        complaints[i].isHisComplaint = true;
      } else {
        complaints[i].isHisComplaint = false;
      }
    }
    dashBoardData.numOfColsedComplaints = numOfColsedComplaints;
    dashBoardData.numOfComplaints = complaints.length;
    const clusters = await ClusterModel.findAll({
      where: { sectorId: employee.sectorId },
    });
    dashBoardData.NumOfClusters = clusters.length;
    dashBoardData.complaints = complaints;
    res
      .status(200)
      .json(dashBoardData ? dashBoardData : { message: "no data" });
  } catch (error) {
    res.status(500).json({ message: error.toString(), trace: error.stack });
  }
};

// change the state of the complaint
const changeComplaintState = async (req, res) => {
  try {
    const id = req.params.id;
    const { state } = req.body;
    const employee = await EmployeeModel.findOne({
      where: { userId: req.user.id },
    });
    let complaint = await ComplaintModel.findOne({
      where: { id },
      include: { model: complaintDetails, attributes: { exclude: "embedding" } },
    });
    if (!complaint) {
      return res.status(404).json({ message: "complaint not found" });
    }
    console.log(complaint.complaintDetails);

    if (complaint.complaintDetails[0].sectorId != employee.sectorId) {
      return res
        .status(401)
        .json({ message: "This complaint not in your sector" });
    }
    if (complaint.state == "closed") {
      return res.status(401).json({ message: "complaint is closed" });
    }
    if (complaint.state == state) {
      return res
        .status(401)
        .json({ message: "complaint state is already " + state });
    }
    if (complaint.employeeId) {
      if (complaint.employeeId != employee.id) {
        return res.status(401).json({
          message: "you are not allowed to change this complaint's state",
        });
      } else {
        if (state == "need-action" || state == "completed" || state == "viewed") {
          const created = await ComplaintHistoryModel.create({
            complaintId: id,
            state,
            previousState: complaint.state,
          });
          console.log(created);
          await complaint.update({ state }, { where: { id } });
          return res
            .status(200)
            .json({ message: "complaint state changed successfully" });
        }
      }
    } else {
      if (state == "viewed") {
        await ComplaintHistoryModel.create({ complaintId: id, state }); //previousState is delivered by default
        await complaint.update(
          { state, employeeId: employee.id },
          { where: { id } }
        );
        return res.status(200).json({
          message:
            "complaint state changed successfully and it has been assigned to you",
        });
      } else {
        return res
          .status(401)
          .json({ message: "the complaint should be assigned to you first" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'catch error', error })
  }
};

const search = async (query, complaints) => {
  complaints.forEach(complaint => {
    let embedding = complaint.embedding.split('$')
    complaint.embedding = embedding
  })
  const smartSearchResults = await smartSearch(query, complaints)
  if (smartSearchResults) {
    return smartSearchResults
  }
  return null
}

const searchComplaints = async (req, res) => {
  try {
    const { query } = req.query
    const complaints = await ComplaintModel.findAll({
      attributes: ['id', 'embedding'],
    })
    const smartSearchResults = await search(query, complaints)

    if (!smartSearchResults) {
      return res.status(404).json({ message: 'no results found' })
    }
    smartSearchResults.result.forEach(function (element) {
      console.log(element);
    });
    const complaintsResult = await getComplaints({ id: smartSearchResults.result.map(result => result.id) }, {})

    res.status(200).json(complaintsResult)
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}
const searchSectorComplaints = async (req, res) => {
  try {
  const { query } = req.query
  const { id } = req.user.id
  const employee = await EmployeeModel.findOne({ where: { userId: req.user.id } })
  const complaints = await ComplaintModel.findAll({
    attributes: ['id', 'embedding'],
    include: [
      {
        model: complaintDetails,
        where: { sectorId: employee.sectorId },
      }
    ]
  })
  const smartSearchResults = await search(query, complaints)
  const complaintsResult = await getComplaints({ id: smartSearchResults.result.map(result => result.id), embedding: { [sequelize.Op.ne]: null } }, { sectorId: employee.sectorId })
  let finalComplaints = []
  complaintsResult.map(complaint => {
    let obj = { ...complaint, score: smartSearchResults.result.find(result => result.id == complaint.id).score }
    finalComplaints.push(obj)
  })
  //sort according to score
  finalComplaints.sort((a, b) => (a.score > b.score) ? -1 : 1)
  res.status(200).json(finalComplaints)
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}

const cluster = async (complaints) => {
  if (complaints.length < 10) {
    return { message: "sector complaints should be more than 10", status: 400 }
  }
  let clusters = await getClusters(complaints);
  if (clusters == null || clusters.length == 0) {
    return { message: "no response or complaints cannot be clustered -> one cluster", status: 404 }
  }

  clusters = clusters.data
  clusters.forEach(cluster => {
    cluster.cluster_name = `تصنيف ${cluster.cluster_id}`
    cluster.number_of_complaints = cluster.complaints.length
  })
  return clusters
}
// cluster complaints on the whole sector and if employee wants to save them will send another request
const clusterSectorComplaints = async (req, res) => {
  try {
    const { id } = req.user.id
    const employee = await EmployeeModel.findOne({ where: { userId: req.user.id } })
    let complaints = await ComplaintModel.findAll({
      attributes: ['id', 'body'],
      include: [{ model: complaintDetails, where: { sectorId: employee.sectorId } }]
    })
    complaints = complaints.map(complaint => {
      return { id: complaint.id, complaint: complaint.body }
    })
    const result = await cluster(complaints)
    if (result.message && result.status) {
      res.status(result.status).json({ message: result.message })
    }
    else {
      res.status(200).json({ clusters: result })
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}

const checkComplaints = async (complaints, sectorId) => {
  try {
    const sectorComplaints = await ComplaintModel.findAll({
      attributes: ['id', 'body'],
      include: [{ model: complaintDetails, where: { sectorId } }]
    })
    const sectorComplaintsIds = sectorComplaints.map(complaint => complaint.id)
    let flag = false
    complaints.forEach(complaint => {
      if (!sectorComplaintsIds.includes(complaint.id)) {
        flag = true
      }
    })
    return flag
  } catch (error) {
    console.log(error);
  }
}

const analyzeComplaints = async (req, res) => {
  try {
    const { complaints } = req.body
    const employee = await EmployeeModel.findOne({ where: { userId: req.user.id } })
    // check complaints within sector
    const flag = await checkComplaints(complaints, employee.sectorId)
    if (flag) {
      return res.status(400).json({ message: "complaints should be within your sector" })
    }
    // cluster complaints and summarize them
    let clusters = await cluster(complaints)
    console.log(complaints);
    let complaintStrings = req.body.complaints.map(complaint => complaint.title);
    let complaintsSummary = await summarizeComplaintsService(complaintStrings)
    if (clusters.message && clusters.status) {
      clusters = null
    }
    if (!complaintsSummary) {
      complaintsSummary = null
    }
    if (!clusters && !complaintsSummary) {
      return res.status(404).json({ message: "no response from ML" })
    }
    // console.log(clusters[0].complaints);
    clustersResult = []
    for (const cluster of clusters) {
      let result = {}
      let complaints = cluster.complaints.map(complaint => complaint.complaint)
      let summary = await summarizeComplaintsService(complaints)
      result.summary = summary
      // add complaints  with details
      const complaintIds = cluster.complaints.map(complaint => complaint.id);
      const resultSummary = await getComplaints({
        id: {
          [sequelize.Op.in]: complaintIds
        }
      })
      result.complaints = resultSummary
      result.cluster_name = cluster.cluster_name
      result.number_of_complaints = cluster.number_of_complaints
      result.keywords = cluster.keywords
      clustersResult.push(result)
    }
    // console.log(clustersResult);
    let response = {
      numberOfClusters: clusters.length ? clusters.length : 0,
      numberOfComplaints: complaints.length ? complaints.length : 0,
      complaintsSummary,
      clusters: clustersResult
    }
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: "catch error", error: error.toString() });
  }
}
// cluster complaints on the fly will not be saved in db
const clusterComplaints = async (req, res) => {
  try {
    const { complaints } = req.body
    const employee = await EmployeeModel.findOne({ where: { userId: req.user.id } })
    // check complaints within sector
    const flag = await checkComplaints(complaints, employee.sectorId)
    if (flag) {
      return res.status(400).json({ message: "complaints should be within your sector" })
    }
    // // then cluter them
    const result = await cluster(complaints)
    if (result.message && result.status) {
      return res.status(result.status).json({ message: result.message })
    }
    else {
      return res.status(200).json({ clusters: result })
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}

const summarizeComplaints = async (req, res) => {
  try {
    const { complaints } = req.body
    const result = await summarizeComplaintsService(complaints)
    if (!result) {
      return res.status(200).json({ message: "cannot summarize complaints" })
    }
    res.status(200).json({ complaintsSummary: result })
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
}

const tagComplaints = async () => {
  const TaggedComplaints = await ComplaintTagModel.findAll({ attributes: ['complaintId'] })
  const tags = await TagModel.findAll({ attributes: ['id', 'name'] })
  const sectors = await SectorModel.findAll({ include: [{ model: ComplaintDetailsModel, include: [{ model: ComplaintModel, attributes: ['id', 'body'] }] }] })
  for (const sector of sectors) {
    let complaintsToTag = []
    if (!sector.complaintDetails.length == 0) {
      // get complaints as an array of objects {id,complaint}
      for (const complaint of sector.complaintDetails) {
        let flag = false
        for (let i = 0; i < TaggedComplaints.length; i++) {
          if (TaggedComplaints[i].complaintId == complaint.complaint.id) {
            flag = true
            break
          }
        }
        if (!flag) {
          complaintsToTag.push({ id: complaint.complaint.id, complaint: complaint.complaint.body })
        }
      }
      if (complaintsToTag.length >= 10) {
        console.log("complaints to tag", complaintsToTag.length);
        const result = await getSectorTags(complaintsToTag)
        if (!result) {
          return console.log("could not tag complaints from ml service");
        }
        let prediction = result.prediction
        for (const cluster in prediction) {
          let tagValues = null
          for (const tag of prediction[cluster][1]) {
            // if tag already exists in db
            tagValues = tags.find(t => t.name === tag)
            if (!tagValues) {
              tagValues = await TagModel.create({ name: tag })
              console.log("tag created", tagValues.id);
            }
            // now we have tag id and complaint id so we can create complaint tag
            for (const complaint of prediction[cluster][0]) {
              if (complaint.complaint.includes(tagValues.name)) {
                console.log("complaint", complaint);
                await ComplaintTagModel.create({ complaintId: complaint.id, tagId: tagValues.id })
              }
            }
          }
        }
      }
    }
  }
}
module.exports = {
  complaints,
  getCitizenComplaints,
  getEmployeeComplaints,
  addComplaint,
  foundDate,
  updateComplaint,
  deleteComplaint,
  getComplaintById,
  getEmployeeSectorComplaints,
  getDashboardData,
  changeComplaintState,
  heatMapQAuery,
  sentiment,
  getComplaints,
  cardsCountInAdmin,
  countsForSectorPageAdmin,
  searchComplaints,
  searchSectorComplaints,
  clusterSectorComplaints,
  clusterComplaints,
  tagComplaints,
  countofComplaintsInMonths,
  analyzeComplaints,
  summarizeComplaints,
  getComplaintsForAdmin
};
