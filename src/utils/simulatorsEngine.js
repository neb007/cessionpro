const safeNumber = (value, fallback = 0) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const qualityDeltaMap = {
  dependencyRisk: {
    high: -0.15,
    medium: -0.05,
    low: 0.05
  },
  clientConcentration: {
    high: -0.1,
    medium: -0.03,
    low: 0
  },
  revenueRecurrence: {
    high: 0.15,
    medium: 0.05,
    low: -0.1
  }
};

const businessMultipleMap = {
  saas: 2.75,
  ecommerce: 3.75,
  agence: 6,
  services: 5,
  other: 4.5
};

const getQualityMultiplier = ({ dependencyRisk, clientConcentration, revenueRecurrence }) => {
  const delta =
    (qualityDeltaMap.dependencyRisk[dependencyRisk] ?? 0) +
    (qualityDeltaMap.clientConcentration[clientConcentration] ?? 0) +
    (qualityDeltaMap.revenueRecurrence[revenueRecurrence] ?? 0);

  return clamp(1 + delta, 0.8, 1.25);
};

const getBusinessMultiple = (businessModel) => {
  const key = String(businessModel || '').toLowerCase();
  return businessMultipleMap[key] ?? businessMultipleMap.other;
};

const loanMonthlyPayment = (principal, yearlyRatePercent, months) => {
  const principalSafe = Math.max(0, safeNumber(principal));
  const monthsSafe = Math.max(1, Math.floor(safeNumber(months, 1)));
  const monthlyRate = Math.max(0, safeNumber(yearlyRatePercent) / 100) / 12;

  if (principalSafe === 0) return 0;
  if (monthlyRate === 0) return principalSafe / monthsSafe;

  const factor = Math.pow(1 + monthlyRate, monthsSafe);
  return principalSafe * ((monthlyRate * factor) / (factor - 1));
};

export function computeValuation(input) {
  const revenue = safeNumber(input.revenue);
  const ebitda = safeNumber(input.ebitda);
  const netIncome = safeNumber(input.netIncome);
  const ownerSalary = safeNumber(input.ownerSalary);
  const equity = safeNumber(input.equity);
  const cash = safeNumber(input.cash);
  const debt = safeNumber(input.debt);
  const growthRate = clamp(safeNumber(input.growthRate, 10), 0, 35) / 100;

  const qualityMultiplier = getQualityMultiplier(input);
  const normOwnerSalary = revenue > 1_000_000 ? 80_000 : 50_000;
  const ebitdaAdjusted = ebitda + ownerSalary - normOwnerSalary;

  const capRateAdjusted = 0.12 / qualityMultiplier;
  const valueRendement = netIncome > 0 ? netIncome / capRateAdjusted : 0;

  const valueMath = equity;
  const valueBercy = (valueMath + valueRendement) / 2;

  const multiple = getBusinessMultiple(input.businessModel) * qualityMultiplier;
  const enterpriseByMultiple =
    String(input.businessModel || '').toLowerCase() === 'saas'
      ? revenue * multiple
      : Math.max(0, ebitdaAdjusted) * multiple;

  const equityByMultiple = enterpriseByMultiple + cash - debt;

  const taxRate = 0.25;
  const waccAdjusted = clamp(0.15 + (1 - qualityMultiplier) * 0.08, 0.12, 0.22);
  const fcfYear1 = Math.max(0, ebitdaAdjusted * (1 - taxRate));
  const fcf = [1, 2, 3, 4, 5].map((year) => fcfYear1 * Math.pow(1 + growthRate, year - 1));
  const discountedFcf = fcf.reduce((sum, value, index) => sum + value / Math.pow(1 + waccAdjusted, index + 1), 0);
  const terminalValue = fcf[4] / waccAdjusted;
  const terminalDiscounted = terminalValue / Math.pow(1 + waccAdjusted, 5);
  const enterpriseByDcf = discountedFcf + terminalDiscounted;
  const equityByDcf = enterpriseByDcf + cash - debt;

  const sortedRange = [
    Math.max(0, valueBercy),
    Math.max(0, equityByMultiple),
    Math.max(0, equityByDcf)
  ].sort((a, b) => a - b);

  return {
    low: sortedRange[0],
    mid: sortedRange[1],
    high: sortedRange[2],
    details: {
      qualityMultiplier,
      ebitdaAdjusted,
      capRateAdjusted,
      valueBercy,
      equityByMultiple,
      equityByDcf
    }
  };
}

export function computeFinancing(input) {
  const acquisitionPrice = safeNumber(input.acquisitionPrice);
  const ebitda = safeNumber(input.ebitda);
  const netIncome = safeNumber(input.netIncome);
  const futureInvestments = safeNumber(input.futureInvestments);

  const personalContribution = safeNumber(input.personalContribution);
  const mobilizableAssets = safeNumber(input.mobilizableAssets);
  const investorsAmount = safeNumber(input.investorsAmount);
  const aidsAmount = safeNumber(input.aidsAmount);
  const earnOutAmount = safeNumber(input.earnOutAmount);
  const sellerCreditPct = clamp(safeNumber(input.sellerCreditPct), 0, 100);
  const sellerCreditAmount = acquisitionPrice * (sellerCreditPct / 100);

  const debtMultipleBase = clamp(
    4 + (input.sectorExperience === 'yes' ? 0.5 : -0.5) + (input.personalGuarantee === 'yes' ? 0.25 : 0),
    3,
    5
  );
  const debtMax = Math.max(0, ebitda * debtMultipleBase);

  const financingWithoutBank =
    personalContribution + mobilizableAssets + investorsAmount + aidsAmount + earnOutAmount + sellerCreditAmount;
  const bankDebtNeeded = Math.max(0, acquisitionPrice - financingWithoutBank);

  const bankDebtAllocated = Math.min(bankDebtNeeded, debtMax);
  const mezzanineNeeded = Math.max(0, bankDebtNeeded - bankDebtAllocated);

  const loanDurationYears = Math.max(1, Math.floor(safeNumber(input.loanDurationYears, 7)));
  const loanDurationMonths = loanDurationYears * 12;
  const interestRate = clamp(safeNumber(input.interestRate, 4.5), 0, 25);
  const monthlyPayment = loanMonthlyPayment(bankDebtAllocated, interestRate, loanDurationMonths);
  const annualDebtService = monthlyPayment * 12;

  const corporateTax = Math.max(0, netIncome) * 0.25;
  const managerSalaryTarget = Math.max(0, safeNumber(input.managerSalaryTarget, 40_000));
  const cashBeforeSalary = ebitda - annualDebtService - corporateTax - futureInvestments;
  const cashAfterSalary = cashBeforeSalary - managerSalaryTarget;
  const dscr = annualDebtService > 0 ? (ebitda - corporateTax - futureInvestments) / annualDebtService : 999;

  const minContributionRecommended = acquisitionPrice * 0.2;
  const roiEstimate = personalContribution > 0 ? (cashAfterSalary / personalContribution) * 100 : 0;
  const paybackYears = cashAfterSalary > 0 && personalContribution > 0 ? personalContribution / cashAfterSalary : null;
  const possibleSalary = Math.max(0, cashBeforeSalary * 0.7);

  const alerts = [];
  if (personalContribution < minContributionRecommended) alerts.push('apport_insuffisant');
  if (ebitda <= 0) alerts.push('rentabilite_trop_faible');
  if (dscr < 1.2) alerts.push('risque_bancaire');
  if (bankDebtNeeded > debtMax) alerts.push('dette_excessive');
  if (cashAfterSalary < 0) alerts.push('salaire_non_viable');

  let status = 'Risqué';
  if (dscr >= 1.2 && bankDebtNeeded <= debtMax && personalContribution >= minContributionRecommended) {
    status = 'Finançable';
  } else if (dscr >= 1 && bankDebtNeeded <= debtMax * 1.2 && personalContribution >= acquisitionPrice * 0.1) {
    status = 'Sous conditions';
  }

  return {
    status,
    monthlyPayment,
    annualCashAvailable: cashAfterSalary,
    indicators: {
      minContributionRecommended,
      debtMax,
      dscr,
      roiEstimate,
      possibleSalary,
      paybackYears
    },
    montage: {
      personalContribution,
      mobilizableAssets,
      bankDebt: bankDebtAllocated,
      sellerCredit: sellerCreditAmount,
      mezzanine: mezzanineNeeded,
      investors: investorsAmount,
      aids: aidsAmount,
      earnOut: earnOutAmount
    },
    alerts
  };
}

const taxBracketToRate = (taxBracketPercent) => {
  const bracket = clamp(safeNumber(taxBracketPercent, 30), 0, 45);
  return bracket / 100;
};

const computeTaxScenario = ({
  regime,
  plusValueBrute,
  taxBracket,
  abatementRate,
  retirementPlanned,
  age,
  salePrice,
  feesAmount,
  repaidDebts
}) => {
  const taxableBase = Math.max(0, plusValueBrute * (1 - abatementRate));
  const retirementEligible = retirementPlanned === 'yes' && safeNumber(age) >= 60;
  const retirementExemption = retirementEligible ? Math.min(500_000, taxableBase) : 0;
  const taxableForIncomeTax = Math.max(0, taxableBase - retirementExemption);

  let incomeTax = 0;
  if (regime === 'pfu') {
    incomeTax = taxableForIncomeTax * 0.128;
  } else {
    incomeTax = taxableForIncomeTax * taxBracketToRate(taxBracket);
  }

  const socialTaxes = taxableBase * 0.172;
  const totalTaxes = incomeTax + socialTaxes;
  const netSeller = salePrice - totalTaxes - feesAmount - repaidDebts;
  const effectiveTaxRate = salePrice > 0 ? (totalTaxes / salePrice) * 100 : 0;

  return {
    taxableBase,
    retirementExemption,
    incomeTax,
    socialTaxes,
    totalTaxes,
    netSeller,
    effectiveTaxRate
  };
};

export function computeNetSeller(input) {
  const salePrice = safeNumber(input.salePrice);
  const purchasePrice = safeNumber(input.purchasePrice);
  const contributions = safeNumber(input.contributions);
  const repaidDebts = safeNumber(input.repaidDebts);

  const feesMode = input.feesMode === 'percent' ? 'percent' : 'amount';
  const feesValue = safeNumber(input.feesValue);
  const feesAmount = feesMode === 'percent' ? salePrice * (feesValue / 100) : feesValue;

  const holdingDurationYears = Math.max(0, safeNumber(input.holdingDurationYears));
  const manualAbatementRate = clamp(safeNumber(input.manualAbatementRate), 0, 100) / 100;
  const holdingAbatementRate =
    holdingDurationYears >= 8 ? 0.65 :
    holdingDurationYears >= 2 ? 0.5 :
    0;

  const plusValueBrute = salePrice - purchasePrice - contributions - feesAmount;

  const pfu = computeTaxScenario({
    regime: 'pfu',
    plusValueBrute,
    taxBracket: input.taxBracket,
    abatementRate: manualAbatementRate,
    retirementPlanned: 'no',
    age: input.age,
    salePrice,
    feesAmount,
    repaidDebts
  });

  const bareme = computeTaxScenario({
    regime: 'bareme',
    plusValueBrute,
    taxBracket: input.taxBracket,
    abatementRate: Math.max(manualAbatementRate, holdingAbatementRate),
    retirementPlanned: 'no',
    age: input.age,
    salePrice,
    feesAmount,
    repaidDebts
  });

  const retraite = computeTaxScenario({
    regime: 'bareme',
    plusValueBrute,
    taxBracket: input.taxBracket,
    abatementRate: Math.max(manualAbatementRate, holdingAbatementRate),
    retirementPlanned: input.retirementPlanned,
    age: input.age,
    salePrice,
    feesAmount,
    repaidDebts
  });

  const selectedScenario = input.taxRegime === 'bareme' ? bareme : pfu;
  const alerts = [];

  if (pfu.netSeller > bareme.netSeller * 1.03) {
    alerts.push('optimisation_fiscale_possible');
  }
  if (String(input.holdingMode || '').toLowerCase() === 'direct') {
    alerts.push('vente_via_holding_a_etudier');
  }
  if (input.retirementPlanned !== 'yes' && safeNumber(input.age) >= 57) {
    alerts.push('depart_retraite_a_anticiper');
  }
  if (selectedScenario.effectiveTaxRate > 35) {
    alerts.push('risque_sur_imposition');
  }

  return {
    plusValueBrute,
    netSeller: selectedScenario.netSeller,
    taxableCapitalGain: selectedScenario.taxableBase,
    effectiveTaxRate: selectedScenario.effectiveTaxRate,
    totalTaxes: selectedScenario.totalTaxes,
    feesAmount,
    finalCashReceived: selectedScenario.netSeller,
    scenarios: {
      pfu,
      bareme,
      retraite
    },
    alerts
  };
}

