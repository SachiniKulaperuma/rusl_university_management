'use client';

import { Suspense } from 'react';
import Sidebar from '../components/layout/slidebar/slidebar';

export default function SlidebarPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar preview navigation */}
      <Suspense fallback={<div className="fixed top-[96px] bottom-0 left-0 w-80 bg-[#6b6363] animate-pulse z-40 hidden lg:block" />}>
        <Sidebar />
      </Suspense>

      {/* Preview Content Area */}
      <main className="flex-1 lg:pl-80 pt-24 pb-12 w-full flex items-center justify-center">
        <div className="max-w-md text-center p-8 bg-white rounded-xl shadow-md border border-gray-200/60 mx-4">
          <div className="w-16 h-16 rounded-full bg-red-900/10 text-red-900 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-columns text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sidebar Preview Portal</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            This route serves as a visual staging page for the navigation slidebar. Hover and click menu items to verify states and dropdowns.
          </p>
        </div>
      </main>
    </div>
  );
}
