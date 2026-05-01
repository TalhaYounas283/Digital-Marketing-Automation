import React, { useEffect, useState } from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  socialAccountsApi,
  SocialAccountDto,
  SocialPlatform,
} from "@/services/socialAccountsApi";
import { useToast } from "@/contexts/ToastContext";

interface SocialAccountView {
  id: SocialPlatform;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  username?: string;
  color: string;
}

const PLATFORM_META: Record<
  SocialPlatform,
  { name: string; icon: React.ReactNode; color: string }
> = {
  twitter: { name: "Twitter", icon: <Twitter size={24} />, color: "bg-sky-500" },
  linkedin: {
    name: "LinkedIn",
    icon: <Linkedin size={24} />,
    color: "bg-blue-700",
  },
  instagram: {
    name: "Instagram",
    icon: <Instagram size={24} />,
    color: "bg-pink-600",
  },
  facebook: {
    name: "Facebook",
    icon: <Facebook size={24} />,
    color: "bg-blue-600",
  },
};

const dtoToView = (dto: SocialAccountDto): SocialAccountView => ({
  id: dto.platform,
  name: PLATFORM_META[dto.platform].name,
  icon: PLATFORM_META[dto.platform].icon,
  color: PLATFORM_META[dto.platform].color,
  connected: dto.connected,
  username: dto.username ?? undefined,
});

export const SocialConnections: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccountView[]>([]);
  const [connectingId, setConnectingId] = useState<SocialPlatform | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    socialAccountsApi
      .list()
      .then((list) => setAccounts(list.map(dtoToView)))
      .catch((err) =>
        showToast("Failed to load connections", {
          variant: "error",
          description: err instanceof Error ? err.message : "Unknown error",
        }),
      );
  }, [showToast]);

  const handleConnect = async (id: SocialPlatform) => {
    setConnectingId(id);
    try {
      const { account } = await socialAccountsApi.connect(id);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === id ? dtoToView(account) : acc)),
      );
    } catch (err) {
      showToast("Connection failed", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (id: SocialPlatform) => {
    if (!window.confirm("Are you sure you want to disconnect this account?")) return;
    try {
      const updated = await socialAccountsApi.disconnect(id);
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === id ? dtoToView(updated) : acc)),
      );
    } catch (err) {
      showToast("Disconnect failed", {
        variant: "error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Social Connections
        </h2>
        <p className="text-[var(--text-secondary)] text-sm">
          Connect your social media accounts to enable auto-posting and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${account.color} flex items-center justify-center text-white shadow-lg shadow-black/10`}
              >
                {account.icon}
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">
                  {account.name}
                </h3>
                {account.connected ? (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Connected as {account.username}
                  </p>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)]">
                    Not connected
                  </p>
                )}
              </div>
            </div>

            {account.connected ? (
              <button
                onClick={() => handleDisconnect(account.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect(account.id)}
                disabled={connectingId === account.id}
                className="px-4 py-2 text-sm font-medium bg-[var(--text-primary)] text-[var(--text-inverse)] hover:opacity-90 rounded-lg transition-all disabled:opacity-50 min-w-[100px] flex justify-center"
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
