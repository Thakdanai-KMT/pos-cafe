const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Utility: คืนค่า timestamp ของช่วงเวลาวัน, สัปดาห์, เดือน
function getRanges() {
  const now = new Date();

  // วันเริ่มต้นและสิ้นสุดของวันนี้
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDay = new Date(startDay);
  endDay.setDate(endDay.getDate() + 1);

  // วันเริ่มต้นของสัปดาห์ (เริ่มจันทร์) และวันถัดไปของอาทิตย์สุดท้าย
  const dayOfWeek = startDay.getDay(); // 0=อาทิตย์, 1=จันทร์
  const diffToMonday = (dayOfWeek + 6) % 7; // ปรับให้จันทร์เป็นวันแรก (0)
  const startWeek = new Date(startDay);
  startWeek.setDate(startWeek.getDate() - diffToMonday);
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 7);

  // วันเริ่มต้นและสิ้นสุดของเดือน
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    day: { start: startDay.toISOString(), end: endDay.toISOString() },
    week: { start: startWeek.toISOString(), end: endWeek.toISOString() },
    month: { start: startMonth.toISOString(), end: endMonth.toISOString() },
  };
}

async function getSalesAndTopProducts(range) {
  // ดึงยอดขายรวมช่วงเวลา
  const { data: orders, error: orderErr } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', range.start)
    .lt('created_at', range.end);

  if (orderErr) throw orderErr;

  const totalSales = orders.reduce(
    (sum, o) => sum + parseFloat(o.total_amount || 0),
    0
  );

  // เรียก RPC get_top_products_by_range (ต้องสร้างใน Supabase)
  // หรือ query join order_items + products + orders กรองช่วงเวลา
  const { data: topProducts, error: topErr } = await supabase.rpc(
    'get_top_products_by_range',
    {
      start_date: range.start,
      end_date: range.end,
    }
  );

  if (topErr) throw topErr;

  return { totalSales, topProducts };
}

// GET /api/dashboard/summary-all
router.get('/summary-all', async (req, res) => {
  try {
    const ranges = getRanges();

    const dayData = await getSalesAndTopProducts(ranges.day);
    const weekData = await getSalesAndTopProducts(ranges.week);
    const monthData = await getSalesAndTopProducts(ranges.month);

    res.json({
      todaySales: dayData.totalSales,
      todayTop: dayData.topProducts,

      weekSales: weekData.totalSales,
      weekTop: weekData.topProducts,

      monthSales: monthData.totalSales,
      monthTop: monthData.topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
