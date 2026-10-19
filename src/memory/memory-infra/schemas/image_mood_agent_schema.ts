import { z } from 'zod';

export const ImageMoodResultSchema = z.object({
  mood: z
    .string()
    .describe(
      '해당 사진에서 풍기는 연인의 분위기를 한국어로 2줄 이내(줄바꿈 포함 최대 2문장)로 감성적이고 따뜻하게 요약한 내용',
    ),

  happyScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      '사진에서 풍기는 연인의 분위기와 표정 등에 대한 행복 점수. 0에서 100 사이의 정수',
    ),

  recommendedSong: z
    .string()
    .describe(
      "사진 속 분위기와 어울리는 한국 노래 1곡. 반드시 '가수 - 곡명' 형식으로 작성 (예: 성시경 - 너의 모든 순간)",
    ),
});
