import Link from 'next/link';
import Image from 'next/image';

const quickAccessItems = [
  {
    title: 'Registration',
    description: 'Create your student account',
    href: '/register',
    icon: 'fas fa-user-plus',
    accent: 'from-violet-500 to-indigo-600',
  },
  {
    title: 'Subject Registration',
    description: 'Register modules',
    href: '/register?section=student-personal-info',
    icon: 'fas fa-book-open',
    accent: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Exam Admission',
    description: 'Apply for exams',
    href: '/register?section=medical',
    icon: 'fas fa-file-circle-check',
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Profile',
    description: 'View your profile',
    href: '/signin',
    icon: 'fas fa-user',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Notices',
    description: 'Latest updates',
    href: '/signin',
    icon: 'fas fa-bell',
    accent: 'from-rose-500 to-red-600',
  },
  {
    title: 'Help',
    description: 'Support center',
    href: '/signin',
    icon: 'fas fa-circle-question',
    accent: 'from-cyan-500 to-teal-600',
  },
];

const announcements = [
  {
    label: 'New',
    title: 'Semester Registration',
    description: 'Registration window is open for the new semester.',
  },
  {
    label: 'Info',
    title: 'Exam Timetable Released',
    description: 'The updated examination timetable is now available.',
  },
];

const featureList = [
  'Fast Registration',
  'Secure Login',
  'Access Anywhere',
];

const footerLinks = [
  {
    title: 'Quick Links',
    links: ['About Us', 'Register', 'Staff', 'Notices'],
  },
  {
    title: 'Student Services',
    links: ['Student Registration', 'Subject Registration', 'Exam Admission', 'My Profile'],
  },
];

export default function Home() {
  return (
    <main className="bg-[#f5efe7] text-slate-900">
      <section className="relative overflow-hidden">
        {/* Campus background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/campus-bg.jpg')" }}
        />
        {/* Very light overlay — keeps image visible */}
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">

            <h1 className="mt-6 text-4xl font-black tracking-tight text-red-950 drop-shadow sm:text-5xl lg:text-6xl">
              WELCOME TO RUSL
            </h1>
            <p className="mt-4 text-base font-bold text-red-900 sm:text-lg lg:text-xl">
              Smart University System for Academic Service
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-4xl border border-white/70 bg-white/95 p-6 text-left shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center justify-center">
                    <Image src="/new-student.png" alt="New Student" width={200} height={200} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">New Student</h2>
                    <p className="mt-1 text-sm text-slate-600">Register as a new student and begin your academic journey.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full bg-red-950 px-5 py-3 text-sm font-semibold text-yellow-300 shadow-md transition hover:bg-red-900"
                  >
                    Register Now
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </article>

              <article className="rounded-4xl border border-white/70 bg-white/95 p-6 text-left shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center justify-center">
                    <Image src="/current-student.png" alt="Current Student" width={90} height={90} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Current Student</h2>
                    <p className="mt-1 text-sm text-slate-600">Login to access academic services and your profile.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-full bg-red-950 px-5 py-3 text-sm font-semibold text-yellow-300 shadow-md transition hover:bg-red-900"
                  >
                    Login Now
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-900">Quick Access</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccessItems.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.12)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105">
                {index === 0 ? (
                  <Image src="/registration-icon.png" alt="Registration" width={200} height={200} />
                ) : index === 1 ? (
                  <Image src="/subject-registration-icon.png" alt="Subject Registration" width={200} height={200} />
                ) : index === 2 ? (
                  <Image src="/exam-admission-icon.png" alt="Exam Admission" width={200} height={200} />
                ) : index === 3 ? (
                  <Image src="/profile-icon.png" alt="Profile" width={200} height={200} />
                ) : index === 4 ? (
                  <Image src="/notices-icon.png" alt="Notices" width={200} height={200} />
                ) : index === 5 ? (
                  <Image src="/help-icon.png" alt="Help" width={200} height={200} />
                ) : (
                  <i className={`${item.icon} text-xl`} />
                )}
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Image src="/announcements-icon.png" alt="Announcements" width={40} height={40} />
              <h3 className="text-2xl font-bold text-slate-900">Latest Announcements</h3>
            </div>

            <div className="mt-5 space-y-4">
              {announcements.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                      {item.label}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 text-right">
              <Link
                href="/signin"
                className="inline-flex rounded-full border border-red-950 px-5 py-2 text-sm font-semibold text-red-950 transition hover:bg-red-950 hover:text-yellow-300"
              >
                View All →
              </Link>
            </div>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-950 text-yellow-300">
                  <i className="fas fa-star" />
                </div>
                <ul className="space-y-4">
                  {featureList.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-800">
                      <i className="fas fa-circle-check text-lg text-red-900" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden md:block self-end rounded-4xl bg-linear-to-br from-red-50 via-white to-amber-50 p-4">
                <div className="flex h-48 w-40 items-end justify-center rounded-[28px] bg-linear-to-b from-red-200 to-red-100 p-4 shadow-inner">
                  <div className="flex h-32 w-24 items-end justify-center rounded-t-full bg-red-950/90 text-white">
                    <i className="fas fa-user-graduate text-5xl pb-3" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <footer className="bg-red-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:px-8">
          <section>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">About Us</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-red-100">
              Rajarata University of Sri Lanka is a public university in Mihintale, Sri Lanka.
              It serves as a central academic institution for students across the country.
            </p>
            <div className="mt-5 flex gap-3 text-white/90">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <i className="fab fa-facebook-f" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <i className="fab fa-twitter" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <i className="fab fa-linkedin-in" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <i className="fab fa-youtube" />
              </span>
            </div>
          </section>

          {footerLinks.map((group) => (
            <section key={group.title}>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-red-100">
                {group.links.map((link) => (
                  <li key={link} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>{link}</span>
                    <span>›</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section>
            <h3 className="text-xl font-bold uppercase tracking-wide text-white">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-red-100">
              <li className="flex gap-3">
                <i className="fas fa-location-dot mt-1" />
                <span>Rajarata University of Sri Lanka, Mihintale - 50300, Sri Lanka</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-phone mt-1" />
                <span>+94(25)2266643</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-envelope mt-1" />
                <span>info@rjt.ac.lk</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-sm text-red-100">
          © 2026 Rajarata University of Sri Lanka
        </div>
      </footer>
    </main>
  );
}
