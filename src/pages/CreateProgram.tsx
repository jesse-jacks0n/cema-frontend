import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Card from '../components/Card';
import Form, { FormField } from '../components/Form';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { programsApi, type Program } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Program name is required')
    .min(2, 'Program name must be at least 2 characters')
    .max(50, 'Program name must be less than 50 characters'),
});

const CreateProgram = () => {
  const [error, setError] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [formValues, setFormValues] = useState({ name: '' });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await programsApi.getAll();
      setPrograms(response.data);
    } catch (err) {
      setError('Failed to load programs');
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    setFormValues(values);
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    try {
      if (editingProgram) {
        await programsApi.update(editingProgram.id, formValues);
      } else {
        await programsApi.create(formValues);
      }
      setShowSaveDialog(false);
      setEditingProgram(null);
      setFormValues({ name: '' });
      fetchPrograms();
    } catch (err) {
      setError('Failed to save program');
    }
  };

  const handleDelete = async (program: Program) => {
    setProgramToDelete(program);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;
    try {
      await programsApi.delete(programToDelete.id);
      setShowDeleteDialog(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete program');
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormValues({ name: program.name });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Programs</h1>

      {error && (
        <div className="mb-4 text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <Form
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <>
              <FormField
                label={editingProgram ? "Edit Program Name" : "Program Name"}
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
                  placeholder="Enter program name"
                />
              </FormField>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
                {editingProgram && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProgram(null);
                      setFormValues({ name: '' });
                    }}
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>
            </>
          )}
        </Form>
      </Card>

      <Card title="Programs List">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(program)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmationDialog
        open={showSaveDialog}
        title={editingProgram ? "Update Program" : "Create Program"}
        message={editingProgram 
          ? "Are you sure you want to update this program?"
          : "Are you sure you want to create this program?"}
        confirmLabel={editingProgram ? "Update" : "Create"}
        onConfirm={confirmSave}
        onCancel={() => setShowSaveDialog(false)}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDestructive
      />
    </div>
  );
};

export default CreateProgram;