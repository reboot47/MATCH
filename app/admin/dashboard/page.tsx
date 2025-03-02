"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pt-16 lg:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">統計・分析</h1>
            <p className="text-gray-600">ようこそ、{session?.user?.name || "管理者"}さん</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-800">総ユーザー数</h3>
              <p className="text-2xl font-bold mt-1">125,876</p>
              <p className="text-xs text-blue-700 mt-1">+2.4%</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-indigo-800">アクティブユーザー</h3>
              <p className="text-2xl font-bold mt-1">68,543</p>
              <p className="text-xs text-indigo-700 mt-1">+5.1%</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-green-800">新規ユーザー</h3>
              <p className="text-2xl font-bold mt-1">423</p>
              <p className="text-xs text-green-700 mt-1">+12.8%</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-pink-800">日次マッチング数</h3>
              <p className="text-2xl font-bold mt-1">12,543</p>
              <p className="text-xs text-pink-700 mt-1">+3.7%</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-amber-800">月間収益</h3>
              <p className="text-2xl font-bold mt-1">¥4234.5万</p>
              <p className="text-xs text-amber-700 mt-1">+9.2%</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="inline-flex rounded-md shadow-sm mb-6" role="group">
              <button type="button" className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-l-lg hover:bg-blue-50 focus:z-10 focus:bg-blue-50 focus:outline-none">
                ユーザー分析
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none">
                マッチング分析
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none">
                売上分析
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-300 hover:bg-gray-50 focus:z-10 focus:outline-none">
                継続率分析
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-300 rounded-r-lg hover:bg-gray-50 focus:z-10 focus:outline-none">
                行動分析
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">性別分布</h3>
              <div className="flex items-center mb-4">
                <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-l-full" style={{ width: "68%" }}></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>男性 (68%)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                  <span>女性 (32%)</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">年齢分布</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">18-24</span>
                    <span className="text-sm text-gray-600">24%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">25-34</span>
                    <span className="text-sm text-gray-600">41%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "41%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">35-44</span>
                    <span className="text-sm text-gray-600">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "22%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
