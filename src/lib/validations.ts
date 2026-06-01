export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

export function validateRequired(value: string, field: string): string | null {
  if (!value || !value.trim()) return `${field} is required`;
  return null;
}

export function validateProductData(data: {
  name?: string;
  category?: string;
}): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Product name is required");
  if (!data.category?.trim()) errors.push("Category is required");
  return errors;
}

export function validateOrderData(data: {
  items?: unknown[];
  customer?: { name?: string; email?: string; phone?: string };
}): string[] {
  const errors: string[] = [];
  if (!data.items?.length) errors.push("At least one item is required");
  if (!data.customer?.name?.trim()) errors.push("Customer name is required");
  if (!data.customer?.email || !validateEmail(data.customer.email))
    errors.push("Valid email is required");
  if (!data.customer?.phone || !validatePhone(data.customer.phone))
    errors.push("Valid phone is required");
  return errors;
}

export function validateContactData(data: {
  name?: string;
  email?: string;
  message?: string;
}): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Name is required");
  if (!data.email || !validateEmail(data.email)) errors.push("Valid email is required");
  if (!data.message?.trim()) errors.push("Message is required");
  return errors;
}
