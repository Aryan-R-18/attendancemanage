import React, { useState } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import { Calendar, User, TrendingUp, Filter, ChevronDown } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { students, getStudentHistory, getAttendancePercentage } = useAttendanceStore();
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const sections = Object.keys(students);
  const sectionStudents = selectedSection ? students[selectedSection] || [] : [];
  const studentHistory = selectedStudent && selectedSection ? getStudentHistory(selectedStudent, selectedSection) : [];
  
  // Filter history by month/year
  const filteredHistory = studentHistory.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  const monthlyPercentage = selectedStudent && selectedSection 
    ? getAttendancePercentage(selectedStudent, selectedSection, selectedMonth, selectedYear)
    : 0;
    
  const yearlyPercentage = selectedStudent && selectedSection
    ? getAttendancePercentage(selectedStudent, selectedSection, undefined, selectedYear)
    : 0;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const getStudentName = (studentId: string) => {
    const student = sectionStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Attendance History</h1>
        <p className="text-gray-600">View individual student attendance records and statistics</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setSelectedStudent('');
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <div className="relative">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedSection}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select Student</option>
                {sectionStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && selectedSection ? (
        <div className="space-y-6">
          {/* Student Info & Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{getStudentName(selectedStudent)}</h2>
                  <p className="text-gray-600">{selectedSection}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Monthly</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{monthlyPercentage}%</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Yearly</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{yearlyPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Monthly Attendance ({months[selectedMonth]} {selectedYear})</span>
                  <span>{monthlyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${monthlyPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Yearly Attendance ({selectedYear})</span>
                  <span>{yearlyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${yearlyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance Records for {months[selectedMonth]} {selectedYear}
              </h3>
              <p className="text-gray-600">
                {filteredHistory.length} record(s) found
              </p>
            </div>
            
            <div className="p-6">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No attendance records found for the selected period.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((record, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        record.status === 'present'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className={`font-medium ${
                            record.status === 'present' ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {record.date}
                          </p>
                          <p className={`text-sm ${
                            record.status === 'present' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.time}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Student</h3>
          <p className="text-gray-600">Choose a section and student to view their attendance history.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;