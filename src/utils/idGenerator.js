export function generateId() {
    // Use nanosecond precision plus random to ensure uniqueness
    return `id-${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`;
  }