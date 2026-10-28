import {
  Agent,
  AgentInputItem,
  run,
  OpenAIChatCompletionsModel,
  setDefaultOpenAIKey,
} from '@openai/agents';
import OpenAI from 'openai';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { ImageMoodResultSchema } from '../schemas/image_mood_agent_schema';
import { MemoryComment } from '../../memory-core/memory-comment';
import { ImageMoodAgentModel } from '../../memory-core/models/image-mood-agent.model';

@Injectable()
export class OpenAIImageMoodAgent implements ImageMoodAgent {
  private readonly logger = new Logger(OpenAIImageMoodAgent.name);
  private readonly imageMoodAgent: Agent<unknown, typeof ImageMoodResultSchema>;

  constructor(
    @Optional()
    private readonly configService?: ConfigService,
  ) {
    const baseUrl =
      this.configService?.get<string>('BASE_URL') ??
      this.configService?.get<string>('OPENAI_BASE_URL') ??
      process.env.BASE_URL ??
      process.env.OPENAI_BASE_URL;

    const modelName =
      this.configService?.get<string>('MODEL') ??
      this.configService?.get<string>('OPENAI_MODEL') ??
      process.env.MODEL ??
      process.env.OPENAI_MODEL ??
      'gpt-4.1-mini-2025-04-14';

    const apiKey =
      this.configService?.get<string>('API_KEY') ??
      this.configService?.get<string>('OPENAI_API_KEY') ??
      process.env.API_KEY ??
      process.env.OPENAI_API_KEY;

    let model: string | OpenAIChatCompletionsModel = modelName;

    if (baseUrl) {
      this.logger.log(
        `Connecting OpenAIImageMoodAgent to custom BASE_URL: ${baseUrl} with model: ${modelName}`,
      );
      const client = new OpenAI({
        baseURL: baseUrl,
        apiKey: apiKey ?? 'dummy-api-key',
      });
      model = new OpenAIChatCompletionsModel(client, modelName);
    } else {
      this.logger.log(
        `Connecting OpenAIImageMoodAgent with default OpenAI endpoint and model: ${modelName}`,
      );
      if (apiKey) {
        setDefaultOpenAIKey(apiKey);
      }
    }

    this.imageMoodAgent = new Agent({
      name: 'image mood agent',
      model,
      instructions: `
# 역할 및 정체성
당신은 연인들의 소중한 순간과 추억을 감성적으로 기록해주는 커플 다이어리 서비스 '하루틈'의 AI 에디터입니다.
제공된 사진들과 사용자의 메모를 세심하게 관찰하여, 그 순간의 분위기, 감정, 온도를 포착하고 감동과 설렘을 주는 다이어리 기록을 완성합니다.

# 필드별 작성 지침

1. mood (추억 요약 문구)
- 분량: 반드시 한국어로 작성하며, 최대 2줄(줄바꿈 포함 1~2문장) 이내로 작성합니다.
- 문체 및 톤:
  * 딱딱한 관찰자적 설명(예: "이 사진은 연인이...", "두 남녀가...", "사진에 따르면...")은 절대 금지합니다.
  * 연인이 시간이 지난 뒤 일기장을 펼쳐보았을 때 가슴이 뭉클하고 설레는 따뜻하고 감성적인 어투를 사용합니다.
  * 자연스러운 다이어리 캡션 어미(예: ~했던 날, ~해서 더 따뜻했던 하루, ~한 순간, ~했어 등)를 사용합니다.
- 내용:
  * 단순 사실 나열("카페에서 커피를 마셨다")을 지양합니다.
  * 사진 속 표정, 맞잡은 손, 눈빛, 조명, 계절감, 장소의 무드, 함께 있어 느껴지는 편안함과 애정을 감각적으로 표현합니다.
  * 사용자가 남긴 메모가 있다면 그 의미를 조화롭게 녹여냅니다.

2. happyScore (행복 지수: 0 ~ 100)
- 사진 속 표정(미소, 눈빛), 스킨십(포옹, 손잡기 등), 장소 분위기, 메모의 긍정적인 감정을 종합하여 0~100 사이의 정수로 평가합니다.
- 기준:
  * 90~100: 특별한 기념일/여행, 환한 웃음, 깊은 설렘과 행복감이 가득한 순간
  * 75~89: 다정하고 편안한 일상 데이트, 소소한 미소와 따뜻한 안정감이 돋보이는 순간
  * 60~74: 차분하고 잔잔한 휴식 또는 평온한 일상의 순간
  * 0~59: 다소 어둡거나 쓸쓸함, 무표정한 분위기 위주일 때

3. recommendedSong (추천 한국 노래 1곡)
- 사진의 무드(계절, 시간대, 감정선, 데이트 장소)에 어울리는 한국 노래(발라드, 어쿠스틱, K-인디, 감성 R&B 등) 1곡을 추천합니다.
- 형식: 반드시 불필요한 수식어 없이 '가수 - 곡명' 형식으로만 출력합니다. (예: 성시경 - 너의 모든 순간)

# 좋은 출력 예시
- 예시 1:
  * mood: 창밖으로 흩날리는 눈을 보며 따뜻한 커피를 나눈 시간.\\n사소한 이야기에도 웃음이 번져 온기가 가득했던 오후.
  * happyScore: 89
  * recommendedSong: 성시경 - 영원히
- 예시 2:
  * mood: 맛있는 음식과 장난스러운 미소로 가득 채운 우리만의 저녁 식탁!\\n함께하는 것만으로도 하루의 피로가 사르르 녹아내려.
  * happyScore: 86
  * recommendedSong: 볼빨간사춘기 - 처음부터 너와 나
- 예시 3:
  * mood: 반짝이는 불빛 아래 손을 맞잡고 거닐던 로맨틱한 밤.\\n너와 함께 걷는 모든 길이 특별한 영화 속 한 장면 같았던 날.
  * happyScore: 94
  * recommendedSong: 폴킴 - 모든 날, 모든 순간
      `.trim(),
      outputType: ImageMoodResultSchema,
    });
  }
  async invoke(
    memoryImageBuffers: Buffer[],
    memoryComments: MemoryComment[],
  ): Promise<ImageMoodAgentModel> {
    const imageContents = memoryImageBuffers.map((buffer: Buffer) => {
      const base64Image = buffer.toString('base64');

      return {
        type: 'input_image' as const,
        image: `data:image/jpeg;base64,${base64Image}`,
      };
    });

    const userCommentsText =
      memoryComments.length > 0
        ? memoryComments
            .map((c) => (c.comment ? `- ${c.comment.trim()}` : ''))
            .filter(Boolean)
            .join('\n')
        : '없음 (사진의 시각적 요소와 분위기를 중심으로 분석해주세요)';

    const userPrompt = [
      '연인이 공유한 추억 사진(들)과 메모를 바탕으로 분위기를 분석해주세요.',
      '',
      '[사용자 메모]',
      userCommentsText,
      '',
      `[첨부된 사진 수] 총 ${memoryImageBuffers.length}장`,
      '',
      '지침에 따라 사진의 시각적 디테일(표정, 배경, 조명, 계절감)과 메모를 종합하여 감성적인 mood(2줄 이내), happyScore(0~100 정수), recommendedSong(가수 - 곡명)을 반환해주세요.',
    ].join('\n');

    const agentInputItem: AgentInputItem = {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: userPrompt,
        },
        ...imageContents,
      ],
    };

    const result = await run(this.imageMoodAgent, [agentInputItem]);

    if (!result.finalOutput) {
      throw new Error('Image mood agent returned no output');
    }

    const finalOutput = result.finalOutput;

    return new ImageMoodAgentModel(
      finalOutput.mood,
      finalOutput.happyScore,
      finalOutput.recommendedSong,
    );
  }
}
