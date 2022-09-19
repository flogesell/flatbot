import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class QueueAgentService {
  loggerContext = 'QueueAgentService';
  isAgentRunning = false;

  constructor(
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    // init upon api start, don't wait for first run
    setTimeout(async () => {
      this.runAgent();
    }, 500);
  }

  /**
   * Kicks of this Agent and runs as long as the API is active/running.
   */
  @Cron(
    process.env.ENV === 'DEV'
      ? CronExpression.EVERY_10_SECONDS
      : CronExpression.EVERY_MINUTE,
    {
      name: 'queue_agent_cron_job',
    },
  )
  async runAgent(): Promise<void> {
    if (!this.isAgentRunning) {
      this.isAgentRunning = true;
      this.logger.log('queue agent, starting cronjob...', this.loggerContext);
      if (
        !(process.env.ENV == undefined) &&
        process.env.ENV.toLowerCase().indexOf('test') === -1
      ) {
        // TESTING
        this.logger.debug('NON TEST MODE, queue agent cycle content...');
      }
      this.logger.log('queue completed...', this.loggerContext);
      this.isAgentRunning = false;
    }
  }

  stopAgent(): void {
    const job = this.schedulerRegistry.getCronJob('queue_agent_cron_job');
    job.stop();
    this.logger.log('Stopped queue agent cron job.', this.loggerContext);
  }

  startAgent(): void {
    const job = this.schedulerRegistry.getCronJob('queue_agent_cron_job');
    job.start();
    this.logger.log(
      'media queue cron job has been started.',
      this.loggerContext,
    );
  }

  restartAgent(): void {
    this.stopAgent();
    this.startAgent();
  }
}
