import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Card from '../components/Card';
import Form, { FormField } from '../components/Form';
import { clientsApi } from '../services/api';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  age: Yup.number()
    .required('Age is required')
    .min(0, 'Age must be positive')
    .max(150, 'Age must be less than 150'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  contact: Yup.string()
    .required('Contact information is required')
    .min(5, 'Contact must be at least 5 characters'),
});

const RegisterClient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values: {
    name: string;
    age: number;
    gender: string;
    contact: string;
  }) => {
    try {
      const response = await clientsApi.create(values);
      navigate(`/clients/${response.data.id}`);
    } catch (err) {
      setError('Failed to register client');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Client</h1>

      {error && (
        <div className="mb-4 text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <Form
          initialValues={{
            name: '',
            age: 0,
            gender: '',
            contact: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <>
              <FormField
                label="Full Name"
                error={errors.name}
                touched={touched.name}
              >
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField
                label="Age"
                error={errors.age}
                touched={touched.age}
              >
                <input
                  type="number"
                  name="age"
                  value={values.age}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </FormField>

              <FormField
                label="Gender"
                error={errors.gender}
                touched={touched.gender}
              >
                <select
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField
                label="Contact Information"
                error={errors.contact}
                touched={touched.contact}
              >
                <input
                  type="text"
                  name="contact"
                  value={values.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter contact information"
                />
              </FormField>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register Client
                </button>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default RegisterClient; 