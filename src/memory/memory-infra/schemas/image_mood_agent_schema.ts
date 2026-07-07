import { z } from 'zod';

export const ImageMoodResultSchema = z.object({
  mood: z
    .string()
    .describe(
      '해당 사진에서 풍기는 연인의 분위기를 한국어로 2줄 이내로 요약한 내용',
    ),

  happyScore: z
    .number()
    .describe(
      '사진에서 풍기는 연인의 분위기에 대한 행복 점수. 0에서 100 사이의 정수로 표현',
    ),

  recommendedSong: z
    .string()
    .describe(
      '사진에서 풍기는 연인의 분위기에 맞는 노래를 추천하는 내용. 한국 노래로 하나만 추천',
    ),
});
