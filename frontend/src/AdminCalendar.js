import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const AdminCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('https://app-1-k69l.onrender.com/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(moment(date));
  };

  const getBookingsForDate = (date) => {
    return bookings.filter((b) => moment(b.datetime).isSame(date, 'day'));
  };

  const goToPreviousMonth = () => {
    setSelectedDate((prev) => moment(prev).subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setSelectedDate((prev) => moment(prev).add(1, 'month'));
  };

  const generateCalendar = () => {
    const startOfMonth = moment(selectedDate).startOf('month').startOf('week');
    const endOfMonth = moment(selectedDate).endOf('month').endOf('week');

    const calendar = [];
    let day = startOfMonth.clone();

    while (day.isBefore(endOfMonth, 'day')) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day.clone());
        day.add(1, 'day');
      }
      calendar.push(week);
    }

    return calendar;
  };

  const calendar = generateCalendar();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '32px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>
            📅 Appointment Dashboard
          </h1>
          <p style={{ 
            fontSize: '16px', 
            margin: '0', 
            opacity: '0.9',
            fontWeight: '400',
          }}>
            Manage and view all scheduled appointments
          </p>
        </div>

        {/* Calendar Container */}
        <div style={{ padding: '40px' }}>
          {/* Month Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            padding: '0 8px',
          }}>
            <button
              onClick={goToPreviousMonth}
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '16px' }}>◀</span>
              Previous
            </button>
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700',
              color: '#1e293b',
              margin: '0',
              letterSpacing: '-0.5px',
            }}>
              {selectedDate.format('MMMM YYYY')}
            </h2>
            
            <button
              onClick={goToNextMonth}
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Next
              <span style={{ fontSize: '16px' }}>▶</span>
            </button>
          </div>

          {/* Calendar Grid */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}>
            {/* Day Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#64748b',
                  fontSize: '14px',
                  padding: '12px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
            }}>
              {calendar.map((week, i) => (
                <React.Fragment key={i}>
                  {week.map((day) => {
                    const isCurrentMonth = moment(day).isSame(selectedDate, 'month');
                    const isToday = moment(day).isSame(moment(), 'day');
                    const isSelected = moment(day).isSame(selectedDate, 'day');
                    const hasBookings = getBookingsForDate(day).length > 0;
                    const bookingCount = getBookingsForDate(day).length;

                    return (
                      <div
                        key={day.format('YYYY-MM-DD')}
                        onClick={() => handleDateClick(day)}
                        style={{
                          aspectRatio: '1',
                          cursor: 'pointer',
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px 8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          backgroundColor: isSelected ? '#4f46e5' : 
                                           isToday ? '#fef3c7' : 
                                           hasBookings ? '#ecfdf5' : 
                                           isCurrentMonth ? '#ffffff' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : 
                                 isCurrentMonth ? '#1e293b' : '#94a3b8',
                          border: isSelected ? '2px solid #4f46e5' : 
                                   isToday ? '2px solid #f59e0b' : 
                                   '2px solid transparent',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          minHeight: '80px',
                        }}
                        onMouseOver={e => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                          }
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ 
                          fontSize: '16px', 
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}>
                          {day.format('D')}
                        </span>
                        
                        {hasBookings && (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#ffffff' : '#10b981',
                            }} />
                            {bookingCount > 1 && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                color: isSelected ? '#ffffff' : '#059669',
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#d1fae5',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                minWidth: '16px',
                                textAlign: 'center',
                              }}>
                                {bookingCount}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Appointments Section */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '24px 32px',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: '0',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                Appointments for {selectedDate.format('dddd, MMMM D, YYYY')}
              </h3>
            </div>
            
            <div style={{ padding: '32px' }}>
              {getBookingsForDate(selectedDate).length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: '#64748b',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                  <p style={{ 
                    fontSize: '16px', 
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}>
                    No appointments scheduled
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    margin: '0',
                    opacity: '0.7',
                  }}>
                    This date is available for new bookings
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px',
                }}>
                  {getBookingsForDate(selectedDate).map((booking, i) => (
                    <div key={i} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                      }}>
                        <div>
                          <label style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px',
                            display: 'block',
                          }}>
                            Name
                          </label>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0',
                          }}>
                            {booking.name}
                          </p>
                        </div>
                        
                        <div>
                          <label style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px',
                            display: 'block',
                          }}>
                            Time
                          </label>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#059669',
                            margin: '0',
                          }}>
                            {moment(booking.datetime).format('hh:mm A')}
                          </p>
                        </div>
                        
                        <div>
                          <label style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px',
                            display: 'block',
                          }}>
                            Email
                          </label>
                          <p style={{
                            fontSize: '14px',
                            color: '#475569',
                            margin: '0',
                            wordBreak: 'break-word',
                          }}>
                            {booking.email || 'Not provided'}
                          </p>
                        </div>
                        
                        <div>
                          <label style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '4px',
                            display: 'block',
                          }}>
                            Phone
                          </label>
                          <p style={{
                            fontSize: '14px',
                            color: '#475569',
                            margin: '0',
                          }}>
                            {booking.phone || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;      