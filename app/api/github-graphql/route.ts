import { type NextRequest, NextResponse } from "next/server"

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"

// GitHub GraphQL query to get real contribution data
const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          primaryLanguage {
            name
          }
          stargazerCount
          forkCount
        }
      }
    }
  }
`

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    console.log(`[GITHUB GRAPHQL] Fetching real data for: ${username}`)

    // Calculate date range for the last year
    const to = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "GitHub-Streak-Card/1.0",
    }

    // Add authorization if token is provided
    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log(`[GITHUB GRAPHQL] Using provided token for ${username}`)
    }

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    })

    if (!response.ok) {
      console.error(`[GITHUB GRAPHQL] API error: ${response.status}`)
      throw new Error(`GitHub GraphQL API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      console.error("[GITHUB GRAPHQL] GraphQL errors:", data.errors)
      return NextResponse.json({ error: "Failed to fetch GitHub data", details: data.errors }, { status: 500 })
    }

    console.log(`[GITHUB GRAPHQL] SUCCESS - Real data fetched for ${username}`)
    return NextResponse.json(data.data)
  } catch (error) {
    console.error("[GITHUB GRAPHQL] Error:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 })
  }
}
