import TypingBox from "@/core/TypingBox";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TypeForge | Typing Test</title>
      </Head>
      <main className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <TypingBox />
      </main>
    </>
  );
}
