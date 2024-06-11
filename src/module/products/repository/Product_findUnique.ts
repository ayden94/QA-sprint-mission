import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { addIsFavorite } from '../../../helper/addIsFavorite';
import userRepository from '../../user/user.repository';

const prisma = new PrismaClient();

export async function Product_findUnique(req: Request, res: Response) {
	const { id } = req.params;
	const email = req.body.email;

	const user = await userRepository.User_findUnique(email);

	const product = await prisma.product.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			description: true,
			price: true,
			tags: true,
			images: true,
			createdAt: true,
			ownerId: true,
			favoriteCount: true,
		},
	});

	if (product) {
		const productWithIsFavorite = await addIsFavorite(product, user);

		res.send(productWithIsFavorite);
	} else {
		res.status(404).send({ error: 'Product not found' });
	}
}
