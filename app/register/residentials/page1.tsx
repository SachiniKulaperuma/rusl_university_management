import Link from "next/link";

export default function ResidentialPage1() {
  return (
    <div className="bg-white rounded-lg shadow p-6">

      <h1 className="text-2xl font-bold mb-6">
        Residential Application - Page 1
      </h1>

      <form className="space-y-5">

        <input
          type="text"
          placeholder="Student Name"
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          placeholder="Registration Number"
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          placeholder="NIC"
          className="w-full border rounded p-3"
        />

        <textarea
          placeholder="Permanent Address"
          className="w-full border rounded p-3"
        />

        <div className="flex justify-end">
          <Link
            href="/residential/page2"
            className="bg-red-800 text-white px-6 py-2 rounded"
          >
            Next
          </Link>
        </div>

      </form>
    </div>
  );
}