import { KPIData, WebSocketMessage } from "@/types";

type MessageHandler = (data: KPIData) => void;
type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private useMocks: boolean;
  private mockInterval: ReturnType<typeof setInterval> | null = null;
  private isConnected = false;

  constructor() {
    this.url = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
    this.useMocks = import.meta.env.VITE_USE_MOCKS !== "false";
  }

  connect(): void {
    if (this.useMocks) {
      this.startMockMode();
      return;
    }

    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.type === "kpi_update" || message.type === "activity_update") {
            this.notifyMessageHandlers(message.data as KPIData);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notifyConnectionHandlers(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.startMockMode();
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      this.startMockMode();
    }
  }

  disconnect(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.notifyConnectionHandlers(false);
  }

  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.log("Max reconnect attempts reached, switching to mock mode");
      this.startMockMode();
    }
  }

  private startMockMode(): void {
    if (this.mockInterval) return;
    
    this.isConnected = true;
    this.notifyConnectionHandlers(true);

    const generateMockData = (): KPIData => ({
      totalReach: Math.floor(10000 + Math.random() * 5000),
      impressions: Math.floor(80000 + Math.random() * 10000),
      clickRate: Math.floor(4000 + Math.random() * 500),
      conversion: parseFloat((95 + Math.random() * 5).toFixed(1)),
      chartData: [
        { name: "Mon", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Tue", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Wed", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Thu", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Fri", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Sat", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
        { name: "Sun", visits: Math.floor(3000 + Math.random() * 2000), clicks: Math.floor(1000 + Math.random() * 2000) },
      ],
      recentActivity: [
        { id: 1, campaign: "Campaign #101 active", performance: "High engagement", time: "2m ago" },
        { id: 2, campaign: "Campaign #102 paused", performance: "Low CTR detected", time: "15m ago" },
        { id: 3, campaign: "Campaign #103 launched", performance: "Initial tracking", time: "1h ago" },
        { id: 4, campaign: "Campaign #104 active", performance: "Exceeding targets", time: "3h ago" },
        { id: 5, campaign: "Campaign #105 completed", performance: "ROI: 245%", time: "5h ago" },
      ],
    });

    this.notifyMessageHandlers(generateMockData());

    this.mockInterval = setInterval(() => {
      this.notifyMessageHandlers(generateMockData());
    }, 5000);
  }

  private notifyMessageHandlers(data: KPIData): void {
    this.messageHandlers.forEach((handler) => handler(data));
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService();
