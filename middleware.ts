import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 旧Vercel本番URL（*.vercel.app）がwww.shufu-kaden.comと別ページとして
// Googleにインデックスされ、重複コンテンツと判定される問題への対応。
// アクセス自体は許可したまま、vercel.appドメインへのレスポンスにのみ
// X-Robots-Tag: noindex を付与してクロール除外を指示する。
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hostname = request.headers.get("host") ?? "";

  if (hostname.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
