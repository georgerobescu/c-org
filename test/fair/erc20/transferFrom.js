const { deployDat } = require("../../datHelpers");
const { approveAll } = require("../../helpers");

contract("fair / erc20 / transferFrom", (accounts) => {
  let contracts;
  const initReserve = 1000;

  before(async () => {
    contracts = await deployDat(accounts, {
      initReserve,
      initGoal: 0,
    });

    await approveAll(contracts, accounts);
  });

  it("has expected balance before transfer", async () => {
    assert.equal(
      (await contracts.dat.balanceOf(accounts[0])).toString(),
      initReserve
    );
    assert.equal(await contracts.dat.balanceOf(accounts[1]), 0);
  });

  describe("can transfer funds from initReserve", () => {
    const transferAmount = 42;

    before(async () => {
      await contracts.dat.approve(accounts[2], -1);
      await contracts.dat.transferFrom(
        accounts[0],
        accounts[1],
        transferAmount,
        {
          from: accounts[2],
        }
      );
    });

    it("has expected after after transfer", async () => {
      assert.equal(
        (await contracts.dat.balanceOf(accounts[0])).toString(),
        initReserve - transferAmount
      );
      assert.equal(
        (await contracts.dat.balanceOf(accounts[1])).toString(),
        transferAmount
      );
    });
  });
});
