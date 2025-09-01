import { AccessCode } from '../models/accessCode.model';

const accessCodes: { [key: string]: { levelAccess: number[]; infiniteMoney: boolean } } = {
    'ADMIN123': { levelAccess: [1, 2, 3, 4, 5], infiniteMoney: true },
    'LEVEL5': { levelAccess: [5], infiniteMoney: false },
    'LEVEL10': { levelAccess: [10], infiniteMoney: false },
};

export const validateAccessCode = (code: string): { levelAccess: number[]; infiniteMoney: boolean } | null => {
    return accessCodes[code] || null;
};

export const getAllAccessCodes = (): string[] => {
    return Object.keys(accessCodes);
};

export const addAccessCode = (code: string, levelAccess: number[], infiniteMoney: boolean): void => {
    accessCodes[code] = { levelAccess, infiniteMoney };
};

export const removeAccessCode = (code: string): void => {
    delete accessCodes[code];
};