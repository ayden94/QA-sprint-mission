import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Board_likes(id: string, email: string) {
	const updatedBoard = await prisma.board.update({
		where: {
			id,
		},
		data: {
			favoriteUser: {
				connect: { email },
			},
			likeCount: {
				increment: 1,
			},
		},
		select: {
			id: true,
			title: true,
			content: true,
			imageUrl: true,
			createdAt: true,
			updatedAt: true,
			likeCount: true,
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
