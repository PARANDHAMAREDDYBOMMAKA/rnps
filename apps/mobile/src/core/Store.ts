type Listener = () => void;

export abstract class Store<S extends object> {
  private listeners = new Set<Listener>();
  private snapshot: S;

  protected constructor(initial: S) {
    this.snapshot = initial;
  }

  get state(): S {
    return this.snapshot;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): S => this.snapshot;

  protected setState(patch: Partial<S>): void {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((l) => l());
  }
}
