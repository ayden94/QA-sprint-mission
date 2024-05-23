import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateBoard } from "../board.structs.js";

const prisma = new PrismaClient();

export async function Board_create(req, res) {
  assert(req.body, CreateBoard);
  const { ownerId, ...boardField } = req.body;

  const board = await prisma.board.create({
    data: {
      ...boardField,
      likeCount: 0,
      writer: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  res.send(board);
}