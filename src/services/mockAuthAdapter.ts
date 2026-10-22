import { createId } from "@/lib/utils";
import { createDefaultUser, type AuthAdapter } from "@/services/authService";
import type { AuthResult, LoginInput, RegisterInput, ReportRecord, User } from "@/types";

const ACCOUNTS_KEY = "matcharcade:accounts:v1";
const SESSION_KEY = "matcharcade:session:v1";
const REPORTS_KEY = "matcharcade:reports:v1";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

interface StoredAccount {
  id: string;
  email: string;
  passwordHash: string;
  user: User;
}

interface StoredSession {
  userId: string;
  token: string;
  issuedAt: string;
  expiresAt: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function latency(): Promise<void> {
  return delay(280 + Math.random() * 220);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable: the in-memory session still works for this tab */
  }
}

/**
 * Local password obfuscation for the offline demo. Real providers hand this
 * responsibility to the auth backend, so nothing here is reused after swapping.
 */
function hashPassword(password: string, salt: string): string {
  const input = `${salt}::${password}`;
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function readAccounts(): StoredAccount[] {
  return readJson<StoredAccount[]>(ACCOUNTS_KEY, []);
}

function writeAccounts(accounts: StoredAccount[]): void {
  writeJson(ACCOUNTS_KEY, accounts);
}

function writeSession(userId: string): void {
  const issuedAt = new Date();
  const session: StoredSession = {
    userId,
    token: createId("tok"),
    issuedAt: issuedAt.toISOString(),
    expiresAt: new Date(issuedAt.getTime() + SESSION_TTL_MS).toISOString(),
  };
  writeJson(SESSION_KEY, session);
}

function readSession(): StoredSession | null {
  const session = readJson<StoredSession | null>(SESSION_KEY, null);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    writeJson(SESSION_KEY, null);
    return null;
  }
  return session;
}

export const mockAuthAdapter: AuthAdapter = {
  async register(input: RegisterInput): Promise<AuthResult> {
    await latency();
    const email = input.email.trim().toLowerCase();
    const accounts = readAccounts();

    if (accounts.some((account) => account.email === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const user = createDefaultUser({ ...input, email });
    writeAccounts([
      ...accounts,
      { id: user.id, email, passwordHash: hashPassword(input.password, user.id), user },
    ]);
    writeSession(user.id);
    return { ok: true, user };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    await latency();
    const email = input.email.trim().toLowerCase();
    const account = readAccounts().find((entry) => entry.email === email);

    if (!account) {
      return { ok: false, error: "No account found with that email." };
    }
    if (account.passwordHash !== hashPassword(input.password, account.id)) {
      return { ok: false, error: "Incorrect password. Please try again." };
    }

    writeSession(account.id);
    return { ok: true, user: account.user };
  },

  async logout(): Promise<void> {
    await delay(140);
    writeJson(SESSION_KEY, null);
  },

  async currentUser(): Promise<User | null> {
    const session = readSession();
    if (!session) return null;
    const account = readAccounts().find((entry) => entry.id === session.userId);
    return account?.user ?? null;
  },

  async saveUser(user: User): Promise<User> {
    const accounts = readAccounts();
    writeAccounts(
      accounts.map((account) => (account.id === user.id ? { ...account, user } : account))
    );
    return user;
  },

  async listReports(userId: string): Promise<ReportRecord[]> {
    const reports = readJson<ReportRecord[]>(REPORTS_KEY, []);
    return reports
      .filter((report) => report.reporterId === userId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async saveReport(report: ReportRecord): Promise<ReportRecord> {
    const reports = readJson<ReportRecord[]>(REPORTS_KEY, []);
    const exists = reports.some((entry) => entry.id === report.id);
    writeJson(
      REPORTS_KEY,
      exists ? reports.map((entry) => (entry.id === report.id ? report : entry)) : [...reports, report]
    );
    return report;
  },
};
