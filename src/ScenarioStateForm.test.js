import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for testing

import ScenarioStateForm from "./ScenarioState";

describe("ScenarioStateForm component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <ScenarioStateForm />
      </MemoryRouter>
    );
  });
});
