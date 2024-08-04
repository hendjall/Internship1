import React, { useState } from 'react';
import DynamicForm from './DynamicForm';

const App = () => {
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData('');
  };

  return (
    <div className="App">
      <h1>Dynamic Form Example</h1>
      <DynamicForm
        onSubmit={handleFormSubmit}
        initialData={formData}
      
      />
    </div>
  );
};

export default App;
