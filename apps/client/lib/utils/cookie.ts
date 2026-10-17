import { cookies } from "next/headers";

export async function forwardCookieFromServerToBrowser(res: Response) {
  const cookieStore = await cookies();

  const setCookies =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [res.headers.get("set-cookie")].filter((value): value is string =>
          Boolean(value),
        );

  for (const setCookie of setCookies) {
    const parts = setCookie.split(";").map((part) => part.trim());
    const [nameValue, ...attributes] = parts;
    const separatorIndex = nameValue.indexOf("=");

    if (separatorIndex < 1) continue;

    const name = nameValue.slice(0, separatorIndex).trim();
    const value = nameValue.slice(separatorIndex + 1).trim();

    const getAttribute = (attribute: string) =>
      attributes
        .find((part) =>
          part.toLowerCase().startsWith(`${attribute.toLowerCase()}=`),
        )
        ?.split("=")
        .slice(1)
        .join("=")
        .trim();

    const sameSite = getAttribute("samesite")?.toLowerCase();

    const maxAgeValue = getAttribute("max-age");
    const expiresValue = getAttribute("expires");

    cookieStore.set(name, value, {
      httpOnly: attributes.some((part) => part.toLowerCase() === "httponly"),
      secure: attributes.some((part) => part.toLowerCase() === "secure"),
      path: getAttribute("path") ?? "/",
      sameSite:
        sameSite === "strict" || sameSite === "lax" || sameSite === "none"
          ? sameSite
          : undefined,
      maxAge:
        maxAgeValue !== undefined && Number.isFinite(Number(maxAgeValue))
          ? Number(maxAgeValue)
          : undefined,
      expires: expiresValue ? new Date(expiresValue) : undefined,
    });
  }
}

export async function getCookie(cookieName: string) {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName);
}
