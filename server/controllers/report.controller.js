/**
 * Report Controller
 * Handles financial summaries and exports
 */

const Transaction = require('../models/Transaction.model');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

/**
 * @route   GET /api/reports/summary
 * @desc    Get financial summary
 * @access  Private
 */
exports.getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    // Calculate date range
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    // Get all transactions for the period
    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate totals
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Category-wise breakdown
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    // Savings analysis
    const savingsGoal = req.user.savingsGoal || 5000;
    const savings = income - expenses;
    const savingsPercentage = income > 0 ? ((savings / income) * 100) : 0;

    // Generate insights
    const insights = [];
    if (savings >= savingsGoal) {
      insights.push(`Excellent! You saved ₹${savings.toFixed(2)}, exceeding your goal by ₹${(savings - savingsGoal).toFixed(2)}`);
    } else if (savings > 0) {
      insights.push(`You saved ₹${savings.toFixed(2)} this month (${savingsPercentage.toFixed(2)}% of income)`);
    } else if (savings < 0) {
      insights.push(`Warning: You spent ₹${Math.abs(savings).toFixed(2)} more than you earned`);
    }

    // Find highest expense category
    const highestCategory = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])[0];
    if (highestCategory) {
      insights.push(`Your highest expense category is ${highestCategory[0]} (₹${highestCategory[1].toFixed(2)})`);
    }

    res.json({
      success: true,
      data: {
        period: {
          month: targetMonth,
          year: targetYear,
          startDate,
          endDate
        },
        summary: {
          totalIncome: income,
          totalExpenses: expenses,
          balance,
          savingsGoal,
          savings,
          savingsPercentage: parseFloat(savingsPercentage.toFixed(2))
        },
        categoryBreakdown,
        insights,
        transactions, // Include actual transactions for printing
        transactionCount: {
          income: transactions.filter(t => t.type === 'income').length,
          expense: transactions.filter(t => t.type === 'expense').length,
          total: transactions.length
        }
      }
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/reports/export/csv
 * @desc    Export transactions as CSV
 * @access  Private
 */
exports.exportCSV = async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    const query = { userId: req.user._id };
    
    // Handle month/year filtering
    if (month && year) {
      const targetMonth = parseInt(month);
      const targetYear = parseInt(year);
      const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
      const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } 
    // Handle startDate/endDate filtering (legacy support)
    else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    const fields = ['type', 'category', 'amount', 'date', 'note'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting CSV',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/reports/export/pdf
 * @desc    Export transactions as PDF
 * @access  Private
 */
exports.exportPDF = async (req, res) => {
  try {
    const { startDate, endDate, month, year } = req.query;
    
    const query = { userId: req.user._id };
    
    // Handle month/year filtering
    if (month && year) {
      const targetMonth = parseInt(month);
      const targetYear = parseInt(year);
      const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
      const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } 
    // Handle startDate/endDate filtering (legacy support)
    else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Create PDF
    const doc = new PDFDocument();
    
    res.header('Content-Type', 'application/pdf');
    res.attachment('transactions.pdf');
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('BudgetBuddy - Transaction Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated for: ${req.user.name}`, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Transactions
    doc.fontSize(14).text('Transactions', { underline: true });
    doc.moveDown();

    transactions.forEach((transaction, index) => {
      doc.fontSize(10)
        .text(`${index + 1}. ${transaction.type.toUpperCase()} - ${transaction.category}`)
        .text(`   Amount: ₹${transaction.amount}`)
        .text(`   Date: ${new Date(transaction.date).toLocaleDateString()}`)
        .text(`   Note: ${transaction.note || 'N/A'}`)
        .moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting PDF',
      error: error.message
    });
  }
};
