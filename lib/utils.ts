import { Sample, SampleStatus } from '@/types';
import { differenceInDays, isPast, isThisWeek, addDays } from 'date-fns';

// Helper to get due date from sample (supports both new and legacy fields)
export const getDueDate = (sample: Sample): Date | null => {
  if (sample.due_date) {
    return sample.due_date instanceof Date ? sample.due_date : new Date(sample.due_date);
  }
  if (sample.expectedDate) {
    return sample.expectedDate instanceof Date ? sample.expectedDate : new Date(sample.expectedDate);
  }
  return null;
};

// Helper to get factory name from sample (supports both new and legacy fields)
export const getFactoryName = (sample: Sample): string => {
  return sample.factory || sample.factoryName || 'Unknown Factory';
};

// Helper to get PO number from sample (supports both new and legacy fields)
export const getPONumber = (sample: Sample): string => {
  return sample.po_number || sample.po || 'N/A';
};

// Helper to get factory email from sample (supports both new and legacy fields)
export const getFactoryEmail = (sample: Sample): string | undefined => {
  return sample.factory_email || sample.supplierEmail;
};

// Check if sample is overdue
export const isOverdue = (sample: Sample): boolean => {
  const dueDate = getDueDate(sample);
  if (!dueDate) return false;
  return isPast(dueDate) && differenceInDays(dueDate, new Date()) < 0;
};

// Check if sample is due soon (within 7 days)
export const isDueSoon = (sample: Sample): boolean => {
  const dueDate = getDueDate(sample);
  if (!dueDate) return false;
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
  return date >= today && date <= nextWeek && sample.status !== 'completed' && !isOverdue(sample);
};

export const getSampleStatus = (dueDate: Date | null, currentStatus?: SampleStatus): SampleStatus => {
  if (!dueDate) return currentStatus || 'under_review';
  
  const daysUntil = differenceInDays(dueDate, new Date());
  
  if (isPast(dueDate) && daysUntil < 0) {
    return 'overdue';
  }
  
  if (isThisWeek(dueDate) || (daysUntil >= 0 && daysUntil <= 7)) {
    return 'expected_this_week';
  }
  
  return currentStatus || 'under_review';
};

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const generateNotificationMessage = (sample: Sample): string => {
  const statusText = {
    overdue: 'is overdue',
    expected_this_week: 'is expected this week',
    under_review: 'is under review',
    completed: 'has been completed',
  }[sample.status];

  const factoryName = getFactoryName(sample);
  const poNumber = getPONumber(sample);
  const dueDate = getDueDate(sample);
  const sampleStage = sample.sample_stage || sample.sampleType || 'sample';
  const style = sample.style || 'N/A';

  return `Hi ${factoryName},\n\nRegarding Style ${style} for PO ${poNumber}, the ${sampleStage} sample ${statusText}.\n\nDue date: ${dueDate ? formatDate(dueDate) : 'N/A'}\n\nPlease update status.\n\nThank you.`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

