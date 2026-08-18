"use client";

import { Handshake, ChevronDown, X, Search } from "lucide-react";
import { useState } from "react";

const partners = [
  { name: "Huawei Technologies", color: "#C8102E" },
  { name: "Cisco", color: "#00BCEF" },
  { name: "HPE", color: "#01A982" },
  { name: "Fortinet", color: "#E83E2F" },
  { name: "Dell", color: "#007DB8" },
  { name: "Lenovo", color: "#E2231A" },
  { name: "Hikvision", color: "#C8102E" },
  { name: "IBM", color: "#0F62FE" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "ManageEngine", color: "#FF6B35" },
  { name: "Solarwinds", color: "#FF6600" },
  { name: "Oracle", color: "#C74634" },
  { name: "Array Networks", color: "#0066CC" },
  { name: "Ruckus", color: "#00A651" },
  { name: "Vertiv", color: "#005696" },
  { name: "CyberArk", color: "#E62020" },
  { name: "Epson", color: "#003399" },
  { name: "Canon", color: "#CC0000" },
  { name: "ZkTeco", color: "#0066CC" },
  { name: "Sophos", color: "#0096D6" },
  { name: "itc", color: "#0055A4" },
  { name: "Mitel", color: "#E31837" },
  { name: "Zebra", color: "#000000" },
];

export function TechnologyPartners() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "#f4f5f4" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#0d9488" }}>
            <Handshake className="h-5 w-5" style={{ color: "white" }} />
          </div>
          <div className="flex flex-col">
            <h2 className="flex items-baseline gap-1">
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 500, color: "#0f2a2e" }}>
                OUR
              </span>
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0d9488" }}>
                TECHNOLOGY PARTNERS
              </span>
            </h2>
            <div className="h-0.5 w-full mt-1" style={{ backgroundColor: "#0d9488" }} />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center max-w-2xl mx-auto mb-12" style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1rem", color: "#64748b", lineHeight: "1.6" }}>
          We collaborate with leading global technology partners to deliver innovative solutions and maximum value to our clients.
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center rounded-xl border p-6 transition hover:shadow-md"
              style={{ backgroundColor: "white", borderColor: "#e5e7eb", minHeight: "100px" }}
            >
              <span
                className="text-center font-semibold"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: partner.color,
                }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechnologyPartnersExpandable() {
  const [isExpanded, setIsExpanded] = useState(false);

  const featuredPartners = partners.slice(0, 2);
  const remainingPartners = partners.slice(2);

  const handleToggle = () => {
    console.log('Toggle clicked, current state:', isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "#f4f5f4" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#0d9488" }}>
            <Handshake className="h-5 w-5" style={{ color: "white" }} />
          </div>
          <div className="flex flex-col">
            <h2 className="flex items-baseline gap-1">
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 500, color: "#0f2a2e" }}>
                OUR
              </span>
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0d9488" }}>
                TECHNOLOGY PARTNERS
              </span>
            </h2>
            <div className="h-0.5 w-full mt-1" style={{ backgroundColor: "#0d9488" }} />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center max-w-2xl mx-auto mb-12" style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1rem", color: "#64748b", lineHeight: "1.6" }}>
          We collaborate with leading global technology partners to deliver innovative solutions and maximum value to our clients.
        </p>

        {/* Featured Partners Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {featuredPartners.map((partner) => (
            <div
              key={partner.name}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
            >
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: partner.color,
                }}
              >
                {partner.name}
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:opacity-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "transparent", border: "1px solid #0d9488", color: "#0d9488", "--tw-ring-color": "#0d9488" } as React.CSSProperties}
          >
            <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.875rem", fontWeight: 500 }}>
              {isExpanded ? "Show Less" : "+ More"}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Expandable Grid */}
        {isExpanded && (
          <div className="mt-6 rounded-xl border p-6" style={{ backgroundColor: "white", borderColor: "#e5e7eb" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {remainingPartners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center rounded-lg border p-4 transition hover:shadow-sm"
                  style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb", minHeight: "80px" }}
                >
                  <span
                    className="text-center font-semibold text-sm"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: partner.color,
                    }}
                  >
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function TechnologyPartnersModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" style={{ backgroundColor: "#f4f5f4" }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#0d9488" }}>
            <Handshake className="h-5 w-5" style={{ color: "white" }} />
          </div>
          <div className="flex flex-col">
            <h2 className="flex items-baseline gap-1">
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 500, color: "#0f2a2e" }}>
                OUR
              </span>
              <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0d9488" }}>
                TECHNOLOGY PARTNERS
              </span>
            </h2>
            <div className="h-0.5 w-full mt-1" style={{ backgroundColor: "#0d9488" }} />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center max-w-2xl mx-auto mb-12" style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1rem", color: "#64748b", lineHeight: "1.6" }}>
          We collaborate with leading global technology partners to deliver innovative solutions and maximum value to our clients.
        </p>

        {/* View All Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 transition hover:opacity-90"
            style={{ backgroundColor: "#0d9488", color: "white" }}
          >
            <span style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.9375rem", fontWeight: 600 }}>
              View all partners
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl border p-6 overflow-hidden"
              style={{ backgroundColor: "white", borderColor: "#e5e7eb", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "1.25rem", fontWeight: 600, color: "#0f2a2e" }}>
                  Our technology partners
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100"
                >
                  <X className="h-5 w-5" style={{ color: "#64748b" }} />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border pl-10 pr-4 py-3 outline-none focus:ring-2"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "0.9375rem",
                    color: "#0f2a2e",
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    "--tw-ring-color": "#0d9488",
                  } as React.CSSProperties}
                />
              </div>

              {/* Scrollable Grid */}
              <div className="overflow-y-auto max-h-[60vh] pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredPartners.map((partner) => (
                    <div
                      key={partner.name}
                      className="flex items-center justify-center rounded-lg border p-4 transition hover:shadow-sm"
                      style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb", minHeight: "80px" }}
                    >
                      <span
                        className="text-center font-semibold text-sm"
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: partner.color,
                        }}
                      >
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </div>
                {filteredPartners.length === 0 && (
                  <div className="text-center py-8" style={{ color: "#64748b" }}>
                    <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.9375rem" }}>
                      No partners found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
