export interface AccessCode {
    code: string;
    levelAccess: number[];
    infiniteMoney: boolean;
}

export interface AdminSettings {
    maxLevels: number;
    defaultVolume: number;
    enableCheats: boolean;
}

export interface GameSettings {
    startLevel: number;
    startFullscreen: boolean;
    volumePercent: number;
}