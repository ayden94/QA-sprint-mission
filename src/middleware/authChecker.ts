import { NextFunction, Request, Response } from 'express';

export const authChecker = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.cookies.email) {
		next();
	} else {
		return res.status(401).send({ message: '로그인이 필요한 서비스입니다' });
	}
};
