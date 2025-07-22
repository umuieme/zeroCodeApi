"use client";

import { useEffect, useState } from "react";
import { IChangeEvent } from '@rjsf/core';
import Form from "@rjsf/mui";

import validator from '@rjsf/validator-ajv8';
import { toast } from "sonner";
import ApiService from "@/lib/api/api_service";
import { createTheme, ThemeProvider } from '@mui/material/styles';
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            paper: '#fff',
        },
        text: {
            primary: '#000',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ccc !important',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#999 !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6 !important', // Tailwind blue-500
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#bbb !important',
                    fontWeight: 500,
                    marginBottom: '0.25rem',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: '#6b7280 !important', // Tailwind gray-500
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '1rem',
                    '& .MuiInputBase-input': {
                        color: '#fff',
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: '#fff',
                    },
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                    },

                },
            },
        },
        MuiIcon: {
            styleOverrides: {
                root: {
                    color: '#fff',
                },
            },
        }
    },
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
    schema: any;
    projectId: string;
    endpointId: string;
    editingItem: any | null;
    onDataAdded: () => void;
};

export default function AddDataModal({ isOpen, onClose, schema, projectId, endpointId, editingItem, onDataAdded }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({});
    useEffect(() => {
        setFormData(editingItem || {});
    }, [editingItem]);
    const handleSubmit = async ({ formData }: IChangeEvent) => {
        setSubmitting(true);
        try {
            if (editingItem) {
                await ApiService.put(`/projects/${projectId}/endpoints/${endpointId}/data/${editingItem._id}`, formData);
                toast.success("Data updated successfully!");
            } else {
                await ApiService.post(`/projects/${projectId}/endpoints/${endpointId}/data`, formData);
                toast.success("Data added successfully!");
            }
            onDataAdded();
            onClose();
        } catch (error) {
            toast.error("Failed to submit data.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Data</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
                </div>

                <ThemeProvider theme={lightTheme}>
                    <Form
                        schema={schema}
                        validator={validator}
                        formData={formData}
                        onChange={(e) => setFormData(e.formData)}
                        onSubmit={handleSubmit}
                        uiSchema={{
                            "ui:submitButtonOptions": {
                                submitText: editingItem ? "Save Changes" : "Submit",
                                props: {
                                    disabled: submitting,
                                    className: `w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50`
                                }
                            }
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
}
