import { supabase } from './supabase';

// ==================== MASTER BILLS ====================

export async function loadMasterBills(userId) {
  try {
    const { data, error } = await supabase
      .from('master_bills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Convert to app format
    return data.map(bill => ({
      id: bill.id,
      name: bill.name,
      amount: parseFloat(bill.amount),
      dueDay: bill.due_day,
      active: bill.active
    }));
  } catch (error) {
    console.error('Error loading master bills:', error);
    return [];
  }
}

export async function saveMasterBills(userId, bills) {
  try {
    // Delete all existing bills for this user
    await supabase
      .from('master_bills')
      .delete()
      .eq('user_id', userId);

    // Insert new bills
    if (bills.length > 0) {
      const billsToInsert = bills.map(bill => ({
        user_id: userId,
        name: bill.name,
        amount: bill.amount,
        due_day: bill.dueDay,
        active: bill.active
      }));

      const { error } = await supabase
        .from('master_bills')
        .insert(billsToInsert);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving master bills:', error);
    throw error;
  }
}

// ==================== ASSIGNED BILLS ====================

export async function loadAssignedBills(userId) {
  try {
    const { data, error } = await supabase
      .from('assigned_bills')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    // Convert to app format (object with week IDs as keys)
    const assignedBills = {};
    for (let i = 1; i <= 56; i++) {
      assignedBills[i] = [];
    }

    data.forEach(bill => {
      if (assignedBills[bill.week_id]) {
        assignedBills[bill.week_id].push({
          id: bill.bill_id,
          name: bill.bill_name,
          amount: parseFloat(bill.amount),
          dueDate: bill.due_date,
          originalId: bill.original_id,
          originalName: bill.original_name,
          originalDueDate: bill.original_due_date
        });
      }
    });

    return assignedBills;
  } catch (error) {
    console.error('Error loading assigned bills:', error);
    // Return empty structure
    const assignedBills = {};
    for (let i = 1; i <= 56; i++) {
      assignedBills[i] = [];
    }
    return assignedBills;
  }
}

export async function saveAssignedBills(userId, assignedBills) {
  try {
    // Delete all existing assigned bills for this user
    await supabase
      .from('assigned_bills')
      .delete()
      .eq('user_id', userId);

    // Flatten and insert new bills
    const billsToInsert = [];
    Object.entries(assignedBills).forEach(([weekId, bills]) => {
      bills.forEach(bill => {
        billsToInsert.push({
          user_id: userId,
          week_id: parseInt(weekId),
          bill_id: bill.id,
          bill_name: bill.name,
          amount: bill.amount,
          due_date: bill.dueDate,
          original_id: bill.originalId,
          original_name: bill.originalName,
          original_due_date: bill.originalDueDate
        });
      });
    });

    if (billsToInsert.length > 0) {
      const { error } = await supabase
        .from('assigned_bills')
        .insert(billsToInsert);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving assigned bills:', error);
    throw error;
  }
}

// ==================== UNASSIGNED BILLS ====================

export async function loadUnassignedBills(userId) {
  try {
    const { data, error } = await supabase
      .from('unassigned_bills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(bill => ({
      id: bill.bill_id,
      name: bill.bill_name,
      amount: parseFloat(bill.amount),
      dueDate: bill.due_date,
      originalId: bill.original_id,
      originalName: bill.original_name,
      originalDueDate: bill.original_due_date
    }));
  } catch (error) {
    console.error('Error loading unassigned bills:', error);
    return [];
  }
}

export async function saveUnassignedBills(userId, bills) {
  try {
    // Delete all existing unassigned bills for this user
    await supabase
      .from('unassigned_bills')
      .delete()
      .eq('user_id', userId);

    // Insert new bills
    if (bills.length > 0) {
      const billsToInsert = bills.map(bill => ({
        user_id: userId,
        bill_id: bill.id,
        bill_name: bill.name,
        amount: bill.amount,
        due_date: bill.dueDate,
        original_id: bill.originalId,
        original_name: bill.originalName,
        original_due_date: bill.originalDueDate
      }));

      const { error } = await supabase
        .from('unassigned_bills')
        .insert(billsToInsert);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving unassigned bills:', error);
    throw error;
  }
}

// ==================== INCOME SETTINGS ====================

export async function loadIncomeSettings(userId) {
  try {
    const { data, error } = await supabase
      .from('income_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return defaults
        return { incomeX: 2500, incomeY: 1800 };
      }
      throw error;
    }

    return {
      incomeX: parseFloat(data.income_x),
      incomeY: parseFloat(data.income_y)
    };
  } catch (error) {
    console.error('Error loading income settings:', error);
    return { incomeX: 2500, incomeY: 1800 };
  }
}

export async function saveIncomeSettings(userId, incomeX, incomeY) {
  try {
    const { error } = await supabase
      .from('income_settings')
      .upsert({
        user_id: userId,
        income_x: incomeX,
        income_y: incomeY,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving income settings:', error);
    throw error;
  }
}
