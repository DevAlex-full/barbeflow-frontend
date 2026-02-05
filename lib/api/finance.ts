import api from '@/lib/api';

// ==================== TYPES ====================

export interface CashflowMonth {
  month: string;
  monthNumber: number;
  year: number;
  revenue: number;
  expenses: number;
  netFlow: number;
  transactionCount: number;
}

export interface CashflowResponse {
  cashflow: CashflowMonth[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    averageMonthlyRevenue: number;
    averageMonthlyExpenses: number;
  };
}

export interface DREReport {
  period: { start: string; end: string };
  dre: {
    revenue: {
      services: number;
      products: number;
      others: number;
      total: number;
    };
    expenses: {
      salaries: number;
      commissions: number;
      rent: number;
      utilities: number;
      supplies: number;
      others: number;
      total: number;
    };
    results: {
      operatingProfit: number;
      netProfit: number;
      profitMargin: string;
    };
  };
}

export interface BalanceReport {
  referenceDate: string;
  balance: {
    assets: {
      current: {
        cash: number;
      };
      total: number;
    };
    liabilities: {
      current: {
        commissionsPayable: number;
      };
      total: number;
    };
    equity: {
      total: number;
    };
  };
  verification: {
    balanced: boolean;
    difference: number;
  };
}

// ==================== API CALLS ====================

export const financeApi = {
  // Fluxo de caixa
  getCashflow: async (year?: number, months?: number) => {
    const response = await api.get<CashflowResponse>('/finance/cashflow', {
      params: { year, months }
    });
    return response.data;
  },

  // DRE - Demonstrativo de Resultados
  getDRE: async (startDate?: string, endDate?: string) => {
    const response = await api.get<DREReport>('/finance/dre', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Balanço Patrimonial
  getBalance: async (date?: string) => {
    const response = await api.get<BalanceReport>('/finance/balance', {
      params: { date }
    });
    return response.data;
  }
};