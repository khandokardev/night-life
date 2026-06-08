import { useListChats, getListChatsQueryKey, useReplyToUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, User } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

export default function Chat() {
  const { data: messages, isLoading } = useListChats({ query: { queryKey: getListChatsQueryKey() } });
  const replyMutation = useReplyToUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useMemo(() => {
    if (!messages) return {};
    const grouped: Record<number, any[]> = {};
    for (const m of messages) {
      if (!grouped[m.userId]) grouped[m.userId] = [];
      grouped[m.userId].push(m);
    }
    return grouped;
  }, [messages]);

  const userIds = Object.keys(conversations).map(Number);
  const selectedMessages = selectedUser ? conversations[selectedUser] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

  const handleReply = () => {
    if (!selectedUser || !reply.trim()) return;
    replyMutation.mutate({ userId: selectedUser, data: { body: reply } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListChatsQueryKey() });
        setReply("");
      },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const getLastMessage = (userId: number) => {
    const msgs = conversations[userId] || [];
    return msgs[msgs.length - 1];
  };

  const getUnread = (userId: number) => {
    return conversations[userId]?.filter(m => m.sender !== "admin").length || 0;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Support Chat</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : userIds.length === 0 ? (
        <div className="border border-border rounded-md bg-card p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">No chat messages yet.</p>
          <p className="text-xs text-muted-foreground mt-1">When users send messages, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
          <div className="border border-border rounded-md bg-card overflow-y-auto">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs text-muted-foreground font-medium">CONVERSATIONS ({userIds.length})</p>
            </div>
            {userIds.map(uid => {
              const last = getLastMessage(uid);
              const unread = getUnread(uid);
              return (
                <button key={uid} type="button"
                  onClick={() => setSelectedUser(uid)}
                  className={`w-full text-left px-3 py-3 border-b border-border hover:bg-muted/50 transition-colors ${selectedUser === uid ? "bg-muted/70" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">User #{uid}</span>
                    </div>
                    {unread > 0 && <Badge className="bg-primary text-primary-foreground text-xs h-4 px-1.5">{unread}</Badge>}
                  </div>
                  {last && (
                    <p className="text-xs text-muted-foreground truncate pl-9">
                      {last.sender === "admin" ? "You: " : ""}{last.body}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="col-span-2 border border-border rounded-md bg-card flex flex-col">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">User #{selectedUser}</p>
                    <p className="text-xs text-muted-foreground">{selectedMessages.length} messages</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender === "admin"
                          ? "bg-primary text-primary-foreground ml-8"
                          : "bg-muted text-foreground mr-8"
                      }`}>
                        <p>{msg.body}</p>
                        {msg.createdAt && (
                          <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleReply()}
                    placeholder="Type a reply..."
                    className="bg-background"
                  />
                  <Button onClick={handleReply} disabled={replyMutation.isPending || !reply.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
