import Link from "next/link";

export default function ResidentialPage2() {
  return (
    <div className="bg-white rounded-lg shadow p-6">

      <h1 className="text-2xl font-bold mb-6">
        Residential Application - Page 2
      </h1>

      <form className="space-y-5">

        <input
          type="text"
          placeholder="Father's Name"
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          placeholder="Mother's Name"
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          placeholder="Family Members"
          className="w-full border rounded p-3"
        />

        <textarea
          placeholder="Declaration"
          className="w-full border rounded p-3"
        />

        <div className="flex justify-between">

          <Link
            href="/residential/page1"
            className="border px-6 py-2 rounded"
          >
            Previous
          </Link>

          <Link
            href="/residential/page3"
            className="bg-red-800 text-white px-6 py-2 rounded"
          >
            Next
          </Link>

        </div>

      </form>
    </div>
  );
}