import { PrismaClient } from '@prisma/client';
import { PatchCommentProps } from './comment.types';

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

async function Comment_findUnique(id: string) {
	const comment = await prisma.comment.findUnique({
		where: { id },
		include: { writerId: true },
	});

	return comment;
}

async function Comment_update(
	patchCommentProps: PatchCommentProps,
	id: string,
) {
	const comment = await prisma.comment.update({
		where: { id },
		data: { ...patchCommentProps },
	});

	return comment;
}

export async function Comment_delete(id: string) {
	await prisma.board.findUnique({
		where: { id },
		include: { writer: true },
	});
}

const commentRepository = {
	Comment_findMany,
	Comment_findUnique,
	Comment_update,
	Comment_delete,
};

export default commentRepository;
