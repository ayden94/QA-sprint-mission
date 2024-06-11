import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const select = {
	id: true,
	content: true,
	createdAt: true,
	updatedAt: true,
	writerId: {
		select: {
			id: true,
			image: true,
			nickname: true,
		},
	},
};

async function Comment_findMany(
	cursor: string,
	takeNumber: number,
	id: string,
	where: 'boardId' | 'productId',
) {
	const comments = await prisma.comment.findMany({
		where: {
			[where]: { id },
		},
		orderBy: { createdAt: 'desc' },
		cursor: cursor ? { id: cursor as string } : undefined,
		take: takeNumber,

		select,
	});

	return comments;
}

export default Comment_findMany;
