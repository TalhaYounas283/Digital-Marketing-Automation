import React, { useState } from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface SocialAccount {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  username?: string;
  color: string;
}

export const SocialConnections: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter size={24} />,
      connected: false,
      color: "bg-sky-500",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <Linkedin size={24} />,
      connected: true,
      username: "@automarketer_inc",
      color: "bg-blue-700",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram size={24} />,
      connected: false,
      color: "bg-pink-600",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook size={24} />,
      connected: false,
      color: "bg-blue-600",
    },
  ]);

  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    // Simulate OAuth Delay
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id
            ? { ...acc, connected: true, username: "@demo_user" }
            : acc,
        ),
      );
      setConnectingId(null);
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    if (window.confirm("Are you sure you want to disconnect this account?")) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id
            ? { ...acc, connected: false, username: undefined }
            : acc,
        ),
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Social Connections
        </h2>
        <p className="text-slate-500 text-sm">
          Connect your social media accounts to enable auto-posting and
          analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${account.color} flex items-center justify-center text-white shadow-lg shadow-black/10`}
              >
                {account.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {account.name}
                </h3>
                {account.connected ? (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Connected as {account.username}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Not connected</p>
                )}
              </div>
            </div>

            {account.connected ? (
              <button
                onClick={() => handleDisconnect(account.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect(account.id)}
                disabled={connectingId === account.id}
                className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 rounded-lg transition-all disabled:opacity-50 min-w-[100px] flex justify-center"
              >
                {connectingId === account.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Connect"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
