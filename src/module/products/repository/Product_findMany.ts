import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ownerIdFormatter } from '../../../helper/ownerIdFormatter';

const prisma = new PrismaClient();

export async function Product_findMany(req: Request, res: Response) {
	const {
		offset = '0',
		limit = '10',
		order = 'recent',
		search = '',
	} = req.query;

	let orderBy:
		| { [key in 'createdAt']: 'desc' | 'asc' }
		| { [key in 'favoriteCount']: 'desc' | 'asc' };
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		case 'favorite':
			orderBy = { favoriteCount: 'asc' };
			break;
		default:
			orderBy = { createdAt: 'desc' };
			break;
	}

	const totalCount = await prisma.product.count({
		where: {
			OR: [
				{
					name: {
						contains: search as string,
					},
				},
				{
					description: {
						contains: search as string,
					},
				},
			],
		},
	});

	const products = await prisma.product.findMany({
		where: {
			OR: [
				{
					name: {
						contains: search as string,
					},
				},
				{
					description: {
						contains: search as string,
					},
				},
			],
		},

		orderBy: { ...orderBy },
		skip: parseInt(offset as string),
		take: parseInt(limit as string),

		select: {
			id: true,
			name: true,
			price: true,
			images: true,
			createdAt: true,
			ownerId: true,
			favoriteCount: true,
		},
	});

	const formattedProducts = ownerIdFormatter(products);

	const response = {
		totalCount,
		list: formattedProducts,
	};

	res.send(response);
}