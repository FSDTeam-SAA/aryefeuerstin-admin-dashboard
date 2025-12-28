import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/team`)
      if (!response.ok) {
        throw new Error("Failed to fetch team")
      }
      return response.json()
    },
  })
}

export function useAddWorker() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newWorker) => {
      console.log("[v0] this is my backend body ...", JSON.stringify(newWorker, null, 2))

      const response = await fetch(`${BASE_URL}/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorker),
      })

      if (!response.ok) {
        throw new Error("Failed to add worker")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] })
    },
  })
}
