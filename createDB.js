const sqlite3 = require('sqlite3')

// SQLite ALTER statement doesn't support constraint such as UNIQUE, PRIMARY
const schema = require(process.env.SCHEMA);

exports.conn = function getConnection(){
    // make db connection and export this object for querying the database from controllers
    const conn = new sqlite3.Database('./db/' + schema.name, (err) => {
        if(err) {
            return console.error(err.message)
        }
    });

    return conn;
}

exports.closeConn = function closeConnection(){
    exports.conn().close();
}

const createSchema = async function createSchema(){
    return new Promise((resolve, reject) => {
        // First create a table with __id as primary key
        // then add all the columns
        const conn = exports.conn();
        Object.keys(schema.tables).forEach(async (tableName) => {
            const tableCreated = await createTable(conn, tableName);
    
            if(tableCreated == true){
                const colsCreated = await updateCols(conn, tableName, schema.tables[tableName]);
                if(colsCreated == true) resolve(true);
                else reject(false);
            }
        });
    });
}

//Create a table is doesn't exist
async function createTable(conn, tableName){
    return new Promise((resolve, reject) => {
        let query = "CREATE TABLE IF NOT EXISTS " + tableName +" (__id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL);"
        conn.run(query, (err) => {
            if(err) return reject(err);
            
            console.log("Table created successfully");
            return resolve(true);
        })
    });
}

//Check if all columns exists. If missing add the column 
async function updateCols(conn, tableName, struct){
    return new Promise((resolve, reject) => {
        //add columns
        struct.cols.forEach(async function (col) {
            const isCol = await colNotExists(conn, tableName, col).catch(err => {
                return reject(err);
            });
            if(isCol == true){
                let query = "ALTER TABLE " + tableName + " ADD "
                if('name' in col && col.name != ""){
                    query += col.name + " " +  col.type; 
                }
        
                conn.run(query, (err) =>{
                    if(err){
                        console.error(err);
                        console.error("Unable to add column");
                        return reject(false);
                    }else{
                        console.info(col.name + " added");
                        resolve(true);
                    }
                });
            }else{
                reject(false);
            }
        });

        resolve(true);
    })
}

//check if column exists
async function colNotExists(conn, tableName, col){
    return new Promise((resolve, reject) => {
        conn.run("SELECT " + col.name + " FROM " + tableName, (err) => {
            //If column doesn't exists, sql will throw error, we are checking if column doesn't exists
            if(err) return resolve(true);

            return reject("Hello");
        })
    });
}

exports.schema = schema;
exports.createSchema = createSchema;