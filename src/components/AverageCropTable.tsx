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

// Define types for the processed crop data
interface CropData {
  crop: string;
  avgYield: string;
  avgArea: string;
}

// Component to render the average crop data table
const AverageCropTable: React.FC = () => {
  const [data, setData] = useState<CropData[]>([]);

  useEffect(() => {
    // Calculate average yield and area for each crop
    const cropData = agricultureData.reduce<Record<string, { totalYield: number; totalArea: number; count: number }>>(
      (acc, record: AgricultureRecord) => {
        const crop = record['Crop Name'];
        const yieldValue = record['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']
          ? parseFloat(record['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'] as string)
          : 0;
        const area = record['Area Under Cultivation (UOM:Ha(Hectares))']
          ? parseFloat(record['Area Under Cultivation (UOM:Ha(Hectares))'] as string)
          : 0;

        // Aggregate total yield, total area, and count of records for each crop
        if (!acc[crop]) {
          acc[crop] = { totalYield: yieldValue, totalArea: area, count: 1 };
        } else {
          acc[crop].totalYield += yieldValue;
          acc[crop].totalArea += area;
          acc[crop].count += 1;
        }
        return acc;
      },
      {}
    );

    // Calculate average yield and area, and format to 3 decimal places
    const tableData = Object.keys(cropData).map(crop => ({
      crop,
      avgYield: (cropData[crop].totalYield / cropData[crop].count).toFixed(3),
      avgArea: (cropData[crop].totalArea / cropData[crop].count).toFixed(3),
    }));

    // Set the state with the processed data
    setData(tableData);
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return (
    <Table withTableBorder withColumnBorders>
      <thead>
        <tr>
          <th>Crop</th>
          <th>Average Yield (1950-2020)</th>
          <th>Average Cultivation Area (1950-2020)</th>
        </tr>
      </thead>
      <tbody>
        {/* Render table rows with processed data */}
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.crop}</td>
            <td>{row.avgYield}</td>
            <td>{row.avgArea}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AverageCropTable;
