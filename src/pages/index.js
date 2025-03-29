import Web3 from 'web3';
import { contractAddress, contractABI } from '../../utils/contractConfig';
import { useState, useEffect } from 'react';

export default function Home() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(null);
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      await connectWallet();
    };
    init();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        setWeb3Instance(web3);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        setContractInstance(contract);
        console.log('Contract instance initialized:', contract);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  }

  async function getAndDisplayResult(operation) {
      if (!contractInstance) {
          alert('Please connect to MetaMask and ensure the correct network is selected.');
          return;
      }

      try {
          let result;
          switch (operation) {
              case 'add':
                  result = await contractInstance.methods.addNumbers().call();
                  break;
              case 'subtract':
                  result = await contractInstance.methods.subtractNumbers().call();
                  break;
              case 'multiply':
                  result = await contractInstance.methods.multiplyNumbers().call();
                  break;
              case 'divide':
                  result = await contractInstance.methods.divideNumbers().call();
                  break;
              default:
                  result = 'Invalid Operation';
          }
          console.log(`Result of ${operation}:`, result);
          setResult(result.toString());
      } catch (error) {
          console.error('Error calling contract function:', error);
          setResult('Error: ' + error.message);
      }
  }

  async function handleUpdateNumbers() {
    if (!contractInstance || !account) {
      alert('Please connect to MetaMask and ensure the correct network is selected.');
      return;
    }

    console.log('handleUpdateNumbers called with:', num1, num2);
    console.log('Account:', account);
    console.log('Contract Instance:', contractInstance);

    try {
      const transaction = await contractInstance.methods
        .updateNumbers(num1, num2)
        .send({ from: account });

      console.log('Transaction object:', transaction);

      // Wait for transaction to be mined (simplified -  listen for "confirmation" event in real app)
      const receipt = await web3Instance.eth.getTransactionReceipt(transaction.transactionHash);
        if (receipt.status) {
            // *After* the transaction is mined, call the view functions
            const newNum1 = await contractInstance.methods.num1().call();
            const newNum2 = await contractInstance.methods.num2().call();
            setNum1(parseInt(newNum1));
            setNum2(parseInt(newNum2));
            setResult(`Numbers updated successfully! num1: ${newNum1}, num2: ${newNum2}`);

        } else {
            setResult('Transaction failed!');
        }


    } catch (error) {
      console.error('Error updating numbers:', error);
      setResult('Error: ' + error.message);
    }
  }

  return (
    <div>
      <h1>Arithmetic Operations</h1>
      <div>
        <label>
          Number 1:
          <input
            type="number"
            value={num1}
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              setNum1(isNaN(parsedValue) ? 0 : parsedValue);
              console.log('Number 1 changed to:', isNaN(parsedValue) ? 0 : parsedValue);
            }}
          />
        </label>
        <br />
        <label>
          Number 2:
          <input
            type="number"
            value={num2}
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value);
              setNum2(isNaN(parsedValue) ? 0 : parsedValue);
              console.log('Number 2 changed to:', isNaN(parsedValue) ? 0 : parsedValue);
            }}
          />
        </label>
      </div>
      <br />
      <button onClick={handleUpdateNumbers}>Update Numbers</button>
      <br />
      <button onClick={() => getAndDisplayResult('add')}>Add</button>
      <button onClick={() => getAndDisplayResult('subtract')}>Subtract</button>
      <button onClick={() => getAndDisplayResult('multiply')}>Multiply</button>
      <button onClick={() => getAndDisplayResult('divide')}>Divide</button>
      <br />
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}

