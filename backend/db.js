const { Sequelize } = require("sequelize");

// In-memory store used when MySQL is unavailable
const inMemoryDB = {
  tasks: [],
  connected: false,
};

// Sequelize instance — exported so taskModel can use it
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "student_portal",
  process.env.MYSQL_USER     || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host:    process.env.MYSQL_HOST || "localhost",
    port:    parseInt(process.env.MYSQL_PORT) || 3306,
    dialect: "mysql",
    logging: false,                  // silence SQL logs; set to console.log to debug
    pool: { max: 5, min: 0, acquire: 3000, idle: 10000 },
    dialectOptions: { connectTimeout: 3000 },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // sync({ alter: true }) creates / updates the table automatically
    await sequelize.sync({ alter: true });
    console.log("✅ MySQL connected and tables synced");
    inMemoryDB.connected = true;
  } catch (err) {
    console.warn("⚠️  MySQL unavailable — using in-memory database (data won't persist).");
    inMemoryDB.connected = false;
  }
};

module.exports = { sequelize, connectDB, inMemoryDB };
