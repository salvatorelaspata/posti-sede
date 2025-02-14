import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Image, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyAttendance, Employee, Location, MonthlyAttendance, Room } from '@/types';

const HomeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [selectedDayAttendance, setSelectedDayAttendance] = useState<DailyAttendance | null>(null);

  const locations: Location[] = [
    { id: 'rm', name: 'Roma', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20rome%20sunset&aspect=16:9' },
    { id: 'mi', name: 'Milano', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20milan%20business%20district&aspect=16:9' },
    { id: 'bg', name: 'Bergamo', image: 'https://api.a0.dev/assets/image?text=modern%20office%20building%20in%20bergamo%20with%20mountains&aspect=16:9' },
  ];

  const rooms: Room[] = [
    { id: 1, name: 'Sala Blu', capacity: 8, available: 5 },
    { id: 2, name: 'Sala Verde', capacity: 12, available: 3 },
    { id: 3, name: 'Sala Rossa', capacity: 6, available: 6 },
    { id: 4, name: 'Open Space', capacity: 20, available: 8 },
  ];

  const employees: Employee[] = [
    { id: 1, name: 'Marco Rossi', department: 'Sviluppo', presences: 15 },
    { id: 2, name: 'Laura Bianchi', department: 'Design', presences: 18 },
    { id: 3, name: 'Giuseppe Verdi', department: 'Marketing', presences: 12 },
    { id: 4, name: 'Anna Neri', department: 'HR', presences: 20 },
  ];

  const monthlyAttendance: MonthlyAttendance = {
    '2024-02-13': { count: 15, people: ['Marco Rossi', 'Laura Bianchi', 'Giuseppe Verdi'] },
    '2024-02-14': { count: 12, people: ['Anna Neri', 'Marco Rossi', 'Laura Bianchi'] },
    '2024-02-15': { count: 18, people: ['Giuseppe Verdi', 'Anna Neri', 'Marco Rossi'] },
  };

  const renderLocationSelection = () => {
    if (selectedLocation) return null;
    
    return (
      <SafeAreaView style={styles.locationContainer}>
        <Text style={styles.locationTitle}>Seleziona la sede</Text>
        <View style={styles.locationGrid}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationCard}
              onPress={() => setSelectedLocation(location)}
            >
              <View style={styles.locationImageContainer}>
                <Image
                  source={{ uri: location.image }}
                  style={styles.locationImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.locationGradient}
                />
                <Text style={styles.locationName}>{location.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  };

  const renderHeader = () => {
    if (!selectedLocation) return null;

    return (
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedLocation(null)}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedLocation?.name}
        </Text>
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => setIsAdminView(!isAdminView)}
        >
          <MaterialIcons name={isAdminView ? "person" : "admin-panel-settings"} size={24} color="#333" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCalendar = () => {
    if (!selectedLocation || isAdminView) return null;

    const dates = getDatesInMonth(selectedDate);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendar}>
        {dates.map((date, index) => {
          const formattedDate = formatDate(date);
          const isSelected = date.getDate() === selectedDate.getDate();
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateItem, isSelected && styles.selectedDate]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText]}>
                {formattedDate.day}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                {formattedDate.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderRooms = () => {
    if (!selectedLocation || isAdminView) return null;

    return (
      <View style={styles.roomsContainer}>
        <Text style={styles.sectionTitle}>Sale disponibili</Text>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={[
              styles.roomCard,
              selectedRoom?.id === room.id && styles.selectedRoom
            ]}
            onPress={() => setSelectedRoom(room)}
          >
            <View style={styles.roomHeader}>
              <Text style={styles.roomName}>{room.name}</Text>
              <View style={styles.capacityBadge}>
                <Text style={styles.capacityText}>
                  {room.available}/{room.capacity}
                </Text>
              </View>
            </View>
            <View style={styles.roomInfo}>
              <FontAwesome5 name="users" size={20} color="#666" />
              <Text style={styles.availabilityText}>
                {room.available} posti disponibili
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${(room.available / room.capacity) * 100}%` }
                ]} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };  const renderAdminView = () => {
    if (!selectedLocation || !isAdminView) return null;

    return (
      <ScrollView style={styles.adminContainer}>
        <View style={styles.adminTabs}>
          <TouchableOpacity 
            style={[styles.adminTab, !showEmployeeDetails && styles.activeTab]}
            onPress={() => setShowEmployeeDetails(false)}
          >
            <Text style={styles.adminTabText}>Calendario Presenze</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.adminTab, showEmployeeDetails && styles.activeTab]}
            onPress={() => setShowEmployeeDetails(true)}
          >
            <Text style={styles.adminTabText}>Dettaglio Dipendenti</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Occupazione</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Prenotazioni</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Sale</Text>
          </View>
        </View>

        {showEmployeeDetails ? renderEmployeeDetails() : renderAdminCalendar()}
      </ScrollView>
    );
  };

  const renderEmployeeDetails = () => {
    return (
      <ScrollView style={styles.employeeList}>
        {employees.map((employee) => (
          <View key={employee.id} style={styles.employeeCard}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeDepartment}>{employee.department}</Text>
            </View>
            <View style={styles.presenceBadge}>
              <Text style={styles.presenceText}>{employee.presences}</Text>
              <Text style={styles.presenceLabel}>presenze</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderAdminCalendar = () => {
    const dates = getDatesInMonth(selectedMonth);
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    dates.forEach((date) => {
      if (currentWeek.length === 0 && date.getDay() !== 0) {
        for (let i = 0; i < date.getDay(); i++) {
          currentWeek.push(new Date());
        }
      }
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return (
      <View style={styles.adminCalendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(selectedMonth);
            newDate.setMonth(newDate.getMonth() - 1);
            setSelectedMonth(newDate);
          }}>
            <MaterialIcons name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {selectedMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => {
            const newDate = new Date(selectedMonth);
            newDate.setMonth(newDate.getMonth() + 1);
            setSelectedMonth(newDate);
          }}>
            <MaterialIcons name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarGrid}>
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
            <Text key={day} style={styles.calendarHeader}>{day}</Text>
          ))}
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.calendarRow}>
              {week.map((date, dateIndex) => {
                if (!date) return <View key={`empty-${dateIndex}`} style={styles.calendarCell} />;
                
                const dateString = date.toISOString().split('T')[0];
                const attendance = monthlyAttendance[dateString];
                
                return (
                  <TouchableOpacity
                    key={dateIndex}
                    style={styles.calendarCell}
                    onPress={() => {
                      if (attendance) {
                        setSelectedDayAttendance({
                          count: attendance.count,
                          people: attendance.people
                        });
                        setShowAttendanceModal(true);
                      }
                    }}
                  >
                    <Text style={styles.calendarDate}>{date.getDate()}</Text>
                    {attendance && (
                      <View style={styles.attendanceCount}>
                        <Text style={styles.attendanceCountText}>{attendance.count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAttendanceModal = () => {
    if (!selectedDayAttendance) return null;

    return (
      <Modal
        visible={showAttendanceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAttendanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Presenze del giorno</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowAttendanceModal(false)}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedDayAttendance.people.map((person, index) => (
                <Text key={index} style={styles.modalPerson}>{person}</Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const getDatesInMonth = (date: Date) => {
    const dates: Date[] = [];
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return {
      day: days[date.getDay()],
      date: date.getDate()
    };
  };  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollContainer}>
        {renderLocationSelection()}
        {renderCalendar()}
        {renderRooms()}
        {renderAdminView()}
      </ScrollView>
      {selectedRoom && !isAdminView && (
        <TouchableOpacity style={styles.bookButton} onPress={() => {
          // Implementare logica di prenotazione
          alert('Prenotazione effettuata con successo!');
          setSelectedRoom(null);
        }}>
          <Text style={styles.bookButtonText}>Prenota</Text>
        </TouchableOpacity>
      )}
      {renderAttendanceModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bookButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  locationContainer: {
    padding: 16,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  locationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16
  },
  locationImageContainer: {
    height: 200,
    position: 'relative',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  locationName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendar: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  dateItem: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedDate: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  selectedText: {
    color: '#fff',
  },
  roomsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedRoom: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
  },
  capacityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capacityText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    color: '#666',
    fontSize: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  adminContainer: {
    flex: 1,
  },
  adminTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
  },
  adminTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  adminTabText: {
    fontSize: 16,
    color: '#333',
  },
  employeeList: {
    padding: 16,
  },
  employeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  employeeDepartment: {
    color: '#666',
    marginTop: 4,
  },
  presenceBadge: {
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  presenceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
  },
  presenceLabel: {
    fontSize: 12,
    color: '#1976D2',
  },
  adminCalendarContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarHeader: {
    width: '14.28%',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
    color: '#666',
  },
  calendarRow: {
    flexDirection: 'row',
    width: '100%',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  calendarDate: {
    fontSize: 16,
  },
  attendanceCount: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#E3F2FD',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceCountText: {
    fontSize: 12,
    color: '#1976D2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  modalPerson: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  adminButton: {
    padding: 8,
  },
  modalClose: {
    padding: 8,
  },
});

export default HomeScreen;