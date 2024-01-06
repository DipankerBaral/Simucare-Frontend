import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for testing

import MonitorManagement from "./Monitor";

describe("Monitor component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <MonitorManagement />
      </MemoryRouter>
    );
  });
});
