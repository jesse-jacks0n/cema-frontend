import React, { HTMLProps } from 'react';
import { Formik, Form as FormikForm, FormikProps, FormikValues, FormikHelpers } from 'formik';

interface FormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => void | Promise<void>;
  children: (props: FormikProps<T>) => React.ReactNode;
  enableReinitialize?: boolean;
}

function Form<T extends FormikValues>({ 
  initialValues, 
  validationSchema, 
  onSubmit, 
  children,
  enableReinitialize 
}: FormProps<T>) {
  return (
    <Formik<T>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {(formikProps) => (
        <FormikForm className="space-y-6">
          {children(formikProps)}
        </FormikForm>
      )}
    </Formik>
  );
}

type FormInputElement = React.ReactElement<HTMLProps<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>;

export const FormField: React.FC<{
  label: string;
  error?: string;
  touched?: boolean;
  children: FormInputElement;
}> = ({ label, error, touched, children }) => {
  const childProps = children.props as HTMLProps<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {React.cloneElement(children, {
        ...childProps,
        className: `
          block w-full px-3 py-2 
          bg-white border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          text-sm text-gray-900
          ${error && touched ? 'border-red-300' : 'border-gray-300'}
          ${children.type === 'select' ? 'pr-10' : ''}
          ${childProps.className || ''}
        `.trim()
      })}
      {touched && error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Form;