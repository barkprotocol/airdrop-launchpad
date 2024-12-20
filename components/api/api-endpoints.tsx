import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APIEndpoint } from '@/app/api/endpoints'

export function APIEndpointComponent({ endpoint }: { endpoint: APIEndpoint }) {
  const { name, method, path, description, parameters, responseExample } = endpoint

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <span className={`font-mono ${method === 'GET' ? 'text-green-600' : 'text-blue-600'}`}>{method}</span> {path}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        <h3 className="text-lg font-semibold mb-2">Parameters</h3>
        {parameters.length > 0 ? (
          <ul className="list-disc list-inside mb-4">
            {parameters.map((param, index) => (
              <li key={index}>
                <span className="font-semibold">{param.name}</span> ({param.type}): {param.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">No parameters required.</p>
        )}
        <h3 className="text-lg font-semibold mb-2">Response Example</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
          <code>{responseExample}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

