import { PrismaClient } from '@prisma/client';
import {
	CreateUserProps,
	PatchUserPasswordProps,
	PatchUserProps,
} from './user.types';

const prisma = new PrismaClient();

async function User_create({ email, password, nickname }: CreateUserProps) {
	const user = await prisma.user.create({
		data: { email, password, nickname },
	});

	return user;
}

async function User_findUnique(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	return user;
}

async function User_Update(
	email: string,
	patchProps: PatchUserProps | PatchUserPasswordProps,
) {
	const updateUser = await prisma.user.update({
		where: { email },
		data: { ...patchProps },
		select: {
			id: true,
			nickname: true,
			image: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return updateUser;
}

async function User_favoriteProduct(email: string) {
	const favoriteProduct = await prisma.user.findMany({
		where: { email },
		select: {
			favoriteProduct: true,
		},
	});

	return favoriteProduct;
}

async function User_ownedProduct(email: string) {
	const ownedProduct = await prisma.user.findMany({
		where: { email },
		select: {
			ownedProduct: true,
		},
	});

	return ownedProduct;
}

const userRepository = {
	User_create,
	User_findUnique,
	User_Update,
	User_favoriteProduct,
	User_ownedProduct,
};

export default userRepository;
