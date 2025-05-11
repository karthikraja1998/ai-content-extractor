import getArticleSummaries from "../services/getSummaries";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getArticleSummaries", () => {
  const mockEnv = { GEMINI_APIKEY: "test-api-key" };
  jest.mock("~/env", () => ({
    env: mockEnv,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return overall summary and keypoints when API calls succeed", async () => {
    // Mock first chunk summary
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [{ text: "Chunk summary. " }],
            },
          },
        ],
      },
    });
    // Mock overall summary and keypoints
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '```json\n{"summary":"Overall summary","keypoints":["A","B"]}\n```',
                },
              ],
            },
          },
        ],
      },
    });

    const result = await getArticleSummaries(["chunk1"]);
    expect(result).toHaveProperty("summary", "Overall summary");
    expect(result).toHaveProperty("keypoints", ["A", "B"]);
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });

  it("should skip chunk on error and still return overall summary", async () => {
    // First chunk fails
    mockedAxios.post.mockRejectedValueOnce(new Error("API error"));
    // Overall summary call
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '```json\n{"summary":"Fallback summary","keypoints":["X"]}\n```',
                },
              ],
            },
          },
        ],
      },
    });

    const result = await getArticleSummaries(["bad chunk"]);
    expect(result).toHaveProperty("summary", "Fallback summary");
    expect(result).toHaveProperty("keypoints", ["X"]);
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });

  it("should return empty object if overall summary API call fails", async () => {
    // Chunk summary
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [{ text: "Chunk summary. " }],
            },
          },
        ],
      },
    });
    // Overall summary fails
    mockedAxios.post.mockRejectedValueOnce(new Error("API error"));

    const result = await getArticleSummaries(["chunk1"]);
    expect(result).toEqual({});
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });

  it("should handle empty input array", async () => {
    // Overall summary call
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '```json\n{"summary":"Empty input","keypoints":[]}\n```',
                },
              ],
            },
          },
        ],
      },
    });

    const result = await getArticleSummaries([]);
    expect(result).toHaveProperty("summary", "Empty input");
    expect(result).toHaveProperty("keypoints", []);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
