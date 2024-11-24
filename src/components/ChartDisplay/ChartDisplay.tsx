import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useFredAPI } from "../../hooks/useFredAPI";
import "./ChartDisplay.css";
import {
  LOADING_MESSAGE,
  NO_CHART_DATA_MESSAGE,
  USER_CHART_SELECT_INFO_ERROR_WITH_MESSAGE,
  USER_CHART_SELECT_INFO_MESSAGE,
} from "../../constants/messages";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay: React.FC<{ config: any }> = ({ config }) => {
  const { fetchFredData, loading, error, clearError } = useFredAPI();
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!config || !config.dataSeries) {
      clearError();
      setChartData(null);
      return;
    }

    fetchFredData(config.dataSeries, config.frequency)
      .then((data) => {
        const observations = data?.observations || [];
        if (observations.length === 0) {
          throw new Error(NO_CHART_DATA_MESSAGE);
        }

        const labels = observations.map((obs: any) => obs.date);
        const values = observations.map((obs: any) => parseFloat(obs.value));

        setChartData({
          labels,
          datasets: [
            {
              label: config.title || "Chart",
              data: values,
              borderColor: config.color || "#000",
              backgroundColor: config.color || "#000",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
      });
  }, [config?.dataSeries, config?.frequency]);

  useEffect(() => {
    if (chartData && config) {
      setChartData((prevData: any) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            label: config.title || prevData.datasets[0]?.label || "Chart",
            borderColor:
              config.color || prevData.datasets[0]?.borderColor || "#000",
            backgroundColor:
              config.color || prevData.datasets[0]?.backgroundColor || "#000",
          },
        ],
      }));
    }
  }, [config?.color, config?.title]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!config?.title,
        text: config?.title || "Chart Title",
      },
    },
    scales: {
      y: {
        title: {
          display: !!config?.yAxisLabel,
          text: config?.yAxisLabel || "Y Axis",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  if (!config || !config.dataSeries) {
    return (
      <div className="chart-display__no-chart">
        <p className="chart-display__no-chart-title">No chart yet</p>
        <p className="chart-display__no-chart-subtitle">
          {USER_CHART_SELECT_INFO_MESSAGE}
        </p>
      </div>
    );
  }

  if (loading && !chartData) {
    return <div className="chart-display__loading">{LOADING_MESSAGE}</div>;
  }

  if (error) {
    return (
      <div className="chart-display__error">
        <p className="chart-display__error-title">{error}</p>
        <p className="chart-display__error-subtitle">
          {USER_CHART_SELECT_INFO_ERROR_WITH_MESSAGE}
        </p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-display__no-data">{NO_CHART_DATA_MESSAGE}</div>
    );
  }

  return (
    <div className="chart-display__container">
      {config?.type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default ChartDisplay;
