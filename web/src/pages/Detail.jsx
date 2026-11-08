import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError, api } from "../api.js";
import { useAuth } from "../auth.jsx";
import { categoryLabels, levelLabels, typeLabels } from "../labels.js";

export function DetailPage() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [quizError, setQuizError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setAnswers([]);
    setResult(null);
    setCheckedSteps([]);
    setQuizError("");

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api(`/api/materials/${id}`, { token });
        if (cancelled) return;
        setMaterial(data.material);
        await api(`/api/materials/${id}/history`, { method: "POST", token });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) logout();
        else setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, token, logout]);

  async function toggleFavorite() {
    if (!material) return;
    const method = material.favorited ? "DELETE" : "POST";
    const data = await api(`/api/materials/${material.id}/favorite`, { method, token });
    setMaterial({ ...material, favorited: data.favorited });
  }

  async function submitQuiz(event) {
    event.preventDefault();
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

  if (loading) return <p className="status">Membuka materi...</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!material) return null;

  const paragraphs = material.body.split("\n\n").filter(Boolean);

  return (
    <article className="detail">
      <Link className="back" to="/">
        Kembali ke beranda
      </Link>
      <div className="detail-kicker">
        <span className={`pill type-${material.type}`}>{typeLabels[material.type]}</span>
        <span>{categoryLabels[material.category]}</span>
        <span>{levelLabels[material.level]}</span>
        <span>{material.durationMin} mnt</span>
      </div>
      <div className="detail-heading">
        <h1>{material.title}</h1>
        <button className={material.favorited ? "primary" : "secondary"} type="button" onClick={toggleFavorite}>
          {material.favorited ? "Tersimpan" : "Simpan favorit"}
        </button>
      </div>
      <p className="summary">{material.summary}</p>

      {material.type === "video" && material.videoUrl ? (
        <video className="player" controls src={material.videoUrl} />
      ) : null}

      <div className="prose">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {material.type === "practice" ? (
        <ul className="steps">
          {material.steps.map((step, index) => (
            <li key={step}>
              <label>
                <input
                  type="checkbox"
                  checked={checkedSteps.includes(index)}
                  onChange={() =>
                    setCheckedSteps((current) =>
                      current.includes(index) ? current.filter((item) => item !== index) : [...current, index]
                    )
                  }
                />
                <span>{step}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}

      {material.type === "quiz" ? (
        <form className="quiz" onSubmit={submitQuiz}>
          {material.questions.map((question, questionIndex) => (
            <fieldset key={question.prompt} disabled={Boolean(result)}>
              <legend>
                {questionIndex + 1}. {question.prompt}
              </legend>
              {question.options.map((option, optionIndex) => {
                const chosen = answers[questionIndex] === optionIndex;
                const correct = result?.results[questionIndex]?.answerIndex === optionIndex;
                const wrongChoice = result && chosen && !correct;
                return (
                  <label key={option} className={correct ? "option correct" : wrongChoice ? "option wrong" : "option"}>
                    <input
                      type="radio"
                      name={`q-${questionIndex}`}
                      checked={chosen}
                      onChange={() =>
                        setAnswers((current) => {
                          const next = [...current];
                          next[questionIndex] = optionIndex;
                          return next;
                        })
                      }
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </fieldset>
          ))}
          {quizError ? <p className="form-error">{quizError}</p> : null}
          {result ? (
            <p className="score">
              Skor kamu {result.score} dari {result.total}.
            </p>
          ) : (
            <button className="primary" type="submit">
              Kirim jawaban
            </button>
          )}
        </form>
      ) : null}
    </article>
  );
}
