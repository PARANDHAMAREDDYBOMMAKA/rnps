import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { UserDto } from "@rnp/shared";

export interface Session {
  token: string;
  user: UserDto;
}

interface KeyValueStore {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

class SecureKeyValueStore implements KeyValueStore {
  read(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  write(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  remove(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }
}

class WebKeyValueStore implements KeyValueStore {
  async read(key: string): Promise<string | null> {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  async write(key: string, value: string): Promise<void> {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {}
  }

  async remove(key: string): Promise<void> {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {}
  }
}

export class SessionStorage {
  private readonly store: KeyValueStore;

  constructor(private readonly key = "skillup.session") {
    this.store = Platform.OS === "web" ? new WebKeyValueStore() : new SecureKeyValueStore();
  }

  async read(): Promise<Session | null> {
    const raw = await this.store.read(this.key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<Session>;
      return parsed.token && parsed.user ? (parsed as Session) : null;
    } catch {
      return null;
    }
  }

  write(session: Session): Promise<void> {
    return this.store.write(this.key, JSON.stringify(session));
  }

  clear(): Promise<void> {
    return this.store.remove(this.key);
  }
}
