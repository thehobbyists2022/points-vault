export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface ParseResult {
  issuer: 'Chase' | 'Amex' | 'CapitalOne' | 'Citi' | 'Generic';
  transactions: ParsedTransaction[];
  totalSpend: number;
  errors: string[];
}

function parseCSVLines(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"+|"+$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"+|"+$/g, ''));
    return result;
  });
}

export function parseCSV(csvText: string): ParseResult {
  const rows = parseCSVLines(csvText);
  if (rows.length < 2) {
    return { issuer: 'Generic', transactions: [], totalSpend: 0, errors: ['CSV file is empty or missing headers.'] };
  }

  const header = rows[0].map((h) => h.toLowerCase());
  const dataRows = rows.slice(1);
  const transactions: ParsedTransaction[] = [];
  let issuer: ParseResult['issuer'] = 'Generic';

  // Detect Issuer Strategy
  if (header.includes('transaction date') && header.includes('post date') && header.includes('type')) {
    issuer = 'Chase';
  } else if (header.includes('appears on your statement as') || header.includes('extended details')) {
    issuer = 'Amex';
  } else if (header.includes('card no.') && header.includes('debit')) {
    issuer = 'CapitalOne';
  } else if (header.includes('status') && header.includes('debit') && header.includes('credit')) {
    issuer = 'Citi';
  }

  dataRows.forEach((row) => {
    if (row.length < 3) return;

    if (issuer === 'Chase') {
      // Chase: Transaction Date, Post Date, Description, Category, Type, Amount, Memo
      const date = row[0] || '';
      const desc = row[2] || '';
      const cat = row[3] || '';
      const amtStr = row[5] || '0';
      const rawAmt = parseFloat(amtStr.replace(/[^0-9.-]+/g, ''));
      // Chase charges are negative numbers, payments positive
      if (!isNaN(rawAmt) && rawAmt < 0) {
        const spend = Math.abs(rawAmt);
        transactions.push({ date, description: desc, amount: spend, category: cat });
      }
    } else if (issuer === 'Amex') {
      // Amex: Date, Description, Amount, Extended Details...
      const date = row[0] || '';
      const desc = row[1] || '';
      const amtStr = row[2] || '0';
      const rawAmt = parseFloat(amtStr.replace(/[^0-9.-]+/g, ''));
      // Amex charges are positive numbers
      if (!isNaN(rawAmt) && rawAmt > 0) {
        transactions.push({ date, description: desc, amount: rawAmt });
      }
    } else if (issuer === 'CapitalOne') {
      // CapOne: Transaction Date, Posted Date, Card No., Description, Category, Debit, Credit
      const date = row[0] || '';
      const desc = row[3] || '';
      const cat = row[4] || '';
      const debitStr = row[5] || '';
      const debitAmt = parseFloat(debitStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(debitAmt) && debitAmt > 0) {
        transactions.push({ date, description: desc, amount: debitAmt, category: cat });
      }
    } else {
      // GenericFallback
      const date = row[0] || '';
      const desc = row[1] || '';
      const amtStr = row[2] || '0';
      const amt = Math.abs(parseFloat(amtStr.replace(/[^0-9.-]+/g, '')));
      if (!isNaN(amt) && amt > 0) {
        transactions.push({ date, description: desc, amount: amt });
      }
    }
  });

  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    issuer,
    transactions,
    totalSpend,
    errors: transactions.length === 0 ? ['No valid spend transactions detected.'] : [],
  };
}
