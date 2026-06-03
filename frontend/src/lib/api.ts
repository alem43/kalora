const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Array<{ path: string; message: string }>
}

export type InsightsResponse = {
  stats: {
    lowProteinBreakfasts: number
    lateNightMeals: number
    avgDailyProtein: number
  }
  insights: string[]
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: Array<{ path: string; message: string }>,
  ) {
    super(code)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      const errorData = data as ApiErrorResponse
      throw new ApiError(
        response.status,
        errorData.code || 'ERROR',
        errorData.details,
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof SyntaxError) {
      throw new ApiError(500, 'PARSE_ERROR')
    }
    throw new ApiError(500, 'NETWORK_ERROR')
  }
}

export const api = {
  auth: {
    register: (data: unknown) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: unknown) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () =>
      request('/auth/logout', {
        method: 'POST',
      }),
    googleLogin: (data: { credential: string }) =>
      request('/auth/google', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  food: {
    list: () => request('/food'),
    create: (data: unknown) =>
      request('/food', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request(`/food/${id}`, {
        method: 'DELETE',
      }),
    insights: () => request<InsightsResponse>('/food/insights'),
  },
}
