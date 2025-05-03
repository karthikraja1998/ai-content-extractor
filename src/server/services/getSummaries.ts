import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { env } from "~/env";
export default async function getArticleSummaries(
  articleChunks: string[],
): Promise<any> {
  const summarySchema = JSON.stringify({
    summary: "summary of the article goes here",
    keypoints: ["keypoint1", "keypoint2", "keypoint3", "etc"],
  });
  let summary: string = ``;
  for (let articleChunk of articleChunks) {
    const prompt: string = `Provide a short summary for the following article content \n ${articleChunk}`;
    const options: AxiosRequestConfig = provideOptions(prompt);
    try {
      const res = await axios(options);
      summary += res?.data?.candidates?.[0].content?.parts?.[0]?.text;
      // console.log("🚀 ~ summary:", summary);
    } catch (error) {
      console.error(
        "error in gemini API: Error summarising article chunks",
        error,
      );
      continue;
    }
  }
  const prompt: string = `Provide a short summary and keypoints for the following article content in the 
                          given json format: \n ${summarySchema} $ \n ${summary}`;
  const options: AxiosRequestConfig = provideOptions(prompt);
  try {
    const res = await axios(options);
    let overallSummaryAndKeypoints =
      res?.data?.candidates?.[0].content?.parts?.[0]?.text;
    overallSummaryAndKeypoints = overallSummaryAndKeypoints
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .replace("```", "")
      .replace(/[“”]/g, '"') // replace smart double quotes
      .replace(/[‘’]/g, "'")
      .trim();
    // console.log("🚀 ~ overallSummaryAndKeypoints:", overallSummaryAndKeypoints);
    // overallSummaryAndKeypoints = JSON.stringify(overallSummaryAndKeypoints);
    return overallSummaryAndKeypoints;
  } catch (error) {
    console.error(
      "error in gemini API: Error in overall summarising article",
      error,
    );
    return {};
  }
}

const provideOptions = (geminiPrompt: string): AxiosRequestConfig => {
  const apikey = env.GEMINI_APIKEY;
  const url: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`;
  const options: AxiosRequestConfig = {
    url,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      contents: [
        {
          parts: [
            {
              text: geminiPrompt,
            },
          ],
        },
      ],
    },
  };
  return options;
};
