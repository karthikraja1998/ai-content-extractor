import { postRouter } from "../api/routers/post";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import axios from "axios";
import cleanArticleContent from "~/server/services/getArticleContent";
import getArticleSummaries from "~/server/services/getSummaries";
import { content } from "~/server/db/schema";
import { desc } from "drizzle-orm";

jest.mock("axios");
jest.mock("~/server/services/getArticleContent");
jest.mock("~/server/services/getSummaries");

jest.mock("~/server/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn().mockResolvedValue({
        id: 1,
        url: "https://example.com",
        summary: "This is a summary",
        keyPoints: JSON.stringify(["Key point 1", "Key point 2"]),
        createdAt: new Date("2025-05-10T09:43:20.000Z"),
      }),
    })),
    select: jest.fn(() => ({
      from: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockResolvedValue([
          {
            id: 1,
            url: "https://example.com",
            summary: "This is a summary",
            keyPoints: JSON.stringify(["Key point 1", "Key point 2"]),
            createdAt: new Date("2025-05-10T09:43:20.000Z"),
          },
        ]),
      }),
    })),
  },
}));

const callerInstance = postRouter.createCaller({
  headers: {} as Headers,
  db: require("~/server/db").db,
});

describe("postRouter", () => {
  describe("getSummary", () => {
    it("should return summaries when valid URL is provided", async () => {
      const mockURL = "https://example.com";
      const mockArticleContent = ["This is a test article content"];
      const mockSummaryResponse = JSON.stringify({
        summary: "This is a summary",
        keypoints: ["Key point 1", "Key point 2"],
      });
      const mockDbResponse = [
        {
          id: 1,
          url: mockURL,
          summary: "This is a summary",
          keyPoints: JSON.stringify(["Key point 1", "Key point 2"]),
          createdAt: new Date("2025-05-10T09:43:20.000Z"),
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({
        data: "<html>content</html>",
      });
      (cleanArticleContent as jest.Mock).mockResolvedValue(mockArticleContent);
      (getArticleSummaries as jest.Mock).mockResolvedValue({
        summary: "This is a summary",
        keypoints: ["Key point 1", "Key point 2"],
      });

      const result = await callerInstance.getSummary({ URL: mockURL });

      expect(result).toEqual(mockDbResponse);
      expect(axios.get).toHaveBeenCalledWith(mockURL);
      expect(cleanArticleContent).toHaveBeenCalledWith("<html>content</html>");
      expect(getArticleSummaries).toHaveBeenCalledWith(mockArticleContent);
      const insertMock = require("~/server/db").db.insert;
      expect(insertMock).toHaveBeenCalledWith(content);
      const valuesMock = insertMock.mock.results[0].value.values;
      expect(valuesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          url: mockURL,
          summary: "This is a summary",
          keyPoints: JSON.stringify(["Key point 1", "Key point 2"]),
        }),
      );
    });

    it("should throw an error when no content is extracted", async () => {
      const mockURL = "https://example.com";

      (axios.get as jest.Mock).mockResolvedValue({
        data: "<html>content</html>",
      });
      (cleanArticleContent as jest.Mock).mockResolvedValue([]);

      await expect(
        callerInstance.getSummary({ URL: mockURL }),
      ).rejects.toThrowError(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No content extracted",
        }),
      );
    });
  });

  describe("getAllSummaries", () => {
    it("should return all summaries from the database", async () => {
      const mockDbResponse = [
        {
          id: 1,
          url: "https://example.com",
          summary: "This is a summary",
          keyPoints: JSON.stringify(["Key point 1", "Key point 2"]),
          createdAt: new Date("2025-05-10T09:43:20.000Z"),
        },
      ];

      const result = await callerInstance.getAllSummaries();

      expect(result).toEqual(mockDbResponse);
      expect(require("~/server/db").db.select).toHaveBeenCalled();
    });

    it("should throw an error when database operation fails", async () => {
      (require("~/server/db").db.select as jest.Mock).mockImplementationOnce(
        () => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error",
          });
        },
      );

      await expect(callerInstance.getAllSummaries()).rejects.toThrowError(
        new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database error",
        }),
      );
    });
  });
});
