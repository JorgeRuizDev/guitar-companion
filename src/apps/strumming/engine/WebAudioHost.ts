/**
 * WebAudioHost manages the AudioContext lifecycle, handles browser autoplay restrictions
 * and iOS Safari gesture unlocking, and provides hardware clock timing.
 */

export class WebAudioHost {
  private static sharedContext: AudioContext | null = null;
  private context: AudioContext | null = null;

  /**
   * Returns active AudioContext, creating a shared instance if not yet initialized.
   */
  public getContext(): AudioContext {
    if (!WebAudioHost.sharedContext || WebAudioHost.sharedContext.state === "closed") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      WebAudioHost.sharedContext = new AudioCtx();
    }
    this.context = WebAudioHost.sharedContext;
    return this.context;
  }

  /**
   * Resumes AudioContext on user interaction (Play button, keyboard SPACE, tap).
   * Critical for mobile Safari which halts audio context until a user gesture occurs.
   * Plays a silent 1-sample buffer to unlock iOS Safari Web Audio state synchronously.
   */
  public async ensureRunning(): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state !== "running") {
      await ctx.resume();
    }
    try {
      if (typeof ctx.createBuffer === "function") {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    } catch {
      // Ignore if unlock buffer fails or is unsupported
    }
  }

  /**
   * Suspends AudioContext when playback halts to save mobile battery.
   */
  public async suspend(): Promise<void> {
    if (this.context && this.context.state === "running") {
      await this.context.suspend();
    }
  }

  /**
   * Returns the current hardware audio clock timestamp in seconds.
   */
  public getCurrentTime(): number {
    return this.context ? this.context.currentTime : 0;
  }

  /**
   * Disposes the AudioContext.
   */
  public async close(): Promise<void> {
    if (this.context && this.context.state !== "closed") {
      await this.context.close();
      this.context = null;
      WebAudioHost.sharedContext = null;
    }
  }
}
