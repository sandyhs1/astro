"use client";

import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Mic, Square, Loader2, Sparkles, Activity } from "lucide-react";
import { format } from "date-fns";

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

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

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
          if (prev <= 1) {
             stopRecording();
             return 0;
          }
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
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "journal.webm");
      formData.append("profileId", activeProfileId);

      const res = await fetch("/api/journal", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process audio");
      }

      await fetchEntries(); // Refresh list after saving
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Prepare data for the chart
  const chartData = entries.map(e => ({
    date: format(new Date(e.created_at), "MMM d"),
    sentiment: e.sentiment_score,
    label: e.sentiment,
    text: e.transcription,
    fullDate: new Date(e.created_at).getTime()
  })).sort((a, b) => a.fullDate - b.fullDate);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-white max-w-xs">
          <p className="text-xs font-bold text-slate-400 mb-1">{data.date}</p>
          <p className="text-sm font-semibold capitalize mb-2 flex items-center gap-2">
            Sentiment: <span className={data.label === "positive" ? "text-green-400" : data.label === "negative" ? "text-red-400" : "text-slate-300"}>{data.label}</span>
          </p>
          <p className="text-xs text-slate-300 italic line-clamp-3">"{data.text}"</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-white md:rounded-2xl shadow-sm border-x md:border border-slate-200 overflow-hidden relative">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <Activity className="text-indigo-600" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Life Journal</h1>
            <p className="text-xs text-slate-500 font-medium">Record your thoughts. See how the cosmos affects your mood.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Adorable Intro Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} className="text-indigo-600" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">✨</span> The Cosmic Mirror
            </h2>
            <p className="text-sm text-indigo-800/80 leading-relaxed mb-4 max-w-2xl">
              Your voice carries the invisible frequency of your soul. Speak your truth, vent your frustrations, or share your joy. Our advanced <strong>sentiment analysis engine</strong> listens to the micro-vibrations in your tone and cross-references them against live astrological transits to reveal <em>why</em> you feel the way you do.
            </p>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-50/50">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">How to use it:</h3>
              <ul className="text-xs text-indigo-800/70 space-y-2 list-disc list-inside font-medium">
                <li>Tap the microphone and speak naturally. Limit: 60 seconds.</li>
                <li><strong>Example 1:</strong> "I feel incredibly anxious today and I don't know why..."</li>
                <li><strong>Example 2:</strong> "I had a massive breakthrough at work! Everything is clicking."</li>
                <li>Submit to receive a personalized Cosmic Insight and Action Plan.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Graph Section */}
        {entries.length > 0 ? (
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
            {/* Background glow effects for premium look */}
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
              <Activity size={14} /> Emotional Timeline
            </h3>
            
            <div className="h-56 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis 
                    domain={[-1, 1]} 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    ticks={[-1, 0, 1]} 
                    tickFormatter={(val) => val === 1 ? 'Positive' : val === -1 ? 'Negative' : 'Neutral'} 
                    width={55}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#818cf8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSentiment)"
                    activeDot={{ r: 6, fill: "#c7d2fe", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
            <Activity className="text-indigo-300 mx-auto mb-2" size={32} />
            <h3 className="text-sm font-bold text-indigo-900 mb-1">Your Emotional Canvas is Empty</h3>
            <p className="text-xs text-indigo-700/70 max-w-sm mx-auto">
              Start recording your daily thoughts to see how your mood correlates with astrological transits over time.
            </p>
          </div>
        )}

        {/* Recording Section */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            {isRecording && (
              <>
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute -inset-4 border border-red-200 rounded-full animate-pulse"></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {timeLeft}s remaining
                </div>
              </>
            )}
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isProcessing ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                isRecording ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30" : 
                "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
              }`}
            >
              {isProcessing ? (
                <Loader2 size={28} className="animate-spin" />
              ) : isRecording ? (
                <Square size={24} fill="currentColor" />
              ) : (
                <Mic size={32} />
              )}
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-6 h-4">
            {isProcessing ? "Analyzing sentiment & planetary transits..." : isRecording ? "Listening to your thoughts..." : "Tap to record your journal"}
          </p>
          {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
        </div>

        {/* History List */}
        {entries.length > 0 && (
          <div>
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Recent Entries</h3>
             <div className="space-y-4">
               {entries.slice().reverse().map((entry) => (
                 <div key={entry.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 transition-all hover:shadow-sm">
                   <div className="flex items-center justify-between mb-3">
                     <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                       {format(new Date(entry.created_at), "MMM d, yyyy • h:mm a")}
                     </span>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        entry.sentiment === "positive" ? "bg-green-100 text-green-700" :
                        entry.sentiment === "negative" ? "bg-red-100 text-red-700" :
                        "bg-slate-200 text-slate-700"
                     }`}>
                       {entry.sentiment}
                     </span>
                   </div>
                   <p className="text-sm text-slate-700 italic mb-4">"{entry.transcription}"</p>
                   
                   {/* AI Feedback & Astro Context */}
                   <div className="mt-4 space-y-3">
                     {entry.ai_feedback && (
                       <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                         <h4 className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                           <Sparkles size={12} className="text-indigo-500" />
                           Cosmic Insight
                         </h4>
                         <p className="text-xs text-indigo-800 leading-relaxed font-medium mb-3">
                           {entry.ai_feedback.cosmic_insight}
                         </p>
                         <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                           <Activity size={12} className="text-emerald-600" />
                           Action Plan
                         </h4>
                         <p className="text-xs text-emerald-700 leading-relaxed">
                           {entry.ai_feedback.action_plan}
                         </p>
                       </div>
                     )}

                     {entry.gochar_snapshot && entry.gochar_snapshot.planets && (
                       <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                           <span className="text-xs">🪐</span>
                         </div>
                         <div>
                           <p className="text-[11px] font-bold text-slate-800 leading-tight">Transit Signature</p>
                           <p className="text-[11px] text-slate-500 mt-0.5">
                             Saturn in <span className="font-semibold text-slate-700">{entry.gochar_snapshot.planets.find((p: any) => p.name === 'Saturn')?.sign || 'Unknown'}</span>. 
                             Dasha: <span className="font-semibold text-slate-700">{entry.dasha_snapshot?.mahadasha}</span>
                           </p>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
