const { constants } = require("../../../helpers");
const { expectRevert } = require("@openzeppelin/test-helpers");

/**
 * Requires `this.contract`
 */
module.exports = function (investor) {
  describe("Behavior / Wiki / Close / burn", function () {
    it("Sanity check: state is close", async function () {
      const state = await this.contract.state();
      assert.equal(state.toString(), constants.STATE.CLOSE);
    });

    it("Burn fails", async function () {
      await expectRevert(
        this.contract.burn("42", {
          from: investor,
        }),
        "INVALID_STATE"
      );
    });
  });
};
