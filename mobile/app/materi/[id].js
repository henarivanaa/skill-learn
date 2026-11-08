import { useVideoPlayer, VideoView } from "expo-video";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError, api } from "../../src/api";
import { useAuth } from "../../src/auth";
import { categoryLabels, colors, levelLabels, typeColor, typeLabels } from "../../src/labels";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const materialId = Array.isArray(id) ? id[0] : id;
  const { token, logout } = useAuth();
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [quizError, setQuizError] = useState("");

  useEffect(() => {
    if (!token || !materialId) return undefined;
    let cancelled = false;
    setAnswers([]);
    setResult(null);
    setCheckedSteps([]);
    setQuizError("");

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api(`/api/materials/${materialId}`, { token });
        if (cancelled) return;
        setMaterial(data.material);
        await api(`/api/materials/${materialId}/history`, { method: "POST", token });
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
  }, [materialId, token, logout]);

  async function toggleFavorite() {
    if (!material) return;
    const method = material.favorited ? "DELETE" : "POST";
    const data = await api(`/api/materials/${material.id}/favorite`, { method, token });
    setMaterial({ ...material, favorited: data.favorited });
  }

  async function submitQuiz() {
    setQuizError("");
    const complete = material.questions.every((_, index) => Number.isInteger(answers[index]));
    if (!complete) {
      setQuizError("Jawab semua soal terlebih dahulu.");
      return;
    }
    try {
      const data = await api(`/api/materials/${material.id}/quiz`, {
        method: "POST",
        token,
        body: { answers },
      });
      setResult(data);
    } catch (err) {
      setQuizError(err.message);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.muted}>Membuka materi...</Text>
      </SafeAreaView>
    );
  }
  if (error || !material) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.error}>{error || "Materi tidak ditemukan."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>Kembali ke beranda</Text>
        </Pressable>
        <View style={styles.meta}>
          <Text style={[styles.pill, { color: typeColor(material.type) }]}>{typeLabels[material.type]}</Text>
          <Text style={styles.muted}>{categoryLabels[material.category]}</Text>
          <Text style={styles.muted}>{levelLabels[material.level]}</Text>
          <Text style={styles.muted}>{material.durationMin} mnt</Text>
        </View>
        <Text style={styles.title}>{material.title}</Text>
        <Pressable style={[styles.button, !material.favorited && styles.buttonGhost]} onPress={toggleFavorite}>
          <Text style={[styles.buttonText, !material.favorited && styles.buttonGhostText]}>
            {material.favorited ? "Tersimpan" : "Simpan favorit"}
          </Text>
        </Pressable>
        <Text style={styles.summary}>{material.summary}</Text>
        {material.type === "video" && material.videoUrl ? <LessonVideo uri={material.videoUrl} /> : null}
        {material.body.split("\n\n").filter(Boolean).map((paragraph) => (
          <Text key={paragraph} style={styles.body}>
            {paragraph}
          </Text>
        ))}
        {material.type === "practice"
          ? material.steps.map((step, index) => {
              const checked = checkedSteps.includes(index);
              return (
                <Pressable
                  key={step}
                  style={styles.choice}
                  onPress={() =>
                    setCheckedSteps((current) =>
                      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
                    )
                  }
                >
                  <Text style={styles.check}>{checked ? "✓" : "○"}</Text>
                  <Text style={styles.choiceText}>{step}</Text>
                </Pressable>
              );
            })
          : null}
        {material.type === "quiz"
          ? material.questions.map((question, questionIndex) => (
              <View key={question.prompt} style={styles.question}>
                <Text style={styles.prompt}>
                  {questionIndex + 1}. {question.prompt}
                </Text>
                {question.options.map((option, optionIndex) => {
                  const chosen = answers[questionIndex] === optionIndex;
                  const correct = result?.results[questionIndex]?.answerIndex === optionIndex;
                  const wrong = result && chosen && !correct;
                  return (
                    <Pressable
                      key={option}
                      style={[styles.choice, correct && styles.correct, wrong && styles.wrong]}
                      disabled={Boolean(result)}
                      onPress={() =>
                        setAnswers((current) => {
                          const next = [...current];
                          next[questionIndex] = optionIndex;
                          return next;
                        })
                      }
                    >
                      <Text style={styles.check}>{chosen ? "●" : "○"}</Text>
                      <Text style={styles.choiceText}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))
          : null}
        {quizError ? <Text style={styles.error}>{quizError}</Text> : null}
        {material.type === "quiz" && !result ? (
          <Pressable style={styles.button} onPress={submitQuiz}>
            <Text style={styles.buttonText}>Kirim jawaban</Text>
          </Pressable>
        ) : null}
        {result ? (
          <Text style={styles.score}>
            Skor kamu {result.score} dari {result.total}.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonVideo({ uri }) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = false;
  });
  return <VideoView player={player} nativeControls contentFit="contain" style={styles.player} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  back: { color: colors.forest, fontWeight: "700" },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { fontWeight: "700" },
  title: { fontSize: 32, lineHeight: 36, fontWeight: "700", color: colors.ink },
  summary: { fontSize: 16, color: colors.ink },
  body: { lineHeight: 22, color: colors.ink },
  muted: { color: colors.muted },
  player: { width: "100%", height: 220, backgroundColor: "black", borderRadius: 16 },
  button: { backgroundColor: colors.clay, borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
  buttonGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.forest },
  buttonGhostText: { color: colors.forest },
  choice: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 12,
  },
  choiceText: { flex: 1, color: colors.ink },
  check: { color: colors.forest, fontWeight: "700" },
  question: { gap: 8 },
  prompt: { fontWeight: "700", color: colors.ink },
  correct: { backgroundColor: colors.okBg, borderColor: colors.forest },
  wrong: { backgroundColor: colors.badBg, borderColor: colors.danger },
  error: { color: colors.danger, padding: 16 },
  score: { fontWeight: "700", color: colors.ink },
});
