import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Board_findUnique(id: string) {
	const board = await prisma.board.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			content: true,
			imageUrl: true,
			createdAt: true,
			writer: true,
			favoriteUser: true,
		},
	});

	return board;
}
