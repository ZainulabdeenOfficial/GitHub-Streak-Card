import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const avatarUrl = searchParams.get("url")

    if (!avatarUrl) {
      return new NextResponse("Avatar URL is required", { status: 400 })
    }

    console.log(`[AVATAR PROXY] Fetching avatar: ${avatarUrl}`)

    // Fetch the avatar image
    const response = await fetch(avatarUrl, {
      headers: {
        "User-Agent": "GitHub-Streak-Card/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/png"

    console.log(`[AVATAR PROXY] Successfully fetched avatar, size: ${imageBuffer.byteLength} bytes`)

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[AVATAR PROXY] Error:", error)
    return new NextResponse("Failed to fetch avatar", { status: 500 })
  }
}
