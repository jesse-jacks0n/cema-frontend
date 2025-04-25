import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import ConfirmationDialog from '../components/ConfirmationDialog';
import Form, { FormField } from '../components/Form';
import * as Yup from 'yup';
import { clientsApi, enrollmentsApi, type Client } from '../services/api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number().required('Age is required').min(0).max(150),
  gender: Yup.string().required('Gender is required'),
  contact: Yup.string().required('Contact information is required'),
});

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    age: 0,
    gender: '',
    contact: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await clientsApi.getById(Number(id));
        setClient(response.data);
      } catch (err) {
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  useEffect(() => {
    if (client) {
      setFormValues({
        name: client.name,
        age: client.age,
        gender: client.gender,
        contact: client.contact,
      });
    }
  }, [client]);

  const handleDelete = async () => {
    try {
      await clientsApi.delete(Number(id));
      navigate('/clients/search');
    } catch (err) {
      setError('Failed to delete client');
    }
  };

  const handleUnenroll = async () => {
    if (!selectedProgramId) return;
    try {
      const response = await enrollmentsApi.delete({
        client_id: Number(id),
        program_id: selectedProgramId,
      });
      setClient(response.data);
      setShowUnenrollDialog(false);
    } catch (err) {
      setError('Failed to unenroll client from program');
    }
  };

  const handleSubmit = async (values: typeof formValues) => {
    setFormValues(values);
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    try {
      const response = await clientsApi.update(Number(id), formValues);
      setClient(response.data);
      setIsEditing(false);
      setShowSaveDialog(false);
    } catch (err) {
      setError('Failed to update client');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error || 'Client not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Client Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Client
          </button>
        )}
      </div>

      <Card>
        {isEditing ? (
          <Form
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <>
                <div className="space-y-4">
                  <FormField
                    label="Name"
                    error={errors.name}
                    touched={touched.name}
                  >
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Contact"
                    error={errors.contact}
                    touched={touched.contact}
                  >
                    <input
                      type="text"
                      name="contact"
                      value={values.contact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormField>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </Form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Personal Information">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{client.name}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Age</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{client.age}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
                  </dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Contact</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{client.contact}</dd>
                </div>
              </dl>
            </Card>

            <Card title="Enrolled Programs">
              {client.programs.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {client.programs.map((program) => (
                    <li key={program.id} className="py-3 flex justify-between items-center">
                      <span className="text-gray-900">{program.name}</span>
                      <button
                        onClick={() => {
                          setSelectedProgramId(program.id);
                          setShowUnenrollDialog(true);
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Unenroll
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Not enrolled in any programs</p>
              )}
            </Card>
          </div>
        )}
      </Card>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete Client
        </button>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDestructive
      />

      <ConfirmationDialog
        open={showUnenrollDialog}
        title="Unenroll from Program"
        message="Are you sure you want to unenroll this client from the selected program?"
        confirmLabel="Unenroll"
        onConfirm={handleUnenroll}
        onCancel={() => setShowUnenrollDialog(false)}
        isDestructive
      />

      <ConfirmationDialog
        open={showSaveDialog}
        title="Save Changes"
        message="Are you sure you want to save these changes?"
        confirmLabel="Save"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveDialog(false)}
      />
    </div>
  );
};

export default ClientProfile;