import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const User_findUnique = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
		include: {
			ownedProduct: true,
			favoriteProduct: true,
			ownedBoard: true,
			favoriteBoard: true,
		},
	});

	return user;
};
