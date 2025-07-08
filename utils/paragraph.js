export const TEACHING_PARAGRAPH =
  "Practice makes perfect, especially when building muscle memory through repetition. The quick brown fox jumps over the lazy dog. Typing speed and accuracy improve with daily practice and consistency. ";

export function getRandomParagraph() {
  const paragraphs = [
    "Typing speed and accuracy improve with daily practice and consistency.",
    "JavaScript is a versatile language used both on the frontend and backend.",
    "Practice makes perfect, especially when building muscle memory through repetition.",
    "Next.js combines the power of React with server-side rendering and routing.",
  ];
  const index = Math.floor(Math.random() * paragraphs.length);
  return paragraphs[index];
}
