"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { History } from "@prisma/client";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Decimal } from "@prisma/client/runtime/library";

interface Message {
  sender: string;
  message: string;
  amount: Decimal;
  ticker: string;
}

export default function Widget() {
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const handleNewHistory = (
      payload: RealtimePostgresChangesPayload<History>
    ) => {
      if ("message" in payload.new) {
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
      .channel("history")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "History",
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

      setTimeout(() => {
        setCurrentMessage(null);
        setMessageQueue((prevQueue) => prevQueue.slice(1));
      }, 5000);
    }
  }, [currentMessage, messageQueue]);

  return (
    <div>
      Widget
      {currentMessage && (
        <>
          <div>
            {currentMessage.sender} has tipped{" "}
            {currentMessage.amount.toString()} {currentMessage.ticker}
          </div>
          <div>{currentMessage.message}</div>
        </>
      )}
    </div>
  );
}
