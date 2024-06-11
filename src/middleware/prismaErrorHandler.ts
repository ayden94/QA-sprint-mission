import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const prismaErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		switch (err.code) {
			case 'P2025':
				res.sendStatus(404);
				break;

			default:
				res.status(500).send({ message: 'Internal server error' });
				break;
		}
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		res.status(400).send({ message: err.message });
	} else {
		res.status(500).send({ message: err.message });
	}

	next();
};
