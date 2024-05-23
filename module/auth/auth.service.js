import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { SignIn, SignUp } from "./auth.structs.js";
import pkg from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../helper/jwt.js";

const { genSalt, hash, compare } = pkg;

const prisma = new PrismaClient();

export async function signUp(req, res) {
  // 제대로 들어왔나 확인
  assert(req.body, SignUp);

  // 구조 분해
  const { email, password, nickname } = req.body;

  // salt + hash
  const salt = await genSalt();
  const hashedPassword = await hash(password, salt);

  await prisma.user.create({
    data: { email, password: hashedPassword, nickname },
  });

  const accessToken = generateAccessToken({ email, nickname });
  const refreshToken = generateRefreshToken({ email, nickname });

  res
    .status(201)
    .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60, httpOnly: true })
    .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 60, httpOnly: true })
    .send("회원가입 성공");
}

export async function signIn(req, res) {
  assert(req.body, SignIn);

  // check
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await compare(password, user.password))) {
    const accessToken = generateAccessToken({ email, nickname: user.nickname });
    const refreshToken = generateRefreshToken({ email, nickname: user.nickname });
    // Secure: true
    res
      .status(200)
      .cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60, httpOnly: true })
      .cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 60, httpOnly: true })
      .send("로그인 성공");
  } else {
    res.sendStatus(401);
  }
}