type SlotChoice = {
  date: Date;
  dateString: string;
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
      return {
        date,
        dateString: formatCalendarDate(date),
        slot,
      };
    }

    return findAvailableSlot(token, offset + 1);
  });
}

function nextInactiveSunday() {
  const today = new Date();
  const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
  return addDays(today, daysUntilSunday);
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

function loginAndOpenDashboard(email: string, password: string) {
  cy.visit("/login");
  cy.loginByApi(email, password);
  cy.visit("/dashboard");
  cy.contains("Operational Timeline").should("be.visible");
}

describe("appointment scheduling", () => {
  it("creates an appointment, filters it locally, and removes the booked slot for another user", () => {
    const firstUser = testUser("owner");
    const secondUser = testUser("viewer");
    const note = `E2E appointment ${Date.now()}`;

    cy.registerUser(firstUser);
    cy.registerUser(secondUser);

    cy.loginByApi(firstUser.email, firstUser.password).then(({ token }) => {
      findAvailableSlot(token).then(({ date, slot }) => {
        const searchableSlot = slot.replace(/^0/, "");

        loginAndOpenDashboard(firstUser.email, firstUser.password);
        selectCalendarDate(date);

        cy.contains('[data-testid="slot-button"]', slot).click();
        cy.get('[data-testid="appointment-notes"]').type(note);
        cy.get('[data-testid="confirm-appointment"]').click();

        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");

        cy.get('[data-testid="dashboard-search"]').type(note);
        cy.get('[data-testid="timeline-row"]').should("have.length", 1);
        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");

        cy.get('[data-testid="dashboard-search"]').clear().type("PENDING");
        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");

        cy.get('[data-testid="dashboard-search"]').clear().type(searchableSlot);
        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");

        cy.get('[data-testid="dashboard-search"]')
          .clear()
          .type(date.toLocaleDateString("en-US", { month: "long" }));
        cy.contains('[data-testid="timeline-note"]', note).should("be.visible");

        loginAndOpenDashboard(secondUser.email, secondUser.password);
        selectCalendarDate(date);

        cy.get('[data-testid="slot-button"]', { timeout: 10000 }).should(
          "exist",
        );
        cy.contains('[data-testid="slot-button"]', slot).should("not.exist");
      });
    });
  });

  it("shows an empty-slots fallback for inactive dates without crashing", () => {
    const user = testUser("closed-day");

    cy.registerUser(user);
    loginAndOpenDashboard(user.email, user.password);
    selectCalendarDate(nextInactiveSunday());

    cy.get('[data-testid="no-available-slots"]').should("be.visible");
    cy.contains("Operational Timeline").should("be.visible");
  });
});
