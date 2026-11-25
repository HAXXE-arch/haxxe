/**
 * Simulates monthly compounded portfolio growth and generates an annual schedule.
 * @param {{ initial: number, monthly: number, annualRate: number, years: number }} params
 */
export function simulateCompoundInterest({ initial, monthly, annualRate, years }) {
  const safeInitial = Math.max(0, Number(initial) || 0);
  const safeMonthly = Math.max(0, Number(monthly) || 0);
  const safeAnnualRate = Math.max(0, Math.min(50, Number(annualRate) || 0));
  const safeYears = Math.max(1, Math.min(40, Math.round(Number(years) || 1)));

  const monthlyRate = safeAnnualRate / 100 / 12;
  const yearlySeries = [
    {
      year: 0,
      deposit: safeInitial,
      interest: 0,
      balance: safeInitial,
    },
  ];

  let balance = safeInitial;
  let totalDeposit = safeInitial;

  for (let year = 1; year <= safeYears; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + safeMonthly;
      totalDeposit += safeMonthly;
    }

    const interest = Math.max(0, balance - totalDeposit);
    yearlySeries.push({
      year,
      deposit: Math.round(totalDeposit),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  const finalPoint = yearlySeries[yearlySeries.length - 1];

  return {
    initial: safeInitial,
    monthly: safeMonthly,
    annualRate: safeAnnualRate,
    years: safeYears,
    totalDeposit: finalPoint.deposit,
    totalInterest: finalPoint.interest,
    finalBalance: finalPoint.balance,
    yearlySeries,
  };
}
