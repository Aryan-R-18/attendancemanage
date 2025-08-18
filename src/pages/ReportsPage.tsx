import React, { useState } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { format } from 'date-fns';
import { Calendar, Users, UserCheck, UserX, Edit3, Check, X } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { attendanceSessions, students, updateAttendanceStatus } = useAttendanceStore();
  const [selectedSession, setSelectedSession] = useState<string>('');

  const session = attendanceSessions.find(s => s.id === selectedSession) || attendanceSessions[attendanceSessions.length - 1];

  const getStudentName = (studentId: string, section: string) => {
    const sectionStudents = students[section] || [];
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getStudentRollNumber = (studentId: string, section: string) => {
    const sectionStudents = students[section] || [];
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.rollNumber : 'N/A';
  };

  const handleStatusUpdate = (studentId: string, currentStatus: string) => {
    // Only allow changing from absent to present
    if (currentStatus === 'absent' && session) {
      updateAttendanceStatus(session.id, studentId, 'present');
    }
  };

  if (attendanceSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Attendance Records</h2>
        <p className="text-gray-600">Take attendance first to see reports here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600">View and manage attendance records</p>
        </div>
        
        {attendanceSessions.length > 1 && (
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Latest Session</option>
            {attendanceSessions.slice().reverse().map((s) => (
              <option key={s.id} value={s.id}>
                {s.section} - {s.date} at {s.time}
              </option>
            ))}
          </select>
        )}
      </div>

      {session && (
        <>
          {/* Session Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{session.section}</h2>
                <p className="text-gray-600">
                  {session.date} at {session.time}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{session.presentCount}</p>
                    <p className="text-sm text-gray-600">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{session.absentCount}</p>
                    <p className="text-sm text-gray-600">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((session.presentCount / session.totalStudents) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Attendance Overview</span>
                <span>{session.presentCount}/{session.totalStudents} students present</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(session.presentCount / session.totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Student Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Present Students */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-green-50 rounded-t-xl">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Present Students ({session.presentCount})
                  </h3>
                </div>
              </div>
              <div className="p-4">
                {session.records.filter(r => r.status === 'present').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No students marked present</p>
                ) : (
                  <div className="space-y-3">
                    {session.records
                      .filter(r => r.status === 'present')
                      .map((record) => (
                        <div
                          key={record.studentId}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div>
                            <p className="font-medium text-green-900">
                              {getStudentName(record.studentId, session.section)}
                            </p>
                            <p className="text-sm text-green-600">
                              {getStudentRollNumber(record.studentId, session.section)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Present</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Absent Students */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-red-50 rounded-t-xl">
                <div className="flex items-center space-x-2">
                  <UserX className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">
                    Absent Students ({session.absentCount})
                  </h3>
                </div>
              </div>
              <div className="p-4">
                {session.records.filter(r => r.status === 'absent').length === 0 ? (
                  <p className="text-gray-500 text-center py-4">All students present!</p>
                ) : (
                  <div className="space-y-3">
                    {session.records
                      .filter(r => r.status === 'absent')
                      .map((record) => (
                        <div
                          key={record.studentId}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div>
                            <p className="font-medium text-red-900">
                              {getStudentName(record.studentId, session.section)}
                            </p>
                            <p className="text-sm text-red-600">
                              {getStudentRollNumber(record.studentId, session.section)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(record.studentId, record.status)}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Mark Present</span>
                            </button>
                            <div className="flex items-center space-x-1">
                              <X className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Absent</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{session.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{session.presentCount}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{session.absentCount}</p>
                <p className="text-sm text-gray-600">Absent</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((session.presentCount / session.totalStudents) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;