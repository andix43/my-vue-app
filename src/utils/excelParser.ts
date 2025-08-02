import * as XLSX from 'xlsx';

export interface TableData {
  id: string;
  [key: string]: any;
}

export interface ExcelParseResult {
  data: TableData[];
  columns: string[];
  error?: string;
}

export const parseExcelFile = async (file: File): Promise<ExcelParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first worksheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '', // Default value for empty cells
      raw: false // Convert dates and numbers to strings for consistency
    }) as any[][];
    
    if (jsonData.length === 0) {
      return { data: [], columns: [], error: 'Excel file is empty' };
    }
    
    // First row contains column headers
    const headers = jsonData[0] as string[];
    const columns = headers.filter(header => header !== ''); // Remove empty headers
    
    // Convert remaining rows to objects
    const data: TableData[] = jsonData.slice(1)
      .filter(row => row.some(cell => cell !== '')) // Remove completely empty rows
      .map((row, index) => {
        const rowData: TableData = {
          id: `row-${index}`, // Generate unique ID for each row
        };
        
        headers.forEach((header, colIndex) => {
          if (header !== '') {
            const cellValue = row[colIndex];
            // Handle different data types
            if (cellValue !== undefined && cellValue !== '') {
              // Try to detect and convert numeric values
              if (typeof cellValue === 'string' && !isNaN(Number(cellValue)) && cellValue.trim() !== '') {
                rowData[header] = Number(cellValue);
              } else {
                rowData[header] = cellValue;
              }
            } else {
              rowData[header] = '';
            }
          }
        });
        
        return rowData;
      });
    
    return { data, columns, error: undefined };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return { 
      data: [], 
      columns: [], 
      error: error instanceof Error ? error.message : 'Failed to parse Excel file' 
    };
  }
};

export const downloadSampleExcel = () => {
  // Create sample data
  const sampleData = [
    { ID: 1, Name: 'John Doe', Age: 28, Department: 'Engineering', Salary: 75000, 'Start Date': '2022-01-15' },
    { ID: 2, Name: 'Jane Smith', Age: 32, Department: 'Marketing', Salary: 68000, 'Start Date': '2021-03-22' },
    { ID: 3, Name: 'Mike Johnson', Age: 25, Department: 'Sales', Salary: 55000, 'Start Date': '2023-06-10' },
    { ID: 4, Name: 'Sarah Wilson', Age: 29, Department: 'HR', Salary: 62000, 'Start Date': '2022-08-05' },
    { ID: 5, Name: 'David Brown', Age: 35, Department: 'Engineering', Salary: 82000, 'Start Date': '2020-11-30' },
    { ID: 6, Name: 'Lisa Davis', Age: 27, Department: 'Design', Salary: 70000, 'Start Date': '2023-02-14' },
    { ID: 7, Name: 'Tom Anderson', Age: 31, Department: 'Sales', Salary: 58000, 'Start Date': '2021-09-18' },
    { ID: 8, Name: 'Emma Martinez', Age: 26, Department: 'Marketing', Salary: 65000, 'Start Date': '2022-12-01' },
    { ID: 9, Name: 'James Taylor', Age: 33, Department: 'Engineering', Salary: 78000, 'Start Date': '2021-05-12' },
    { ID: 10, Name: 'Anna Clark', Age: 30, Department: 'HR', Salary: 64000, 'Start Date': '2022-04-20' }
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Data');
  
  // Save the file
  XLSX.writeFile(workbook, 'front-end-dynamic-table.xlsx');
};
