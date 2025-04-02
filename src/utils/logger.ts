const LOG_LEVELS = ['debug','info','warn','error'] as const;
type LogLevel = typeof LOG_LEVELS[number];
export class Logger {
  constructor(private ctx: string) {}
  info(m: string) { console.log('['+this.ctx+'] '+m); }
  warn(m: string) { console.warn('['+this.ctx+'] '+m); }
  error(m: string) { console.error('['+this.ctx+'] '+m); }
}











