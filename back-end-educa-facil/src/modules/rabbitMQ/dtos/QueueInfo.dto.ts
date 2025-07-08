export interface QueueInfo {
  name: string;
  messageCount: number;
  consumerCount: number;
  durable: boolean;
}
