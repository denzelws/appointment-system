type SlotChoice = {
  date: Date;
  slot: string;
};

function testUser(label: string) {
  const id = `${label}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    name: `E2E ${label}`,
    email: `${id}@schedulr.test`,
    password: "Password123!",
  };
}

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function findAvailableSlot(
  token: string,
  offset = 1,
): Cypress.Chainable<SlotChoice> {
  const date = addDays(new Date(), offset);

  if (offset > 45) {
    throw new Error("No available slot found in the next 45 days.");
  }

  return cy.getAvailableSlots(formatCalendarDate(date), token).then((slots) => {
    const slot = slots.available[0];

    if (slot) {
      return { date, slot };
    }

    return findAvailableSlot(token, offset + 1);
  });
}

function moveCalendarTo(date: Date, attempts = 0) {
  const monthLabel = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  cy.get("body").then(($body) => {
    if ($body.text().includes(monthLabel)) return;

    if (attempts >= 6) {
      throw new Error(`Could not navigate calendar to ${monthLabel}.`);
    }

    cy.get('button[aria-label*="next" i]').first().click();
    moveCalendarTo(date, attempts + 1);
  });
}

function selectCalendarDate(date: Date) {
  moveCalendarTo(date);

  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = String(date.getDate());
  const year = String(date.getFullYear());

  cy.get("button")
    .filter((_index, button) => {
      const label = button.getAttribute("aria-label") ?? "";
      return label.includes(`${month} ${day}`) && label.includes(year);
    })
    .first()
    .click();
}

function loginThroughUi(email: string, password: string) {
  cy.visit("/login");
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();
  cy.location("pathname").should("eq", "/dashboard");
  cy.contains("Operational Timeline").should("be.visible");
  cy.wait(700);
}

describe("product journey", () => {
  it("walks through the main scheduling experience", () => {
    const firstUser = testUser("journey-owner");
    const secondUser = testUser("journey-viewer");
    const note = `Journey appointment ${Date.now()}`;

    cy.registerUser(firstUser);
    cy.registerUser(secondUser);

    cy.loginByApi(firstUser.email, firstUser.password).then(({ token }) => {
      findAvailableSlot(token).then(({ date, slot }) => {
        loginThroughUi(firstUser.email, firstUser.password);

        cy.get('[data-testid="notification-bell"]').click();
        cy.get('[data-testid="notification-popover"]')
          .should("be.visible")
          .and("contain", "Welcome back!")
          .and(
            "contain",
            "Your dashboard is ready. Create or manage appointments from here.",
          );
        cy.wait(700);

        selectCalendarDate(date);
        cy.get('[data-testid="slot-button"]').should("exist");
        cy.wait(700);

        cy.contains('[data-testid="slot-button"]', slot).click();
        cy.wait(600);

        cy.get('[data-testid="appointment-notes"]').type(note);
        cy.get('[data-testid="confirm-appointment"]').click();

        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");
        cy.wait(800);

        cy.get('[data-testid="dashboard-search"]').type(note);
        cy.get('[data-testid="timeline-row"]').should("have.length", 1);
        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");
        cy.wait(800);

        cy.contains("Sign out").click();
        cy.location("pathname").should("eq", "/login");

        loginThroughUi(secondUser.email, secondUser.password);
        selectCalendarDate(date);
        cy.wait(700);

        cy.get('[data-testid="slot-button"]', { timeout: 10000 }).should(
          "exist",
        );
        cy.contains('[data-testid="slot-button"]', slot).should("not.exist");
        cy.wait(800);
      });
    });
  });
});
