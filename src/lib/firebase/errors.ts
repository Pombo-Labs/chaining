// Firebase error handling utilities

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export const getFirestoreErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested data was not found.';
    case 'already-exists':
      return 'This item already exists.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    case 'failed-precondition':
      return 'Operation failed. Please try again.';
    case 'aborted':
      return 'Operation was interrupted. Please try again.';
    case 'out-of-range':
      return 'Invalid data provided.';
    case 'unimplemented':
      return 'This feature is not available yet.';
    case 'internal':
      return 'Internal error. Please try again later.';
    case 'unavailable':
      return 'Service temporarily unavailable. Please try again.';
    case 'data-loss':
      return 'Data error occurred. Please contact support.';
    default:
      return 'An error occurred. Please try again.';
  }
};
