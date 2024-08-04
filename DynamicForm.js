import React, { useState } from 'react';
import axios from 'axios';
import formData from './formData.json'; // Ensure this path is correct
import './styles.css'; // Import the CSS file

const DynamicForm = ({ onCancelEdit }) => {
  const [formValues, setFormValues] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e, field) => {
    const { id, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));

    // Reset dependent fields
    const dependentFieldIndex = formData.findIndex(f => f.id === id) + 1;
    for (let i = dependentFieldIndex; i < formData.length; i++) {
      const dependentField = formData[i];
      setFormValues(prevValues => ({
        ...prevValues,
        [dependentField.id]: ''
      }));
    }
  };

  const getOptions = (field) => {
    if (!field.dependsOn) {
      return field.options;
    }
    const dependentValue = formValues[field.dependsOn];
    return field.options[dependentValue] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/data', formValues);
      setSubmissionStatus('Form data received successfully');
      setShowSummary(true);
    } catch (error) {
      setErrorMessage('Error submitting form data');
      console.error(error);
    }
  };

  const handleAccept = () => {
    setSubmissionStatus('Data accepted');
    // Optionally, handle data acceptance here
    setShowSummary(true); // Re-show the summary after acceptance
  };

  const handleEdit = () => {
    setShowSummary(false);
  };

  const handleDecline = () => {
    setFormValues({});
    setShowSummary(false);
    setSubmissionStatus('Data declined');
    // Optionally, handle data decline here
  };

  return (
   
      <div className="form-container">
        {showSummary ? (
          <div>
            <pre>{JSON.stringify(formValues, null, 2)}</pre>
            <div className="form-actions">
              <button className="form-action-button accept-button" onClick={handleAccept}>Accept</button>
              <button className="form-action-button decline-button" onClick={handleDecline}>Decline</button>
              <button className="form-action-button cancel-button" onClick={handleEdit}>Edit</button>
            </div>
           
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {formData.map((field) => (
              <div className="form-group" key={field.id}>
                <label>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={formValues[field.id] || ''}
                    onChange={(e) => handleChange(e, field)}
                    disabled={field.dependsOn && !formValues[field.dependsOn]}
                  >
                    <option value="">Select {field.label}</option>
                    {getOptions(field).map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                ) : null}
              </div>
            ))}
            <div className="form-group">
              <label>Postal Code</label>
              <input
                id='postalcode'
                value={formValues['postalcode'] || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, postalcode: e.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="form-action-button submit-button">Submit</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {onCancelEdit && <button type="button" onClick={onCancelEdit} className="form-action-button cancel-button">Cancel</button>}
          </form>
        )}
        {submissionStatus && <p>{submissionStatus}</p>}
      </div>
    );
  };
export default DynamicForm;
