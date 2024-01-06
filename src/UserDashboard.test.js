import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for testing

import UserDashboard from "./UserDashboard";

describe("UserDashboard component", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
  });
});
