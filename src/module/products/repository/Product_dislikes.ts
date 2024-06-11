import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

import { isFavorite } from '../../../helper/isFavorite';
import userRepository from '../../user/user.repository';

const prisma = new PrismaClient();

export async function Product_dislikes(req: Request, res: Response) {
	const { id } = req.params;

	const email = req.body.email;

	const user = await userRepository.User_findUnique(email);

	// 액션에 따른 에러 핸들
	if (!(await isFavorite(id, user))) {
		throw new Error('이미 좋아요가 해제되었어요');
	}

	await prisma.product.update({
		where: {
			id,
		},
		data: {
			favoriteUser: {
				disconnect: { email: req.cookies.email },
			},
			favoriteCount: {
				decrement: 1,
			},
		},
	});

	res.sendStatus(204);
}
