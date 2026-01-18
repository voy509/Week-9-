import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Trash2 } from 'lucide-react';

const WeeklyBudgetPlanner = () => {
  const [weeks, setWeeks] = useState([
    { id: 1, friday: '12/19/25', income: 2500 },
    { id: 2, friday: '12/26/25', income: 1800 },
    { id: 3, friday: '1/2/26', income: 2500 },
    { id: 4, friday: '1/9/26', income: 1800 },
    { id: 5, friday: '1/16/26', income: 2500 },
    { id: 6, friday: '1/23/26', income: 1800 },
    { id: 7, friday: '1/30/26', income: 2500 },
    { id: 8, friday: '2/6/26', income: 1800 },
    { id: 9, friday: '2/13/26', income: 2500 },
    { id: 10, friday: '2/20/26', income: 1800 },
    { id: 11, friday: '2/27/26', income: 2500 },
    { id: 12, friday: '3/6/26', income: 1800 },
  ]);

  const [masterBills, setMasterBills] = useState([
    { id: 1, name: 'Mortgage', amount: 1500, dueDay: 15, active: true },
    { id: 2, name: 'Electric', amount: 150, dueDay: 20, active: true },
    { id: 3, name: 'Water', amount: 80, dueDay: 25, active: true },
    { id: 4, name: 'Internet', amount: 100, dueDay: 10, active: true },
    { id: 5, name: 'Car Payment', amount: 450, dueDay: 18, active: true },
  ]);

  const [assignedBills, setAssignedBills] = useState({
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  });

  const [unassignedBills, setUnassignedBills] = useState([]);
  const [draggedBill, setDraggedBill] = useState(null);
  const [splitBillId, setSplitBillId] = useState(null);
  const [splitAmount, setSplitAmount] = useState('');
  const [autoScrollInterval, setAutoScrollInterval] = useState(null);
  const [showBillSetup, setShowBillSetup] = useState(false);
  const [showIncomeSetup, setShowIncomeSetup] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [newBillForm, setNewBillForm] = useState({ name: '', amount: '', dueDay: '' });
  const [incomeAmountX, setIncomeAmountX] = useState(2500);
  const [incomeAmountY, setIncomeAmountY] = useState(1800);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!window.storage) {
          console.error('window.storage is not available!');
          return;
        }

        console.log('Loading data from storage...');
        const savedMasterBills = await window.storage.get('masterBills');
        const savedAssignedBills = await window.storage.get('assignedBills');
        const savedUnassignedBills = await window.storage.get('unassignedBills');

        if (savedMasterBills) {
          console.log('Loaded masterBills:', savedMasterBills);
          setMasterBills(JSON.parse(savedMasterBills.value));
        }
        if (savedAssignedBills) {
          setAssignedBills(JSON.parse(savedAssignedBills.value));
        }
        if (savedUnassignedBills) {
          setUnassignedBills(JSON.parse(savedUnassignedBills.value));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (!window.storage) {
          console.error('window.storage is not available for saving!');
          return;
        }

        console.log('Saving data to storage...');
        await window.storage.set('masterBills', JSON.stringify(masterBills));
        await window.storage.set('assignedBills', JSON.stringify(assignedBills));
        await window.storage.set('unassignedBills', JSON.stringify(unassignedBills));
        await window.storage.set('weeks', JSON.stringify(weeks));
        await window.storage.set('incomeAmounts', JSON.stringify({ amountX: incomeAmountX, amountY: incomeAmountY }));
        console.log('Data saved successfully!');
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };
    saveData();
  }, [masterBills, assignedBills, unassignedBills, weeks, incomeAmountX, incomeAmountY]);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const newBills = [];

    for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
      const month = (currentMonth + monthOffset) % 12;
      const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);

      masterBills.filter(b => b.active).forEach(masterBill => {
        const billId = `${masterBill.id}-${month}-${year}`;
        const existsInUnassigned = unassignedBills.some(b => b.id === billId);
        const existsInAssigned = Object.values(assignedBills).flat().some(b => b.id === billId);

        if (!existsInUnassigned && !existsInAssigned) {
          newBills.push({
            id: billId,
            name: masterBill.name,
            amount: masterBill.amount,
            dueDate: `${month + 1}/${masterBill.dueDay}/${String(year).slice(-2)}`,
            originalId: masterBill.id,
            originalName: masterBill.name,
            originalDueDate: `${month + 1}/${masterBill.dueDay}/${String(year).slice(-2)}`
          });
        }
      });
    }

    if (newBills.length > 0) {
      setUnassignedBills(prev => {
        // Remove any bills whose master bill is no longer active
        const activeMasterIds = new Set(masterBills.filter(b => b.active).map(b => b.id));
        const filtered = prev.filter(b => activeMasterIds.has(b.originalId));
        return [...filtered, ...newBills];
      });
    } else {
      // Even if no new bills, still filter out inactive ones
      const activeMasterIds = new Set(masterBills.filter(b => b.active).map(b => b.id));
      setUnassignedBills(prev => prev.filter(b => activeMasterIds.has(b.originalId)));
    }
  }, [masterBills]);

  useEffect(() => {
    if (!draggedBill && autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  }, [draggedBill, autoScrollInterval]);

  const handleDragStart = (bill, source) => {
    setDraggedBill({ ...bill, source });
  };

  const handleDragEnd = () => {
    setDraggedBill(null);
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!draggedBill) {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        setAutoScrollInterval(null);
      }
      return;
    }

    const scrollThreshold = 100;
    const scrollSpeed = 10;
    const viewportHeight = window.innerHeight;
    const mouseY = e.clientY;

    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      setAutoScrollInterval(null);
    }

    if (mouseY < scrollThreshold) {
      const interval = setInterval(() => {
        window.scrollBy(0, -scrollSpeed);
      }, 16);
      setAutoScrollInterval(interval);
    } else if (mouseY > viewportHeight - scrollThreshold) {
      const interval = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 16);
      setAutoScrollInterval(interval);
    }
  };

  const isBillOnTime = (billDueDate, weekFriday) => {
    const dueDate = new Date(billDueDate);
    const friday = new Date(weekFriday);
    return friday <= dueDate;
  };

  const isValidDropZone = (weekId) => {
    if (!draggedBill) return true;
    const week = weeks.find(w => w.id === weekId);
    return week && isBillOnTime(draggedBill.dueDate, week.friday);
  };

  const handleDrop = (weekId) => {
    if (!draggedBill) return;

    const week = weeks.find(w => w.id === weekId);
    if (week && !isBillOnTime(draggedBill.dueDate, week.friday)) {
      alert(`Cannot assign ${draggedBill.name} to this week. Due date ${draggedBill.dueDate} is after ${week.friday}. This would result in a late fee.`);
      setDraggedBill(null);
      return;
    }

    if (draggedBill.source === 'unassigned') {
      setUnassignedBills(unassignedBills.filter(b => b.id !== draggedBill.id));
      setAssignedBills({
        ...assignedBills,
        [weekId]: [...assignedBills[weekId], { ...draggedBill, paid: false }]
      });
    } else {
      const sourceWeekId = draggedBill.source;
      setAssignedBills({
        ...assignedBills,
        [sourceWeekId]: assignedBills[sourceWeekId].filter(b => b.id !== draggedBill.id),
        [weekId]: [...assignedBills[weekId], draggedBill]
      });
    }
    setDraggedBill(null);
  };

  const toggleBillPaid = (weekId, billId) => {
    setAssignedBills({
      ...assignedBills,
      [weekId]: assignedBills[weekId].map(bill =>
        bill.id === billId ? { ...bill, paid: !bill.paid } : bill
      )
    });
  };

  const handleSplitBill = (bill) => {
    setSplitBillId(bill.id);
    setSplitAmount('');
  };

  const confirmSplit = (weekId) => {
    const bill = assignedBills[weekId].find(b => b.id === splitBillId);
    const amount = parseFloat(splitAmount);

    if (!bill || !amount || amount >= bill.amount || amount <= 0) return;

    const remainingAmount = bill.amount - amount;

    const splitBill = {
      id: Date.now(),
      name: `${bill.originalName || bill.name} (Split)`,
      amount: amount,
      dueDate: bill.originalDueDate || bill.dueDate,
      originalId: bill.originalId || bill.id,
      originalName: bill.originalName || bill.name,
      originalDueDate: bill.originalDueDate || bill.dueDate
    };

    const updatedBills = assignedBills[weekId].map(b =>
      b.id === splitBillId ? {
        ...b,
        amount: remainingAmount,
        name: `${b.originalName || b.name} (Split)`
      } : b
    );

    setAssignedBills({
      ...assignedBills,
      [weekId]: updatedBills
    });

    setUnassignedBills([...unassignedBills, splitBill]);
    setSplitBillId(null);
    setSplitAmount('');
  };

  const removeBill = (weekId, billId) => {
    const bill = assignedBills[weekId].find(b => b.id === billId);

    setAssignedBills({
      ...assignedBills,
      [weekId]: assignedBills[weekId].filter(b => b.id !== billId)
    });

    const relatedBills = unassignedBills.filter(b => b.originalId === bill.originalId);

    if (relatedBills.length > 0) {
      const totalAmount = relatedBills.reduce((sum, b) => sum + b.amount, 0) + bill.amount;

      const mergedBill = {
        id: bill.originalId,
        name: bill.originalName || bill.name.replace(' (Split)', ''),
        amount: totalAmount,
        dueDate: bill.originalDueDate || bill.dueDate,
        originalId: bill.originalId || bill.id,
        originalName: bill.originalName || bill.name.replace(' (Split)', ''),
        originalDueDate: bill.originalDueDate || bill.dueDate
      };

      setUnassignedBills([
        ...unassignedBills.filter(b => b.originalId !== bill.originalId),
        mergedBill
      ]);
    } else {
      const restoredBill = {
        ...bill,
        name: bill.originalName || bill.name.replace(' (Split)', '')
      };
      setUnassignedBills([...unassignedBills, restoredBill]);
    }
  };

  const calculateWeekTotal = (weekId) => {
    return assignedBills[weekId].reduce((sum, bill) => sum + bill.amount, 0);
  };

  const calculateSpendingMoney = (week) => {
    const total = calculateWeekTotal(week.id);
    return week.income - total;
  };

  const getMonthColor = (dateString) => {
    const month = new Date(dateString).getMonth();
    const colors = {
      0: { header: 'bg-blue-400', footer: 'bg-blue-50 border-blue-500' },
      1: { header: 'bg-orange-400', footer: 'bg-orange-50 border-orange-500' },
      2: { header: 'bg-purple-400', footer: 'bg-purple-50 border-purple-500' },
      3: { header: 'bg-pink-400', footer: 'bg-pink-50 border-pink-500' },
      4: { header: 'bg-green-400', footer: 'bg-green-50 border-green-500' },
      5: { header: 'bg-yellow-400', footer: 'bg-yellow-50 border-yellow-500' },
      6: { header: 'bg-red-400', footer: 'bg-red-50 border-red-500' },
      7: { header: 'bg-indigo-400', footer: 'bg-indigo-50 border-indigo-500' },
      8: { header: 'bg-teal-400', footer: 'bg-teal-50 border-teal-500' },
      9: { header: 'bg-amber-400', footer: 'bg-amber-50 border-amber-500' },
      10: { header: 'bg-cyan-400', footer: 'bg-cyan-50 border-cyan-500' },
      11: { header: 'bg-emerald-400', footer: 'bg-emerald-50 border-emerald-500' }
    };
    return colors[month] || colors[0];
  };

  const getMonthlyBillStatus = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = 2026;
    const status = {};

    for (let month = 0; month < 12; month++) {
      const allBillsForMonth = [...unassignedBills, ...Object.values(assignedBills).flat()]
        .filter(bill => {
          const billDate = new Date(bill.dueDate);
          return billDate.getMonth() === month && billDate.getFullYear() === currentYear;
        });

      const uniqueBillIds = new Set();
      allBillsForMonth.forEach(bill => uniqueBillIds.add(bill.originalId));
      const totalBills = uniqueBillIds.size;

      const assignedBillsForMonth = Object.entries(assignedBills).flatMap(([weekId, bills]) =>
        bills.filter(bill => {
          const billDate = new Date(bill.dueDate);
          return billDate.getMonth() === month && billDate.getFullYear() === currentYear;
        }).map(bill => ({ ...bill, weekId }))
      );

      const assignedUniqueIds = new Set();
      assignedBillsForMonth.forEach(bill => assignedUniqueIds.add(bill.originalId));
      const assignedCount = assignedUniqueIds.size;

      const allOnTime = assignedBillsForMonth.every(bill => {
        const week = weeks.find(w => w.id === parseInt(bill.weekId));
        return week && isBillOnTime(bill.dueDate, week.friday);
      });

      status[month] = {
        name: monthNames[month],
        total: totalBills,
        assigned: assignedCount,
        complete: totalBills > 0 && assignedCount === totalBills && allOnTime
      };
    }

    return status;
  };

  const isMonthComplete = (weekFriday) => {
    const month = new Date(weekFriday).getMonth();
    const status = getMonthlyBillStatus();
    return status[month]?.complete || false;
  };

  const handleAddBill = () => {
    if (!newBillForm.name || !newBillForm.amount || !newBillForm.dueDay) return;

    const newBill = {
      id: Date.now(),
      name: newBillForm.name,
      amount: parseFloat(newBillForm.amount),
      dueDay: parseInt(newBillForm.dueDay),
      active: true
    };

    setMasterBills([...masterBills, newBill]);
    setNewBillForm({ name: '', amount: '', dueDay: '' });
  };

  const handleDeleteBill = (billId) => {
    setMasterBills(masterBills.filter(b => b.id !== billId));
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
  };

  const handleSaveEdit = () => {
    setMasterBills(masterBills.map(b =>
      b.id === editingBill.id ? editingBill : b
    ));
    setEditingBill(null);
  };

  const toggleBillActive = (billId) => {
    const bill = masterBills.find(b => b.id === billId);
    const newActiveState = !bill.active;

    setMasterBills(masterBills.map(b =>
      b.id === billId ? { ...b, active: newActiveState } : b
    ));

    // If deactivating, remove its instances from unassigned bills
    if (!newActiveState) {
      setUnassignedBills(unassignedBills.filter(b => b.originalId !== billId));
    }
  };

  const monthlyStatus = getMonthlyBillStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-6" onMouseMove={handleMouseMove} style={{ borderRadius: '24px' }}>
      <div className="sticky top-0 bg-gray-50 z-20 pb-4 mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 max-w-xs">Weekly Budget Planner</h1>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowBillSetup(true)}
              className="bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium w-full"
            >
              Bill Setup
            </button>
            <button
              onClick={() => setShowIncomeSetup(true)}
              className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium w-full"
            >
              Income
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 w-auto">
            <h2 className="text-sm font-semibold mb-2 text-gray-700">Monthly Bill Status</h2>
            <div className="grid grid-cols-6 gap-2 text-xs">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
                const data = monthlyStatus[month];
                return (
                  <div key={month} className={`flex items-center justify-center p-2 rounded ${data.complete ? 'bg-green-200' : 'bg-gray-50'}`}>
                    <span className="font-medium">{data.name}:</span>
                    <span className={`ml-1 ${data.complete ? 'text-green-800 font-bold' : 'text-gray-600'}`}>
                      {data.assigned}/{data.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showBillSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-start justify-center p-6 overflow-y-auto pt-4">
          <div className="bg-white shadow-xl w-full max-w-3xl my-8 flex flex-col max-h-[80vh]" style={{ borderRadius: '24px' }}>
            <div className="p-6 border-b flex justify-between items-center bg-white" style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <h2 className="text-2xl font-bold text-gray-900">Bill Setup</h2>
              <button
                onClick={() => setShowBillSetup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1" style={{ borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Add New Bill</h3>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Bill Name"
                    value={newBillForm.name}
                    onChange={(e) => setNewBillForm({...newBillForm, name: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newBillForm.amount}
                    onChange={(e) => setNewBillForm({...newBillForm, amount: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Due Day (1-31)"
                    value={newBillForm.dueDay}
                    onChange={(e) => setNewBillForm({...newBillForm, dueDay: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <button
                  onClick={handleAddBill}
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Bill
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Bills</h3>
                <div className="space-y-2">
                  {masterBills
                    .sort((a, b) => a.dueDay - b.dueDay)
                    .map(bill => (
                    <div key={bill.id} className="border rounded-lg p-4 flex justify-between items-center">
                      {editingBill?.id === bill.id ? (
                        <div className="flex gap-3 flex-1">
                          <input
                            type="text"
                            value={editingBill.name}
                            onChange={(e) => setEditingBill({...editingBill, name: e.target.value})}
                            className="border rounded px-3 py-2"
                          />
                          <input
                            type="number"
                            value={editingBill.amount}
                            onChange={(e) => setEditingBill({...editingBill, amount: parseFloat(e.target.value)})}
                            className="border rounded px-3 py-2 w-32"
                          />
                          <input
                            type="number"
                            value={editingBill.dueDay}
                            onChange={(e) => setEditingBill({...editingBill, dueDay: parseInt(e.target.value)})}
                            className="border rounded px-3 py-2 w-24"
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingBill(null)}
                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={bill.active}
                              onChange={() => toggleBillActive(bill.id)}
                              className="w-5 h-5 cursor-pointer"
                            />
                            <div>
                              <div className={`font-medium text-lg ${!bill.active ? 'text-gray-400' : ''}`}>
                                {bill.name}
                              </div>
                              <div className={`text-sm ${!bill.active ? 'text-gray-400' : 'text-gray-600'}`}>
                                ${bill.amount.toFixed(2)} - Due on day {bill.dueDay} of each month
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBill(bill)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBill(bill.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income Setup Modal */}
      {showIncomeSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-start justify-center p-6 overflow-y-auto pt-4">
          <div className="bg-white shadow-xl w-full max-w-3xl my-8 flex flex-col max-h-[80vh]" style={{ borderRadius: '24px' }}>
            <div className="p-6 border-b flex justify-between items-center bg-white" style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <h2 className="text-2xl font-bold text-gray-900">Income Setup</h2>
              <button
                onClick={() => setShowIncomeSetup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1" style={{ borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Configure Bi-Weekly Income Pattern</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set your two income amounts that alternate every two weeks. Week 1 and 3 will use Amount X, Week 2 and 4 will use Amount Y, and this pattern repeats.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount X (Weeks 1, 3, etc.)</label>
                    <input
                      type="number"
                      placeholder="2500.00"
                      value={incomeAmountX}
                      onChange={(e) => setIncomeAmountX(parseFloat(e.target.value))}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount Y (Weeks 2, 4, etc.)</label>
                    <input
                      type="number"
                      placeholder="1800.00"
                      value={incomeAmountY}
                      onChange={(e) => setIncomeAmountY(parseFloat(e.target.value))}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Button clicked!');

                    try {
                      console.log('Starting inline pattern application');
                      const updatedWeeks = weeks.map((week, index) => ({
                        ...week,
                        income: index % 2 === 0 ? incomeAmountX : incomeAmountY
                      }));
                      setWeeks(updatedWeeks);
                      alert('Income pattern applied!');
                    } catch (error) {
                      console.error('Error:', error);
                      alert('Error: ' + error.message);
                    }
                  }}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                >
                  Apply Income Pattern
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Current Weeks</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {weeks.map((week, index) => (
                    <div key={week.id} className="border rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">Week of {week.friday}</div>
                        <div className="text-sm text-gray-600">Pattern: {index % 2 === 0 ? 'Amount X' : 'Amount Y'}</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${week.income.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full">
        <div style={{ width: 'calc(76%)' }}>
          <div className="grid grid-cols-4 gap-4 auto-rows-min">
            {weeks.map(week => {
              const spendingMoney = calculateSpendingMoney(week);
              const isNegative = spendingMoney < 0;
              const monthColors = getMonthColor(week.friday);
              const monthComplete = isMonthComplete(week.friday);
              const isValidDrop = isValidDropZone(week.id);
              const isDragging = draggedBill !== null;

              return (
                <div
                  key={week.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(week.id)}
                  className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${
                    isDragging ? (isValidDrop ? 'ring-4 ring-green-400' : 'ring-4 ring-red-400 cursor-not-allowed') : ''
                  }`}
                >
                  <div className={`p-4 ${isNegative ? 'bg-red-500' : monthColors.header} text-white`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Week of</div>
                        <div className="text-lg font-bold">{week.friday}</div>
                      </div>
                      {monthComplete && (
                        <div className="bg-white bg-opacity-30 rounded-full p-1">
                          <span className="text-white text-lg">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm">Income: ${week.income.toFixed(2)}</div>
                  </div>

                  <div className={`p-2 border-2 border-dashed ${
                    isDragging ? (isValidDrop ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-gray-300'
                  } flex-shrink-0`}>
                    {assignedBills[week.id].length === 0 ? (
                      <div className="text-gray-400 text-sm text-center py-2">
                        Drag bills here
                      </div>
                    ) : (
                      assignedBills[week.id].map(bill => (
                        <div
                          key={bill.id}
                          draggable
                          onDragStart={() => handleDragStart(bill, week.id)}
                          onDragEnd={handleDragEnd}
                          className={`rounded p-3 mb-2 cursor-move transition ${
                            bill.paid ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={bill.paid || false}
                                onChange={() => toggleBillPaid(week.id, bill.id)}
                                className="w-4 h-4 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className={`font-medium text-sm ${bill.paid ? 'line-through text-gray-500' : ''}`}>
                                {bill.name}
                              </div>
                            </div>
                            <button
                              onClick={() => removeBill(week.id, bill.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className={`text-xs text-gray-600 mb-1 ${bill.paid ? 'line-through' : ''}`}>
                            Due: {bill.dueDate}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className={`font-bold text-blue-600 ${bill.paid ? 'line-through' : ''}`}>
                              ${bill.amount.toFixed(2)}
                            </div>
                            {splitBillId !== bill.id && (
                              <button
                                onClick={() => handleSplitBill(bill)}
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Split
                              </button>
                            )}
                          </div>
                          {splitBillId === bill.id && (
                            <div className="mt-2 flex gap-1">
                              <input
                                type="number"
                                value={splitAmount}
                                onChange={(e) => setSplitAmount(e.target.value)}
                                placeholder="Amount"
                                className="border rounded px-2 py-1 text-xs w-20"
                              />
                              <button
                                onClick={() => confirmSplit(week.id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setSplitBillId(null)}
                                className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-400"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className={`p-4 ${isNegative ? 'bg-red-50 border-t-2 border-red-500' : monthColors.footer + ' border-t-2'} flex-shrink-0`}>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">Spending Money:</div>
                      <div className={`text-sm font-bold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                        ${spendingMoney.toFixed(2)}
                      </div>
                    </div>
                    {isNegative && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Consider splitting bills
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[30%]"></div>
      </div>

      <div className="fixed top-44 right-6 z-10" style={{ width: '18%', minWidth: '220px', maxWidth: '260px' }}>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 flex-shrink-0">
            <Calendar className="w-5 h-5" />
            Bills to Assign
          </h2>
          <div className="space-y-3 overflow-y-auto flex-1">
            {unassignedBills
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(bill => (
              <div
                key={bill.id}
                draggable
                onDragStart={() => handleDragStart(bill, 'unassigned')}
                onDragEnd={handleDragEnd}
                className="border-2 border-blue-300 rounded-lg p-3 cursor-move hover:bg-blue-50 transition"
              >
                <div className="font-medium text-gray-900 break-words" style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}>{bill.name}</div>
                <div className="text-sm text-gray-600">Due: {bill.dueDate}</div>
                <div className="text-lg font-bold text-blue-600">${bill.amount.toFixed(2)}</div>
              </div>
            ))}
            {unassignedBills.length === 0 && (
              <div className="text-gray-500 italic">All bills assigned!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyBudgetPlanner;
