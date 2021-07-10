const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

exports.findAll = (req, res) => {
  const { page, size  } = req.query;
  const { limit, offset } = getPagination(page, size);

  User.findAndCountAll({
                        attributes: {
                            exclude: ['password']
                        },
                        include: [{

                            model: Role,
                            attributes: ['name'],
                            as: "roles"
                        }],
                        where: null,limit, offset
                        })
      .then(data => {
        if(data){
          const response = getPagingData(data, page, limit);
          res.send(response);
        }
        else
          res.status(404).send({
            message: "Not Found Data"
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving gender."
        });
      });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
