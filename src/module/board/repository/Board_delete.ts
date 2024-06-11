import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Board_delete(id: string) {
	await prisma.board.delete({
		where: { id },
	});
}
