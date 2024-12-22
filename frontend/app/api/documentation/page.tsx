import React from 'react';

const DocumentationPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">BARK Protocol API Documentation</h1>
      <p className="text-lg text-center mb-12">
        Welcome to the BARK Protocol´s Airdrop & Token Sale API documentation! Below are the available endpoints you can use to interact with our system.
      </p>

      {/* Transactions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">1. Get Transactions</h2>
        <p className="text-lg mb-4">
          This endpoint allows you to retrieve a list of transactions with optional filters.
        </p>
        <h3 className="text-xl font-medium mb-2">Endpoint</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">GET /transactions</pre>

        <h3 className="text-xl font-medium mb-2">Query Parameters</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>page</strong> (integer, default: 1): The page number for pagination.</li>
          <li><strong>limit</strong> (integer, default: 10): The number of transactions per page.</li>
          <li><strong>filter</strong> (string): Optional filter for transaction status. Values: 'all', 'pending', 'completed', 'failed'.</li>
          <li><strong>search</strong> (string): Search term to find transactions by recipient address or transaction signature.</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Example Request</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">
{`GET /transactions?page=1&limit=10&filter=completed&search=0x12345`}
        </pre>

        <h3 className="text-xl font-medium mb-2">Response</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">
{`{
  "transactions": [
    {
      "id": "txn123",
      "amount": "1000",
      "recipientAddress": "0x12345",
      "status": "completed",
      "transactionSignature": "signature123",
      "createdAt": "2024-12-22T10:00:00Z"
    }
  ],
  "total": 100
}`}
        </pre>
      </section>

      {/* Airdrop Balance Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">2. Get Airdrop Wallet Balance</h2>
        <p className="text-lg mb-4">
          This endpoint allows you to retrieve the balance for a specific airdrop wallet address.
        </p>
        <h3 className="text-xl font-medium mb-2">Endpoint</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">GET /airdrop/balance</pre>

        <h3 className="text-xl font-medium mb-2">Query Parameters</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>walletAddress</strong> (string, required): The wallet address for which you want to check the balance.</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Example Request</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">
{`GET /airdrop/balance?walletAddress=0x12345`}
        </pre>

        <h3 className="text-xl font-medium mb-2">Response</h3>
        <pre className="bg-gray-100 p-4 rounded-md mb-4">
{`{
  "balance": "1000"
}`}
        </pre>
      </section>

      {/* Other sections as needed */}
      <footer className="text-center mt-12 text-lg">
        <p>
          If you have any questions or need further assistance, feel free to contact support.
        </p>
      </footer>
    </div>
  );
};

export default DocumentationPage;
