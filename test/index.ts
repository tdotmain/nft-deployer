import { expect } from "chai";
import { ethers } from "hardhat";

const contractParams = {
  name: "DesertOfTheSurreal",
  symbol: "DOTS",
};

async function deployContract(contractName: string) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(
    contractParams.name,
    contractParams.symbol
  );

  const response = await contract.deployed();

  if (response) {
    return contract;
  } else {
    throw Error("There was an error deploying the contract!");
  }
}

describe("DOTS Contract Tests", function () {
  it("Should be deployable", async function () {
    const [owner] = await ethers.getSigners();
    console.log("Owner:", owner.address);
    const dots = await deployContract("DOTS");
    expect(dots).to.not.equal("undefined");
  });

  it("Should have usable functions/methods", async function () {
    const dots = await deployContract("DOTS");
    expect(typeof Object.keys(dots.callStatic)).to.equal("object");
    console.log("Functions & Methods: ", Object.keys(dots.callStatic));
  });

  it("Should return the right name & symbol", async function () {
    const dots = await deployContract("DOTS");
    expect(await dots.name()).to.equal(contractParams.name);
    expect(await dots.symbol()).to.equal(contractParams.symbol);
  });

  it("Initial totalSupply should be zero", async function () {
    const dots = await deployContract("DOTS");
    expect(await dots.totalSupply()).to.equal(0);
  });

  it("Initially should be minted by infnfty, with totalSupply = 1", async function () {
    const [owner] = await ethers.getSigners();
    const dots = await deployContract("DOTS");

    await dots.safeMint(owner.address);

    expect(await dots.balanceOf(owner.address)).to.equal(1);
    expect(await dots.totalSupply()).to.equal(1);
  });

  it("Should be transferable between accounts", async function () {
    const [owner, user1] = await ethers.getSigners();
    const dots = await deployContract("DOTS");

    const userA = owner.address;
    const userB = user1.address;

    await dots.safeMint(userA);

    expect(await dots.totalSupply()).to.equal(1);
    expect(await dots.balanceOf(userA)).to.equal(1);
    expect(await dots.balanceOf(userB)).to.equal(0);

    await dots.transferFrom(userA, userB, 0);
    expect(await dots.balanceOf(userA)).to.equal(0);
    expect(await dots.balanceOf(userB)).to.equal(1);
  });
});
