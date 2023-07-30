import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyTokenABI from "./contracts/MyToken.sol/MyToken.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the deployed contract address
const contractABI = MyTokenABI.abi;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const myTokenContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider.getSigner()
);

function App() {
  const [accountAddress, setAccountAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [balance, setBalance] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  useEffect(() => {
    async function setup() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccountAddress(accounts[0]);

        const ownerName = await myTokenContract.getOwnerName();
        setOwnerName(ownerName);

        const balance = await myTokenContract.balanceOf(accounts[0]);
        setBalance(balance.toString());
      } else {
        console.error("No Ethereum provider found.");
      }
    }

    setup();
  }, []);

  const handleMint = async () => {
    try {
      const tx = await myTokenContract.mint(
        accountAddress,
        ethers.utils.parseUnits(mintAmount, 18)
      );
      await tx.wait();
      const updatedBalance = await myTokenContract.balanceOf(accountAddress);
      setBalance(updatedBalance.toString());
    } catch (error) {
      console.error("Error minting tokens:", error);
    }
  };

  const handleBurn = async () => {
    try {
      const tx = await myTokenContract.burn(
        ethers.utils.parseUnits(burnAmount, 18)
      );
      await tx.wait();
      const updatedBalance = await myTokenContract.balanceOf(accountAddress);
      setBalance(updatedBalance.toString());
    } catch (error) {
      console.error("Error burning tokens:", error);
    }
  };

  return (
    <div>
      <h1>My Token App</h1>
      <p>Account Address: {accountAddress}</p>
      <p>Owner Name: {ownerName}</p>
      <p>Balance: {balance} Tokens</p>
      <div>
        <input
          type="text"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="Enter amount to mint"
        />
        <button onClick={handleMint}>Mint</button>
      </div>
      <div>
        <input
          type="text"
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Enter amount to burn"
        />
        <button onClick={handleBurn}>Burn</button>
      </div>
    </div>
  );
}

export default App;
