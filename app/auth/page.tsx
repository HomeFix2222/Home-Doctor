"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [role, setRole] = useState<"customer" | "worker">("customer");
  const [action, setAction] = useState<"login" | "signup">("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("Plumber");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (action === "signup") {
        if (!name.trim()) {
          setMessage("Please enter your full name.");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
              role,
            },
          },
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm your account."
          );
          return;
        }

        setMessage("Account created successfully. Please complete your profile.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.href = "/";
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const normalizedPhone = phone.replace(/\s+/g, "");

      if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
        setMessage("Enter your phone number with country code, e.g. +919876543210.");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
        options: {
          shouldCreateUser: action === "signup",
          data: {
            full_name: name.trim(),
            role,
          },
        },
      });

      if (error) throw error;

      setMessage("OTP request sent. Enter the code received by SMS.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Could not send OTP."
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const normalizedPhone = phone.replace(/\s+/g, "");

      const { error } = await supabase.auth.verifyOtp({
        phone: normalizedPhone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      window.location.href = "/";
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "OTP verification failed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{
      maxWidth: 480,
      margin: "40px auto",
      padding: 24,
      fontFamily: "Arial, sans-serif"
    }}>
      <a href="/">← Home Doctor</a>
      <h1>{action === "signup" ? "Create account" : "Welcome back"}</h1>
      <p>Sign in to Home Doctor to access home services.</p>

      <div style={{ display: "flex", gap: 8, margin: "20px 0" }}>
        <button type="button" onClick={() => setRole("customer")}>
          Customer
        </button>
        <button type="button" onClick={() => setRole("worker")}>
          Worker
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button type="button" onClick={() => setMode("email")}>
          Email + Password
        </button>
        <button type="button" onClick={() => setMode("phone")}>
          Mobile OTP
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button type="button" onClick={() => setAction("signup")}>
          Sign up
        </button>
        <button type="button" onClick={() => setAction("login")}>
          Login
        </button>
      </div>

      {mode === "email" ? (
        <form onSubmit={submitEmail}>
          {action === "signup" && (
            <label style={{ display: "block", marginBottom: 12 }}>
              Full name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: 12 }}>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: "block", width: "100%", padding: 12 }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 16 }}>
            Password
            <input
              required
              type="password"
              minLength={8}
              autoComplete={action === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: "block", width: "100%", padding: 12 }}
            />
          </label>

          <button className="button" disabled={busy} type="submit">
            {busy ? "Please wait..." : action === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={sendOtp}>
            {action === "signup" && (
              <label style={{ display: "block", marginBottom: 12 }}>
                Full name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ display: "block", width: "100%", padding: 12 }}
                />
              </label>
            )}

            <label style={{ display: "block", marginBottom: 16 }}>
              Mobile number with country code
              <input
                required
                type="tel"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>

            <button className="button" disabled={busy} type="submit">
              {busy ? "Please wait..." : "Send OTP"}
            </button>
          </form>

          <form onSubmit={verifyOtp} style={{ marginTop: 20 }}>
            <label style={{ display: "block", marginBottom: 12 }}>
              SMS verification code
              <input
                required
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ display: "block", width: "100%", padding: 12 }}
              />
            </label>

            <button className="button" disabled={busy} type="submit">
              Verify OTP
            </button>
          </form>
        </>
      )}

      {role === "worker" && action === "signup" && (
        <p style={{ marginTop: 20 }}>
          Worker profiles, service areas and pricing must be completed
          separately after account creation.
        </p>
      )}

      {message && (
        <p role="status" style={{ marginTop: 20, overflowWrap: "anywhere" }}>
          {message}
        </p>
      )}
    </main>
  );
}
