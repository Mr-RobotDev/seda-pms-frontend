import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { AlertStatsType } from '@/type';

interface AlertsPieChartProps {
  data: AlertStatsType
}

const AlertsPieChart: React.FC<AlertsPieChartProps> = ({data}) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          const tooltipEl = document.querySelector('.apexcharts-tooltip') as HTMLElement;
          if (tooltipEl) {
            const tooltipRect = tooltipEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (tooltipRect.right > viewportWidth) {
              tooltipEl.style.left = `-${tooltipRect.width}px`;
            }
            if (tooltipRect.bottom > viewportHeight) {
              tooltipEl.style.top = `-${tooltipRect.height}px`;
            }
          }
        },
        dataPointMouseLeave: function () {
          const tooltipEl = document.querySelector('.apexcharts-tooltip') as HTMLElement;
          if (tooltipEl) {
            tooltipEl.style.left = '';
            tooltipEl.style.top = '';
          }
        }
      }
    },
    labels: ['Active Alerts', 'Non-Active Alerts'],
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const chunkArray = (array: string[], size: number) => {
          const result = [];
          for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
          }
          return result;
        };

        if (seriesIndex === 0) {
          if (data.activeAlerts.length === 0) {
            return `<div class="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">No Active Alerts</div>`;
          }

          const columns = chunkArray(data.activeAlerts, 10);
          const activeAlertsTable = `
            <div class="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
              <table class="table-auto w-full">
                <tbody>
                  <tr>
                    ${columns.map(column => `
                      <td class="align-top">
                        ${column.map(alert => `<div class="p-1 border-b border-gray-200">${alert}</div>`).join('')}
                      </td>
                    `).join('')}
                  </tr>
                </tbody>
              </table>
            </div>
          `;

          return activeAlertsTable;
        } else {
          const columns = chunkArray(data.nonActiveAlerts, 10);
          const nonActiveAlertsTable = `
            <div class="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
              <table class="table-auto w-full">
                <tbody>
                  <tr>
                    ${columns.map(column => `
                      <td class="align-top">
                        ${column.map(alert => `<div class="p-1 border-b border-gray-200">${alert}</div>`).join('')}
                      </td>
                    `).join('')}
                  </tr>
                </tbody>
              </table>
            </div>
          `;

          return nonActiveAlertsTable;
        }
      },
    },
    legend: {
      position: 'bottom'
    }
  };

  const series = [data.totalActiveAlerts, data.totalNonActiveAlerts];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="pie" width="500" />
    </div>
  );
};

export default AlertsPieChart;
