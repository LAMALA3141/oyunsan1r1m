import { Request, Response } from 'express';
import { AccessCodeService } from '../services/accessCode.service';

export class AdminController {
    private accessCodeService: AccessCodeService;

    constructor() {
        this.accessCodeService = new AccessCodeService();
    }

    public async validateAccessCode(req: Request, res: Response): Promise<void> {
        const { code } = req.body;
        const isValid = await this.accessCodeService.validateCode(code);

        if (isValid) {
            res.status(200).json({ message: 'Access granted' });
        } else {
            res.status(403).json({ message: 'Invalid access code' });
        }
    }

    public async grantInfiniteMoney(req: Request, res: Response): Promise<void> {
        const { code } = req.body;
        const isValid = await this.accessCodeService.validateCode(code);

        if (isValid) {
            // Logic to grant infinite money to players
            res.status(200).json({ message: 'Infinite money granted' });
        } else {
            res.status(403).json({ message: 'Invalid access code' });
        }
    }

    public async setLevelAccess(req: Request, res: Response): Promise<void> {
        const { code, level } = req.body;
        const isValid = await this.accessCodeService.validateCode(code);

        if (isValid) {
            // Logic to set level access
            res.status(200).json({ message: `Level ${level} access granted` });
        } else {
            res.status(403).json({ message: 'Invalid access code' });
        }
    }
}