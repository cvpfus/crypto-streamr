"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { History } from "@prisma/client";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Decimal } from "@prisma/client/runtime/library";
import useSound from "use-sound";
import LetterPullup from "@/components/ui/letter-pullup";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface Message {
  sender: string;
  message: string;
  amount: Decimal;
  ticker: string;
}

export default function Widget({ userId }: { userId: string }) {
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  const [play] = useSound("/sound/kaching.mp3");

  useEffect(() => {
    const supabase = createClient();

    const handleNewHistory = (
      payload: RealtimePostgresChangesPayload<History>
    ) => {
      if ("message" in payload.new && payload.new.userId === userId) {
        const message = {
          sender: payload.new.sender,
          message: payload.new.message,
          amount: payload.new.amount,
          ticker: payload.new.ticker,
        };
        setMessageQueue((prevQueue) => [...prevQueue, message]);
      }
    };

    const channel = supabase
      .channel(`history-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "History",
          filter: `userId=eq.${userId}`,
        },
        handleNewHistory
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messageQueue]);

  useEffect(() => {
    if (currentMessage === null && messageQueue.length > 0) {
      setCurrentMessage(messageQueue[0]);
      play({ forceSoundEnabled: true });

      setTimeout(() => {
        setCurrentMessage(null);
        setMessageQueue((prevQueue) => prevQueue.slice(1));
      }, 5000);
    }
  }, [currentMessage, messageQueue]);

  return (
    <div>
      {currentMessage && (
        <BackgroundGradient className="w-full min-h-[300px] flex flex-col items-center rounded-[22px] bg-zinc-900 text-white text-3xl py-4 text-center">
          <LetterPullup
            className="text-xl text-white"
            words={`${currentMessage.sender} tipped ${currentMessage.amount} ${currentMessage.ticker}`}
            delay={0.02}
          />
          <div className="mt-12 px-4 pb-4">{currentMessage.message}</div>
        </BackgroundGradient>
      )}
    </div>
  );
}
