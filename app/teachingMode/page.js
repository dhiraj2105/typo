import TeachingMode from "@/core/TeachingMode";
import Head from "next/head";

export default function page() {
  return (
    <>
      <Head>
        <title>Teaching Mode | TypeForge</title>
      </Head>
      <main className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <TeachingMode />
      </main>
    </>
  );
}
