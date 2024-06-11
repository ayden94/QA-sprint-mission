import { NextFunction, Request, Response } from 'express';
import { Struct, assert } from 'superstruct';

export const requestChecker =
	<T extends Struct<any, any>, S extends keyof Request>(type: S, props: T) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			assert(req[type], props);
			next();
		} catch (err: any) {
			return res.status(400).send({ message: err.message });
		}
	};
