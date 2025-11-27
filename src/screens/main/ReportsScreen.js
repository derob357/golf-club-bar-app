import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, Platform} from 'react-native';
import {
  Card,
  Title,
  Button,
  Text,
  DataTable,
  SegmentedButtons,
  Surface,
  ActivityIndicator,
  Menu,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {useSettings} from '../../context/SettingsContext';
import {useAuth} from '../../context/AuthContext';
import FirebaseService from '../../services/FirebaseService';

const ReportsScreen = () => {
  const {isManager} = useAuth();
  const {
    reportFilter,
    updateReportFilter,
    getDateRangeForTimeframe,
    TIMEFRAME_OPTIONS,
  } = useSettings();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState('start');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (isManager()) {
      loadOrders();
    }
  }, [reportFilter.timeframe, reportFilter.startDate, reportFilter.endDate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const {start, end} = getDateRangeForTimeframe(reportFilter.timeframe);
      const orderData = await FirebaseService.getOrdersByTimeframe(start, end);
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    try {
      if (!Array.isArray(orders) || orders.length === 0) {
        return {
          totalSales: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          topItems: [],
        };
      }

      const totalSales = orders.reduce((sum, order) => {
        if (!order || typeof order.total !== 'number') return sum;
        return sum + order.total;
      }, 0);
      
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      const itemCounts = {};
      orders.forEach(order => {
        if (!order || !Array.isArray(order.items)) return;
        
        order.items.forEach(item => {
          if (!item || !item.name || typeof item.quantity !== 'number') return;
          
          const itemName = String(item.name);
          if (itemCounts[itemName]) {
            itemCounts[itemName] += item.quantity;
          } else {
            itemCounts[itemName] = item.quantity;
          }
        });
      });

      const topItems = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({name, count}));

      return {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
        topItems,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        topItems: [],
      };
    }
  };

  const generateHTMLReport = () => {
    const stats = calculateStats();
    const {start, end} = getDateRangeForTimeframe(reportFilter.timeframe);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1B5E20; }
          .header { margin-bottom: 20px; }
          .stats { margin: 20px 0; }
          .stat-box { 
            display: inline-block; 
            padding: 15px; 
            margin: 10px; 
            background: #f5f5f5; 
            border-radius: 8px;
          }
          .stat-value { font-size: 24px; font-weight: bold; color: #1B5E20; }
          .stat-label { font-size: 14px; color: #757575; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #1B5E20; color: white; }
          .footer { margin-top: 40px; text-align: center; color: #757575; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Golf Club Bar - Sales Report</h1>
          <p><strong>Report Period:</strong> ${format(start, 'MMM dd, yyyy')} - ${format(end, 'MMM dd, yyyy')}</p>
          <p><strong>Generated:</strong> ${format(new Date(), 'MMM dd, yyyy HH:mm')}</p>
        </div>

        <div class="stats">
          <h2>Summary</h2>
          <div class="stat-box">
            <div class="stat-value">$${stats.totalSales.toFixed(2)}</div>
            <div class="stat-label">Total Sales</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${stats.totalOrders}</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">$${stats.avgOrderValue.toFixed(2)}</div>
            <div class="stat-label">Avg Order Value</div>
          </div>
        </div>

        <h2>Top Selling Items</h2>
        <table>
          <tr>
            <th>Item Name</th>
            <th>Quantity Sold</th>
          </tr>
          ${stats.topItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.count}</td>
            </tr>
          `).join('')}
        </table>

        <h2>Order Details</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Member ID</th>
            <th>Member Name</th>
            <th>Items</th>
            <th>Total</th>
          </tr>
          ${orders.map(order => {
            if (!order) return '';
            
            let orderDate = 'N/A';
            try {
              if (order.timestamp && typeof order.timestamp.toDate === 'function') {
                orderDate = format(order.timestamp.toDate(), 'MMM dd, HH:mm');
              } else if (order.timestamp instanceof Date) {
                orderDate = format(order.timestamp, 'MMM dd, HH:mm');
              }
            } catch (e) {
              console.error('Error formatting date:', e);
            }
            
            const memberId = order.memberId || 'N/A';
            const memberName = order.memberName || 'Unknown';
            const itemCount = Array.isArray(order.items) ? order.items.length : 0;
            const total = typeof order.total === 'number' ? order.total.toFixed(2) : '0.00';
            
            return `
            <tr>
              <td>${orderDate}</td>
              <td>${memberId}</td>
              <td>${memberName}</td>
              <td>${itemCount}</td>
              <td>$${total}</td>
            </tr>
            `;
          }).join('')}
        </table>

        <div class="footer">
          <p>Golf Club Bar Management System</p>
        </div>
      </body>
      </html>
    `;

    return html;
  };

  const handlePrintReport = async () => {
    try {
      const html = generateHTMLReport();
      await RNPrint.print({html});
    } catch (error) {
      console.error('Error printing report:', error);
      Alert.alert('Error', 'Failed to print report');
    }
  };

  const handleSaveReport = async () => {
    try {
      const html = generateHTMLReport();
      const {start, end} = getDateRangeForTimeframe(reportFilter.timeframe);
      const fileName = `SalesReport_${format(start, 'yyyy-MM-dd')}_to_${format(end, 'yyyy-MM-dd')}.pdf`;

      const options = {
        html,
        fileName,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      Alert.alert(
        'Success',
        `Report saved to ${file.filePath}`,
        [
          {text: 'OK'},
          {
            text: 'Share',
            onPress: () => Share.open({url: `file://${file.filePath}`}),
          },
        ],
      );
    } catch (error) {
      console.error('Error saving report:', error);
      Alert.alert('Error', 'Failed to save report');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    
    try {
      if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        if (datePickerType === 'start') {
          updateReportFilter({startDate: selectedDate});
        } else if (datePickerType === 'end') {
          updateReportFilter({endDate: selectedDate});
        }
      }
    } catch (error) {
      console.error('Error updating date:', error);
      Alert.alert('Error', 'Failed to update date');
    }
  };

  if (!isManager()) {
    return (
      <View style={styles.accessDenied}>
        <Icon name="lock" size={80} color="#D32F2F" />
        <Title style={styles.accessTitle}>Access Denied</Title>
        <Text style={styles.accessText}>
          Only managers can view reports
        </Text>
      </View>
    );
  }

  const stats = calculateStats();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        {/* Timeframe Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Report Period</Title>
            <SegmentedButtons
              value={reportFilter.timeframe}
              onValueChange={value =>
                updateReportFilter({timeframe: value})
              }
              buttons={TIMEFRAME_OPTIONS.slice(0, 4).map(option => ({
                value: option.value,
                label: option.label,
              }))}
              style={styles.segmentedButtons}
            />

            {reportFilter.timeframe === 'custom' && (
              <View style={styles.customDateContainer}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setDatePickerType('start');
                    setShowDatePicker(true);
                  }}
                  style={styles.dateButton}>
                  Start: {format(reportFilter.startDate, 'MMM dd, yyyy')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setDatePickerType('end');
                    setShowDatePicker(true);
                  }}
                  style={styles.dateButton}>
                  End: {format(reportFilter.endDate, 'MMM dd, yyyy')}
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1B5E20" />
            <Text style={styles.loadingText}>Loading report...</Text>
          </View>
        ) : (
          <>
            {/* Summary Stats */}
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Summary</Title>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Icon name="currency-usd" size={32} color="#1B5E20" />
                    <Text style={styles.statValue}>
                      ${stats.totalSales.toFixed(2)}
                    </Text>
                    <Text style={styles.statLabel}>Total Sales</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Icon name="receipt" size={32} color="#1976D2" />
                    <Text style={styles.statValue}>{stats.totalOrders}</Text>
                    <Text style={styles.statLabel}>Total Orders</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Icon name="chart-line" size={32} color="#F57C00" />
                    <Text style={styles.statValue}>
                      ${stats.avgOrderValue.toFixed(2)}
                    </Text>
                    <Text style={styles.statLabel}>Avg Order</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Top Items */}
            {stats.topItems.length > 0 && (
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.cardTitle}>Top Selling Items</Title>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Item</DataTable.Title>
                      <DataTable.Title numeric>Qty Sold</DataTable.Title>
                    </DataTable.Header>

                    {stats.topItems.map((item, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.count}</DataTable.Cell>
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </Card.Content>
              </Card>
            )}

            {/* Recent Orders */}
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>
                  Recent Orders ({orders.length})
                </Title>
                {orders.length > 0 ? (
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Date</DataTable.Title>
                      <DataTable.Title>Member</DataTable.Title>
                      <DataTable.Title numeric>Total</DataTable.Title>
                    </DataTable.Header>

                    {orders.slice(0, 10).map(order => {
                      if (!order || !order.id) return null;
                      
                      let formattedDate = 'N/A';
                      try {
                        if (order.timestamp && typeof order.timestamp.toDate === 'function') {
                          formattedDate = format(order.timestamp.toDate(), 'MM/dd HH:mm');
                        } else if (order.timestamp instanceof Date) {
                          formattedDate = format(order.timestamp, 'MM/dd HH:mm');
                        }
                      } catch (e) {
                        console.error('Error formatting order date:', e);
                      }
                      
                      const memberId = order.memberId || 'N/A';
                      const total = typeof order.total === 'number' ? order.total.toFixed(2) : '0.00';
                      
                      return (
                        <DataTable.Row key={order.id}>
                          <DataTable.Cell>{formattedDate}</DataTable.Cell>
                          <DataTable.Cell>{memberId}</DataTable.Cell>
                          <DataTable.Cell numeric>${total}</DataTable.Cell>
                        </DataTable.Row>
                      );
                    }).filter(row => row !== null)}
                  </DataTable>
                ) : (
                  <Text style={styles.noDataText}>
                    No orders in this period
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Export Actions */}
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Export Report</Title>
                <View style={styles.exportButtons}>
                  <Button
                    mode="contained"
                    onPress={handlePrintReport}
                    icon="printer"
                    style={styles.exportButton}
                    disabled={orders.length === 0}>
                    Print
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSaveReport}
                    icon="download"
                    style={styles.exportButton}
                    disabled={orders.length === 0}>
                    Save PDF
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
      </Surface>

      {showDatePicker && (
        <DateTimePicker
          value={
            datePickerType === 'start'
              ? reportFilter.startDate
              : reportFilter.endDate
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  surface: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  customDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#757575',
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  exportButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  accessTitle: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  accessText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ReportsScreen;
