'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  amount: string
  recipient: string
  status: 'Completed' | 'Pending' | 'Failed'
}

async function getTransactions(filter: string): Promise<Transaction[]> {
  const response = await fetch(`/api/admin/transactions?filter=${filter}`)
  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }
  return response.json()
}

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true)
        const data = await getTransactions(filter)
        setTransactions(data)
      } catch (error) {
        toast.error("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }
    loadTransactions()
  }, [filter])

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.amount.includes(searchTerm)
  )

  const handleExport = () => {
    // Implement export functionality here
    toast.success("Exporting transactions...")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search transactions"
            className="max-w-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select onValueChange={handleFilterChange} defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount (BARK)</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.recipient}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

