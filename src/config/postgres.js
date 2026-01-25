const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "ukebackend",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

pool
    .connect()
    .then((client) => {
        return client
            .query("SELECT NOW()")
            .then(() => {
                client.release();
                console.log("✅ PostgreSQL Connected Successfully");
            })
            .catch((err) => {
                client.release();
                console.error("❌ Query Error:", err);
            });
    })
    .catch((err) => console.error("❌ DB Connection Error:", err));

module.exports = pool;
