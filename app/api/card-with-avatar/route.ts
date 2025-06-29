import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const themeParam = searchParams.get("theme")

    if (!username) {
      return new NextResponse("Username is required", { status: 400 })
    }

    console.log(`[CARD WITH AVATAR API] Generating card for: ${username}`)

    // Fetch streak data
    let data
    try {
      const baseUrl = new URL(request.url).origin
      const streakResponse = await fetch(`${baseUrl}/api/streak?username=${username}`, {
        headers: { "User-Agent": "GitHub-Streak-Card/1.0" },
      })

      if (!streakResponse.ok) {
        throw new Error(`Streak API returned ${streakResponse.status}`)
      }

      data = await streakResponse.json()

      if (data.error) {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error(`[CARD WITH AVATAR API] Failed to fetch data:`, error)
      return generateErrorCard("Failed to fetch user data")
    }

    // Parse theme
    let theme = {
      backgroundColor: "#1a1b27",
      textColor: "#ffffff",
      accentColor: "#00d4aa",
      borderColor: "#30363d",
      waterColor: "#00d4aa",
      streakColor: "#ff6b6b",
    }

    if (themeParam) {
      try {
        const parsedTheme = JSON.parse(decodeURIComponent(themeParam))
        theme = { ...theme, ...parsedTheme }
      } catch (e) {
        console.log("[CARD WITH AVATAR API] Using default theme")
      }
    }

    // Fetch avatar image and convert to base64 for embedding
    let avatarBase64 = ""
    if (data.avatarUrl) {
      try {
        console.log(`[CARD WITH AVATAR API] Fetching avatar: ${data.avatarUrl}`)
        const avatarResponse = await fetch(data.avatarUrl, {
          headers: {
            "User-Agent": "GitHub-Streak-Card/1.0",
          },
        })

        if (avatarResponse.ok) {
          const avatarBuffer = await avatarResponse.arrayBuffer()
          const avatarArray = new Uint8Array(avatarBuffer)
          avatarBase64 = Buffer.from(avatarArray).toString("base64")
          console.log(`[CARD WITH AVATAR API] Avatar fetched successfully, size: ${avatarBuffer.byteLength} bytes`)
        }
      } catch (error) {
        console.error("[CARD WITH AVATAR API] Failed to fetch avatar:", error)
      }
    }

    const svg = generateCardWithEmbeddedAvatar(data, theme, avatarBase64)

    console.log(`[CARD WITH AVATAR API] SUCCESS - Generated card for ${username}`)

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[CARD WITH AVATAR API] Unexpected error:", error)
    return generateErrorCard("Card generation failed")
  }
}

function generateCardWithEmbeddedAvatar(data: any, theme: any, avatarBase64: string): string {
  const username = String(data.username || "user").substring(0, 15)
  const currentStreak = Number(data.currentStreak) || 0
  const longestStreak = Number(data.longestStreak) || 0
  const totalContributions = Number(data.totalContributions) || 0
  const publicRepos = Number(data.publicRepos) || 0
  const contributionsThisYear = Number(data.contributionsThisYear) || 0
  const joinedYear = data.joinedDate ? new Date(data.joinedDate).getFullYear() : 2020
  const topLanguages = data.topLanguages || ["JavaScript", "TypeScript"]

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  // Create avatar section with embedded base64 image
  const avatarSection = avatarBase64
    ? `
    <!-- Avatar Background Circle -->
    <circle cx="40" cy="40" r="32" fill="${theme.accentColor}" fill-opacity="0.2" stroke="${theme.accentColor}" stroke-width="2"/>
    
    <!-- White background for avatar -->
    <circle cx="40" cy="40" r="30" fill="#ffffff"/>
    
    <!-- Embedded Avatar Image -->
    <image x="10" y="10" width="60" height="60" 
           href="data:image/png;base64,${avatarBase64}" 
           clip-path="url(#avatarClip)" 
           preserveAspectRatio="xMidYMid slice"/>
    
    <!-- Avatar border -->
    <circle cx="40" cy="40" r="30" fill="none" stroke="${theme.accentColor}" stroke-width="1" stroke-opacity="0.5"/>`
    : `
    <!-- Avatar Background Circle -->
    <circle cx="40" cy="40" r="32" fill="${theme.accentColor}" fill-opacity="0.2" stroke="${theme.accentColor}" stroke-width="2"/>
    
    <!-- Username Initial Fallback -->
    <text x="40" y="50" text-anchor="middle" fill="${theme.accentColor}" font-size="24" font-weight="bold" font-family="Arial, sans-serif">
      ${username.charAt(0).toUpperCase()}
    </text>`

  return `<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="bgPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="${theme.accentColor}" opacity="0.05"/>
    </pattern>
    
    <!-- Circular clip path for avatar -->
    <clipPath id="avatarClip">
      <circle cx="40" cy="40" r="30"/>
    </clipPath>
    
    <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.streakColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${theme.accentColor};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Main Background -->
  <rect width="500" height="200" rx="12" fill="${theme.backgroundColor}" stroke="${theme.borderColor}" stroke-width="2"/>
  
  <!-- Background Pattern -->
  <rect width="500" height="200" fill="url(#bgPattern)"/>

  <!-- Profile Section -->
  <g transform="translate(50, 50)">
    ${avatarSection}
    
    <!-- Username Text -->
    <text x="40" y="100" text-anchor="middle" fill="${theme.textColor}" font-size="14" font-weight="bold" font-family="Arial, sans-serif">
      ${username.length > 12 ? username.substring(0, 12) + "..." : username}
    </text>
    
    <!-- Join Year -->
    <text x="40" y="115" text-anchor="middle" fill="${theme.textColor}" font-size="11" opacity="0.7" font-family="Arial, sans-serif">
      Since ${joinedYear}
    </text>
  </g>

  <!-- Separator 1 -->
  <line x1="150" y1="60" x2="150" y2="140" stroke="${theme.borderColor}" stroke-width="1"/>

  <!-- Streak Circle Section -->
  <g transform="translate(170, 50)">
    <!-- Animated Background -->
    <circle cx="40" cy="40" r="35" fill="${theme.waterColor}" fill-opacity="0.1">
      <animate attributeName="r" values="35;37;35" dur="3s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Inner glow -->
    <circle cx="40" cy="40" r="30" fill="url(#streakGradient)" fill-opacity="0.3">
      <animate attributeName="fill-opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Streak Number -->
    <text x="40" y="35" text-anchor="middle" fill="${theme.streakColor}" font-size="20" font-weight="bold" font-family="Arial, sans-serif">
      ${currentStreak}
    </text>
    <text x="40" y="50" text-anchor="middle" fill="${theme.textColor}" font-size="11" font-family="Arial, sans-serif">
      days
    </text>
    
    <!-- Animated Border -->
    <circle cx="40" cy="40" r="35" fill="none" stroke="${theme.streakColor}" stroke-width="2">
      <animate attributeName="stroke-opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Label -->
    <text x="40" y="105" text-anchor="middle" fill="${theme.accentColor}" font-size="11" font-weight="500" font-family="Arial, sans-serif">
      Current Streak
    </text>
  </g>

  <!-- Separator 2 -->
  <line x1="260" y1="60" x2="260" y2="140" stroke="${theme.borderColor}" stroke-width="1"/>

  <!-- Stats Section -->
  <g transform="translate(280, 60)">
    <!-- Row 1: Total Contributions & Longest Streak -->
    <text x="0" y="15" fill="${theme.textColor}" font-size="10" opacity="0.7" font-family="Arial, sans-serif">Total Contributions</text>
    <text x="0" y="30" fill="${theme.accentColor}" font-size="13" font-weight="bold" font-family="Arial, sans-serif">${formatNumber(totalContributions)}</text>

    <text x="110" y="15" fill="${theme.textColor}" font-size="10" opacity="0.7" font-family="Arial, sans-serif">Longest Streak</text>
    <text x="110" y="30" fill="${theme.streakColor}" font-size="13" font-weight="bold" font-family="Arial, sans-serif">${longestStreak} days</text>

    <!-- Row 2: Repositories & Followers -->
    <text x="0" y="55" fill="${theme.textColor}" font-size="10" opacity="0.7" font-family="Arial, sans-serif">Repositories</text>
    <text x="0" y="70" fill="${theme.textColor}" font-size="13" font-weight="bold" font-family="Arial, sans-serif">${publicRepos}</text>

    <text x="110" y="55" fill="${theme.textColor}" font-size="10" opacity="0.7" font-family="Arial, sans-serif">Followers</text>
    <text x="110" y="70" fill="${theme.textColor}" font-size="13" font-weight="bold" font-family="Arial, sans-serif">${formatNumber(data.followers || 0)}</text>

    <!-- Languages Section -->
    <text x="0" y="95" fill="${theme.textColor}" font-size="10" opacity="0.7" font-family="Arial, sans-serif">Top Languages</text>
    <text x="110" y="95" fill="${theme.textColor}" font-size="10" font-family="Arial, sans-serif">${topLanguages.slice(0, 2).join(" • ")}</text>

    <!-- Enhanced Language Bar -->
    <rect x="0" y="105" width="40" height="4" rx="2" fill="${theme.accentColor}">
      <animate attributeName="width" values="40;45;40" dur="3s" repeatCount="indefinite"/>
    </rect>
    <rect x="45" y="105" width="35" height="4" rx="2" fill="${theme.streakColor}">
      <animate attributeName="width" values="35;40;35" dur="3s" repeatCount="indefinite" begin="0.5s"/>
    </rect>
    <rect x="85" y="105" width="30" height="4" rx="2" fill="${theme.accentColor}" opacity="0.6">
      <animate attributeName="width" values="30;35;30" dur="3s" repeatCount="indefinite" begin="1s"/>
    </rect>
    <rect x="120" y="105" width="25" height="4" rx="2" fill="${theme.streakColor}" opacity="0.4">
      <animate attributeName="width" values="25;30;25" dur="3s" repeatCount="indefinite" begin="1.5s"/>
    </rect>
    <rect x="150" y="105" width="20" height="4" rx="2" fill="${theme.textColor}" opacity="0.3">
      <animate attributeName="width" values="20;25;20" dur="3s" repeatCount="indefinite" begin="2s"/>
    </rect>
  </g>

  <!-- Animated Flame Icon -->
  <text x="470" y="30" font-size="14" opacity="0.8" font-family="Arial, sans-serif">
    <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
    🔥
  </text>
  
  <!-- Data timestamp -->
  <text x="10" y="190" fill="${theme.textColor}" font-size="8" opacity="0.5" font-family="Arial, sans-serif">
    Updated: ${new Date().toLocaleDateString()} • Avatar: ${avatarBase64 ? "Embedded" : "Fallback"}
  </text>
</svg>`
}

function generateErrorCard(message: string): NextResponse {
  const errorSvg = `<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="200" rx="12" fill="#1a1b27" stroke="#ef4444" stroke-width="2"/>
  <text x="250" y="90" text-anchor="middle" fill="#ffffff" font-size="16" font-family="Arial, sans-serif">❌</text>
  <text x="250" y="110" text-anchor="middle" fill="#ffffff" font-size="14" font-family="Arial, sans-serif">${message}</text>
  <text x="250" y="130" text-anchor="middle" fill="#ffffff" font-size="12" font-family="Arial, sans-serif" opacity="0.7">Please try again</text>
</svg>`

  return new NextResponse(errorSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache",
    },
  })
}
