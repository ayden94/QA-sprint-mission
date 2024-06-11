import { PrismaClient } from '@prisma/client';
import { PatchBoardProps } from '../board.types';

const prisma = new PrismaClient();

export async function Board_update(
	patchBoardProps: PatchBoardProps,
	id: string,
) {
	const updateBoard = await prisma.board.update({
		where: {
			id,
		},
		data: { ...patchBoardProps },
	});

	return updateBoard;
}
