export const CATALOG = [
  {
    id: 1,
    name: "Stylo a bille Bleu - BIC",
    price: 1.5,
    cat: "Supplies",
    img: "",
    status: "active",
    reference: "BIC-001",
    stock: 12,
    description:
      "The iconic BIC Cristal pen is the world's best-selling ballpoint pen. Its clear barrel lets you see the ink level, and its 1.0mm point delivers a smooth writing experience. Perfect for students and professionals.",
  },
  {
    id: 2,
    name: "Stylo a bille Rouge - BIC",
    price: 1.5,
    cat: "Supplies",
    img: "",
    status: "active",
    reference: "BIC-002",
    stock: 11,
    description:
      "A reliable red BIC Cristal pen designed for daily note-taking, corrections, and classroom work.",
  },
  {
    id: 3,
    name: "Stylo a bille Vert - BIC",
    price: 1.5,
    cat: "Supplies",
    img: "",
    status: "active",
    reference: "BIC-003",
    stock: 10,
    description:
      "A practical green BIC Cristal pen ideal for organizing homework and school notes with a clean look.",
  },
  {
    id: 4,
    name: "Stylo a bille Noir - BIC",
    price: 1.5,
    cat: "Supplies",
    img: "",
    status: "active",
    reference: "BIC-004",
    stock: 9,
    description:
      "A classic black BIC Cristal pen for everyday writing, exams, and office tasks.",
  },
  {
    id: 5,
    name: "Mathematics Grade 6",
    price: 120,
    cat: "Textbooks",
    img: "",
    status: "active",
    reference: "TXT-006",
    stock: 6,
    description: "A grade 6 mathematics textbook covering essential lessons and exercises.",
  },
  {
    id: 6,
    name: "Chemistry Starter Kit",
    price: 350,
    cat: "Supplies",
    img: "",
    status: "inactive",
    reference: "KIT-201",
    stock: 0,
    description: "A special-order chemistry kit for school experiments and lab preparation.",
  },
];

export function formatDh(amount) {
  return `${Number(amount || 0).toFixed(2)} DH`;
}
