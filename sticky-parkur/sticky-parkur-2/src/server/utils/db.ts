import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sticky-parkur';
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export const getDatabase = () => {
    return client.db();
};

export const closeDatabaseConnection = async () => {
    try {
        await client.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};