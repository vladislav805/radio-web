import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

let connection: mysql.Connection;

export const getConnection = (): Promise<mysql.Connection> => connection
    ? Promise.resolve(connection)
    : mysql.createConnection({
        host: process.env.database_host,
        user: process.env.database_user,
        database: process.env.database_name,
        password: process.env.database_password,
    });
