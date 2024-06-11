import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Board_dislikes(id: string, email: string) {
	const updatedBoard = await prisma.board.update({
		where: {
			id,
		},
		data: {
			favoriteUser: {
				disconnect: { email },
			},
			likeCount: {
				decrement: 1,
			},
		},
		select: {
			id: true,
			title: true,
			content: true,
			imageUrl: true,
			createdAt: true,
			writer: {
				select: {
					nickname: true,
					id: true,
				},
			},
		},
	});

	return updatedBoard;
}
