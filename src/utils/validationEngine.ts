export type ValidationRule =
  | { type: 'required'; message: string }
  | { type: 'email'; message: string }
  | { type: 'pan'; message: string }
  | { type: 'dob'; message: string }
  | { type: 'regex'; pattern: string; message: string };

export function validateValue(value: string, rules?: ValidationRule[]): string {
  if (!rules) return '';

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value.trim()) return rule.message;
        break;

      case 'email':
        if (value && !/^\S+@\S+\.\S+$/.test(value)) return rule.message;
        break;

      case 'pan':
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
          return rule.message;
        }
        break;

      case 'dob': {
        if (!value) break;
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return rule.message;

        const [dd, mm, yyyy] = value.split('/').map(Number);
        const date = new Date(yyyy!, mm! - 1, dd!);

        // Ensure the parsed date matches input (catches 32/01, 29/02 on non-leap, etc.)
        if (
          date.getFullYear() !== yyyy ||
          date.getMonth() !== mm! - 1 ||
          date.getDate() !== dd
        ) {
          return 'Invalid date';
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date >= today) return 'DOB cannot be in future';

        const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        if (date > minAge) return 'You must be at least 18 years old';

        break;
      }

      case 'regex':
        try {
          if (value && !new RegExp(rule.pattern).test(value)) return rule.message;
        } catch {
          console.error('Invalid regex pattern', rule.pattern);
        }
        break;
    }
  }

  return '';
}
