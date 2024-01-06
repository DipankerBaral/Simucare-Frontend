import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for testing

import ScenarioPage from "./Scenario";

describe("Scenario component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <ScenarioPage />
      </MemoryRouter>
    );
  });
});
