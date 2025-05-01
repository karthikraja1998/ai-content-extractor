import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";

export const postRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const pageRes = await axios({ url: input.text, method: "get" });
      console.log("html res", pageRes.data);
      return {
        message: `${pageRes.data}`,
      };
    }),
});
