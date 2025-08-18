import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStore } from '../store/attendanceStore';
import { Users, ChevronRight } from 'lucide-react';

const SectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, setSelectedSection } = useAttendanceStore();

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    navigate('/attendance');
  };

  const sections = Object.keys(students);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Class Section</h1>
        <p className="text-gray-600">Choose a section to take attendance</p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const studentCount = students[section].length;
          
          return (
            <button
              key={section}
              onClick={() => handleSectionSelect(section)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">{section}</h3>
                    <p className="text-gray-500 text-sm">{studentCount} students</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <div className="text-left">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Recent Attendance</span>
                  <span className="text-green-600 font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-[85%]"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Sections</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{sections.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Students</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Object.values(students).reduce((sum, section) => sum + section.length, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg. Class Size</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(Object.values(students).reduce((sum, section) => sum + section.length, 0) / sections.length)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;