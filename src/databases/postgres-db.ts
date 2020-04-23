import { createConnection } from 'typeorm';

export const postgresDB = async () => {
    return await createConnection().then((connection) => {
        console.log('Database connection established');
    });
};
