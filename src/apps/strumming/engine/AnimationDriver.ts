import { IPlaybackEngine } from "./LookaheadScheduler";

/**
 * AnimationDriver drives the visual playhead sweeping across the strumming timeline at 60/120 FPS.
 * Directly translates the playhead via GPU transforms (translate3d), completely bypassing
 * React Virtual DOM reconciliations to prevent main-thread jank and garbage collection pauses.
 */
export class AnimationDriver {
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private containerElement: HTMLElement | null = null;
  private playheadElement: HTMLElement | null = null;
  private cachedContainerWidth: number = 0;

  constructor(private engine: IPlaybackEngine) {}

  /**
   * Attaches the DOM elements for direct GPU mutation.
   */
  public attach(container: HTMLElement | null, playhead: HTMLElement | null): void {
    this.containerElement = container;
    this.playheadElement = playhead;
    this.updateDimensions();
  }

  /**
   * Recalculates container width on window resize or layout changes.
   */
  public updateDimensions(): void {
    if (this.containerElement) {
      this.cachedContainerWidth = this.containerElement.getBoundingClientRect().width;
    }
  }

  /**
   * Starts the rAF animation loop.
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  /**
   * Stops the rAF animation loop.
   */
  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Immediately resets playhead position to 0px.
   */
  public reset(): void {
    this.stop();
    if (this.playheadElement) {
      this.playheadElement.style.transform = "translate3d(0px, 0, 0)";
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    if (this.playheadElement && this.cachedContainerWidth > 0) {
      const progress = this.engine.getCurrentProgress();
      const px = progress * this.cachedContainerWidth;
      // Direct GPU transform update - avoids any React re-render
      this.playheadElement.style.transform = `translate3d(${px}px, 0, 0)`;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
