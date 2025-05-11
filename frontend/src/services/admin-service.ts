"use server"; // Can be used by Server Components/Actions if needed, or just client-side

// Mock data - this would typically come from a database
const mockPendingAccounts = [
  { id: "usr_123", name: "Alice Wonderland", usn: "1MS21CS001", userType: "UG_STUDENT", dateSubmitted: "2024-07-28", department: "CSE" },
  { id: "usr_456", name: "Bob The Builder", usn: "EMP056", userType: "ASSISTANT_PROFS", department: "CSE", dateSubmitted: "2024-07-27" },
  { id: "usr_789", name: "Charlie Brown", usn: "1MS20ME030", userType: "ALUMNI", dateSubmitted: "2024-07-26", department: undefined },
  { id: "usr_101", name: "Diana Prince", usn: "PG22PHY05", userType: "PG_STUDENT", department: "Physics", dateSubmitted: "2024-07-29"},
  { id: "usr_112", name: "Edward Scissorhands", usn: "LIB003", userType: "LIBRARIAN", department: undefined, dateSubmitted: "2024-07-29"},
];

export interface PendingAccount {
  id: string;
  name: string;
  usn: string;
  userType: string; // Ideally use UserTypeValue from constants
  department?: string;
  dateSubmitted: string;
}

// Simulate API call
export async function getPendingAccounts(): Promise<PendingAccount[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPendingAccounts);
    }, 1000); // Simulate network delay
  });
}

// Simulate approving an account
export async function approveAccount(accountId: string): Promise<{ success: boolean; message: string }> {
  console.log(`Attempting to approve account: ${accountId}`);
  // In a real app, you'd update the database here
  const accountExists = mockPendingAccounts.find(acc => acc.id === accountId);
  if (accountExists) {
    // Simulate removing from pending list
    // mockPendingAccounts = mockPendingAccounts.filter(acc => acc.id !== accountId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Account ${accountId} approved successfully.` });
      }, 500);
    });
  } else {
     return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: false, message: `Account ${accountId} not found.` });
      }, 500);
    });
  }
}

// Simulate rejecting an account
export async function rejectAccount(accountId: string): Promise<{ success: boolean; message: string }> {
  console.log(`Attempting to reject account: ${accountId}`);
  // In a real app, you might mark as rejected or delete
   const accountExists = mockPendingAccounts.find(acc => acc.id === accountId);
  if (accountExists) {
    // Simulate removing from pending list
    // mockPendingAccounts = mockPendingAccounts.filter(acc => acc.id !== accountId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Account ${accountId} rejected.` });
      }, 500);
    });
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: false, message: `Account ${accountId} not found.` });
      }, 500);
    });
  }
}