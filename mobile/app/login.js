import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../src/api";
import { useAuth } from "../src/auth";
import { colors } from "../src/labels";

export default function LoginScreen() {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setError("");
    setBusy(true);
    try {
      const data = await api("/api/auth/login", { method: "POST", body: { email, password } });
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
      <View style={styles.story}>
        <Text style={styles.eyebrow}>SKILLLEARN</Text>
        <Text style={styles.storyTitle}>Belajar keterampilan yang bisa langsung dipakai.</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.title}>Masuk ke ruang belajar</Text>
        <Text style={styles.lead}>Materi terbuka setelah akunmu dikenali.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Kata sandi</Text>
        <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={onSubmit} disabled={busy}>
          <Text style={styles.buttonText}>{busy ? "Memeriksa..." : "Masuk"}</Text>
        </Pressable>
        <Link href="/register" style={styles.link}>
          Belum punya akun? Daftar
        </Link>
        <Text style={styles.demo}>Akun contoh: demo@skilllearn.id / demo1234</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  story: { backgroundColor: colors.forest, padding: 24, paddingTop: 36 },
  eyebrow: { color: "#f6f1e7", letterSpacing: 2, fontWeight: "700", fontSize: 12 },
  storyTitle: { color: "#f6f1e7", fontSize: 32, lineHeight: 36, marginTop: 10, fontWeight: "700" },
  panel: { padding: 20, gap: 8 },
  title: { fontSize: 28, fontWeight: "700", color: colors.ink },
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
  demo: { color: colors.muted, marginTop: 8 },
});
