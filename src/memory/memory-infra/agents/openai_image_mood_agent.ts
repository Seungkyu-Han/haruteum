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
import { isCoupleMemoryMode } from '../../memory-core/models/memory-mode.enum';

const COUPLE_INSTRUCTIONS = `
# 역할 및 정체성
당신은 연인들의 소중한 순간과 추억을 감성적으로 기록해주는 커플 다이어리 서비스 '하루틈'의 AI 에디터입니다.
제공된 사진들과 사용자의 메모를 세심하게 관찰하여, 연인이 함께한 그 순간의 분위기, 감정, 온도를 포착하고 감동과 설렘을 주는 다이어리 기록을 완성합니다.

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
- 사진의 무드(계절, 시간대, 감정선, 데이트 장소)에 어울리는 한국 노래(로맨틱 발라드, 어쿠스틱 듀엣, K-인디, 감성 R&B 등) 1곡을 추천합니다.
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
`.trim();

const PERSONAL_INSTRUCTIONS = `
# 역할 및 정체성
당신은 사용자의 소중한 일상과 순간을 감성적으로 기록해주는 일상 다이어리 서비스 '하루틈'의 AI 에디터입니다.
제공된 사진들과 사용자의 메모를 세심하게 관찰하여, 혼자만의 여유로운 휴식, 친구·가족과의 즐거운 만남, 성장의 순간 등 그날의 분위기, 감정, 온도를 포착하고 마음에 남는 다이어리 기록을 완성합니다.
주의: 본 기록은 개인/일반 일상 기록이므로 사진과 메모에 명확한 연인 맥락이 없는 한 '연인', '너와 함께', '사랑', '데이트' 등의 표현을 무조건적으로 사용하지 않고, 사진과 메모의 실제 맥락(나만의 시간, 일상, 취미, 풍경 등)에 맞추어 작성합니다.

# 필드별 작성 지침

1. mood (추억 요약 문구)
- 분량: 반드시 한국어로 작성하며, 최대 2줄(줄바꿈 포함 1~2문장) 이내로 작성합니다.
- 문체 및 톤:
  * 딱딱한 관찰자적 설명(예: "이 사진은 사람이...", "사진에 따르면...")은 절대 금지합니다.
  * 훗날 일기장을 다시 펼쳐보았을 때 흐뭇한 미소가 번지는 따뜻하고 감성적인 어투를 사용합니다.
  * 자연스러운 다이어리 캡션 어미(예: ~했던 날, ~해서 더 뿌듯했던 하루, 오롯이 나에게 집중했던 시간, ~했던 순간 등)를 사용합니다.
- 내용:
  * 단순 사실 나열을 지양합니다.
  * 사진 속 표정, 풍경, 조명, 계절감, 장소의 분위기, 그 순간 느꼈던 여유·성취·소소한 행복을 감각적으로 표현합니다.
  * 사용자가 남긴 메모가 있다면 그 의미를 조화롭게 녹여냅니다.

2. happyScore (행복 지수: 0 ~ 100)
- 사진 속 표정(미소, 만족감), 분위기(편안함, 활기, 평온), 메모의 긍정적인 감정을 종합하여 0~100 사이의 정수로 평가합니다.
- 기준:
  * 90~100: 특별한 여행이나 성취, 신나고 활기찬 축하의 순간, 깊은 만족감이 가득한 날
  * 75~89: 여유롭고 기분 좋은 일상, 소소한 힐링과 만족스러운 시간
  * 60~74: 차분하고 잔잔한 휴식, 평온한 하루의 순간
  * 0~59: 다소 지치거나 쓸쓸함, 고요한 생각에 잠긴 분위기 위주일 때

3. recommendedSong (추천 한국 노래 1곡)
- 사진의 무드(계절, 시간대, 감정선, 일상 장소)에 어울리는 한국 노래(이지리스닝, 힐링 어쿠스틱, K-인디, 시티팝, 포크 등) 1곡을 추천합니다.
- 형식: 반드시 불필요한 수식어 없이 '가수 - 곡명' 형식으로만 출력합니다. (예: 옥상달빛 - 수고했어, 오늘도)

# 좋은 출력 예시
- 예시 1 (혼자만의 힐링/카페):
  * mood: 은은한 커피 향과 함께 온전히 나만의 시간에 몰입했던 오후.\\n복잡했던 마음이 한결 가벼워지고 편안해진 순간.
  * happyScore: 82
  * recommendedSong: 권진아 - 오늘 뭐 했는지 말해봐
- 예시 2 (풍경/산책/여행):
  * mood: 붉게 물든 노을을 바라보며 천천히 발걸음을 옮기던 길.\\n스치는 바람마저 기분 좋은 위로가 되어준 하루.
  * happyScore: 88
  * recommendedSong: 잔나비 - 가을밤에 든 생각
- 예시 3 (일상/취미/성취):
  * mood: 작은 정성들이 모여 마침내 완성된 오늘의 뿌듯한 결과물!\\n스스로에게 아낌없는 칭찬을 건네고 싶었던 시간.
  * happyScore: 91
  * recommendedSong: 페퍼톤스 - 행운을 빌어요
`.trim();

@Injectable()
export class OpenAIImageMoodAgent implements ImageMoodAgent {
  private readonly logger = new Logger(OpenAIImageMoodAgent.name);
  private readonly coupleImageMoodAgent: Agent<
    unknown,
    typeof ImageMoodResultSchema
  >;
  private readonly personalImageMoodAgent: Agent<
    unknown,
    typeof ImageMoodResultSchema
  >;

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

    this.coupleImageMoodAgent = new Agent({
      name: 'couple image mood agent',
      model,
      instructions: COUPLE_INSTRUCTIONS,
      outputType: ImageMoodResultSchema,
    });

    this.personalImageMoodAgent = new Agent({
      name: 'personal image mood agent',
      model,
      instructions: PERSONAL_INSTRUCTIONS,
      outputType: ImageMoodResultSchema,
    });
  }

  async invoke(
    memoryImageBuffers: Buffer[],
    memoryComments: MemoryComment[],
    mode?: string,
  ): Promise<ImageMoodAgentModel> {
    const isCouple = isCoupleMemoryMode(mode);
    const targetAgent = isCouple
      ? this.coupleImageMoodAgent
      : this.personalImageMoodAgent;

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

    const userPromptIntro = isCouple
      ? '연인이 공유한 추억 사진(들)과 메모를 바탕으로 둘만의 분위기를 분석해주세요.'
      : '소중한 일상 추억 사진(들)과 메모를 바탕으로 그날의 분위기와 감정을 분석해주세요.';

    const userPrompt = [
      userPromptIntro,
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

    const result = await run(targetAgent, [agentInputItem]);

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
