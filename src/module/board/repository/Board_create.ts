import { PrismaClient } from '@prisma/client';
import { CreateBoardProps } from '../board.types';
const prisma = new PrismaClient();

export async function Board_create(
	createBoardProps: CreateBoardProps,
	email: string,
) {
	const board = await prisma.board.create({
		data: {
			...createBoardProps,
			likeCount: 0,
			writer: {
				connect: {
					email,
				},
			},
		},
	});

	return board;
}
