'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; page: number }[];
  mode?: 'A' | 'B';
}

export function ChatDrawer() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const query = input.trim();
    if (!query || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await fetch('/api/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          mode: data.mode,
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.error || 'Something went wrong'}`,
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Network error — check your connection and try again.',
      }]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[22px] right-[22px] z-[115] bg-navy text-white border-none px-5 py-3.5 rounded-[30px] text-sm font-bold cursor-pointer flex items-center gap-2.5 shadow-[0_6px_22px_rgba(26,58,92,0.30)] hover:bg-accent hover:-translate-y-px transition-all min-h-[50px]"
      >
        <span className="text-[18px]">{open ? '✕' : '💬'}</span>
        <span>{open ? 'Close' : 'Ask Upstream'}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-[84px] right-[22px] z-[110] w-[380px] max-w-[calc(100vw-44px)] h-[520px] max-h-[calc(100vh-120px)] bg-surface border border-border rounded-xl shadow-[0_12px_40px_rgba(26,58,92,0.20)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-gradient-to-b from-[#fafbfc] to-white shrink-0">
            <div className="text-sm font-bold text-navy">Ask <em className="font-serif italic text-accent">Upstream</em></div>
            <div className="text-[10px] text-text-dim mt-0.5">AI assistant · trained on your facility documents</div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-xs text-text-mid">Ask anything about your facility, permits, or compliance.</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? '' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-bg text-text-primary border border-border'
                    : 'bg-gradient-to-br from-accent to-water text-navy-dark'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 px-2.5 py-2 bg-bg border-l-[3px] border-accent rounded text-[10px] text-text-mid leading-relaxed">
                      <div className="text-[9px] font-bold text-accent uppercase tracking-[0.7px] mb-1">Sources</div>
                      {msg.sources.map((s, j) => (
                        <div key={j}>• {s.title}, p.{s.page}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-water flex items-center justify-center text-[11px] font-bold text-navy-dark shrink-0">AI</div>
                <div className="text-xs text-text-dim animate-pulse">Thinking...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-border shrink-0">
            <div className="flex items-center gap-2 bg-bg border border-border rounded-lg px-2.5 py-1.5 focus-within:border-accent">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 border-none bg-transparent text-xs text-text-primary outline-none py-1"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-7 h-7 rounded-md bg-navy text-white border-none cursor-pointer text-xs hover:bg-accent disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
