import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { feeService } from '../../services/fee.service';
import { FeeStructure } from '../../types/fee';
import { IndianRupee, Plus, FileText, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { FeeCollectionForm } from './FeeCollectionForm';
import { FeeStructureForm } from './FeeStructureForm';
import { FeeReports } from './FeeReports';

export function FeeDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collection' | 'reports'>('dashboard');
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await feeService.getFeeStructures();
      setStructures(data);
    } catch (error) {
      addToast('Failed to fetch fee structures', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-content font-display">
            Fee Management
          </h1>
          <p className="text-sm text-content-secondary mt-1">Manage fee structures, invoices, and payments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setActiveTab('reports')} className="border-line text-content-secondary hover:text-content">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button onClick={() => setActiveTab('collection')}>
            <Plus className="h-4 w-4 mr-2" />
            Collect Fee
          </Button>
        </div>
      </div>

      <div className="border-b border-line mb-6">
        <nav className="-mb-px flex space-x-8 font-display">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all ${
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'border-transparent text-content-tertiary hover:text-content-secondary hover:border-line'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all ${
              activeTab === 'collection'
                ? 'border-primary text-primary'
                : 'border-transparent text-content-tertiary hover:text-content-secondary hover:border-line'
            }`}
          >
            Fee Collection
          </button>
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-display">
            <Card className="border-line shadow-e1">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Total Collection</p>
                  <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">₹0</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-line shadow-e1">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-warning-500/10 rounded-xl">
                  <FileText className="h-6 w-6 text-warning-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Pending Fees</p>
                  <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">₹0</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-line shadow-e1">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-success-500/10 rounded-xl">
                  <Download className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">Today's Collection</p>
                  <h3 className="text-2xl font-extrabold text-content font-mono mt-0.5">₹0</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-line shadow-e1">
            <CardHeader className="border-b border-line pb-4">
              <div className="flex justify-between items-center font-display">
                <CardTitle className="text-lg text-content font-extrabold">Fee Structures</CardTitle>
                <Button variant="secondary" size="sm" onClick={() => setShowStructureForm(true)} className="border-line text-content-secondary hover:text-content">
                  <Plus className="h-4 w-4 mr-2" />
                  New Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              {showStructureForm ? (
                <FeeStructureForm 
                  onSuccess={() => { setShowStructureForm(false); fetchData(); }} 
                  onCancel={() => setShowStructureForm(false)} 
                />
              ) : loading ? (
                <div className="py-12 text-center text-content-secondary font-semibold">Loading fee structures...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="text-xs text-content-secondary font-bold uppercase bg-surface-overlay border-b border-line">
                      <tr>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Class</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Academic Year</th>
                        <th className="px-6 py-4 font-display uppercase tracking-wider text-xs">Categories</th>
                        <th className="px-6 py-4 text-right font-display uppercase tracking-wider text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {structures.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-content-secondary font-medium">
                            No fee structures found.
                          </td>
                        </tr>
                      ) : (
                        structures.map((structure) => (
                          <tr key={structure.id} className="bg-surface hover:bg-surface-raised transition-colors duration-fast">
                            <td className="px-6 py-4 font-semibold text-content">Class {structure.class}</td>
                            <td className="px-6 py-4 font-semibold text-content-secondary">{structure.academicYear}</td>
                            <td className="px-6 py-4 font-medium text-content-secondary">{structure.fees.length} items</td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="secondary" size="sm" className="border-line text-content-secondary hover:text-content">View</Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'collection' && <FeeCollectionForm />}
      
      {activeTab === 'reports' && (
        <FeeReports />
      )}
    </div>
  );
}
