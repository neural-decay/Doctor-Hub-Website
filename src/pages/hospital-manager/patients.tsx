"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Edit, MoreHorizontal, Search, UserPlus } from "lucide-react"

// Mock data
const patients = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 45,
    gender: "Female",
    status: "admitted",
    room: "301",
    admissionDate: "2023-04-10",
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 62,
    gender: "Male",
    status: "admitted",
    room: "205",
    admissionDate: "2023-04-08",
  },
  {
    id: "3",
    name: "Carol Davis",
    age: 28,
    gender: "Female",
    status: "discharged",
    room: "-",
    admissionDate: "2023-04-01",
  },
  {
    id: "4",
    name: "David Wilson",
    age: 35,
    gender: "Male",
    status: "admitted",
    room: "412",
    admissionDate: "2023-04-12",
  },
  {
    id: "5",
    name: "Emma Brown",
    age: 50,
    gender: "Female",
    status: "discharged",
    room: "-",
    admissionDate: "2023-04-05",
  },
]

export default function HospitalPatients() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.id.includes(searchTerm)
    const matchesFilter = filter === "all" || patient.status === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Patient Management</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Register Patient
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="admitted">Admitted</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                <Badge variant={patient.status === "admitted" ? "default" : "secondary"}>{patient.status}</Badge>
              </TableCell>
              <TableCell>{patient.room}</TableCell>
              <TableCell>{patient.admissionDate}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ClipboardList className="mr-2 h-4 w-4" /> View Medical History
                    </DropdownMenuItem>
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
