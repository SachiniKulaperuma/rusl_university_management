import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Current Student — RUSL Student Portal",
    description:
        "Manage your academic activities, registration and view your academic progress at Rajarata University of Sri Lanka.",
};

const cards = [
    {
        id: "subject-title",
        emoji: "📚",
        title: "Subject Registration",
        description:
            "Register your subjects for the current semester. Add or drop subjects according to your study plan.",
        href: "/register/student-personal-info",
        label: "Subject Registration",
    },
    {
        id: "exam-title",
        emoji: "📝",
        title: "Exam Registration",
        description:
            "Register for your semester exams. Select the exams you wish to appear and submit your registration.",
        href: "#",
        label: " Exam Registration",
    },
];

const infoItems = [
    { emoji: "📅", label: "Academic Year", value: "2024/2025" },
    { emoji: "🏷️", label: "Semester", value: "Semester 1" },
    { emoji: "🕒", label: "Registration Period", value: "01 May 2024 – 14 May 2024" },
    { emoji: "🆔", label: "Student ID", value: "RJT/TEC/2023/048" },
];

export default function CurrentStudentPage() {
    return (
        <div className="min-h-[calc(100vh-77px)] bg-gradient-to-b from-white to-[#fafafa] text-[#222] antialiased leading-[1.45]">
            <div className="max-w-[1100px] mx-auto px-5 py-7">

                {/* ── Breadcrumb ── */}
                <nav aria-label="Breadcrumb" className="text-[13px] text-[#666] mb-3">
                    Home › Current Student
                </nav>

                {/* ── Hero ── */}
                <section
                    aria-labelledby="hero-title"
                    className="flex gap-5 items-center flex-wrap bg-gradient-to-r from-[rgba(122,11,11,0.06)] to-[rgba(143,31,31,0.03)] p-[22px] rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
                >
                    <div className="flex-1 min-w-[200px]">
                        <h2
                            id="hero-title"
                            className="text-2xl font-bold text-[#7a0b0b] mt-0 mb-2"
                        >
                            Current Student
                        </h2>
                        <p className="m-0 text-[#555]">
                            Manage your academic activities, registration and view your academic progress.
                        </p>
                    </div>
                    <div
                        aria-hidden="true"
                        className="w-[180px] h-[90px] bg-gradient-to-br from-[#eee] to-white rounded-lg flex items-center justify-center text-[#999] text-xs shrink-0 sm:w-full sm:h-[140px] sm:max-w-full"
                    >
                        Campus Image
                    </div>
                </section>

                {/* ── Heading ── */}
                <h3 className="mt-[22px] mb-0 text-[#333] text-lg font-semibold">
                    What would you like to do?
                </h3>
                <p className="mt-1.5 mb-3 text-[#666] text-[15px]">
                    Select an option below to continue.
                </p>

                {/* ── Cards ── */}
                <section
                    aria-label="Actions"
                    className="grid gap-[18px] my-[22px]"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))" }}
                >
                    {cards.map((card) => (
                        <article
                            key={card.id}
                            aria-labelledby={card.id}
                            className="bg-white rounded-xl p-[22px] shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/[0.04] flex flex-col gap-3.5 items-start"
                        >
                            <div className="flex gap-3 items-center">
                                <div
                                    aria-hidden="true"
                                    className="w-14 h-14 rounded-[10px] bg-[#f5f5f6] flex items-center justify-center text-[22px] shrink-0"
                                >
                                    {card.emoji}
                                </div>
                                <div>
                                    <h3 id={card.id} className="m-0 text-[#7a0b0b] font-bold text-base">
                                        {card.title}
                                    </h3>
                                    <p className="m-0 text-[#555] text-sm mt-1">{card.description}</p>
                                </div>
                            </div>
                            <div className="mt-auto w-full flex justify-end">
                                <Link
                                    href={card.href}
                                    role="button"
                                    className="inline-block px-3.5 py-2.5 rounded-lg bg-[#7a0b0b] text-white font-semibold text-sm no-underline transition-all duration-200 hover:bg-[#5a0602] hover:shadow-[0_4px_12px_rgba(122,11,11,0.35)]"
                                >
                                    {card.label}
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>

                {/* ── Info panel ── */}
                <section
                    aria-label="Quick information"
                    className="mt-[18px] bg-gradient-to-b from-white to-[#fafafa] rounded-xl p-4 border border-black/[0.04] shadow-[0_6px_18px_rgba(0,0,0,0.08)] flex flex-wrap gap-3 items-center justify-between"
                >
                    {infoItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex gap-2.5 items-center min-w-[160px]"
                        >
                            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-base shadow-[0_2px_6px_rgba(0,0,0,0.04)] shrink-0">
                                {item.emoji}
                            </div>
                            <div>
                                <b className="block font-bold text-sm text-[#222]">{item.label}</b>
                                <span className="block text-[#666] text-sm">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </section>

            </div>

            {/* ── Footer ── */}
            <footer className="max-w-[1100px] mx-auto px-5 pb-10 pt-7 text-[#666] text-[13px]">
                © Rajarata University — Student Services
            </footer>
        </div>
    );
}