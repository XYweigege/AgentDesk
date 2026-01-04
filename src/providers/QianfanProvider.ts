import { ChatCompletion } from "@baiducloud/qianfan";
import { BaseProvider } from "./BaseProvider";
import {
  ChatMessageProps,
  UniversalChunkProps,
  BaiduChunkProps,
} from "../types";

/**
 * QianfanProvider
 *
 * 该类是 `BaseProvider` 的 Baidu 千帧（Qianfan）实现，负责：
 * - 使用 Qianfan SDK 初始化客户端
 * - 发起 chat 请求并以流（stream）方式产出响应片段
 * - 将 Qianfan 返回的分片（BaiduChunkProps）转换为项目内部统一的分片格式（UniversalChunkProps）
 *
 * 使用场景：在应用需要接入千帧模型时，直接使用该 Provider 即可实现与上层统一的异步流消费。
 */
export class QianfanProvider extends BaseProvider {
  // Qianfan SDK 客户端实例（类型使用 any 以兼容第三方库）
  private client: any;

  /**
   * 构造函数
   * @param accessKey Qianfan access key（建议从主进程或环境变量注入，避免在渲染进程明文保存）
   * @param secretKey Qianfan secret key
   */
  constructor(accessKey: string, secretKey: string) {
    super();
    // 使用 SDK 初始化客户端，内部会基于提供的凭证进行鉴权
    this.client = new ChatCompletion({
      QIANFAN_ACCESS_KEY: accessKey,
      QIANFAN_SECRET_KEY: secretKey,
    });
  }

  /**
   * 发起一次聊天请求并以异步迭代器（stream）返回响应片段
   *
   * 上层可以使用 `for await (const chunk of provider.chat(...))` 的方式消费流式结果。
   * 方法内部将调用 Qianfan SDK 的 `chat`，并将 SDK 的流式输出逐片转换为项目统一格式后产出。
   *
   * @param messages 聊天消息数组，符合 `ChatMessageProps` 结构
   * @param model 可选的模型标识（由上层配置传入）
   */
  async chat(messages: ChatMessageProps[], model: string) {
    const stream = await this.client.chat(
      {
        messages,
        stream: true,
      },
      model
    );

    const self = this;

    // 返回一个对象，实现异步迭代器协议：上层可直接用 for-await-of 遍历
    return {
      async *[Symbol.asyncIterator]() {
        // SDK 返回的 stream 可能是一个异步可迭代对象（async iterable）
        for await (const chunk of stream) {
          // 将第三方 chunk 转为统一格式后产出
          yield self.transformResponse(chunk);
        }
      },
    };
  }

  /**
   * 将 Qianfan 的返回片段转换为项目通用的响应片段结构
   *
   * 目前只保留 `is_end` 与 `result` 字段，以便上层统一处理结束标志与文本片段。
   */
  protected transformResponse(chunk: BaiduChunkProps): UniversalChunkProps {
    return {
      is_end: chunk.is_end,
      result: chunk.result,
    };
  }
}
