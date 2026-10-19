"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const workerId = searchParams.get("worker");

  const [service, setService] = useState("Plumber");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("300");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadWorker() {
      if (!workerId) return;

      const { data, error } = await supabase
        .from("workers")
        .select("service, price")
        .eq("id", workerId)
        .maybeSingle();

      if (!error && data) {
        if (data.service) setService(data.service);
        if (data.price != null) setAmount(String(data.price));
      }
    }

    loadWorker();
  }, [workerId]);

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        window.location.href = "/auth";
        return;
      }

      if (!workerId) {
        setMessage("कृपया Dashboard मधून आधी कामगार निवडा.");
        return;
      }

      if (new Date(date).getTime() <= Date.now()) {
        setMessage("कृपया भविष्यातील तारीख आणि वेळ निवडा.");
        return;
      }

      const serviceAmount = Number(amount);

      if (!Number.isFinite(serviceAmount) || serviceAmount < 0) {
        setMessage("कृपया योग्य किंमत टाका.");
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        customer_id: authData.user.id,
        worker_id: workerId,
        service_type: service,
        booking_date: new Date(date).toISOString(),
        address: address.trim(),
        notes: notes.trim(),
        status: "pending",
        service_amount: serviceAmount,
        commission_amount: 0,
      });

      if (error) throw error;

      setMessage("🎉 Booking request पाठवली! कामगाराच्या प्रतिसादाची वाट पाहा.");
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Booking करताना त्रुटी आली."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "30px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <a href="/dashboard">← Dashboard</a>

      <h1>📅 Book a Service</h1>
      <p>तुमच्या घरासाठी कामाची विनंती नोंदवा.</p>

      <form onSubmit={createBooking}>
        <label>
          Service Type
          <input
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          Date and Time
          <input
            required
            type="datetime-local"
            value={date}
            min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label>
          Full Address
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House number, street, village/city"
            style={{ ...inputStyle, minHeight: 90 }}
          />
        </label>

        <label>
          Work Details
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="कामाची माहिती"
            style={{ ...inputStyle, minHeight: 80 }}
          />
        </label>

        <label>
          Estimated Service Amount (₹)
          <input
            required
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            fontSize: 16,
          }}
        >
          {busy ? "Submitting..." : "Confirm Booking"}
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
