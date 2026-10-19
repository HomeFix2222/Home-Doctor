"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function WorkerRegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Plumber");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function registerWorker(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data, error: authError } =
        await supabase.auth.getUser();

      if (authError || !data.user) {
        window.location.href = "/auth";
        return;
      }

      const { error } = await supabase.from("workers").upsert(
        {
          id: data.user.id,
          full_name: name.trim(),
          phone: phone.trim(),
          service,
          city: city.trim(),
          price: price ? Number(price) : null,
          available: true,
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      setMessage(
        "Registration successful! तुमची माहिती सेव्ह झाली आहे."
      );
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Registration करताना त्रुटी आली."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "30px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a href="/dashboard">← Back to Dashboard</a>

      <h1>👨‍🔧 Worker Registration</h1>
      <p>तुमची माहिती भरून Home Doctor वर कामगार म्हणून नोंदणी करा.</p>

      <form onSubmit={registerWorker}>
        <label>
          Full Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="तुमचे पूर्ण नाव"
            style={inputStyle}
          />
        </label>

        <label>
          Mobile Number
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10 digit mobile number"
            pattern="[0-9+\-\s]{10,16}"
            style={inputStyle}
          />
        </label>

        <label>
          Service
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={inputStyle}
          >
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Carpenter</option>
            <option>Cleaning</option>
            <option>Painter</option>
            <option>AC Repair</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Village / City
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="उदा. Pathari"
            style={inputStyle}
          />
        </label>

        <label>
          Starting Price (₹)
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="उदा. 300"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            padding: 14,
            background: "#16794b",
            color: "white",
            border: 0,
            borderRadius: 8,
            marginTop: 16,
            fontSize: 16,
          }}
        >
          {busy ? "Saving..." : "Register as Worker"}
        </button>
      </form>

      {message && (
        <p role="status" style={{ marginTop: 20, overflowWrap: "anywhere" }}>
          {message}
        </p>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  padding: 12,
  marginTop: 6,
  marginBottom: 16,
  border: "1px solid #ccc",
  borderRadius: 8,
};
