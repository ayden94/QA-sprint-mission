import { PrismaClient } from '@prisma/client';
import {
	CreateBoardProps,
	FindBoardsProps,
	PatchBoardProps,
	BoardOrderBy,
} from './board.types';

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

export class BoardRepository extends PrismaClient {
	async Board_create(createBoardProps: CreateBoardProps, email: string) {
		const board = await this.board.create({
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

	async Board_findMany(
		{ offset, limit, search }: FindBoardsProps,
		orderBy: BoardOrderBy,
	) {
		const boards = await this.board.findMany({
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

			select: {
				...commonSelect,
				favoriteUser: true,
			},
		});

		return boards;
	}

	async Board_findUnique(id: string) {
		const board = await this.board.findUnique({
			where: { id },
			select: {
				...commonSelect,
				favoriteUser: true,
			},
		});

		if (!board) {
			throw new Error('게시글이 존재하지 않습니다');
		}

		return board;
	}

	async Board_update(patchBoardProps: PatchBoardProps, id: string) {
		const updateBoard = await this.board.update({
			where: {
				id,
			},
			data: { ...patchBoardProps },
		});

		return updateBoard;
	}

	async Board_delete(id: string) {
		await this.board.delete({
			where: { id },
		});
	}

	async Board_likes(id: string, email: string) {
		const updatedBoard = await this.board.update({
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
				...commonSelect,
				likeCount: true,
			},
		});

		return updatedBoard;
	}

	async Board_dislikes(id: string, email: string) {
		const updatedBoard = await this.board.update({
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
				...commonSelect,
				likeCount: true,
			},
		});

		return updatedBoard;
	}
}
