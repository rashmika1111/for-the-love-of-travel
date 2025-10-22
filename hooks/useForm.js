import { useState } from 'react';
import toast from 'react-hot-toast';

export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!onSubmit) return;

    setIsSubmitting(true);
    clearErrors();

    try {
      await onSubmit(values);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
      } else {
        // Handle general errors
        toast.error(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit
  };
};

export default useForm;

