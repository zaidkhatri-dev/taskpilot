import { cookies } from "next/headers";

export async function forwardCookieFromServerToBrowser(res: Response) {
  const setCookieHeader = res.headers.get("set-cookie");

  if (setCookieHeader) {
    const cookieStore = await cookies();

    const parts = setCookieHeader.split(";").map((part) => part.trim());
    const [cookieNameValuePair] = parts;
    const [name, ...valParts] = cookieNameValuePair.split("=");
    const value = valParts.join("=");

    const isHttpOnly = parts.some((part) => part.toLowerCase() === "httponly");
    const isSecure = parts.some((part) => part.toLowerCase() === "secure");

    const pathPart = parts.find((part) =>
      part.toLowerCase().startsWith("path="),
    );
    const path = pathPart
      ? pathPart.split("=").slice(1).join("=").trim()
      : undefined;

    const maxAgePart = parts.find((part) =>
      part.toLowerCase().startsWith("max-age="),
    );
    const maxAge = maxAgePart
      ? parseInt(maxAgePart.split("=")[1].trim(), 10)
      : undefined;

    const expiresPart = parts.find((part) =>
      part.toLowerCase().startsWith("expires="),
    );
    const expiresVal = expiresPart
      ? expiresPart.split("=").slice(1).join("=").trim()
      : undefined;
    const expires = expiresVal ? new Date(expiresVal) : undefined;

    const sameSitePart = parts.find((part) =>
      part.toLowerCase().startsWith("samesite="),
    );
    const sameSiteVal = sameSitePart
      ? (sameSitePart.split("=")[1].trim().toLowerCase() as
          "lax" | "strict" | "none")
      : undefined;

    cookieStore.set(name.trim(), value.trim(), {
      path,
      httpOnly: isHttpOnly,
      secure: isSecure,
      sameSite: sameSiteVal,
      maxAge: typeof maxAge === "number" && !isNaN(maxAge) ? maxAge : undefined,
      expires: expires && !isNaN(expires.getTime()) ? expires : undefined,
    });
  }
}

export async function getCookie(cookieName: string) {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName);
}
