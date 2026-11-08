export const colors = {
  paper: "#f3efe6",
  paperDeep: "#e7e0d4",
  card: "#fffdf8",
  ink: "#1f1a17",
  muted: "#6d645c",
  line: "#ddd4c6",
  forest: "#145c45",
  forestDeep: "#0e3f30",
  clay: "#b85c38",
  article: "#145c45",
  video: "#1d4e89",
  quiz: "#8a4b08",
  practice: "#8c2f39",
  danger: "#8c2f39",
  okBg: "#e7f4ee",
  badBg: "#fdecea",
};

export const typeLabels = {
  article: "Artikel",
  video: "Video",
  quiz: "Kuis",
  practice: "Latihan",
};

export const categoryLabels = {
  programming: "Pemrograman",
  design: "Desain Grafis",
  marketing: "Digital Marketing",
  technology: "Teknologi",
};

export const levelLabels = {
  pemula: "Pemula",
  menengah: "Menengah",
};

export const categories = [
  { id: "all", label: "Semua" },
  { id: "programming", label: "Pemrograman" },
  { id: "design", label: "Desain Grafis" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "technology", label: "Teknologi" },
];

export function typeColor(type) {
  return colors[type] || colors.article;
}
