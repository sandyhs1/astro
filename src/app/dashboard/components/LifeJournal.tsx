"use client";

import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Mic, Square, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { PAL } from "./destiny-theme";

export default function LifeJournal({ activeProfileId }: { activeProfileId: string }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchEntries();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeProfileId]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`/api/journal?profileId=${activeProfileId}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(60);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { stopRecording(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setError("Microphone access is required to record voice journals.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true); setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "journal.webm");
      formData.append("profileId", activeProfileId);
      const res = await fetch("/api/journal", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process audio");
      }
      await fetchEntries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const chartData = entries.map(e => ({
    date: format(new Date(e.created_at), "MMM d"),
    sentiment: e.sentiment_score,
    label: e.sentiment,
    text: e.transcription,
    fullDate: new Date(e.created_at).getTime(),
  })).sort((a, b) => a.fullDate - b.fullDate);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="rounded-sm p-3 max-w-xs shadow-xl"
          style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: "#E1CE9B" }}>
            {data.date}
          </p>
          <p className="serif-display text-[13px] font-semibold mb-1.5">
            Sentiment ·{" "}
            <span
              style={{
                color:
                  data.label === "positive" ? "#A7F3D0" :
                  data.label === "negative" ? "#FCA5A5" : PAL.paper2,
              }}
            >
              {data.label}
            </span>
          </p>
          <p className="serif-text italic text-[12px] leading-snug line-clamp-3" style={{ color: PAL.paper2 }}>
            "{data.text}"
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>✎</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Life journal
            </p>
            <h2 className="serif-display text-[18px] md:text-[22px] font-semibold leading-none tracking-tight mt-0.5" style={{ color: PAL.ink }}>
              Behavioural intelligence
            </h2>
            <p className="serif-text italic text-[11.5px] mt-1" style={{ color: PAL.ink3 }}>
              Sentiment · intent · Dasha correlation
            </p>
          </div>
        </div>
      </div>

      <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scroll-light">
        <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7 space-y-7">

          {/* Intro */}
          <section className="rounded-sm p-5 md:p-7"
            style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              How it works
            </p>
            <h3 className="serif-display text-[20px] md:text-[24px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
              Speak. We measure your emotion, intent, and karmic moment.
            </h3>
            <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-3xl" style={{ color: PAL.ink2 }}>
              Every time you speak into this journal, two precision AI systems analyse your audio in parallel. The first measures your <strong style={{ color: PAL.ink }}>emotional state</strong> — scoring sentiment from highly negative to highly positive. The second identifies your <strong style={{ color: PAL.ink }}>behavioural intent</strong> — the underlying psychological driver behind what you are saying.
            </p>
            <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-3xl" style={{ color: PAL.ink2 }}>
              Both signals are cross-referenced against your active <strong style={{ color: PAL.ink }}>Vimshottari Dasha</strong> period and live planetary positions. The output is not a general reading — it's a precise, data-driven correlation between your psychological state right now and the astrological period you are in.
            </p>

            <div className="rounded-sm p-4 mt-5"
              style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.accent }}>
                For the most accurate reading
              </p>
              <ul className="space-y-2 serif-text text-[13.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                <li className="flex gap-2"><span style={{ color: PAL.accent }}>◆</span><span>Tap the microphone and speak naturally for up to 60 seconds.</span></li>
                <li className="flex gap-2"><span style={{ color: PAL.accent }}>◆</span><span>Be direct and specific — vague expressions produce weaker analysis than concrete statements.</span></li>
                <li className="flex gap-2"><span style={{ color: PAL.accent }}>◆</span><span><em style={{ color: PAL.ink, fontStyle: "italic" }}>Example.</em> "I feel stuck in my career. Nothing I try seems to work and I don't know why."</span></li>
                <li className="flex gap-2"><span style={{ color: PAL.accent }}>◆</span><span><em style={{ color: PAL.ink, fontStyle: "italic" }}>Example.</em> "I got a major opportunity today but I'm terrified to take it. Something feels off."</span></li>
              </ul>
            </div>
          </section>

          {/* Chart */}
          {entries.length > 0 ? (
            <section className="rounded-sm p-5 md:p-7"
              style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: "#E1CE9B" }}>
                ◐ Emotional timeline
              </p>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="qkSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E1CE9B" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#E1CE9B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke={PAL.paper2} fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis
                      domain={[-1, 1]}
                      stroke={PAL.paper2}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      ticks={[-1, 0, 1]}
                      tickFormatter={(val) => val === 1 ? "Positive" : val === -1 ? "Negative" : "Neutral"}
                      width={62}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.30)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.20)" strokeDasharray="3 3" />
                    <Area
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#E1CE9B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#qkSentiment)"
                      activeDot={{ r: 5, fill: PAL.paper, stroke: "#E1CE9B", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          ) : (
            <section className="rounded-sm p-7 text-center"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              <p className="serif-display italic text-[20px] md:text-[24px]" style={{ color: PAL.ink2 }}>
                Your emotional canvas is empty.
              </p>
              <p className="serif-text text-[13.5px] mt-1.5 max-w-md mx-auto" style={{ color: PAL.ink3 }}>
                Start recording your daily thoughts to see how your mood correlates with astrological transits over time.
              </p>
            </section>
          )}

          {/* Recording */}
          <section className="flex flex-col items-center justify-center py-4 md:py-6">
            <div className="relative">
              {isRecording && (
                <>
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: PAL.rose }}
                  />
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-[0.18em] tabular-nums whitespace-nowrap"
                    style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
                  >
                    {timeLeft}s remaining
                  </div>
                </>
              )}

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className="relative z-10 w-20 h-20 grid place-items-center rounded-full transition-all"
                style={
                  isProcessing
                    ? { background: PAL.paper2, color: PAL.ink3, border: `1px solid ${PAL.border}`, cursor: "not-allowed" }
                    : isRecording
                    ? { background: PAL.rose, color: PAL.paper, border: `1px solid ${PAL.rose}`, boxShadow: "0 8px 20px -6px rgba(156,42,63,0.40)" }
                    : { background: PAL.accent, color: PAL.paper, border: `1px solid ${PAL.accent}`, boxShadow: "0 8px 20px -6px rgba(123,10,31,0.40)" }
                }
              >
                {isProcessing ? <Loader2 size={28} className="animate-spin" /> :
                 isRecording ? <Square size={22} fill="currentColor" /> : <Mic size={32} />}
              </button>
            </div>

            <p className="serif-text italic text-[13px] mt-5 h-4" style={{ color: PAL.ink2 }}>
              {isProcessing
                ? "Analysing sentiment & planetary transits…"
                : isRecording
                ? "Listening to your thoughts…"
                : "Tap to record your journal"}
            </p>
            {error && (
              <p className="serif-text text-[12.5px] mt-2 px-3 py-1.5 rounded-sm"
                style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
              >
                {error}
              </p>
            )}
          </section>

          {/* History */}
          {entries.length > 0 && (
            <section>
              <div className="pb-3 mb-4" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                  Recent entries
                </p>
              </div>

              <div className="space-y-3.5">
                {entries.slice().reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-sm p-4 md:p-5 transition-colors"
                    style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
                  >
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
                        {format(new Date(entry.created_at), "MMM d, yyyy · h:mm a")}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                          style={
                            entry.sentiment === "positive"
                              ? { color: PAL.sage, background: PAL.sageBg, border: `1px solid #C7D6BB` }
                              : entry.sentiment === "negative"
                              ? { color: PAL.rose, background: PAL.roseBg, border: `1px solid #E5BFC1` }
                              : { color: PAL.ink2, background: PAL.paper2, border: `1px solid ${PAL.border2}` }
                          }
                        >
                          {entry.sentiment}
                        </span>
                        {Array.isArray(entry.intents) && entry.intents.length > 0 && entry.intents.map((intent: string) => (
                          <span
                            key={intent}
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm capitalize"
                            style={{ color: "#5A3A8F", background: "#ECE6F4", border: `1px solid #D2C4E5` }}
                          >
                            {intent}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="serif-display italic text-[15px] md:text-[16px] leading-relaxed mb-4" style={{ color: PAL.ink }}>
                      "{entry.transcription}"
                    </p>

                    {/* AI Feedback */}
                    {entry.ai_feedback && (
                      <div
                        className="rounded-sm p-4 space-y-3"
                        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                      >
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.accent }}>
                            ✦ Cosmic insight
                          </p>
                          <p className="serif-text text-[13.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                            {entry.ai_feedback.cosmic_insight}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.sage }}>
                            ✓ Action plan
                          </p>
                          <p className="serif-text text-[13.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                            {entry.ai_feedback.action_plan}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Transit signature */}
                    {entry.gochar_snapshot && entry.gochar_snapshot.planets && (
                      <div className="rounded-sm p-3 mt-3 flex items-start gap-3"
                        style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
                      >
                        <span className="serif-display text-[16px] flex-shrink-0" style={{ color: PAL.gold }}>◯</span>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold }}>
                            Transit signature
                          </p>
                          <p className="serif-text text-[12.5px] mt-0.5" style={{ color: PAL.ink2 }}>
                            Saturn in <strong style={{ color: PAL.ink }}>{entry.gochar_snapshot.planets.find((p: any) => p.name === "Saturn")?.sign || "Unknown"}</strong>
                            {entry.dasha_snapshot?.mahadasha && (
                              <> · Dasha · <strong style={{ color: PAL.ink }}>{entry.dasha_snapshot.mahadasha}</strong></>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
