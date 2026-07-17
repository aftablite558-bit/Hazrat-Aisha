import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { feeService } from '../../services/fee.service';
import { FeeCategory } from '../../types/fee';
import { useToast } from '../../context/ToastContext';
import { Plus, Save, Trash2, Loader2 } from 'lucide-react';

interface FeeStructureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function FeeStructureForm({ onSuccess, onCancel }: FeeStructureFormProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    class: '1',
    academicYear: '2026-2027'
  });
  
  const [fees, setFees] = useState<{ category: FeeCategory; amount: number; frequency: 'one_time' | 'monthly' | 'yearly' }[]>([
    { category: 'admission', amount: 5000, frequency: 'one_time' },
    { category: 'monthly', amount: 2500, frequency: 'monthly' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fees.length === 0) {
      addToast('Please add at least one fee item', 'error');
      return;
    }

    setLoading(true);
    try {
      await feeService.saveFeeStructure({
        ...formData,
        fees
      });
      addToast('Fee structure saved successfully', 'success');
      onSuccess();
    } catch (error) {
      addToast('Failed to save fee structure', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addFeeItem = () => {
    setFees([...fees, { category: 'custom', amount: 0, frequency: 'one_time' }]);
  };

  const removeFeeItem = (index: number) => {
    const newFees = [...fees];
    newFees.splice(index, 1);
    setFees(newFees);
  };

  const updateFeeItem = (index: number, field: string, value: any) => {
    const newFees = [...fees];
    newFees[index] = { ...newFees[index], [field]: value };
    setFees(newFees);
  };

  const categories = ['admission', 'monthly', 'exam', 'transport', 'library', 'hostel', 'custom'];

  return (
    <Card className="border-line shadow-e1 font-body">
      <CardHeader className="border-b border-line pb-4">
        <CardTitle className="text-lg text-content font-extrabold font-display">Create Fee Structure</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Class</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-content-tertiary uppercase tracking-wider font-display">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)]"
                placeholder="e.g. 2026-2027"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-content font-display uppercase tracking-wider">Fee Items</h4>
              <Button type="button" variant="secondary" size="sm" onClick={addFeeItem} className="border-line text-content-secondary hover:text-content font-bold font-display">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            {fees.map((fee, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border border-line rounded-xl bg-surface-raised transition-all duration-fast">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Category</label>
                  <select
                    value={fee.category}
                    onChange={(e) => updateFeeItem(index, 'category', e.target.value)}
                    className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={fee.amount}
                    onChange={(e) => updateFeeItem(index, 'amount', Number(e.target.value))}
                    className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider font-display">Frequency</label>
                  <select
                    value={fee.frequency}
                    onChange={(e) => updateFeeItem(index, 'frequency', e.target.value)}
                    className="w-full p-2 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-surface)] text-sm text-content-secondary focus:outline-none focus:border-primary"
                  >
                    <option value="one_time">One Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="pt-0 sm:pt-4 flex justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeeItem(index)} className="text-danger-500 hover:text-danger-600 hover:bg-danger-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-line">
            <Button type="button" variant="secondary" onClick={onCancel} className="border-line text-content-secondary hover:text-content font-bold font-display">Cancel</Button>
            <Button type="submit" disabled={loading} className="font-bold font-display">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Structure
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
