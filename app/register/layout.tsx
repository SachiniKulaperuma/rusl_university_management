import Sidebar from "../components/layout/slidebar/slidebar";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[calc(100vh-96px)] overflow-hidden bg-[#f4efe7]">
      <Sidebar />
      <main className="h-full overflow-y-auto lg:pl-80 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}