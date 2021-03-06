import Queue from 'bull';
import axios from 'axios';

export default class NotificationService {
  constructor(config, database) {
    this.config = config;
    this.database = database;

    this._queue = new Queue('notifications', {
      redis: config.redis
    });

    this._processJobs();
  }

  notify(userId, type, context) {
    const query = {
      where: { userId }
    };

    return this.database.deviceToken.findAll(query).then((deviceTokens) => {
      deviceTokens.forEach((deviceToken) => {
        if (!deviceToken.ios) {
          return;
        }

        this._queue.add({ deviceToken, type, context }, this.config.notifications.queue);
      });
    });
  }

  _processJobs() {
    this._queue.process((job) => {
      const { deviceToken, type, context } = job.data;
      return this._sendWithWebhook(deviceToken.ios, type, context).then(this._handleUnsubscribe.bind(this));
    });
  }

  _sendWithWebhook(deviceToken, type, context) {
    const { webhook } = this.config.notifications;

    return axios.post(webhook, { deviceToken, type, context })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error('[NOTIFICATIONS] 🔥 Error calling webhook:', error.message);
        throw error;
      });
  }

  _handleUnsubscribe(results) {
    if (!results || !Array.isArray(results.failed)) {
      return;
    }

    results.failed.forEach((result) => {
      if (!result || !result.device || !result.status) {
        return;
      }

      const status = parseInt(result.status);
      const reason = result.response && result.response.reason;

      if (status >= 400 && status < 500) {
        console.log(`[NOTIFICATIONS] Unsubscribing (${reason}):`, result.device);

        return this.database.deviceToken.destroy({ where: { ios: result.device } }).catch((error) => {
          console.error('[NOTIFICATIONS] 🔥 Error unsubscribing:', error.message);
        });
      }
    });
  }
}
