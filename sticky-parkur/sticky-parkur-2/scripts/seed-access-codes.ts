import { AccessCode } from '../src/server/models/accessCode.model';
import { db } from '../src/server/utils/db';

async function seedAccessCodes() {
    const accessCodes = [
        { code: 'LEVEL_ACCESS', description: 'Grants access to all levels', levelAccess: true, infiniteMoney: false },
        { code: 'INFINITE_MONEY', description: 'Grants infinite money', levelAccess: false, infiniteMoney: true },
        { code: 'ALL_ACCESS', description: 'Grants access to all levels and infinite money', levelAccess: true, infiniteMoney: true },
    ];

    try {
        await db.connect();
        await AccessCode.deleteMany({}); // Clear existing access codes
        await AccessCode.insertMany(accessCodes); // Seed new access codes
        console.log('Access codes seeded successfully.');
    } catch (error) {
        console.error('Error seeding access codes:', error);
    } finally {
        await db.disconnect();
    }
}

seedAccessCodes();