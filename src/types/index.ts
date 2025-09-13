export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface Receipt {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  items: ReceiptItem[];
  category: string;
  walletSynced: boolean;
  imageUrl?: string;
  tax?: number;
  tip?: number;
  paymentMethod?: string;
}

export interface WalletPass {
  id: string;
  title: string;
  addedDate: string;
  amount?: number;
  type: 'receipt' | 'loyalty' | 'ticket';
  merchantLogo?: string;
}

export interface MonthlyBilling {
  totalSpent: number;
  receiptsCount: number;
  walletPasses: number;
  isPaid: boolean;
  dueDate: string;
  period: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}