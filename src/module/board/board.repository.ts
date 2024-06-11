import { PrismaClient } from '@prisma/client';
import {
	CreateBoardProps,
	FindBoardsProps,
	PatchBoardProps,
	BoardOrderBy,
} from './board.types';

const prisma = new PrismaClient();

const commonSelect = {
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
};

const selectLikes = {
	...commonSelect,
	likeCount: true,
};

const selectFind = {
	...commonSelect,
	favoriteUser: true,
};

async function Board_create(createBoardProps: CreateBoardProps, email: string) {
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

async function Board_findMany(
	{ offset, limit, search }: FindBoardsProps,
	orderBy: BoardOrderBy,
) {
	const boards = await prisma.board.findMany({
		where: {
			OR: [
				{
					title: {
						contains: search,
					},
				},
				{
					content: {
						contains: search,
					},
				},
			],
		},

		orderBy,
		skip: parseInt(offset),
		take: parseInt(limit),

		select: selectFind,
	});

	return boards;
}

async function Board_findUnique(id: string) {
	const board = await prisma.board.findUnique({
		where: { id },
		select: selectFind,
	});

	if (!board) {
		throw new Error('게시글이 존재하지 않습니다');
	}

	return board;
}

async function Board_update(patchBoardProps: PatchBoardProps, id: string) {
	const updateBoard = await prisma.board.update({
		where: {
			id,
		},
		data: { ...patchBoardProps },
	});

	return updateBoard;
}

async function Board_delete(id: string) {
	await prisma.board.delete({
		where: { id },
	});
}

async function Board_likes(id: string, email: string) {
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
		select: selectLikes,
	});

	return updatedBoard;
}

async function Board_dislikes(id: string, email: string) {
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
		select: selectLikes,
	});

	return updatedBoard;
}

const boardRepository = {
	Board_create,
	Board_findMany,
	Board_findUnique,
	Board_update,
	Board_delete,
	Board_likes,
	Board_dislikes,
};

export default boardRepository;
