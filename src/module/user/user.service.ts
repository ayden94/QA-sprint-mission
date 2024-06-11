import pkg from 'bcryptjs';
import userRepository from './user.repository';
import { PatchUserPasswordProps, PatchUserProps } from './user.types';

async function getUser(email: string) {
	const user = await userRepository.User_findUnique(email);

	return user;
}

async function updateUser(email: string, patchUserProps: PatchUserProps) {
	const updatedUser = await userRepository.User_Update(email, patchUserProps);

	return updatedUser;
}

async function updateUserPassword(
	email: string,
	patchUserPasswordProps: PatchUserPasswordProps,
) {
	const { genSalt, hash } = pkg;
	const { password } = patchUserPasswordProps;

	// salt + hash
	const salt = await genSalt();
	const hashedPassword = await hash(password, salt);

	const updatedUser = await userRepository.User_Update(email, {
		password: hashedPassword,
	});

	return updatedUser;
}

async function getUserOwnedProduct(email: string) {
	const ownedProduct = await userRepository.User_ownedProduct(email);

	return ownedProduct;
}

async function getUserFavoriteProduct(email: string) {
	const favoriteProducts = await userRepository.User_favoriteProduct(email);

	return favoriteProducts;
}

const userService = {
	getUser,
	updateUser,
	updateUserPassword,
	getUserOwnedProduct,
	getUserFavoriteProduct,
};

export default userService;
