import * as core from '@actions/core';
import * as exec from '@actions/exec';

describe("index", () => {
  it("should import exec and core correctly", () => {
    expect(typeof core).not.toEqual('undefined');
    expect(typeof core.getInput).toEqual('function');
    expect(typeof exec).not.toEqual('undefined');
    expect(typeof exec.exec).toEqual('function');
  });
});
