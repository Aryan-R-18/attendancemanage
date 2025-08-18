import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
  section: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  time: string;
  section: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  records: AttendanceRecord[];
}

interface AttendanceState {
  // Auth
  isAuthenticated: boolean;
  teacherName: string;
  
  // Current session
  selectedSection: string;
  currentSessionId: string;
  
  // Students data
  students: Record<string, Student[]>;
  
  // Attendance data
  attendanceSessions: AttendanceSession[];
  attendanceHistory: AttendanceRecord[];
  
  // Current attendance taking
  currentAttendance: Record<string, 'present' | 'absent'>;
  processedStudents: string[];
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setSelectedSection: (section: string) => void;
  startAttendanceSession: () => void;
  markAttendance: (studentId: string, status: 'present' | 'absent') => void;
  submitAttendanceSession: () => void;
  updateAttendanceStatus: (sessionId: string, studentId: string, newStatus: 'present' | 'absent') => void;
  getStudentHistory: (studentId: string, section: string) => AttendanceRecord[];
  getAttendancePercentage: (studentId: string, section: string, month?: number, year?: number) => number;
}

// Mock student data
const mockStudents: Record<string, Student[]> = {
  'Section A': [
    { id: '1', name: 'Alice Johnson', rollNumber: 'A001' },
    { id: '2', name: 'Bob Smith', rollNumber: 'A002' },
    { id: '3', name: 'Charlie Brown', rollNumber: 'A003' },
    { id: '4', name: 'Diana Prince', rollNumber: 'A004' },
    { id: '5', name: 'Edward Norton', rollNumber: 'A005' },
    { id: '6', name: 'Fiona Apple', rollNumber: 'A006' },
    { id: '7', name: 'George Washington', rollNumber: 'A007' },
    { id: '8', name: 'Helen Keller', rollNumber: 'A008' },
  ],
  'Section B': [
    { id: '9', name: 'Ivan Petrov', rollNumber: 'B001' },
    { id: '10', name: 'Julia Roberts', rollNumber: 'B002' },
    { id: '11', name: 'Kevin Hart', rollNumber: 'B003' },
    { id: '12', name: 'Linda Hamilton', rollNumber: 'B004' },
    { id: '13', name: 'Michael Jordan', rollNumber: 'B005' },
    { id: '14', name: 'Natalie Portman', rollNumber: 'B006' },
  ],
  'Section C': [
    { id: '15', name: 'Oliver Twist', rollNumber: 'C001' },
    { id: '16', name: 'Penelope Cruz', rollNumber: 'C002' },
    { id: '17', name: 'Quincy Jones', rollNumber: 'C003' },
    { id: '18', name: 'Rachel Green', rollNumber: 'C004' },
    { id: '19', name: 'Samuel Jackson', rollNumber: 'C005' },
    { id: '20', name: 'Tina Turner', rollNumber: 'C006' },
  ],
};

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      teacherName: '',
      selectedSection: '',
      currentSessionId: '',
      students: mockStudents,
      attendanceSessions: [],
      attendanceHistory: [],
      currentAttendance: {},
      processedStudents: [],

      // Actions
      login: (email: string, password: string) => {
        // Mock authentication - any email/password combo works
        if (email && password) {
          set({ 
            isAuthenticated: true, 
            teacherName: email.split('@')[0] 
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          teacherName: '',
          selectedSection: '',
          currentSessionId: '',
          currentAttendance: {},
          processedStudents: []
        });
      },

      setSelectedSection: (section: string) => {
        set({ selectedSection: section });
      },

      startAttendanceSession: () => {
        const sessionId = `session_${Date.now()}`;
        set({ 
          currentSessionId: sessionId,
          currentAttendance: {},
          processedStudents: []
        });
      },

      markAttendance: (studentId: string, status: 'present' | 'absent') => {
        const state = get();
        const newCurrentAttendance = { ...state.currentAttendance };
        const newProcessedStudents = [...state.processedStudents];
        
        newCurrentAttendance[studentId] = status;
        if (!newProcessedStudents.includes(studentId)) {
          newProcessedStudents.push(studentId);
        }
        
        set({ 
          currentAttendance: newCurrentAttendance,
          processedStudents: newProcessedStudents
        });
      },

      submitAttendanceSession: () => {
        const state = get();
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        
        const sectionStudents = state.students[state.selectedSection] || [];
        const records: AttendanceRecord[] = [];
        let presentCount = 0;
        let absentCount = 0;
        
        sectionStudents.forEach(student => {
          const status = state.currentAttendance[student.id] || 'absent';
          records.push({
            studentId: student.id,
            date,
            time,
            status,
            section: state.selectedSection
          });
          
          if (status === 'present') presentCount++;
          else absentCount++;
        });
        
        const session: AttendanceSession = {
          id: state.currentSessionId,
          date,
          time,
          section: state.selectedSection,
          totalStudents: sectionStudents.length,
          presentCount,
          absentCount,
          records
        };
        
        set({
          attendanceSessions: [...state.attendanceSessions, session],
          attendanceHistory: [...state.attendanceHistory, ...records],
          currentAttendance: {},
          processedStudents: []
        });
      },

      updateAttendanceStatus: (sessionId: string, studentId: string, newStatus: 'present' | 'absent') => {
        const state = get();
        
        // Update session
        const updatedSessions = state.attendanceSessions.map(session => {
          if (session.id === sessionId) {
            const updatedRecords = session.records.map(record => {
              if (record.studentId === studentId) {
                return { ...record, status: newStatus };
              }
              return record;
            });
            
            const presentCount = updatedRecords.filter(r => r.status === 'present').length;
            const absentCount = updatedRecords.filter(r => r.status === 'absent').length;
            
            return {
              ...session,
              records: updatedRecords,
              presentCount,
              absentCount
            };
          }
          return session;
        });
        
        // Update history
        const updatedHistory = state.attendanceHistory.map(record => {
          if (record.studentId === studentId && record.date === state.attendanceSessions.find(s => s.id === sessionId)?.date) {
            return { ...record, status: newStatus };
          }
          return record;
        });
        
        set({
          attendanceSessions: updatedSessions,
          attendanceHistory: updatedHistory
        });
      },

      getStudentHistory: (studentId: string, section: string) => {
        const state = get();
        return state.attendanceHistory.filter(
          record => record.studentId === studentId && record.section === section
        );
      },

      getAttendancePercentage: (studentId: string, section: string, month?: number, year?: number) => {
        const state = get();
        let records = state.attendanceHistory.filter(
          record => record.studentId === studentId && record.section === section
        );
        
        if (month !== undefined && year !== undefined) {
          records = records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === month && recordDate.getFullYear() === year;
          });
        } else if (year !== undefined) {
          records = records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year;
          });
        }
        
        if (records.length === 0) return 0;
        
        const presentCount = records.filter(record => record.status === 'present').length;
        return Math.round((presentCount / records.length) * 100);
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);