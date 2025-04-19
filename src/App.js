import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip,
  IconButton,
  Fade,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  InfoOutlined, 
  TrendingUp, 
  AccessTime, 
  MonetizationOn,
  CheckCircleOutline,
  Business,
  Cases,
  Assessment,
} from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.01)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

const USE_CASES = [
  { name: 'Incident Management', savings: 30 },
  { name: 'Cloud Migration', savings: 20 },
  { name: 'Compliance and Audits', savings: 85 },
  { name: 'Software License Management', savings: 40 },
  { name: 'Disaster Recovery', savings: 60 },
  { name: 'Data Center Consolidation / DC Foot Print Reduction', savings: 65 },
  { name: 'IT Asset Management', savings: 15 },
  { name: 'IT Operational Efficiency', savings: 60 },
];

function ValueCard({ title, value, icon, trend }) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1.5,
            borderRadius: '50%', 
            bgcolor: 'primary.light', 
            color: 'white',
            mr: 2,
            width: 40,
            height: 40,
            '& svg': {
              fontSize: 24,
            }
          }}>
            {icon}
          </Box>
          <Typography variant="subtitle1" color="secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
        {trend && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1,
            color: trend > 0 ? 'success.main' : 'error.main'
          }}>
            <TrendingUp sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2">
              {Math.abs(trend)}% {trend > 0 ? 'improvement' : 'decline'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [organizationInfo, setOrganizationInfo] = useState({
    companyName: '',
    businessSector: '',
    itEmployeeCost: 120000,
  });

  const [selectedUseCases, setSelectedUseCases] = useState(
    USE_CASES.reduce((acc, useCase) => ({
      ...acc,
      [useCase.name]: {
        selected: false,
        ftes: '',
        hoursPerDay: '',
      }
    }), {})
  );

  const [subscriptionCost, setSubscriptionCost] = useState('');
  const [results, setResults] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOrganizationChange = (event) => {
    const { name, value } = event.target;
    setOrganizationInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUseCaseChange = (useCaseName, field, value) => {
    setSelectedUseCases(prev => ({
      ...prev,
      [useCaseName]: {
        ...prev[useCaseName],
        [field]: value
      }
    }));
  };

  const calculateResults = () => {
    setShowProgress(true);
    
    setTimeout(() => {
      const results = USE_CASES.map(useCase => {
        const currentCase = selectedUseCases[useCase.name];
        if (!currentCase.selected) return { ...useCase, currentCost: 0, withDevice42: 0, totalValue: 0 };

        const hoursPerYear = parseFloat(currentCase.hoursPerDay) * 260; // 260 working days per year
        const ftePercentage = hoursPerYear / (8 * 260); // Percentage of FTE's time (8 hours standard workday)
        const effectiveFTEs = parseFloat(currentCase.ftes) * ftePercentage;
        const currentCost = organizationInfo.itEmployeeCost * effectiveFTEs;

        const withDevice42 = currentCost * (1 - useCase.savings / 100);
        const totalValue = currentCost - withDevice42;

        return {
          ...useCase,
          currentCost,
          withDevice42,
          totalValue
        };
      });

      const totals = results.reduce((acc, curr) => ({
        currentCost: acc.currentCost + curr.currentCost,
        withDevice42: acc.withDevice42 + curr.withDevice42,
        totalValue: acc.totalValue + curr.totalValue
      }), { currentCost: 0, withDevice42: 0, totalValue: 0 });

      const annualSubscriptionCost = parseFloat(subscriptionCost) || 0;
      const threeYearSubscriptionCost = annualSubscriptionCost * 3;
      const threeYearGrossValue = totals.totalValue * 3;
      const projectedNetValue = threeYearGrossValue - threeYearSubscriptionCost;
      const paybackPeriod = annualSubscriptionCost > 0 ? 
        (threeYearGrossValue / threeYearSubscriptionCost) : 0;
      const costOfMonthlyDelay = projectedNetValue / 36;

      setResults({
        useCases: results,
        totals,
        annualSubscriptionCost,
        threeYearSubscriptionCost,
        threeYearGrossValue,
        projectedNetValue,
        paybackPeriod,
        costOfMonthlyDelay
      });
      setShowProgress(false);
    }, 500);
  };

  useEffect(calculateResults, [selectedUseCases, organizationInfo.itEmployeeCost, subscriptionCost]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h1" gutterBottom sx={{ color: 'primary.main' }}>
              Device42 ROI Calculator
            </Typography>
            <Typography variant="body1" color="secondary" sx={{ maxWidth: '600px', mx: 'auto', mb: 2 }}>
              Calculate your potential return on investment with Device42's solutions
            </Typography>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                  }
                }}
              >
                <Tab 
                  icon={<Business />} 
                  label="Organization" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Cases />} 
                  label="Use Cases" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Assessment />} 
                  label="Results" 
                  iconPosition="start"
                  disabled={!Object.values(selectedUseCases).some(uc => uc.selected)}
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      value={organizationInfo.companyName}
                      onChange={handleOrganizationChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Sector / Vertical"
                      name="businessSector"
                      value={organizationInfo.businessSector}
                      onChange={handleOrganizationChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Average Annual Cost of an IT Employee"
                      name="itEmployeeCost"
                      type="number"
                      value={organizationInfo.itEmployeeCost}
                      onChange={handleOrganizationChange}
                      InputProps={{
                        startAdornment: '$',
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <TableContainer>
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Use Case</TableCell>
                        <TableCell padding="checkbox">Select</TableCell>
                        <TableCell>FTEs</TableCell>
                        <TableCell>Hours/Day</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {USE_CASES.map((useCase) => (
                        <TableRow key={useCase.name} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{useCase.name}</TableCell>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUseCases[useCase.name].selected}
                              onChange={(e) => handleUseCaseChange(useCase.name, 'selected', e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={selectedUseCases[useCase.name].ftes}
                              onChange={(e) => handleUseCaseChange(useCase.name, 'ftes', e.target.value)}
                              disabled={!selectedUseCases[useCase.name].selected}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={selectedUseCases[useCase.name].hoursPerDay}
                              onChange={(e) => handleUseCaseChange(useCase.name, 'hoursPerDay', e.target.value)}
                              disabled={!selectedUseCases[useCase.name].selected}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                {!subscriptionCost && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please enter the annual Device42 subscription cost to see the complete ROI analysis
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Annual Device42 Subscription Cost"
                      type="number"
                      value={subscriptionCost}
                      onChange={(e) => setSubscriptionCost(e.target.value)}
                      InputProps={{
                        startAdornment: '$',
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {results && (
                  <>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Summary</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <ValueCard
                            title="3-Year Net Value"
                            value={`$${results.projectedNetValue.toLocaleString()}`}
                            icon={<MonetizationOn />}
                            trend={20}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <ValueCard
                            title="Payback Period"
                            value={`${results.paybackPeriod.toFixed(1)} months`}
                            icon={<AccessTime />}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <ValueCard
                            title="Monthly Delay Cost"
                            value={`$${results.costOfMonthlyDelay.toLocaleString()}`}
                            icon={<MonetizationOn />}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Selected Use Cases</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Use Case</TableCell>
                              <TableCell align="right">Current Cost</TableCell>
                              <TableCell align="right">Savings</TableCell>
                              <TableCell align="right">Value/Year</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {results.useCases
                              .filter(useCase => useCase.currentCost > 0)
                              .map((useCase) => (
                                <TableRow key={useCase.name} hover>
                                  <TableCell>{useCase.name}</TableCell>
                                  <TableCell align="right">${useCase.currentCost.toLocaleString()}</TableCell>
                                  <TableCell align="right">{useCase.savings}%</TableCell>
                                  <TableCell align="right">${useCase.totalValue.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                                ${results.totals.currentCost.toLocaleString()}
                              </TableCell>
                              <TableCell />
                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                                ${results.totals.totalValue.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </>
                )}
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 