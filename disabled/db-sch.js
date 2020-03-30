"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-sap-a-team-mta:db-sch", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/db-sch"))
      .withPrompts({ someAnswer: true });
  });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
