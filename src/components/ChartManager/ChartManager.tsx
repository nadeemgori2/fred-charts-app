import React, { useRef, useState } from "react";
import ChartDisplay from "../ChartDisplay/ChartDisplay";
import ChartConfigurator from "../ChartConfigurator/ChartConfigurator";
import "./ChartManager.css";
import {
  ADD_CHART,
  EMPTY_PAGE_MESSAGE,
  REMOVE_CHART,
} from "../../constants/messages";

const ChartManager: React.FC = () => {
  const lastChartRef = useRef<HTMLDivElement>(null);
  const [charts, setCharts] = useState<{ id: number; config: any }[]>([]);

  const addChart = () => {
    setCharts([...charts, { id: Date.now(), config: null }]);

    setTimeout(() => {
      lastChartRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const updateChartConfig = (id: number, config: any) => {
    setCharts((prevCharts) =>
      prevCharts.map((chart) =>
        chart.id === id
          ? { ...chart, config: { ...chart.config, ...config } }
          : chart
      )
    );
  };

  const removeChart = (id: number) => {
    setCharts(charts.filter((chart) => chart.id !== id));
  };

  return (
    <div className="chart-manager">
      {charts.length === 0 ? (
        <div className="chart-manager__empty">{EMPTY_PAGE_MESSAGE}</div>
      ) : (
        charts.map((chart) => (
          <div key={chart.id} className="chart-manager__chart">
            <ChartConfigurator
              onUpdateConfig={(config) => updateChartConfig(chart.id, config)}
            />
            <ChartDisplay config={chart.config} />
            <button
              onClick={() => removeChart(chart.id)}
              className="chart-manager__remove-button"
            >
              {REMOVE_CHART}
            </button>
          </div>
        ))
      )}

      <div ref={lastChartRef}></div>

      <button onClick={addChart} className="chart-manager__add-button">
        {ADD_CHART}
      </button>
    </div>
  );
};

export default ChartManager;
