import { Agent, AgentInputItem, run } from '@openai/agents';
import { ImageMoodAgent } from '../../memory-core/output/agents/image-mood.agent';
import { ImageMoodResultSchema } from '../schemas/image_mood_agent_schema';
import { Injectable } from '@nestjs/common';
import { MemoryComment } from '../../memory-core/memory-comment';
import { ImageMoodAgentModel } from '../../memory-core/models/image-mood-agent.model';

@Injectable()
export class OpenAIImageMoodAgent implements ImageMoodAgent {
  private readonly imageMoodAgent: Agent<unknown, typeof ImageMoodResultSchema>;

  constructor() {
    this.imageMoodAgent = new Agent({
      name: 'image mood agent',
      model: 'gpt-4.1-mini-2025-04-14',
      instructions: `
        사진 속 연인의 일상과 추억을 분위기있게 요약해주세요.

        반드시 한국어로 작성해주고, 일상에서 사용하는 말투로 작성해주세요.
        EXAMPLE:
        오늘은 눈 오는 날 같이 카페에 가서 많은 이야기를 나눈 날!
        레스토랑에서 같이 파스타를 먹었다!
      `,
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

    const agentInputItem: AgentInputItem = {
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: `사용자가 입력한 요약: ${memoryComments.map((c) => c.comment).join(', ')}`,
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
