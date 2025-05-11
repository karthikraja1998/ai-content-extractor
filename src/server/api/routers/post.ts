import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { content } from "~/server/db/schema";
import { db } from "~/server/db";
import axios from "axios";
import cleanArticleContent from "~/server/services/getArticleContent";
import getArticleSummaries from "~/server/services/getSummaries";
import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
type dbRes = {
  id: number;
  url: string;
  summary: string | null;
  keyPoints: string | null;
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
        const { summary, keypoints } = summaryRes;
        await db.insert(content).values({
          url: input.URL,
          summary: summary,
          keyPoints: JSON.stringify(keypoints || []),
        });

        const contents: dbRes[] = await db
          .select()
          .from(content)
          .orderBy(desc(content.createdAt));
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
      const contents: dbRes[] = await db
        .select()
        .from(content)
        .orderBy(desc(content.createdAt));
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
