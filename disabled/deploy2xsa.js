"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-sap-a-team-mta:deploy2xsa", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/deploy2xsa"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
