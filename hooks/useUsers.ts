import { getUsers } from "@/api/users"
import { type User } from "@/types/models"
import { useEffect, useState } from "react"

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers () {
      const { data } = await getUsers()
      setUsers(data.data)
    }

    fetchUsers()
  }, [])

  return { users }
}