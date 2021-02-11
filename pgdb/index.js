const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgres://mxnolcvyjeqdmd:3f2a2e7a70f9395f64cf89dddfdbb4ff292d27620ca49f5bcc9f888f8eebd2b6@ec2-54-164-241-193.compute-1.amazonaws.com:5432/daormcs1pbr53b",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTables() {
  const { rows: isUsers } = await pool.query(
    "SELECT EXISTS (\
    SELECT FROM information_schema.tables \
    WHERE  table_schema = 'public'\
    AND    table_name   = 'users'\
    );"
  );
  const { rows: isTasks } = await pool.query(
    "SELECT EXISTS (\
    SELECT FROM information_schema.tables \
    WHERE  table_schema = 'public'\
    AND    table_name   = 'tasks'\
    );"
  );

  if (!isUsers[0].exists) {
    pool.query(
      "CREATE TABLE users (\
       user_id SERIAL NOT NULL PRIMARY KEY,\
       username varchar(255) NOT NULL,\
       password varchar(255) NOT NULL\
      );"
    );
  }
  if (!isTasks[0].exists) {
    pool.query(
      "CREATE TABLE tasks (\
       task_id SERIAL NOT NULL PRIMARY KEY,\
       username varchar(255) NOT NULL,\
       text varchar(255) NOT NULL,\
       status varchar(255) NOT NULL\
      );"
    );
  }
}
createTables();

module.exports = {
  query: async (text, params) => pool.query(text, params),
};
