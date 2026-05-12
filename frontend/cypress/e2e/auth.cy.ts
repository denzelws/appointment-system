function testUser(label: string) {
  const id = `${label}-${Date.now()}`;

  return {
    name: `E2E ${label}`,
    email: `${id}@schedulr.test`,
    password: "Password123!",
  };
}

describe("authentication", () => {
  it("logs in and reaches the dashboard", () => {
    const user = testUser("login");

    cy.registerUser(user);
    cy.visit("/login");

    cy.get('[data-testid="login-email"]').type(user.email);
    cy.get('[data-testid="login-password"]').type(user.password);
    cy.get('[data-testid="login-submit"]').click();

    cy.location("pathname").should("eq", "/dashboard");
    cy.contains("Operational Timeline").should("be.visible");
  });
});
