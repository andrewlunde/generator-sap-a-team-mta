/* eslint-disable capitalized-comments */
"use strict";
// const path = require("path");
const assert = require("yeoman-assert");
// const helpers = require("yeoman-test");

describe("generator-sap-a-team-mta:db-cap", () => {
  // beforeAll(() => {
  //   return helpers
  //     .run(path.join(__dirname, "../generators/db-cap"))
  //     .withPrompts({ someAnswer: true });
  // });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
