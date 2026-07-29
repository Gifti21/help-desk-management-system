import Link from "next/link";
import {
  Headset,
  BarChart3,
  Users,
  Shield,
  Ticket,
  Clock,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Headset className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-[15px] font-bold text-gray-900 tracking-tight">HDMS</span>
              <span className="text-[15px] font-bold text-emerald-600 tracking-tight"> Pro</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#stats" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Stats</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200 hover:shadow-emerald-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-60 blur-3xl" />
          <div className="absolute top-20 -left-40 w-[400px] h-[400px] rounded-full bg-sky-50 opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-50 opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Enterprise Support Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold text-gray-900 tracking-tight leading-[1.08] mb-6">
              Resolve issues{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                faster
              </span>
              , together.
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Streamline your organization&apos;s support workflow with intelligent ticket routing, 
              real-time dashboards, and actionable analytics — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[15px] font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20"
              >
                Open Dashboard
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 px-6 py-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-b from-emerald-100/40 via-transparent to-transparent rounded-[2rem] blur-2xl" />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg border border-gray-200 px-4 py-1.5 text-xs text-gray-400 max-w-md mx-auto">
                    hdms-pro.besys.tech/dashboard
                  </div>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Admin Command Center</h3>
                    <p className="text-sm text-gray-400">Real-time oversight of help desk performance</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-500">Export Data</span>
                    <span className="px-3 py-1.5 text-xs font-medium bg-emerald-600 rounded-lg text-white">Refresh</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total Tickets", value: "2,842", change: "+12.5%", color: "text-emerald-600" },
                    { label: "Open Tickets", value: "142", change: "-3.2%", color: "text-amber-600" },
                    { label: "Closed Today", value: "64", change: "+18%", color: "text-emerald-600" },
                    { label: "Overdue", value: "28", change: "+5.1%", color: "text-red-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                        <span className={`text-xs font-semibold ${stat.color} mb-0.5`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted By ─── */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Built for Enterprise Teams
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {["IT Services", "HR & Operations", "Finance", "Engineering", "Administration"].map((dept) => (
              <span key={dept} className="text-sm font-bold text-gray-600 tracking-wide">{dept}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything your support team needs
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Purpose-built tools that help your team resolve issues faster and keep employees happier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Ticket,
                title: "Smart Ticket Management",
                desc: "Create, assign, and track tickets through their entire lifecycle with automated status transitions.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: Users,
                title: "Role-Based Access",
                desc: "Three distinct roles — Admin, Agent, Employee — each with tailored views and permissions.",
                color: "bg-violet-50 text-violet-600",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                desc: "Interactive dashboards with ticket trends, department breakdowns, and performance metrics.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: Clock,
                title: "SLA & Priority Tracking",
                desc: "Monitor overdue tickets and enforce priority levels from Low to Critical with visual indicators.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "JWT authentication, bcrypt password hashing, RBAC, and audit logging on every critical action.",
                color: "bg-red-50 text-red-600",
              },
              {
                icon: Globe,
                title: "Department Management",
                desc: "Organize users and tickets by department with full CRUD and cross-department visibility.",
                color: "bg-teal-50 text-teal-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Three steps to streamlined support
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Submit a Ticket",
                desc: "Employees describe their issue, select a category and priority, and submit in seconds.",
              },
              {
                step: "02",
                title: "Assign & Resolve",
                desc: "Admins route tickets to agents. Agents update status, add comments, and close when resolved.",
              },
              {
                step: "03",
                title: "Track & Report",
                desc: "Dashboards show real-time metrics. Export CSV/PDF reports for stakeholder reviews.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section id="stats" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Built for scale
              </h2>
              <p className="text-gray-400 text-lg">Designed to handle your organization&apos;s growing support needs.</p>
            </div>

            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { value: "30", label: "Functional Requirements" },
                { value: "3", label: "User Roles" },
                { value: "5", label: "Core Entities" },
                { value: "99%", label: "Uptime Target" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Ready to deploy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Ready to transform your support workflow?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Sign in to access the Admin Command Center and start managing tickets, users, and departments.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
          >
            Launch Dashboard
            <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Headset className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">HDMS Pro</span>
              <span className="text-xs text-gray-400 ml-1">by BESYS Technologies</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-400">© 2024 BESYS Technologies PLC</span>
              <span className="text-gray-200">|</span>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">System Status</a>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Security Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}