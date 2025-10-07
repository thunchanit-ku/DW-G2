// components/StudentSearch.jsx
import React from 'react';
import { Search } from 'lucide-react'; // Assuming 'lucide-react' is used for icons

// Assuming Card, Input, and Button are custom components
// Adjust import paths as necessary
import { Card } from 'antd'; 
import { Input } from 'antd'; 
import { Button } from 'antd';

const StudentSearch = ({ student, setStudent, handleSubmit, result }) => {
  return (
    <Card title="ค้นหานิสิต" className="mb-6 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="กรุณาใส่รหัสนิสิต"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        <Button
          type="primary"
          icon={<Search className="w-5 h-5" />}
          size="large"
          onClick={handleSubmit}
        >
          ส่งข้อมูล
        </Button>
      </div>
    </Card>
  );
};

export default StudentSearch;