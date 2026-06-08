export function getErrorMessage(error: any, fallback: string): string {
  const errors = error.error?.errors as Record<string, string[]> | undefined;
  if (errors) {
    return Object.values(errors).flat().join('\n');
  }
  if (typeof error.error === 'string') {
    return error.error;
  }
  return fallback;
}