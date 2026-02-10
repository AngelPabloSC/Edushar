import { useState, useCallback } from 'react';

/**
 * Reusable form validation hook
 * @param {Object} initialData - Initial form data
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(initialData, validationRules) {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});

    /**
     * Validate a single field
     */
    const validateField = useCallback((name, value, rules) => {
        if (!value && rules.required) {
            return validationRules.required;
        }

        if (rules.pattern && value && !rules.pattern.value.test(value)) {
            return rules.pattern.message;
        }

        if (rules.minLength && value && value.length < rules.minLength) {
            return validationRules.minLength(rules.minLength).message;
        }

        if (rules.maxLength && value && value.length > rules.maxLength) {
            return validationRules.maxLength(rules.maxLength).message;
        }

        return '';
    }, [validationRules]);

    /**
     * Handle field change with validation
     */
    const handleChange = useCallback((e, fieldRules) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        // Update data
        setData(prev => ({
            ...prev,
            [name]: fieldValue,
        }));

        // Validate if rules provided
        if (fieldRules) {
            const error = validateField(name, fieldValue, fieldRules);
            setErrors(prev => ({
                ...prev,
                [name]: error,
            }));
        }
    }, [validateField]);

    /**
     * Validate all fields
     */
    const validateAll = useCallback((fieldsConfig) => {
        const newErrors = {};

        Object.entries(fieldsConfig).forEach(([field, rules]) => {
            const error = validateField(field, data[field], rules);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [data, validateField]);

    /**
     * Reset form
     */
    const reset = useCallback(() => {
        setData(initialData);
        setErrors({});
    }, [initialData]);

    /**
     * Set specific field value
     */
    const setFieldValue = useCallback((name, value) => {
        setData(prev => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    /**
     * Set specific field error
     */
    const setFieldError = useCallback((name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        data,
        errors,
        handleChange,
        validateField,
        validateAll,
        reset,
        setFieldValue,
        setFieldError,
        setData,
        setErrors,
    };
}
