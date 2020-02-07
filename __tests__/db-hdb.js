/* eslint-disable capitalized-comments */
"use strict";
// const path = require("path");
const assert = require("yeoman-assert");
// const helpers = require("yeoman-test");

describe("generator-sap-a-team-mta:db-hdb", () => {
  // beforeAll(() => {
  //   return helpers
  //     .run(path.join(__dirname, "../generators/db-hdb"))
  //     .withPrompts({ someAnswer: true });
  // });

  it("creates files", () => {
    assert.file(["dummyfile.txt"]);
  });
});
