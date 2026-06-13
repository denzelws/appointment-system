const API_BASE_URL = "http://localhost:3000/api/v1";

const TEST_PASSWORD = "12345678";

const USERS = Array.from({ length: 10 }, (_, index) => ({
  name: `Concurrency User ${String(index + 1).padStart(2, "0")}`,
  email: `concurrency-user-${String(index + 1).padStart(2, "0")}@email.com`,
  password: TEST_PASSWORD,
}));

const SAME_SLOT_PAYLOAD = {
  start_time: "2026-10-08T16:30:00Z",
};

type TestUser = (typeof USERS)[number];

type LoginResponse = {
  status: number;
  code: string;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    };
  };
  timestamp: string;
};

type AppointmentResult = {
  user: string;
  status: number | "NETWORK_ERROR";
  ok: boolean;
  durationMs: number;
  body: string;
};

async function registerUser(user: TestUser): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  // Existing users are acceptable because this script is reusable.
  if (response.ok || response.status === 409) {
    return;
  }

  const body = await response.text();

  throw new Error(
    `Registration failed for ${user.email}: ${response.status} ${body}`,
  );
}

async function loginUser(user: TestUser): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Login failed for ${user.email}: ${response.status} ${body}`,
    );
  }

  const data = (await response.json()) as LoginResponse;

  const token = data.data.token;

  if (!token) {
    throw new Error(`JWT not found in login response for ${user.email}`);
  }

  return token;
}

async function createAppointment(
  user: TestUser,
  token: string,
): Promise<AppointmentResult> {
  const startedAt = performance.now();

  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(SAME_SLOT_PAYLOAD),
    });

    const durationMs = Math.round(performance.now() - startedAt);
    const body = await response.text();

    return {
      user: user.email,
      status: response.status,
      ok: response.ok,
      durationMs,
      body,
    };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);

    return {
      user: user.email,
      status: "NETWORK_ERROR",
      ok: false,
      durationMs,
      body: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log("1. Registering users if needed...");
  await Promise.all(USERS.map(registerUser));

  console.log("2. Logging in 10 users...");
  const tokens = await Promise.all(USERS.map(loginUser));

  console.log("3. Sending 10 concurrent appointment requests...");
  console.log(`Target slot: ${SAME_SLOT_PAYLOAD.start_time}\n`);

  const results = await Promise.all(
    USERS.map((user, index) => createAppointment(user, tokens[index])),
  );

  console.table(
    results.map((result) => ({
      user: result.user,
      status: result.status,
      ok: result.ok,
      durationMs: result.durationMs,
    })),
  );

  const successes = results.filter((result) => result.ok);
  const failures = results.filter((result) => !result.ok);
  const durations = results.map((result) => result.durationMs);

  console.log("\nSummary:");

  console.log({
    totalRequests: results.length,
    successCount: successes.length,
    failureCount: failures.length,
    fastestMs: Math.min(...durations),
    slowestMs: Math.max(...durations),
    averageMs: Math.round(
      durations.reduce((total, duration) => total + duration, 0) /
        durations.length,
    ),
  });

  console.log("\nDetailed responses:");

  for (const result of results) {
    console.log(`\n${result.user} — ${result.status}`);
    console.log(result.body);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
