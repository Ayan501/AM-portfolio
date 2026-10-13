import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { answerPortfolioQuestion } from "../services/portfolioAssistant";
import type { ChatTurn } from "../types";

const suggestions = [
  "Who is Ayan Mansoori?",
  "Explain the TraderIQ project.",
  "What are his technical skills?",
  "How can I contact him?",
];

export function AskAyanAI() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [retryMessage, setRetryMessage] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const messageList = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messageList.current?.scrollTo({ top: messageList.current.scrollHeight, behavior: "smooth" });
  }, [turns, sending, open]);

  useEffect(() => {
    if (open) {
      input.current?.focus();
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") closeChat();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [open]);

  function closeChat() {
    setOpen(false);
    launcher.current?.focus();
  }

  async function submitMessage(message: string, retry = false) {
    const cleanMessage = message.trim();
    if (!cleanMessage || sending) return;
    const recentTurns = turns.slice(-8);
    const lastTurn = recentTurns[recentTurns.length - 1];
    if (retry && lastTurn?.role === "user" && lastTurn.content === cleanMessage) {
      recentTurns.pop();
    }
    const previous = recentTurns;
    if (!retry) setTurns((current) => [...current, { role: "user", content: cleanMessage }]);
    setDraft("");
    setSending(true);
    setError("");
    setRetryMessage(cleanMessage);
    try {
      const response = await answerPortfolioQuestion(cleanMessage, previous);
      setTurns((current) => [...current, { role: "assistant", content: response.answer, links: response.links }]);
      setRetryMessage("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The assistant could not respond.");
    } finally {
      setSending(false);
      input.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(draft);
  }

  return (
    <div className="assistant-widget">
      <button
        ref={launcher}
        className="assistant-launcher"
        type="button"
        aria-label={open ? "Close Ask Ayan" : "Open Ask Ayan"}
        aria-expanded={open}
        onClick={() => open ? closeChat() : setOpen(true)}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && <span>Ask Ayan</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.section
            className="assistant-panel"
            role="dialog"
            aria-label="Ask Ayan portfolio assistant"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          >
            <header className="assistant-header">
              <div className="assistant-avatar"><Bot size={18} /></div>
              <div><strong>Ask Ayan</strong><span>Free portfolio guide · no API required</span></div>
              <button type="button" aria-label="Reset conversation" disabled={sending} onClick={() => { setTurns([]); setError(""); setRetryMessage(""); }}><RotateCcw size={16} /></button>
              <button type="button" aria-label="Close chat" onClick={closeChat}><X size={18} /></button>
            </header>
            <div className="assistant-messages" ref={messageList} aria-live="polite">
              {turns.length === 0 && (
                <div className="assistant-welcome">
                  <div className="assistant-avatar"><Bot size={18} /></div>
                  <p>Hello! I can answer from the information on this portfolio—no API key needed.</p>
                  <div className="suggestion-list">
                    {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void submitMessage(suggestion)}>{suggestion}</button>)}
                  </div>
                </div>
              )}
              {turns.map((turn, index) => (
                <div className={`chat-bubble ${turn.role}`} key={`${turn.role}-${index}`}>
                  {turn.content}
                  {turn.links?.filter((link) => link.href.startsWith("/#")).map((link) => (
                    <a className="chat-section-link" href={link.href} key={link.href} onClick={closeChat}>{link.label} ↗</a>
                  ))}
                </div>
              ))}
              {sending && <div className="chat-bubble assistant typing" aria-label="Assistant is typing"><i /><i /><i /></div>}
              {error && (
                <div className="chat-error" role="alert">
                  <p>{error}</p>
                  <button type="button" onClick={() => void submitMessage(retryMessage, true)}>Retry</button>
                </div>
              )}
            </div>
            <form className="assistant-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="assistant-question">Ask a question</label>
              <input
                id="assistant-question"
                ref={input}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask a question…"
                maxLength={1000}
                disabled={sending}
              />
              <button type="submit" aria-label="Send message" disabled={sending || !draft.trim()}><Send size={17} /></button>
            </form>
            <p className="assistant-disclaimer">Answers are based on the information available on this portfolio.</p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}