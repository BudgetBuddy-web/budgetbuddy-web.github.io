/**
 * Admin Dashboard
 * Analytics and user management for administrators
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersThisMonth: 0,
    pendingAdminRequests: 0,
    registrationData: [],
    loginData: [],
    activityData: []
  });
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch admin statistics
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, selectedMonth, selectedYear]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all users
      const usersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const users = usersResponse.data.data.users;
      
      // Calculate statistics
      const now = new Date();
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      // Filter users based on time range
      let filteredUsers = users;
      if (timeRange === 'month') {
        filteredUsers = users.filter(u => {
          const createdAt = new Date(u.createdAt);
          return createdAt >= startOfMonth && createdAt <= endOfMonth;
        });
      }

      // Calculate active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const activeUsers = users.filter(u => {
        const lastLogin = u.lastLogin ? new Date(u.lastLogin) : new Date(u.createdAt);
        return lastLogin >= thirtyDaysAgo;
      });

      // Generate registration data for graph
      const registrationData = generateRegistrationData(users, timeRange, selectedMonth, selectedYear);
      
      // Generate login frequency data
      const loginData = generateLoginData(users, timeRange);
      
      // Activity distribution
      const activityData = calculateActivityDistribution(users);

      // Count pending admin requests
      const pendingRequests = users.filter(u => u.adminRequestPending === true).length;

      setStats({
        totalUsers: users.length,
        activeUsers: activeUsers.length,
        inactiveUsers: users.length - activeUsers.length,
        newUsersThisMonth: filteredUsers.length,
        pendingAdminRequests: pendingRequests,
        registrationData,
        loginData,
        activityData
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const generateRegistrationData = (users, range, month, year) => {
    const data = {};
    
    if (range === 'month') {
      // Days in selected month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        data[i] = 0;
      }
      
      users.forEach(user => {
        const createdAt = new Date(user.createdAt);
        if (createdAt.getMonth() === month && createdAt.getFullYear() === year) {
          const day = createdAt.getDate();
          data[day] = (data[day] || 0) + 1;
        }
      });
      
      return {
        labels: Object.keys(data).map(d => `Day ${d}`),
        datasets: [{
          label: 'New Registrations',
          data: Object.values(data),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          tension: 0.4
        }]
      };
    } else if (range === 'year') {
      // Months in selected year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach((m, i) => data[i] = 0);
      
      users.forEach(user => {
        const createdAt = new Date(user.createdAt);
        if (createdAt.getFullYear() === year) {
          const month = createdAt.getMonth();
          data[month] = (data[month] || 0) + 1;
        }
      });
      
      return {
        labels: months,
        datasets: [{
          label: 'New Registrations',
          data: Object.values(data),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          tension: 0.4
        }]
      };
    } else {
      // All time - group by month
      users.forEach(user => {
        const createdAt = new Date(user.createdAt);
        const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        data[key] = (data[key] || 0) + 1;
      });
      
      return {
        labels: Object.keys(data).sort(),
        datasets: [{
          label: 'New Registrations',
          data: Object.values(data),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          tension: 0.4
        }]
      };
    }
  };

  const generateLoginData = (users) => {
    // Simulate login frequency (in real app, track actual login events)
    const frequency = {
      'Daily': 0,
      'Weekly': 0,
      'Monthly': 0,
      'Rarely': 0
    };

    const now = new Date();
    users.forEach(user => {
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(user.createdAt);
      const daysSinceLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLogin < 1) frequency['Daily']++;
      else if (daysSinceLogin < 7) frequency['Weekly']++;
      else if (daysSinceLogin < 30) frequency['Monthly']++;
      else frequency['Rarely']++;
    });

    return {
      labels: Object.keys(frequency),
      datasets: [{
        label: 'User Activity',
        data: Object.values(frequency),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(192, 132, 252, 0.8)',
          'rgba(216, 180, 254, 0.8)'
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(168, 85, 247)',
          'rgb(192, 132, 252)',
          'rgb(216, 180, 254)'
        ],
        borderWidth: 2
      }]
    };
  };

  const calculateActivityDistribution = (users) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const active = users.filter(u => {
      const lastLogin = u.lastLogin ? new Date(u.lastLogin) : new Date(u.createdAt);
      return lastLogin >= thirtyDaysAgo;
    }).length;
    
    const inactive = users.length - active;

    return {
      labels: ['Active (30 days)', 'Inactive'],
      datasets: [{
        data: [active, inactive],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }]
    };
  };

  const generatePDFReport = async () => {
    try {
      toast.info('Generating PDF report with charts...');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(147, 51, 234);
      pdf.text('📊 BudgetBuddy Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Add Key Metrics section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Key Metrics', 20, yPosition);
      yPosition += 10;

      // Create metrics boxes
      const metrics = [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Active Users', value: stats.activeUsers },
        { label: 'New This Month', value: stats.newUsersThisMonth }
      ];

      pdf.setFontSize(10);
      let xPosition = 25;
      metrics.forEach((metric, index) => {
        pdf.setDrawColor(147, 51, 234);
        pdf.setLineWidth(1);
        pdf.rect(xPosition, yPosition, 50, 25);
        
        pdf.setFontSize(20);
        pdf.setTextColor(147, 51, 234);
        pdf.text(metric.value.toString(), xPosition + 25, yPosition + 12, { align: 'center' });
        
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(metric.label, xPosition + 25, yPosition + 20, { align: 'center' });
        
        xPosition += 55;
      });

      yPosition += 35;

      // Add User Growth Summary
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('User Growth Summary', 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      const activePercentage = ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1);
      pdf.text(`Active users represent ${activePercentage}% of total user base.`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Company shows ${stats.newUsersThisMonth > 0 ? 'positive' : 'stable'} growth trend.`, 20, yPosition);
      yPosition += 15;

      // Capture and add User Registration Trend chart
      const registrationChartElement = document.getElementById('registration-chart');
      if (registrationChartElement) {
        try {
          const canvas = await html2canvas(registrationChartElement, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 0);
          pdf.text('User Registration Trend', 20, yPosition);
          yPosition += 5;
          
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error('Error capturing registration chart:', error);
        }
      }

      // Add new page for more charts if needed
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      // Capture and add Activity Distribution chart
      const activityChartElement = document.getElementById('activity-chart');
      if (activityChartElement) {
        try {
          const canvas = await html2canvas(activityChartElement, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 0);
          pdf.text('Activity Distribution', 20, yPosition);
          yPosition += 5;
          
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error('Error capturing activity chart:', error);
        }
      }

      // Capture and add User Distribution Pie chart
      const pieChartElement = document.getElementById('pie-chart');
      if (pieChartElement) {
        try {
          const canvas = await html2canvas(pieChartElement, { scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(14);
          pdf.setTextColor(0, 0, 0);
          pdf.text('User Distribution', 20, yPosition);
          yPosition += 5;
          
          const imgWidth = (pageWidth - 40) / 2;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', pageWidth / 2 - imgWidth / 2, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error('Error capturing pie chart:', error);
        }
      }

      // Add footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      const footerY = pageHeight - 10;
      pdf.text('This report is generated by BudgetBuddy Admin Dashboard', pageWidth / 2, footerY, { align: 'center' });
      pdf.text(`© ${new Date().getFullYear()} BudgetBuddy. All rights reserved.`, pageWidth / 2, footerY + 4, { align: 'center' });

      // Save the PDF
      pdf.save(`BudgetBuddy-Analytics-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  if (loading) {
    return (
      <Container className="admin-dashboard mt-5">
        <div className="text-center">
          <div className="spinner-border text-purple" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-dashboard" fluid>
      <div className="dashboard-header">
        <div>
          <h1>📊 Admin Analytics Dashboard</h1>
          <p className="text-muted">Company Growth & User Insights</p>
        </div>
        <Button variant="primary" onClick={generatePDFReport} className="print-btn">
          🖨️ Generate Report
        </Button>
      </div>

      {/* Time Range Selector */}
      <Card className="mb-4 time-selector-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Time Range</Form.Label>
                <Form.Select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="form-control"
                >
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {timeRange === 'month' && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Month</Form.Label>
                  <Row>
                    <Col>
                      <Form.Select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December']
                          .map((month, idx) => (
                            <option key={idx} value={idx}>{month}</option>
                          ))}
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      >
                        {[2023, 2024, 2025, 2026].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card stat-card-purple">
            <Card.Body>
              <div className="stat-icon">👥</div>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card stat-card-green">
            <Card.Body>
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.activeUsers}</div>
              <div className="stat-label">Active Users</div>
              <small className="text-muted">Last 30 days</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card stat-card-blue">
            <Card.Body>
              <div className="stat-icon">📈</div>
              <div className="stat-number">{stats.newUsersThisMonth}</div>
              <div className="stat-label">New Registrations</div>
              <small className="text-muted">Selected period</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card stat-card-orange">
            <Card.Body>
              <div className="stat-icon">💤</div>
              <div className="stat-number">{stats.inactiveUsers}</div>
              <div className="stat-label">Inactive Users</div>
              <small className="text-muted">30+ days</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="chart-card" id="registration-chart">
            <Card.Header>
              <h5>📊 User Registration Trend</h5>
              <p className="mb-0 text-muted">New user signups over time</p>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={stats.registrationData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="chart-card" id="pie-chart">
            <Card.Header>
              <h5>👁️ User Activity Status</h5>
              <p className="mb-0 text-muted">Active vs Inactive</p>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Pie data={stats.activityData} options={pieOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card className="chart-card" id="activity-chart">
            <Card.Header>
              <h5>🔄 Login Frequency Distribution</h5>
              <p className="mb-0 text-muted">How often users visit</p>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={stats.loginData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="chart-card insight-card">
            <Card.Header>
              <h5>💡 Key Insights</h5>
            </Card.Header>
            <Card.Body>
              <div className="insight-item">
                <div className="insight-icon">📈</div>
                <div>
                  <h6>User Engagement</h6>
                  <p>
                    {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of users 
                    are actively using the platform
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🎯</div>
                <div>
                  <h6>Growth Rate</h6>
                  <p>
                    {stats.newUsersThisMonth} new registrations in selected period
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">⭐</div>
                <div>
                  <h6>Platform Health</h6>
                  <p>
                    {stats.inactiveUsers < stats.activeUsers ? 
                      'Strong user retention and engagement' : 
                      'Consider user re-engagement campaigns'}
                  </p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🚀</div>
                <div>
                  <h6>Recommendation</h6>
                  <p>
                    {stats.newUsersThisMonth > 10 ? 
                      'Excellent growth! Maintain current strategies.' : 
                      'Focus on user acquisition and marketing.'}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="action-card">
            <Card.Body>
              <h5>⚡ Quick Actions</h5>
              <div className="action-buttons">
                <Button 
                  variant="outline-warning" 
                  onClick={() => navigate('/admin/requests')}
                  className="position-relative"
                >
                  👑 Admin Requests
                  {stats.pendingAdminRequests > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {stats.pendingAdminRequests}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/admin/users')}
                >
                  👥 Manage Users
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={generatePDFReport}
                >
                  📄 Export Report
                </Button>
                <Button 
                  variant="outline-info" 
                  onClick={fetchStats}
                >
                  🔄 Refresh Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
