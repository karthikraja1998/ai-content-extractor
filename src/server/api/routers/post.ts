import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import cleanArticleContent from "~/server/services/getArticleContent";
import getArticleSummaries from "~/server/services/getSummaries";
import { prisma } from "lib/prisma";
import { TRPCError } from "@trpc/server";
type dbRes = {
  id: number;
  url: string;
  summary: string;
  keyPoints: string;
  createdAt: Date;
};
export const postRouter = createTRPCRouter({
  getSummary: publicProcedure
    .input(z.object({ URL: z.string().url() }))
    .mutation(async ({ input }) => {
      try {
        const pageRes = await axios.get(input.URL);
        const articleContentChunks = await cleanArticleContent(pageRes.data);
        if (!articleContentChunks.length) {
          throw new Error("No content extracted");
        }
        const summaryRes = await getArticleSummaries(articleContentChunks);
        console.log("🚀 ~ .mutation ~ summaryRes:", summaryRes);
        const { summary, keypoints } = JSON.parse(summaryRes);
        await prisma.content.create({
          data: {
            url: input.URL,
            summary: summary,
            keyPoints: JSON.stringify(keypoints || []),
          },
        });
        const contents: dbRes[] = await prisma.content.findMany({
          orderBy: { createdAt: "desc" },
        });
        return contents;
      } catch (error) {
        console.error("Database error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Database operation failed",
        });
      }
    }),
  getAllSummaries: publicProcedure.query(async () => {
    try {
      const contents: dbRes[] = await prisma.content.findMany({
        orderBy: { createdAt: "desc" },
      });
      return contents;
    } catch (error) {
      console.error("Error in Prisma: Error fetching data", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Database operation failed",
      });
    }
  }),
});
