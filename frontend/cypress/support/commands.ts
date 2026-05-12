type TestUser = {
  name: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: unknown;
};

type AvailableSlotsResponse = {
  date: string;
  available: string[];
  unavailable: string[];
};

function apiUrl() {
  return Cypress.env("apiUrl") as string;
}

Cypress.Commands.add("registerUser", ({ name, email, password }: TestUser) => {
  cy.request({
    method: "POST",
    url: `${apiUrl()}/auth/register`,
    body: { name, email, password },
  });
});

Cypress.Commands.add("loginByApi", (email: string, password: string) => {
  return cy.request<{ data: AuthResponse }>({
    method: "POST",
    url: `${apiUrl()}/auth/login`,
    body: { email, password },
  }).then(({ body }) => {
    window.localStorage.setItem("token", body.data.token);
    window.localStorage.setItem("user", JSON.stringify(body.data.user));
    return body.data;
  });
});

Cypress.Commands.add("getAvailableSlots", (date: string, token: string) => {
  return cy
    .request<{ data: AvailableSlotsResponse }>({
      method: "GET",
      url: `${apiUrl()}/appointments/available`,
      qs: { date },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ body }) => body.data);
});

declare global {
  namespace Cypress {
    interface Chainable {
      registerUser(user: TestUser): Chainable<void>;
      loginByApi(email: string, password: string): Chainable<AuthResponse>;
      getAvailableSlots(
        date: string,
        token: string,
      ): Chainable<AvailableSlotsResponse>;
    }
  }
}

export {};
