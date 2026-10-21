"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main className="min-h-screen bg-neutral-950 p-8 text-white">
        <h1 className="text-2xl font-semibold">CMS 尚未连接</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          请先创建 Sanity 项目，并在部署平台配置 NEXT_PUBLIC_SANITY_PROJECT_ID 与 NEXT_PUBLIC_SANITY_DATASET；配置完成后，此页面会显示文章管理后台。
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
