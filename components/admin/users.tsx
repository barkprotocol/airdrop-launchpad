'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  walletAddress: string
  email: string | null
  createdAt: string
  status: 'active' | 'inactive'
}

async function getUsers(page: number, limit: number, filter: string, search: string): Promise<{ users: User[], total: number }> {
  const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}&filter=${filter}&search=${search}`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

async function updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<void> {
  const response = await fetch(`/api/admin/users/${userId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error('Failed to update user status')
  }
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()
  const limit = 10

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true)
        const data = await getUsers(page, limit, filter, searchTerm)
        setUsers(data.users)
        setTotalUsers(data.total)
      } catch (error) {
        toast.error("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [page, filter, searchTerm])

  const handleFilterChange = (value: string) => {
    setFilter(value)
    setPage(1)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      setIsUpdating(userId)
      await updateUserStatus(userId, newStatus)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
      toast.success(`User status updated to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update user status")
    } finally {
      setIsUpdating(null)
    }
  }

  const totalPages = Math.ceil(totalUsers / limit)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users"
              className="pl-8 max-w-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select onValueChange={handleFilterChange} defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableCaption>A list of users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.walletAddress}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant={user.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                      disabled={isUpdating === user.id}
                    >
                      {isUpdating === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        user.status === 'active' ? 'Disable' : 'Enable'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

