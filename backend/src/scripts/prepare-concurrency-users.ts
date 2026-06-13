const API_BASE_URL = "http://localhost:3000/api/v1";

const USERS = Array.from({ length: 10 }, (_, index) => ({
  name: `Concurrency User ${String(index + 1).padStart(2, "0")}`,
  email: `concurrency-user-${String(index + 1).padStart(2, "0")}@email.com`,
  password: "12345678",
}));

type TokenResult = {
  email: string;
  token: string;
};

async function registerUser(user: (typeof USERS)[number]) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (response.ok || response.status === 409) {
    return;
  }

  const body = await response.text();

  throw new Error(
    `Registration failed for ${user.email}: ${response.status} ${body}`,
  );
}

async function loginUser(user: (typeof USERS)[number]): Promise<TokenResult> {
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

  const data = (await response.json()) as {
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

  const token = data.data.token;

  if (!token) {
    throw new Error(`JWT not found in login response for ${user.email}`);
  }

  return {
    email: user.email,
    token,
  };
}

async function main() {
  console.log("1. Registering users...");
  await Promise.all(USERS.map(registerUser));

  console.log("2. Logging in users...");
  const tokens = await Promise.all(USERS.map(loginUser));

  console.log("\nUsers prepared successfully:");

  console.table(
    tokens.map((item) => ({
      email: item.email,
      tokenCreated: Boolean(item.token),
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
