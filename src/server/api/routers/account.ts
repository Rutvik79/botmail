import z from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";

export const authoriseAccountAccess = async (
  accountId: string,
  userId: string,
) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId,
    },
    select: {
      id: true,
      emailAddress: true,
      name: true,
      accessToken: true,
    },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};

const inboxFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  inboxStatus: true,
});

const sentFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  sentStatus: true,
});

const draftFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  draftStatus: true,
});

export const accountRouter = createTRPCRouter({
  getAccounts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
      },
    });
  }),

  getNumThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter = inboxFilter(account.id);
      } else if (input.tab === "sent") {
        filter = sentFilter(account.id);
      } else if (input.tab === "draft") {
        filter = draftFilter(account.id);
      }

      return await ctx.db.thread.count({
        where: {
          accountId: account.id,
          ...filter,
        },
      });
    }),

  getThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter = inboxFilter(account.id);
      } else if (input.tab === "sent") {
        filter = sentFilter(account.id);
      } else if (input.tab === "draft") {
        filter = draftFilter(account.id);
      }

      filter.done = {
        equals: input.done,
      };

      const threads = await ctx.db.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              bodySnippet: true,
              emailLabel: true,
              subject: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
        take: 15,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
      return threads;
    }),
});
