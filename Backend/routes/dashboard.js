const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

router.get('/summary', async (req, res) => {
  try {
    const now = new Date();

    // วันที่ปัจจุบัน
    const today = formatDate(now);

    // เดือนปัจจุบัน (เช่น 2025-06-01)
    const firstDayOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    // ปีปัจจุบัน (เช่น 2025-01-01)
    const firstDayOfYear = `${now.getFullYear()}-01-01`;

    // ==== ยอดขาย (orders.total_amount) ====

    const [salesToday, salesMonth, salesYear] = await Promise.all([
      supabase.from('orders').select('total_amount').gte('created_at', `${today}T00:00:00+07:00`),
      supabase.from('orders').select('total_amount').gte('created_at', `${firstDayOfMonth}T00:00:00+07:00`),
      supabase.from('orders').select('total_amount').gte('created_at', `${firstDayOfYear}T00:00:00+07:00`)
    ]);

    // ==== ค่าใช้จ่าย (expenses.amount) ====

    const [expensesToday, expensesMonth, expensesYear] = await Promise.all([
      supabase.from('expenses').select('amount').eq('expense_date', today),
      supabase.from('expenses').select('amount').gte('expense_date', firstDayOfMonth),
      supabase.from('expenses').select('amount').gte('expense_date', firstDayOfYear)
    ]);

    // === คำนวณยอดรวม ===
    const sum = (arr, field) => arr.data?.reduce((sum, item) => sum + Number(item[field] || 0), 0);

    res.json({
      sales: {
        today: sum(salesToday, 'total_amount'),
        month: sum(salesMonth, 'total_amount'),
        year: sum(salesYear, 'total_amount')
      },
      expenses: {
        today: sum(expensesToday, 'amount'),
        month: sum(expensesMonth, 'amount'),
        year: sum(expensesYear, 'amount')
      }
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

module.exports = router;
