import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import agricultureData from '../agricultureData.json';

// Define types for the agriculture data
interface AgricultureRecord {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': string | number;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': string | number;
  'Area Under Cultivation (UOM:Ha(Hectares))': string | number;
}

// Define types for the processed data
interface ProcessedData {
  year: string;
  maxCrop: string;
  minCrop: string;
}

// Component to render the yearly crop production table
const YearlyCropTable: React.FC = () => {
  const [data, setData] = useState<ProcessedData[]>([]);

  useEffect(() => {
    // Process the agriculture data to find crops with max and min production per year
    const processedData = agricultureData.reduce<Record<string, { maxCrop: string; maxProd: number; minCrop: string; minProd: number }>>(
      (acc, record: AgricultureRecord) => {
        const year = record.Year.split(', ')[1]; // Extract year from 'Year' field
        const production = record['Crop Production (UOM:t(Tonnes))'] ? parseFloat(record['Crop Production (UOM:t(Tonnes))'] as string) : 0; // Parse production value

        // Update or initialize max and min production crops for each year
        if (!acc[year]) {
          acc[year] = { maxCrop: record['Crop Name'], maxProd: production, minCrop: record['Crop Name'], minProd: production };
        } else {
          if (production > acc[year].maxProd) {
            acc[year].maxCrop = record['Crop Name'];
            acc[year].maxProd = production;
          }
          if (production < acc[year].minProd) {
            acc[year].minCrop = record['Crop Name'];
            acc[year].minProd = production;
          }
        }
        return acc;
      },
      {}
    );

    // Format processed data into table format
    const tableData = Object.keys(processedData).map(year => ({
      year,
      maxCrop: processedData[year].maxCrop,
      minCrop: processedData[year].minCrop,
    }));

    // Set the state with the processed data
    setData(tableData);
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return (
    <Table withTableBorder withColumnBorders>
      <thead>
        <tr>
          <th>Year</th>
          <th>Crop with Maximum Production</th>
          <th>Crop with Minimum Production</th>
        </tr>
      </thead>
      <tbody>
        {/* Render table rows with processed data */}
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.year}</td>
            <td>{row.maxCrop}</td>
            <td>{row.minCrop}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default YearlyCropTable;
