import type { ReactionStyle } from "@prisma/client";
import { prisma } from "../database/prisma.server";

export async function createReaction({
  message,
  style,
  authorId,
  recipientId,
}: {
  message: string;
  style: ReactionStyle;
  authorId: string;
  recipientId: string;
}) {
  prisma.reaction.create({
    data: {
      message,
      style,
      author: { connect: { id: authorId } },
      recipient: { connect: { id: recipientId } },
    },
  });
}
