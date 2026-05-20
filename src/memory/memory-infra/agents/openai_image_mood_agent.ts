import { Agent, AgentInputItem, run } from '@openai/agents';
import { ImageMoodAgent } from '../../memory-core/output/agents/image_mood_agent';
import { ImageMoodResultSchema } from '../schemas/image_mood_agent_schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAIImageMoodAgent implements ImageMoodAgent {
  private readonly imageMoodAgent: Agent<unknown, typeof ImageMoodResultSchema>;

  constructor() {
    this.imageMoodAgent = new Agent({
      name: 'image mood agent',
      model: 'gpt-4.1-mini-2025-04-14',
      instructions: `
        사진 속 연인의 분위기와 감정을 분석하세요.

        반드시 한국어로 작성하세요.
        결과는 최대 2줄 이내로 요약하세요.
      `,
      outputType: ImageMoodResultSchema,
    });
  }
  async invoke(imageFile: Buffer) {
    const base64Image = imageFile.toString('base64');

    const agentInputItem: AgentInputItem = {
      role: 'user',
      content: [
        {
          type: 'input_image',
          image: `data:image/jpeg;base64,${base64Image}`,
        },
      ],
    };

    const result = await run(this.imageMoodAgent, [agentInputItem]);

    if (!result.finalOutput) {
      throw new Error('Image mood agent returned no output');
    }

    return result.finalOutput.mood;
  }
}
