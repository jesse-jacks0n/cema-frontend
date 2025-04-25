import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Card from '../components/Card';
import Form, { FormField } from '../components/Form';
import { clientsApi, programsApi, enrollmentsApi, type Client, type Program } from '../services/api';

const validationSchema = Yup.object().shape({
  client_id: Yup.number().required('Client is required'),
  program_id: Yup.number().required('Program is required'),
});

const EnrollClient = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, programsRes] = await Promise.all([
          clientsApi.getAll(),
          programsApi.getAll(),
        ]);
        setClients(clientsRes.data);
        setPrograms(programsRes.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: { client_id: number; program_id: number }) => {
    try {
      const response = await enrollmentsApi.create(values);
      navigate(`/clients/${response.data.id}`);
    } catch (err) {
      setError('Failed to enroll client in program');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Enroll Client in Program</h1>

      {error && (
        <div className="mb-4 text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <Form
          initialValues={{
            client_id: 0,
            program_id: 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <>
              <FormField
                label="Select Client"
                error={errors.client_id}
                touched={touched.client_id}
              >
                <select
                  name="client_id"
                  value={values.client_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Select Program"
                error={errors.program_id}
                touched={touched.program_id}
              >
                <select
                  name="program_id"
                  value={values.program_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enroll Client
                </button>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default EnrollClient; 