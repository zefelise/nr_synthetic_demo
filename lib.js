'use strict';
const _ = require('lodash');

class Logger {
  /**
   * Initialize required parameter
   */
  constructor() {
    this.lastEventTime = Date.now();
    this.startTime = Date.now();
  }

  logWithTime(msg) {
    console.log(`${msg} - at ${new Date().toISOString()}`);
  };

  logWithEvents(event, useDeltaTime = true) {
    this.logWithTime(event);
    event = `${_.camelCase(event)}${useDeltaTime ? 'Delta' : ''}Duration`;
    const baseTime = useDeltaTime ? this.lastEventTime : this.startTime;
    console.log(`${event},\t${useDeltaTime ? 'Delta ' : ''}Duration:${Date.now() - baseTime}\n⇊`);
    $util.insights.set(event, Date.now() - baseTime);
    this.lastEventTime = Date.now();
  };

  resetStartTime(startTime = undefined) {
    this.startTime = startTime || Date.now();
  }
}

class Utils {
  static syntheticAgentHeader = {
    'user-agent':
      'Automation-synthetic-browser Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
  };
}

module.exports = {
  Logger,
  Utils
}

