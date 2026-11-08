import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError, api } from "../src/api";
import { useAuth } from "../src/auth";
import { categories, categoryLabels, colors, levelLabels, typeColor, typeLabels } from "../src/labels";

export default function HomeScreen() {
  const { token, user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [materialData, historyData] = await Promise.all([
          api("/api/materials", { token }),
          api("/api/history", { token }),
        ]);
        if (cancelled) return;
        setMaterials(materialData.materials);
        setHistory(historyData.items);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) await logout();
        else setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const favoriteIds = new Set(materials.filter((item) => item.favorited).map((item) => item.id));
  const visible = materials.filter((material) => {
    if (favoritesOnly && !material.favorited) return false;
    if (filter !== "all" && material.category !== filter) return false;
    return `${material.title} ${material.summary}`.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>HALO, {user?.name?.split(" ")[0]?.toUpperCase()}</Text>
            <Text style={styles.title}>Pilih keterampilan yang ingin kamu latih.</Text>
          </View>
          <Pressable onPress={logout}>
            <Text style={styles.logout}>Keluar</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.search}
          placeholder="Cari judul atau ringkasan"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
        />
        {history.length > 0 ? (
          <View>
            <Text style={styles.section}>Lanjutkan belajar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
              {history.map((item) => (
                <Card
                  key={item.material.id}
                  material={{ ...item.material, favorited: favoriteIds.has(item.material.id) }}
                  compact
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[styles.chip, filter === category.id && !favoritesOnly && styles.chipOn]}
              onPress={() => {
                setFilter(category.id);
                setFavoritesOnly(false);
              }}
            >
              <Text style={[styles.chipText, filter === category.id && !favoritesOnly && styles.chipTextOn]}>
                {category.label}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.chip, favoritesOnly && styles.chipOn]}
            onPress={() => setFavoritesOnly((value) => !value)}
          >
            <Text style={[styles.chipText, favoritesOnly && styles.chipTextOn]}>Favorit</Text>
          </Pressable>
        </ScrollView>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <Text style={styles.muted}>Memuat materi...</Text> : null}
        {!loading && visible.length === 0 ? <Text style={styles.muted}>Tidak ada materi pada saringan ini.</Text> : null}
        <View style={styles.list}>
          {visible.map((material) => (
            <Card key={material.id} material={material} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ material, compact = false }) {
  return (
    <Pressable
      style={[styles.card, { borderLeftColor: typeColor(material.type) }, compact && styles.cardCompact]}
      onPress={() => router.push(`/materi/${material.id}`)}
    >
      <View style={styles.meta}>
        <Text style={[styles.pill, { color: typeColor(material.type) }]}>{typeLabels[material.type]}</Text>
        <Text style={styles.mutedSmall}>{categoryLabels[material.category]}</Text>
        {material.favorited ? <Text style={styles.saved}>Tersimpan</Text> : null}
      </View>
      <Text style={styles.cardTitle}>{material.title}</Text>
      <Text style={styles.summary} numberOfLines={3}>
        {material.summary}
      </Text>
      <Text style={styles.mutedSmall}>
        {levelLabels[material.level]} · {material.durationMin} mnt
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: colors.forest, fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  title: { fontSize: 28, lineHeight: 32, fontWeight: "700", color: colors.ink, maxWidth: 260 },
  logout: { color: colors.forest, fontWeight: "700" },
  search: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.ink,
  },
  section: { fontSize: 22, fontWeight: "700", color: colors.ink, marginBottom: 8 },
  row: { gap: 12 },
  filters: { gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.ink, fontWeight: "600" },
  chipTextOn: { color: colors.paper },
  list: { gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderLeftWidth: 6,
    padding: 14,
    gap: 8,
  },
  cardCompact: { width: 260 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  pill: { fontWeight: "700", fontSize: 12 },
  saved: { backgroundColor: "#efe2c4", borderRadius: 999, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 2, fontSize: 12 },
  cardTitle: { fontSize: 20, fontWeight: "700", color: colors.ink },
  summary: { color: colors.muted },
  muted: { color: colors.muted },
  mutedSmall: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger },
});
