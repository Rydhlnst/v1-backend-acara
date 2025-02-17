import { Request, Response } from 'express';

export default  {
    // 2 Argumen
    dummy(req: Request, res: Response) {
        res.status(200).json({
            message: "Hello Dummy",
            data: "Hello Dummy"
        })
    }
};