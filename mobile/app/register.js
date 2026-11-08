import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../src/api";
import { useAuth } from "../src/auth";
import { colors } from "../src/labels";

export default function RegisterScreen() {
  const { setSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }
    setBusy(true);
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      await setSession(data);
      router.replace("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.panel} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>SKILLLEARN</Text>
        <Text style={styles.title}>Buat akun belajar</Text>
        <Text style={styles.lead}>Registrasi diperlukan sebelum membuka materi.</Text>
        <Field label="Nama" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Kata sandi" value={password} onChangeText={setPassword} secureTextEntry />
        <Field label="Ulangi kata sandi" value={confirm} onChangeText={setConfirm} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={onSubmit} disabled={busy}>
          <Text style={styles.buttonText}>{busy ? "Mendaftarkan..." : "Daftar dan masuk"}</Text>
        </Pressable>
        <Link href="/login" style={styles.link}>
          Sudah punya akun? Masuk
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} autoCapitalize="none" {...inputProps} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  panel: { padding: 20, gap: 8 },
  eyebrow: { color: colors.forest, letterSpacing: 2, fontWeight: "700", fontSize: 12 },
  title: { fontSize: 32, fontWeight: "700", color: colors.ink },
  lead: { color: colors.muted, marginBottom: 8 },
  label: { fontWeight: "700", color: colors.ink, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.ink,
  },
  button: { backgroundColor: colors.clay, borderRadius: 999, paddingVertical: 14, marginTop: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
  error: { color: colors.danger },
  link: { color: colors.forest, fontWeight: "700", marginTop: 12 },
});
