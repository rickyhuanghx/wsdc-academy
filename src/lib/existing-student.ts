// The "existing student" choice a parent makes at the Register button. Kept
// in sessionStorage so checkout starts with the same answer; the server still
// verifies the email and decides what is charged.
const KEY = 'wsdc-existing-student';

export function getExistingStudentChoice(): boolean | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === '1' ? true : v === '0' ? false : null;
  } catch {
    return null;
  }
}

export function setExistingStudentChoice(value: boolean): void {
  try {
    sessionStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    // storage unavailable — checkout will ask again
  }
}
