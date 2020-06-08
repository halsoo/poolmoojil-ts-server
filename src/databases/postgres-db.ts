import { createConnection } from 'typeorm';
import { postgresTables } from './postgres-tables';

// export const postgresDB = async () => {
//     return await createConnection().then((connection) => {
//         console.log('Database connection established');
//     });
// };

export const postgresDB = async () => {
    return await createConnection({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: 5432,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: 'poolmoojil',
        ssl: false,
        entities: postgresTables,
        synchronize: true,
    }).then((connection) => {
        console.log('Database connection established');
    });
};
