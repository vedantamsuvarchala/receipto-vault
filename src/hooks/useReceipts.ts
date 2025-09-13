import { useState, useCallback, useEffect } from 'react';
import { Receipt, WalletPass, MonthlyBilling } from '../types';

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [walletPasses, setWalletPasses] = useState<WalletPass[]>([]);
  const [monthlyBilling, setMonthlyBilling] = useState<MonthlyBilling | null>(null);

  // Initialize with some sample data for demonstration
  useEffect(() => {
    const sampleReceipts: Receipt[] = [
      {
        id: '1',
        merchant: 'Whole Foods Market',
        date: new Date().toLocaleDateString(),
        amount: 47.32,
        items: [
          { name: 'Organic Bananas', price: 3.99, quantity: 2, category: 'Produce' },
          { name: 'Greek Yogurt', price: 5.49, quantity: 1, category: 'Dairy' },
          { name: 'Sourdough Bread', price: 4.99, quantity: 1, category: 'Bakery' }
        ],
        category: 'Groceries',
        walletSynced: true,
        tax: 3.28,
        paymentMethod: 'Credit Card'
      }
    ];

    const sampleWalletPasses: WalletPass[] = [
      {
        id: '1',
        title: 'Whole Foods Receipt',
        addedDate: new Date().toLocaleDateString(),
        amount: 47.32,
        type: 'receipt'
      }
    ];

    setReceipts(sampleReceipts);
    setWalletPasses(sampleWalletPasses);
    updateMonthlyBilling(sampleReceipts);
  }, []);

  const updateMonthlyBilling = useCallback((receipts: Receipt[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyReceipts = receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const walletSyncedCount = monthlyReceipts.filter(r => r.walletSynced).length;

    setMonthlyBilling({
      totalSpent,
      receiptsCount: monthlyReceipts.length,
      walletPasses: walletSyncedCount,
      isPaid: totalSpent === 0,
      dueDate: new Date(currentYear, currentMonth + 1, 1).toLocaleDateString(),
      period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  }, []);

  const addReceipt = useCallback((receipt: Receipt) => {
    const newReceipt = {
      ...receipt,
      id: Date.now().toString(),
      walletSynced: true // Auto-sync to wallet
    };

    setReceipts(prev => {
      const updated = [newReceipt, ...prev];
      updateMonthlyBilling(updated);
      return updated;
    });

    // Add to wallet passes
    const walletPass: WalletPass = {
      id: newReceipt.id,
      title: `${receipt.merchant} Receipt`,
      addedDate: receipt.date,
      amount: receipt.amount,
      type: 'receipt'
    };

    setWalletPasses(prev => [walletPass, ...prev]);
  }, [updateMonthlyBilling]);

  const processReceiptImage = useCallback(async (imageData: string): Promise<Receipt> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI extraction results
    const mockReceipt: Receipt = {
      id: '',
      merchant: 'Target Store #1234',
      date: new Date().toLocaleDateString(),
      amount: 29.47,
      items: [
        { name: 'Milk 2% Gallon', price: 3.29, quantity: 1, category: 'Dairy' },
        { name: 'Bread White', price: 2.49, quantity: 1, category: 'Bakery' },
        { name: 'Eggs Large Dozen', price: 4.99, quantity: 1, category: 'Dairy' },
        { name: 'Apples Gala 3lb', price: 4.99, quantity: 1, category: 'Produce' }
      ],
      category: 'Groceries',
      walletSynced: false,
      tax: 2.17,
      paymentMethod: 'Debit Card',
      imageUrl: imageData
    };

    return mockReceipt;
  }, []);

  const resetMonthlyBilling = useCallback(() => {
    setMonthlyBilling(prev => prev ? { ...prev, isPaid: true } : null);
  }, []);

  return {
    receipts,
    walletPasses,
    monthlyBilling,
    addReceipt,
    processReceiptImage,
    resetMonthlyBilling
  };
};