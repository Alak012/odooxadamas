const prisma = require('../config/db');

// Request a salary advance
const requestAdvance = async (req, res) => {
  try {
    const { amount, reason, monthDeduction } = req.body;
    const advance = await prisma.salaryAdvance.create({
      data: {
        userId: req.user.id,
        amount,
        reason,
        monthDeduction
      }
    });
    res.json(advance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin approves/rejects advance
const updateAdvanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const advance = await prisma.salaryAdvance.update({
      where: { id },
      data: { status }
    });
    res.json(advance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin gets all advances
const getAllAdvances = async (req, res) => {
  try {
    const advances = await prisma.salaryAdvance.findMany({
      include: { user: { select: { displayName: true, employeeId: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(advances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Payroll for a specific month for all users
const generateMonthlyPayroll = async (req, res) => {
  try {
    const { month } = req.params; // format: '2026-07'
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1; // 0-based

    // Get days in month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Get all active users
    const users = await prisma.user.findMany({
      where: { status: 'Active' },
      include: {
        advances: {
          where: { monthDeduction: month, status: 'Approved' }
        },
        attendances: {
          where: {
            date: {
              gte: new Date(year, monthIndex, 1),
              lt: new Date(year, monthIndex + 1, 1)
            }
          }
        }
      }
    });

    const payrolls = [];

    for (const user of users) {
      if (!user.baseSalary) continue;

      // Calculate days present
      let presentDays = 0;
      for (const att of user.attendances) {
        if (att.status === 'Present') presentDays++;
        else if (att.status === 'HalfDay') presentDays += 0.5;
      }

      // Add Paid Leaves logic? (Skipping for simplicity: assuming Base Salary / Working Days * Days Present)
      const dailyRate = user.baseSalary / 12 / 30; // Rough approx
      const monthWage = user.baseSalary / 12;
      
      let advanceDeduction = 0;
      user.advances.forEach(adv => advanceDeduction += adv.amount);

      // Rough Calculation for demo
      const grossSalary = monthWage;
      const netSalary = grossSalary - advanceDeduction - 200; // 200 is Prof Tax

      const payroll = await prisma.payroll.upsert({
        where: {
          userId_month: { userId: user.id, month }
        },
        update: {
          monthWage,
          payableDays: presentDays,
          basicSalary: monthWage * 0.4,
          hra: monthWage * 0.2,
          performanceBonus: 0,
          lta: 0,
          pfEmployee: monthWage * 0.05,
          pfEmployer: monthWage * 0.05,
          fixedAllowance: 0,
          grossSalary,
          netSalary
        },
        create: {
          userId: user.id,
          month,
          monthWage,
          payableDays: presentDays,
          basicSalary: monthWage * 0.4,
          hra: monthWage * 0.2,
          performanceBonus: 0,
          lta: 0,
          pfEmployee: monthWage * 0.05,
          pfEmployer: monthWage * 0.05,
          fixedAllowance: 0,
          grossSalary,
          netSalary
        }
      });
      payrolls.push(payroll);
    }

    res.json({ message: 'Payroll generated successfully', count: payrolls.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyPayrolls = async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      where: { userId: req.user.id },
      orderBy: { month: 'desc' }
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPayrolls = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const payrolls = await prisma.payroll.findMany({
      where: filter,
      include: { user: { select: { displayName: true, employeeId: true } } },
      orderBy: { month: 'desc' }
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  requestAdvance,
  updateAdvanceStatus,
  getAllAdvances,
  generateMonthlyPayroll,
  getMyPayrolls,
  getAllPayrolls
};
