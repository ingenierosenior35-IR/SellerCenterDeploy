'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { TiptapEditor } from 'src/components/editor';

// ----------------------------------------------------------------------

type RHFEditorProps = {
  name: string;
  placeholder?: string;
  helperText?: React.ReactNode;
};

export function RHFEditor({ name, placeholder, helperText }: RHFEditorProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TiptapEditor
          value={field.value}
          onChange={field.onChange}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
}
