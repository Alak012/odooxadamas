/**
 * Auto-Computation Formulas:
 * Basic Salary: 50% of Month Wage.
 * HRA (House Rent Allowance): 50% of Basic Salary.
 * Standard Allowance: Fixed predefined value (e.g., 4167.00).
 * Performance Bonus: 8.33% of Basic Salary.
 * LTA (Leave Travel Allowance): 8.33% of Basic Salary.
 * PF Contribution (Employee & Employer): 12% of Basic Salary (each).
 * Professional Tax: Fixed deduction of ₹200.
 * Fixed Allowance: Automatically calculated as (Month Wage - Sum of all other positive components).
 */

const STANDARD_ALLOWANCE = 4167.00;
const PROFESSIONAL_TAX = 200.00;

function calculatePayroll(monthWage, payableDays, totalDaysInMonth = 30) {
  // Prorate month wage based on payable days
  const proratedWage = (monthWage / totalDaysInMonth) * payableDays;

  const basicSalary = Number((proratedWage * 0.50).toFixed(2));
  const hra = Number((basicSalary * 0.50).toFixed(2));
  const performanceBonus = Number((basicSalary * 0.0833).toFixed(2));
  const lta = Number((basicSalary * 0.0833).toFixed(2));
  
  // Calculate fixed allowance to balance the prorated wage
  // Month Wage = Basic + HRA + Standard Allowance + Performance Bonus + LTA + Fixed Allowance
  // Fixed Allowance = Month Wage - (Basic + HRA + Standard Allowance + Performance Bonus + LTA)
  let fixedAllowance = proratedWage - (basicSalary + hra + STANDARD_ALLOWANCE + performanceBonus + lta);
  fixedAllowance = Number(fixedAllowance.toFixed(2));
  
  // If fixed allowance is negative, we might need to adjust (for edge cases with very low wages)
  if (fixedAllowance < 0) fixedAllowance = 0;

  // Deductions
  const pfContribution = Number((basicSalary * 0.12).toFixed(2));
  
  // Net Salary = Gross (Basic + HRA + Standard + Perf + LTA + Fixed) - Deductions (PF Employee + Prof Tax)
  // Note: PF Employer is an expense to company, not deducted from Gross to get Net typically, 
  // but if gross includes Employer PF, it varies. We assume Net = Gross - Employee PF - PT
  const grossSalary = basicSalary + hra + STANDARD_ALLOWANCE + performanceBonus + lta + fixedAllowance;
  const netSalary = Number((grossSalary - pfContribution - PROFESSIONAL_TAX).toFixed(2));

  return {
    basicSalary,
    hra,
    standardAllowance: STANDARD_ALLOWANCE,
    performanceBonus,
    lta,
    pfContribution,
    professionalTax: PROFESSIONAL_TAX,
    fixedAllowance,
    netSalary
  };
}

module.exports = { calculatePayroll };
