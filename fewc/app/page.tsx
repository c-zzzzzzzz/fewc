"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

const KATAKANA = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ"];

function QuizForm() {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    KATAKANA.forEach((k) => (init[k] = ""));
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const answeredCount = useMemo(() => Object.values(answers).filter((v) => v).length, [answers]);

  const handleChoose = (kana: string, value: string) => {
    setAnswers((s) => ({ ...s, [kana]: value }));
    setResultMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage(null);

    const allAnswered = Object.values(answers).every((v) => v === "correct" || v === "incorrect");
    if (!allAnswered) {
      setResultMessage("すべての項目に回答してください。");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { answers };
      const res = await fetch("https://www.example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResultMessage("送信に成功しました。");
    } catch (err) {
      setResultMessage("送信に失敗しました。ネットワークまたはサーバーを確認してください。");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = Math.round((answeredCount / KATAKANA.length) * 100);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="w-full">
          <p className="text-sm text-zinc-500">回答済み {answeredCount}/{KATAKANA.length}</p>
          <div className="progress-track mt-3">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="sm:ml-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-md disabled:opacity-60 w-full sm:w-auto"
          >
            {submitting ? "送信中..." : "送信する"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KATAKANA.map((k) => (
          <div key={k} className="quiz-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 w-12 h-12 flex items-center justify-center text-xl font-semibold">{k}</div>
                <div>
                  <p className="text-sm font-medium">項目 {k}</p>
                  <p className="text-xs text-zinc-500">この項目は正しいですか？</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                aria-pressed={answers[k] === "correct"}
                onClick={() => handleChoose(k, "correct")}
                className={`option-btn w-full sm:w-auto ${answers[k] === "correct" ? "option-btn-checked" : "border-zinc-200 dark:border-zinc-700"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                正解
              </button>

              <button
                type="button"
                aria-pressed={answers[k] === "incorrect"}
                onClick={() => handleChoose(k, "incorrect")}
                className={`option-btn w-full sm:w-auto ${answers[k] === "incorrect" ? "option-btn-checked" : "border-zinc-200 dark:border-zinc-700"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                不正解
              </button>
            </div>
          </div>
        ))}
      </div>

      {resultMessage && <p className="mt-4 text-sm text-zinc-700">{resultMessage}</p>}
    </form>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-12 px-4">
      <main className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={72} height={20} priority />
            <div>
              <h1 className="text-2xl font-semibold">カタカナ問題（ア〜シ）</h1>
              <p className="text-sm text-zinc-500">各項目について「正解」または「不正解」を選択してください。</p>
            </div>
          </div>
        </div>

        <div className="quiz-card">
          <QuizForm />
        </div>
      </main>
    </div>
  );
}
