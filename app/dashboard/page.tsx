"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Worker = {
  id: string;
  full_name: string;
  service: string;
  city: string;
  phone?: string;
  price?: number;
  available: boolean;
};

export default function DashboardPage() {
  const [userName, setUserName] = useState("Customer");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data, error: authError } =
          await supabase.auth.getUser();

        if (authError || !data.user) {
          window.location.href = "/auth";
          return;
        }

        setUserName(
          data.user.user_metadata?.full_name ||
            data.user.email ||
            "Customer"
        );

        const { data: workerData, error: workerError } =
          await supabase
            .from("workers")
            .select("id, full_name, service, city, phone, price, available")
            .eq("available", true);

        if (workerError) throw workerError;

        setWorkers((workerData || []) as Worker[]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "कामगारांची माहिती लोड झाली नाही."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      !search ||
      worker.service?.toLowerCase().includes(search.toLowerCase()) ||
      worker.full_name?.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      !city ||
      worker.city?.toLowerCase().includes(city.toLowerCase());

    return matchesSearch && matchesCity;
  });

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        color: "#172033",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: "1px solid #ddd",
          paddingBottom: 16,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 4 }}>🏠 Home Doctor</h1>
          <p style={{ margin: 0, color: "#667085" }}>
            Trusted home services near you
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "white",
          }}
        >
          Logout
        </button>
      </header>

      <section
        style={{
          background: "#eaf7ef",
          padding: 22,
          borderRadius: 14,
          marginTop: 24,
        }}
      >
        <h2>Welcome, {userName}! 👋</h2>
        <p>तुमच्या घरासाठी विश्वासार्ह कामगार शोधा.</p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>🛠️ Our Services</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {[
            ["🔧", "Plumber"],
            ["⚡", "Electrician"],
            ["🪚", "Carpenter"],
            ["🧹", "Cleaning"],
            ["🎨", "Painter"],
            ["❄️", "AC Repair"],
          ].map(([icon, service]) => (
            <button
              key={service}
              onClick={() => setSearch(service)}
              style={{
                padding: 18,
                border: "1px solid #ddd",
                borderRadius: 12,
                background: "white",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              <span style={{ fontSize: 26 }}>{icon}</span>
              <br />
              {service}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>👨‍🔧 Find Available Workers</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plumber, electrician..."
          style={{
            boxSizing: "border-box",
            width: "100%",
            padding: 14,
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 10,
          }}
        />

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city or village"
          style={{
            boxSizing: "border-box",
            width: "100%",
            padding: 14,
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 18,
          }}
        />

        {loading && <p>कामगार शोधत आहोत...</p>}

        {error && (
          <p style={{ color: "red", overflowWrap: "anywhere" }}>
            {error}
          </p>
        )}

        {!loading && !error && filteredWorkers.length === 0 && (
          <div
            style={{
              background: "#f7f8fa",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <p>सध्या जुळणारे उपलब्ध कामगार सापडले नाहीत.</p>
            <p>
              नवीन कामगार Registration झाल्यानंतर ते येथे दिसू शकतील.
            </p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {filteredWorkers.map((worker) => (
            <article
              key={worker.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <h3>{worker.full_name}</h3>
              <p>🛠️ {worker.service}</p>
              <p>📍 {worker.city}</p>
              {worker.price != null && <p>💰 ₹{worker.price}</p>}
              <p>🟢 Available</p>

              <a
                href={`/booking?worker=${encodeURIComponent(worker.id)}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#16794b",
                  color: "white",
                  padding: 12,
                  borderRadius: 8,
                  textDecoration: "none",
                  marginTop: 14,
                }}
              >
                Book Now
              </a>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>📅 My Bookings</h2>
        <p>
          तुमच्या बुकिंगची माहिती पाहण्यासाठी पुढील टप्प्यात Booking
          History जोडू.
        </p>
      </section>
    </main>
  );
}
