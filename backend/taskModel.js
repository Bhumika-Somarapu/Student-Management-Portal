const { DataTypes } = require("sequelize");
const { sequelize } = require("./db");

// Sequelize model — maps to the `tasks` table in MySQL
const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
        len: { args: [3, 100], msg: "Title must be between 3 and 100 characters" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
      validate: {
        len: { args: [0, 500], msg: "Description cannot exceed 500 characters" },
      },
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
      allowNull: false,
      defaultValue: "Pending",
      validate: {
        isIn: {
          args: [["Pending", "In Progress", "Completed"]],
          msg: "Status must be Pending, In Progress, or Completed",
        },
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,   // stores as YYYY-MM-DD
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,             // adds createdAt / updatedAt columns
  }
);

module.exports = Task;
