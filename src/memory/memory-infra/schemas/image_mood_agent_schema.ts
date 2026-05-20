import { z } from 'zod';

export const ImageMoodResultSchema = z.object({
  mood: z
    .string()
    .describe(
      '해당 사진에서 풍기는 연인의 분위기를 한국어로 2줄 이내로 요약한 내용',
    ),
});
