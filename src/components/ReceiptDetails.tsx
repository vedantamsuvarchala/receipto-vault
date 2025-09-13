import React, { useState } from 'react';
import { Receipt } from '../types';
import { 
  X, 
  Edit2, 
  Check, 
  Store, 
  Calendar, 
  CreditCard, 
  Receipt as ReceiptIcon,
  Wallet,
  Plus,
  Minus
} from 'lucide-react';

interface ReceiptDetailsProps {
  receipt: Receipt;
  onConfirm: () => void;
  onEdit: (receipt: Receipt) => void;
  onClose: () => void;
}

export const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({
  receipt,
  onConfirm,
  onEdit,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReceipt, setEditedReceipt] = useState(receipt);

  const handleSave = () => {
    onEdit(editedReceipt);
    setIsEditing(false);
  };

  const handleItemEdit = (index: number, field: string, value: any) => {
    const updatedItems = [...editedReceipt.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate amount
    const newAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setEditedReceipt({
      ...editedReceipt,
      items: updatedItems,
      amount: newAmount + (editedReceipt.tax || 0)
    });
  };

  const addItem = () => {
    setEditedReceipt({
      ...editedReceipt,
      items: [...editedReceipt.items, { name: 'New Item', price: 0, quantity: 1 }]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = editedReceipt.items.filter((_, i) => i !== index);
    const newAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setEditedReceipt({
      ...editedReceipt,
      items: updatedItems,
      amount: newAmount + (editedReceipt.tax || 0)
    });
  };

  const currentReceipt = isEditing ? editedReceipt : receipt;
  const subtotal = currentReceipt.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ReceiptIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Receipt Details</h3>
              <p className="text-sm text-gray-500">Review and confirm</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Merchant Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Store className="w-5 h-5 text-gray-600" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedReceipt.merchant}
                  onChange={(e) => setEditedReceipt({ ...editedReceipt, merchant: e.target.value })}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <span className="font-semibold text-gray-900">{currentReceipt.merchant}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{currentReceipt.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{currentReceipt.paymentMethod || 'Card'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Items</h4>
              {isEditing && (
                <button
                  onClick={addItem}
                  className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {currentReceipt.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemEdit(index, 'name', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemEdit(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                            min="1"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemEdit(index, 'price', parseFloat(e.target.value) || 0)}
                            className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                            step="0.01"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {currentReceipt.tax && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${currentReceipt.tax.toFixed(2)}</span>
                </div>
              )}
              {currentReceipt.tip && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tip</span>
                  <span className="text-gray-900">${currentReceipt.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${currentReceipt.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Integration */}
          <div className="bg-gradient-primary-soft rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-gray-900">Auto-sync to Google Wallet</div>
                <div className="text-sm text-gray-600">Receipt will be added automatically</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditedReceipt(receipt);
                  setIsEditing(false);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConfirm}
              className="w-full bg-gradient-primary text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>Confirm & Add to Wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};